<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'

const { Layout } = DefaultTheme
const route = useRoute()
let zoom: ReturnType<typeof mediumZoom> | undefined

const attachZoom = () => {
  zoom?.detach()
  zoom = mediumZoom('.vp-doc img:not(.no-zoom)', {
    background: 'var(--vp-c-bg)',
    margin: 24,
    scrollOffset: 40
  })
}

onMounted(attachZoom)

watch(
  () => route.path,
  async () => {
    await nextTick()
    attachZoom()
  }
)

onBeforeUnmount(() => {
  zoom?.detach()
})
</script>

<template>
  <Layout />
</template>
