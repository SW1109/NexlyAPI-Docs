<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
import { useData } from 'vitepress'
import '@scalar/api-reference/style.css'

const { isDark } = useData()
const container = useTemplateRef<HTMLElement>('container')

const createConfiguration = (darkMode: boolean) => ({
  url: '/openapi.yaml',
  theme: 'kepler' as const,
  layout: 'modern' as const,
  localization: {
    locale: 'zh-CN' as const
  },
  modelsSectionLabel: '数据模型',
  darkMode,
  showSidebar: true,
  hideModels: false,
  hideClientButton: false,
  hideDarkModeToggle: true,
  persistAuth: true,
  withDefaultFonts: false,
  defaultHttpClient: {
    targetKey: 'shell',
    clientKey: 'curl'
  }
})

type ScalarInstance = {
  updateConfiguration: (configuration: ReturnType<typeof createConfiguration>) => void
  destroy: () => void
}

let scalarInstance: ScalarInstance | undefined
let disposed = false

onMounted(async () => {
  const target = container.value
  if (!target) return

  const { createApiReference } = await import('@scalar/api-reference')
  if (disposed) return

  scalarInstance = createApiReference(target, createConfiguration(isDark.value))
})

watch(isDark, (darkMode) => {
  scalarInstance?.updateConfiguration(createConfiguration(darkMode))
})

onBeforeUnmount(() => {
  disposed = true
  scalarInstance?.destroy()
  scalarInstance = undefined
})
</script>

<template>
  <div ref="container" class="nexly-api-reference" />
</template>
