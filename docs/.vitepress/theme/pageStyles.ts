import { withBase, type Router } from 'vitepress'

declare global {
  interface Window { __NEXLY_PAGE_STYLES__?: Record<string, string[]> }
}

const loadStyle = (href: string) => new Promise<void>((resolve, reject) => {
  const url = new URL(href, location.href).href
  let link = [...document.querySelectorAll<HTMLLinkElement>('link[rel~="stylesheet"]')]
    .find(element => element.href === url)
  if (link?.sheet) return resolve()
  const created = !link
  link ??= document.createElement('link')
  const element = link
  const finish = (error?: Error) => {
    clearTimeout(timeout)
    element.removeEventListener('load', loaded)
    element.removeEventListener('error', failed)
    if (error) { if (created) element.remove(); reject(error) } else resolve()
  }
  const loaded = () => finish()
  const failed = () => finish(new Error(`页面样式加载失败：${href}`))
  const timeout = setTimeout(failed, 15000)
  element.addEventListener('load', loaded, { once: true })
  element.addEventListener('error', failed, { once: true })
  if (created) {
    element.rel = 'stylesheet'
    element.href = href
    document.head.appendChild(element)
  }
})

export const installPageStyles = (router: Router) => {
  if (import.meta.env.SSR || import.meta.env.DEV) return
  const manifest = window.__NEXLY_PAGE_STYLES__
  if (!manifest) return
  const previous = router.onBeforePageLoad
  const pending = new Map<string, Promise<void>>()
  let navigation = 0
  router.onBeforePageLoad = async href => {
    const current = ++navigation
    if (await previous?.(href) === false) return false
    const path = decodeURIComponent(new URL(href, location.href).pathname).slice(withBase('/').length)
    const page = path.endsWith('/') || !path ? `${path}index.md` : `${path.replace(/\.html$/, '')}.md`
    try {
      await Promise.all((manifest[page] ?? manifest['404.md'] ?? []).map(file => {
        if (!pending.has(file)) {
          const loading = loadStyle(withBase(`/${file}`)).catch(error => { pending.delete(file); throw error })
          pending.set(file, loading)
        }
        return pending.get(file)!
      }))
    } catch (error) {
      console.warn(error)
      // 新部署可能已替换资产。站内跳转退回完整页面加载，让浏览器取得匹配的新 HTML。
      if (current === navigation && router.route.component) { location.assign(href); return false }
    }
    if (current !== navigation) return false
  }
}