<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
import { useData, withBase } from 'vitepress'
import '@scalar/api-reference/style.css'

const { isDark } = useData()
const container = useTemplateRef<HTMLElement>('container')

const createConfiguration = (darkMode: boolean) => ({
  url: withBase('/openapi.yaml'),
  theme: 'kepler' as const,
  layout: 'modern' as const,
  localization: {
    locale: 'zh-CN' as const
  },
  modelsSectionLabel: '数据模型',
  darkMode,
  forceDarkModeState: darkMode ? ('dark' as const) : ('light' as const),
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
let mounted = false
let renderVersion = 0

const applyScalarThemeClass = (darkMode: boolean) => {
  document.body.classList.toggle('dark-mode', darkMode)
  document.body.classList.toggle('light-mode', !darkMode)
}

const renderScalar = async (darkMode: boolean) => {
  const target = container.value
  if (!target) return

  const currentVersion = ++renderVersion
  scalarInstance?.destroy()
  scalarInstance = undefined
  applyScalarThemeClass(darkMode)

  const { createApiReference } = await import('@scalar/api-reference')
  if (disposed || currentVersion !== renderVersion) return

  // Scalar 的强制主题只在实例创建时读取，重建可避免它自己的 colorMode 缓存覆盖站点主题。
  applyScalarThemeClass(darkMode)
  scalarInstance = createApiReference(target, createConfiguration(darkMode))
}

onMounted(() => {
  mounted = true
  void renderScalar(isDark.value)
})

watch(isDark, (darkMode) => {
  if (mounted) void renderScalar(darkMode)
})

onBeforeUnmount(() => {
  disposed = true
  renderVersion += 1
  scalarInstance?.destroy()
  scalarInstance = undefined
  document.body.classList.remove('dark-mode', 'light-mode')
})
</script>

<template>
  <div ref="container" class="nexly-api-reference" />
</template>
