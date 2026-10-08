<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
import { withBase } from 'vitepress'

const props = withDefaults(
  defineProps<{
    src: string
    title: string
    description?: string
    ratio?: 'wide' | 'standard' | 'portrait'
  }>(),
  { ratio: 'wide' }
)

const state = shallowRef<'loading' | 'ready' | 'error'>('loading')
const mounted = shallowRef(false)
const retryToken = shallowRef('')
const image = useTemplateRef<HTMLImageElement>('image')
const trigger = useTemplateRef<HTMLButtonElement>('trigger')
const dialog = useTemplateRef<HTMLDialogElement>('dialog')
let ownsScrollLock = false
let focusAfterLoad = false

const imageSource = computed(() => {
  const source = withBase(props.src)
  if (!retryToken.value) return source
  const [path, hash] = source.split('#')
  return `${path}${path.includes('?') ? '&' : '?'}nexly_retry=${retryToken.value}${hash ? `#${hash}` : ''}`
})

const releaseScrollLock = () => {
  if (!ownsScrollLock) return
  document.documentElement.classList.remove('screenshot-preview-open')
  ownsScrollLock = false
}

const closePreview = () => {
  dialog.value?.close()
  releaseScrollLock()
}

const openPreview = () => {
  if (state.value !== 'ready' || !dialog.value || dialog.value.open) return
  // showModal 提供原生焦点约束和 Escape；不再让页面其他控件进入 Tab 顺序。
  dialog.value.showModal()
  if (!document.documentElement.classList.contains('screenshot-preview-open')) {
    document.documentElement.classList.add('screenshot-preview-open')
    ownsScrollLock = true
  }
}

const handleClose = () => {
  releaseScrollLock()
  if (mounted.value) trigger.value?.focus({ preventScroll: true })
}

const handleLoad = async (event?: Event) => {
  if (event && event.currentTarget !== image.value) return
  state.value = 'ready'
  if (focusAfterLoad) {
    focusAfterLoad = false
    await nextTick()
    // 用户等待期间若已移向其他控件，不再抢回焦点。
    if (mounted.value && document.activeElement === document.body) {
      trigger.value?.focus({ preventScroll: true })
    }
  }
}

const handleError = (event: Event) => {
  if (event.currentTarget !== image.value) return
  state.value = 'error'
}

const retry = (event: MouseEvent) => {
  focusAfterLoad = document.activeElement === event.currentTarget
  retryToken.value = String(Date.now())
  state.value = 'loading'
}

watch(() => props.src, () => {
  closePreview()
  state.value = 'loading'
  retryToken.value = ''
  focusAfterLoad = false
})

onMounted(() => {
  mounted.value = true
  if (!image.value?.complete) return
  if (image.value.naturalWidth > 0) void handleLoad()
  else state.value = 'error'
})

onBeforeUnmount(() => {
  mounted.value = false
  closePreview()
})
</script>

<template>
  <figure class="screenshot-slot" :class="`screenshot-slot--${ratio}`">
    <div class="screenshot-slot__frame" :aria-busy="state === 'loading'">
      <button
        ref="trigger"
        class="screenshot-slot__trigger"
        type="button"
        :disabled="state !== 'ready'"
        :aria-label="`放大查看：${title}`"
        aria-haspopup="dialog"
        @click="openPreview"
      >
        <img
          v-if="state !== 'error'"
          :key="imageSource"
          ref="image"
          :src="imageSource"
          :alt="title"
          :class="{ 'screenshot-slot__image--loaded': state === 'ready' }"
          loading="lazy"
          decoding="async"
          class="screenshot-slot__image no-zoom"
          @load="handleLoad"
          @error="handleError"
        >
      </button>
      <div v-if="state !== 'ready'" class="screenshot-slot__placeholder">
        <p role="status">
          {{ state === 'error' ? '截图暂时无法显示，可继续按正文步骤操作。' : '正在加载截图…' }}
        </p>
        <button v-if="state === 'error'" class="screenshot-slot__retry" type="button" @click="retry">
          重新加载图片
        </button>
      </div>
    </div>
    <figcaption>{{ title }}</figcaption>
  </figure>

  <Teleport v-if="mounted" to="body">
    <dialog
      ref="dialog"
      class="screenshot-preview"
      :aria-label="`${title} 图片预览`"
      @close="handleClose"
      @click.self="closePreview"
    >
      <button
        class="screenshot-preview__close"
        type="button"
        autofocus
        :aria-label="`关闭${title}图片预览`"
        @click="closePreview"
      >
        <span aria-hidden="true">×</span>
      </button>
      <div class="screenshot-preview__content">
        <img class="screenshot-preview__image no-zoom" :src="imageSource" :alt="title" loading="lazy">
        <p class="screenshot-preview__caption">{{ title }}</p>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
.screenshot-preview {
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: none;
  height: 100%;
  max-height: none;
  margin: 0;
  padding: 56px 32px 32px;
  border: 0;
  overflow: auto;
  background: transparent;
}

.screenshot-preview[open] {
  display: grid;
  place-items: center;
}

.screenshot-preview::backdrop {
  background: rgba(3, 13, 20, 0.9);
  backdrop-filter: blur(10px);
}

.screenshot-preview__content {
  display: grid;
  place-items: center;
  gap: 12px;
  width: fit-content;
  max-width: 100%;
}

.screenshot-preview__image {
  display: block;
  max-width: min(1440px, calc(100vw - 64px));
  max-height: calc(100dvh - 120px);
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.46);
}

.screenshot-preview__caption {
  margin: 0;
  color: rgba(235, 248, 246, 0.86);
  font-size: 14px;
  text-align: center;
}

.screenshot-preview__close {
  position: fixed;
  top: 12px;
  right: 16px;
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid rgba(202, 237, 232, 0.3);
  border-radius: 50%;
  color: #edf9f7;
  background: rgba(16, 43, 52, 0.82);
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
}

.screenshot-preview__close:hover {
  background: rgba(28, 75, 84, 0.95);
}

.screenshot-preview__close:focus-visible {
  outline: 3px solid var(--vp-c-brand-2);
  outline-offset: 3px;
}

@media (max-width: 640px) {
  .screenshot-preview {
    padding: 56px 16px 16px;
  }

  .screenshot-preview__image {
    max-width: calc(100vw - 32px);
    max-height: calc(100dvh - 112px);
    border-radius: 8px;
  }
}
</style>