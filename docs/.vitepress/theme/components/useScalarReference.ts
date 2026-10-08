import { onBeforeUnmount, onMounted, shallowRef, watch, type Ref } from 'vue'
import { withBase } from 'vitepress'
import type { createApiReference } from '@scalar/api-reference'

type ScalarInstance = ReturnType<typeof createApiReference>
type LoadState = 'loading' | 'ready' | 'error'

// 沿用 Scalar 1.64.1 为本站分配的文档标识；清理只影响该文档的认证。
const DOCUMENT_SLUG = 'api-1'
const AUTH_STORAGE_KEY = `scalar-reference-auth-${DOCUMENT_SLUG}`
const LOAD_TIMEOUT_MS = 25_000

const clearStoredAuth = () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return true
  } catch {
    return false
  }
}

export const useScalarReference = (
  container: Readonly<Ref<HTMLElement | null>>,
  isDark: Readonly<Ref<boolean>>
) => {
  const state = shallowRef<LoadState>('loading')
  const errorMessage = shallowRef('')
  const authMessage = shallowRef('')
  let instance: ScalarInstance | undefined
  let request: AbortController | undefined
  let deadline: ReturnType<typeof setTimeout> | undefined
  let renderVersion = 0
  let mounted = false
  let previousTheme = { dark: false, light: false }

  const clearDeadline = () => {
    clearTimeout(deadline)
    deadline = undefined
  }

  const disposeInstance = () => {
    clearDeadline()
    request?.abort()
    request = undefined
    instance?.destroy()
    instance = undefined
  }

  const isCurrent = (version: number) => mounted && version === renderVersion

  const fail = (version: number, message: string) => {
    if (!isCurrent(version)) return
    // 使仍在进行的动态导入和 Scalar 回调失效，重试后不允许旧实例再次挂载。
    renderVersion += 1
    disposeInstance()
    errorMessage.value = message
    state.value = 'error'
  }

  const render = async () => {
    const target = container.value
    if (!mounted || !target) return

    const version = ++renderVersion
    disposeInstance()
    state.value = 'loading'
    errorMessage.value = ''
    const controller = new AbortController()
    request = controller
    deadline = setTimeout(() => {
      fail(version, '接口文档加载超时，请检查网络后重试。')
    }, LOAD_TIMEOUT_MS)

    try {
      const [{ createApiReference }, { parse }, response] = await Promise.all([
        import('@scalar/api-reference'),
        import('yaml'),
        fetch(withBase('/openapi.yaml'), { signal: controller.signal, cache: 'no-cache' })
      ])
      if (!isCurrent(version)) return
      if (!response.ok) {
        fail(version, `接口定义加载失败（HTTP ${response.status}），请稍后重试。`)
        return
      }

      const content = parse(await response.text())
      if (!isCurrent(version)) return
      if (!content || typeof content !== 'object' || !content.openapi || !content.paths) {
        fail(version, '接口定义格式不正确，请重试或下载原始定义查看。')
        return
      }

      const darkMode = isDark.value
      document.body.classList.toggle('dark-mode', darkMode)
      document.body.classList.toggle('light-mode', !darkMode)

      // 强制主题只在初始化时读取；不依赖私有 store 保留密钥，主题变化时明确重置会话。
      instance = createApiReference(target, {
        content,
        slug: DOCUMENT_SLUG,
        theme: 'kepler',
        layout: 'modern',
        localization: { locale: 'zh-CN' },
        modelsSectionLabel: '数据模型',
        darkMode,
        forceDarkModeState: darkMode ? 'dark' : 'light',
        showSidebar: true,
        hideModels: false,
        hideClientButton: true,
        hideDarkModeToggle: true,
        persistAuth: false,
        withDefaultFonts: false,
        defaultHttpClient: { targetKey: 'shell', clientKey: 'curl' },
        onLoaded: () => {
          if (!isCurrent(version)) return
          clearDeadline()
          state.value = 'ready'
        }
      })
    } catch {
      fail(version, '接口文档暂时无法加载，请检查网络后重试；若仍失败，请刷新页面。')
    }
  }

  const clearAuth = () => {
    const cleared = clearStoredAuth()
    authMessage.value = cleared
      ? '已清除认证信息并重置调试输入。'
      : '已重置本页认证。浏览器禁止访问存储，历史认证请通过浏览器的站点数据设置清除。'
    void render()
  }

  onMounted(() => {
    mounted = true
    previousTheme = {
      dark: document.body.classList.contains('dark-mode'),
      light: document.body.classList.contains('light-mode')
    }
    if (!clearStoredAuth()) {
      authMessage.value = '浏览器禁止访问存储，无法清理历史认证；本页不会主动保存密钥。'
    }
    void render()
  })

  watch(isDark, () => {
    if (!mounted) return
    authMessage.value = '外观已切换，临时认证和调试输入已重置。'
    void render()
  })

  onBeforeUnmount(() => {
    mounted = false
    renderVersion += 1
    disposeInstance()
    document.body.classList.toggle('dark-mode', previousTheme.dark)
    document.body.classList.toggle('light-mode', previousTheme.light)
  })

  return { state, errorMessage, authMessage, retry: render, clearAuth }
}