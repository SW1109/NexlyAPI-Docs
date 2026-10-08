import { relative } from 'node:path'
import type { HeadConfig, UserConfig } from 'vitepress'
import type { OutputBundle, OutputChunk } from 'rollup'
import type { Plugin } from 'vite'

type StyledChunk = OutputChunk & { viteMetadata?: { importedCss?: Set<string> } }

// VitePress 1.6 只自动输出第一个 CSS 资产；以实际依赖图同时服务 SSR 和站内导航。
export const createPageStyles = (docsRoot: string) => {
  let styles: Record<string, string[]> = {}
  let scripts: Record<string, Set<string>> = {}
  const collect = (bundle: OutputBundle, entries: StyledChunk[]) => {
    const visited = new Set<string>()
    const result = new Set<string>()
    const visit = (chunk: StyledChunk) => {
      if (visited.has(chunk.fileName)) return
      visited.add(chunk.fileName)
      for (const name of chunk.imports) {
        const dependency = bundle[name]
        if (dependency?.type === 'chunk') visit(dependency)
      }
      for (const css of chunk.viteMetadata?.importedCss ?? []) result.add(css)
    }
    entries.forEach(visit)
    return { styles: [...result], scripts: visited }
  }
  const plugin: Plugin = {
    name: 'nexly-page-styles',
    enforce: 'post',
    apply: (_, environment) => environment.command === 'build' && !environment.isSsrBuild,
    generateBundle(_, bundle) {
      styles = {}
      scripts = {}
      const chunks = Object.values(bundle).filter((item): item is StyledChunk => item.type === 'chunk')
      const app = chunks.find(chunk => chunk.isEntry && chunk.name === 'app')
      if (!app) this.error('找不到 VitePress app 入口，无法生成页面样式清单')
      const record = (page: string, entries: StyledChunk[]) => {
        const assets = collect(bundle, entries)
        styles[page] = assets.styles
        scripts[page] = assets.scripts
      }
      record('404.md', [app])
      for (const chunk of chunks) {
        if (!chunk.facadeModuleId?.endsWith('.md') || chunk.fileName.endsWith('.lean.js')) continue
        const page = relative(docsRoot, chunk.facadeModuleId).replaceAll('\\', '/')
        record(page, [app, chunk])
      }
    }
  }
  const transformHead: UserConfig['transformHead'] = ({ page, siteData }) => {
    const links: HeadConfig[] = (styles[page] ?? styles['404.md'] ?? []).map(file =>
      ['link', { rel: 'stylesheet', href: siteData.base + file }])
    // 和 VitePress 的路由哈希表一样随 HTML 发布，避免额外清单请求与跨版本缓存错配。
    const manifest = JSON.stringify(styles).replaceAll('<', '\\u003c')
    return [...links, ['script', {}, `window.__NEXLY_PAGE_STYLES__=${manifest}`]]
  }
  const transformHtml: UserConfig['transformHtml'] = (html, _, { page, siteData }) => {
    const initialScripts = scripts[page] ?? scripts['404.md']
    return html
      .replace(/<link rel="preload stylesheet" href="[^"]*\/assets\/[^"\s]+\.css" as="style">/g, '')
      // 1.6 还会预加载页面的动态 import；保持 GSAP、Ripple、Scalar 真正按需下载。
      .replace(/<link rel="(?:modulepreload|prefetch)" href="([^"]+)">/g, (tag, href: string) => {
        const file = href.slice(siteData.base.length).replace(/\.lean\.js$/, '.js')
        return initialScripts?.has(file) ? tag : ''
      })
  }

  return { plugin, transformHead, transformHtml }
}