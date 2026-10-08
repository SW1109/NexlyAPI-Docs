import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { build } from 'vitepress'

const root = fileURLToPath(new URL('../docs', import.meta.url))
const reportOnly = process.argv.includes('--report-only')
let outputDir
let artifacts = {}

await build(root, {
  onAfterConfigResolve(config) {
    outputDir = config.outDir
    config.vite ??= {}
    config.vite.plugins ??= []
    config.vite.plugins.push({
      name: 'nexly-page-assets-check',
      enforce: 'post',
      apply: (_, environment) => !environment.isSsrBuild,
      generateBundle(_, bundle) {
        artifacts = Object.fromEntries(Object.values(bundle).map(artifact => [artifact.fileName, artifact]))
      }
    })
  }
})

const pages = [
  { file: 'index.html', kind: 'home', title: '首页' },
  { file: 'guide/quickstart.html', kind: 'document', title: '普通文档' },
  { file: 'api-reference.html', kind: 'api', title: 'API Reference' },
  { file: '404.html', kind: 'document', title: '404 页面' }
]

const manifestByPage = new Map()
for (const page of pages) {
  const html = await readFile(`${outputDir}/${page.file}`, 'utf8')
  const linked = new Set([...html.matchAll(/(?:src|href)="\/(assets\/[^"?]+\.(?:js|css))"/g)].map((match) => match[1]))
  const match = html.match(/window\.__NEXLY_PAGE_STYLES__=(\{[^<]+\});?<\/script>/)
  assert(match, `${page.file} 缺少站内导航样式清单`)
  const manifest = JSON.parse(match[1])
  manifestByPage.set(page.kind, manifest)
  const pageStyles = manifest[page.file.replace(/\.html$/, '.md')] ?? []
  assert(pageStyles.length > 0, `${page.file} 缺少页面样式`)
  for (const css of pageStyles) assert(linked.has(css), `${page.file} 直达页面未加载 ${css}`)
  assert(linked.size > 0, `${page.file} 缺少静态资源引用`)
  const initial = new Set()
  const modules = new Set()
  const visit = (name) => {
    if (initial.has(name)) return
    initial.add(name)
    const artifact = artifacts[name]
    if (artifact?.type !== 'chunk') return
    for (const id of Object.keys(artifact.modules)) modules.add(id)
    for (const dependency of artifact.imports) visit(dependency)
    for (const css of artifact.viteMetadata?.importedCss ?? []) visit(css)
  }
  for (const name of linked) visit(name)

  let scriptBytes = 0
  let styleBytes = 0
  let styles = ''
  for (const name of initial) {
    const content = await readFile(`${outputDir}/${name}`)
    if (name.endsWith('.js')) scriptBytes += content.byteLength
    if (name.endsWith('.css')) {
      styleBytes += content.byteLength
      styles += content.toString()
      if (!reportOnly) assert(linked.has(name), `${page.file} 的初始样式 ${name} 只有依赖声明，没有 HTML 链接`)
    }
  }
  const hasHome = [...modules].some((id) => /\/components\/(HomePage\.vue|home\/)|\/gsap\//.test(id))
  const hasScalar = [...modules].some((id) => id.includes('/@scalar/'))
  const hasScalarCss = styles.includes('--tw-backdrop-sepia')
  console.log(`${page.title}: 初始静态 JS ${(scriptBytes / 1024).toFixed(1)} KiB / CSS ${(styleBytes / 1024).toFixed(1)} KiB / 首页依赖 ${hasHome} / Scalar 依赖 ${hasScalar} / Scalar 样式 ${hasScalarCss}`)
  if (reportOnly) continue

  if (page.kind !== 'home') assert(!hasHome, `${page.file} 不应静态加载首页动效`)
  if (page.kind !== 'api') {
    assert(!hasScalar, `${page.file} 不应静态加载 Scalar`)
    assert(!hasScalarCss, `${page.file} 不应加载 Scalar 样式`)
  }
  if (page.kind === 'api') assert(hasScalarCss, 'API 直达页面必须带有 Scalar 样式')
  if (page.kind === 'home') {
    assert(html.includes('跳转到主要内容'), '首页缺少键盘跳转入口')
    assert(html.includes('搜索文档'), '首页缺少搜索入口')
    assert(html.includes('兼容 OpenAI 协议'), '首页静态输出缺少产品说明')
    assert(hasHome, '首页资源依赖图必须能识别页面组件')
    assert(styles.includes('.gateway'), '首页直达页面缺少首页样式')
  }
}

for (const manifest of manifestByPage.values()) {
  assert.deepEqual(manifest, manifestByPage.get('home'), '各页面的导航样式清单必须来自同一构建')
  for (const files of Object.values(manifest)) {
    for (const file of files) await readFile(`${outputDir}/${file}`)
  }
}
console.log(reportOnly ? '资源报告完成（未执行隔离断言）。' : '页面静态资源隔离、直达样式及站内导航样式清单检查通过。')