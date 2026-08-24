<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue'

withDefaults(
  defineProps<{
    src: string
    title: string
    description?: string
    ratio?: 'wide' | 'standard' | 'portrait'
  }>(),
  {
    description: '请将截图保存到下方路径，重新构建后会自动显示。',
    ratio: 'wide'
  }
)

const loaded = shallowRef(false)
const failed = shallowRef(false)
const previewOpen = shallowRef(false)
const image = useTemplateRef<HTMLImageElement>('image')
const closeButton = useTemplateRef<HTMLButtonElement>('closeButton')

const handleLoad = () => {
  loaded.value = true
  failed.value = false
}

const handleError = () => {
  loaded.value = false
  failed.value = true
}

const openPreview = async () => {
  if (!loaded.value) return

  previewOpen.value = true
  await nextTick()
  closeButton.value?.focus()
}

const closePreview = () => {
  previewOpen.value = false
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closePreview()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)

  if (!image.value?.complete) return

  if (image.value.naturalWidth > 0) {
    handleLoad()
    return
  }

  handleError()
})

watch(previewOpen, (open) => {
  document.documentElement.classList.toggle('screenshot-preview-open', open)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.documentElement.classList.remove('screenshot-preview-open')
})
</script>

<template>
  <figure
    class="screenshot-slot"
    :class="[`screenshot-slot--${ratio}`, { 'screenshot-slot--loaded': loaded }]"
  >
    <img
      v-if="!failed"
      ref="image"
      :class="{ 'screenshot-slot__image--loaded': loaded }"
      :src="src"
      :alt="title"
      loading="lazy"
      class="screenshot-slot__image no-zoom"
      role="button"
      :tabindex="loaded ? 0 : -1"
      @load="handleLoad"
      @error="handleError"
      @click="openPreview"
      @keydown.enter.prevent="openPreview"
      @keydown.space.prevent="openPreview"
    >
    <div v-if="!loaded" class="screenshot-slot__placeholder">
      <span class="screenshot-slot__index">SCREENSHOT</span>
      <strong>{{ title }}</strong>
      <p>{{ description }}</p>
      <code>{{ src }}</code>
    </div>
    <figcaption v-if="loaded">{{ title }}</figcaption>
  </figure>

  <Teleport to="body">
    <div
      v-if="previewOpen"
      class="screenshot-preview"
      role="dialog"
      aria-modal="true"
      :aria-label="`${title} 图片预览`"
      @click.self="closePreview"
    >
      <button
        ref="closeButton"
        class="screenshot-preview__close"
        type="button"
        :aria-label="`关闭${title}图片预览`"
        @click="closePreview"
      >
        <span aria-hidden="true">×</span>
      </button>
      <div class="screenshot-preview__content">
        <img class="screenshot-preview__image" :src="src" :alt="title">
        <p class="screenshot-preview__caption">{{ title }}</p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.screenshot-preview {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 32px;
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
  max-height: calc(100dvh - 104px);
  border-radius: 12px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.46);
}

.screenshot-preview__caption {
  margin: 0;
  color: rgba(235, 248, 246, 0.76);
  font-size: 14px;
}

.screenshot-preview__close {
  position: fixed;
  top: 20px;
  right: 24px;
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

.screenshot-preview__close:focus-visible,
.screenshot-slot__image:focus-visible {
  outline: 3px solid var(--vp-c-brand-2);
  outline-offset: 4px;
}

@media (max-width: 640px) {
  .screenshot-preview {
    padding: 16px;
  }

  .screenshot-preview__image {
    max-width: calc(100vw - 32px);
    max-height: calc(100dvh - 82px);
    border-radius: 8px;
  }

  .screenshot-preview__close {
    top: 12px;
    right: 12px;
  }
}
</style>
