<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import '@scalar/api-reference/style.css'

const container = ref<HTMLElement | null>(null)

onMounted(async () => {
  const target = container.value
  if (!target) return

  const { createApiReference } = await import('@scalar/api-reference')

  createApiReference(target, {
    url: '/openapi.yaml',
    theme: 'kepler',
    layout: 'modern',
    localization: {
      locale: 'zh-CN'
    },
    modelsSectionLabel: '数据模型',
    darkMode: document.documentElement.classList.contains('dark'),
    showSidebar: true,
    hideModels: false,
    hideClientButton: false,
    persistAuth: true,
    withDefaultFonts: false,
    defaultHttpClient: {
      targetKey: 'shell',
      clientKey: 'curl'
    }
  })
})

onBeforeUnmount(() => {
  if (container.value) container.value.innerHTML = ''
})
</script>

<template>
  <div ref="container" class="nexly-api-reference" />
</template>
