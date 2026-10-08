import assert from 'node:assert/strict'
import { once } from 'node:events'
import { fileURLToPath } from 'node:url'
import { build, serve } from 'vitepress'

const docsRoot = fileURLToPath(new URL('../docs', import.meta.url))
const checks = [
  { path: '/', contains: 'Nexly API' },
  { path: '/guide/quickstart.html', contains: '快速开始' },
  { path: '/guide/console.html', contains: 'Nexly API 工作台' },
  { path: '/tools/cc-switch-quick-import.html', contains: '从 Nexly API 快速导入' },
  { path: '/tools/cc-switch.html', contains: '安装与添加 Nexly' },
  { path: '/tools/cc-switch-codex.html', contains: '配置 Codex' },
  { path: '/tools/cc-switch-claude.html', contains: '配置 Claude Code' },
  { path: '/api-reference.html', contains: 'API Reference' },
  { path: '/help/faq.html', contains: '不会把新输入的 Key 持久保存' },
  { path: '/images/quickstart/macos-api-quickstart.webp', contentType: 'image/webp' },
  { path: '/openapi.yaml', contains: 'ResponseStreamEvent' },
  { path: '/sitemap.xml', contains: 'nexlydocs.guangnian.xin' },
  { path: '/__smoke_missing_page__', status: 404 },
  { path: '/assets/__smoke_missing_asset__.js', status: 404 }
]

// 构建失败即停止，不允许旧 dist 通过发布检查；路径也不依赖调用者的工作目录。
await build(docsRoot)
// 持有真正的服务器实例并由系统分配端口，不再探测可能属于其他进程的固定端口。
const { server } = await serve({ root: docsRoot, port: 0 })

try {
  if (!server.listening) {
    await once(server, 'listening', { signal: AbortSignal.timeout(5_000) })
  }
  const address = server.address()
  assert(address && typeof address === 'object', '无法取得本次预览的监听地址')
  const origin = `http://127.0.0.1:${address.port}`
  const assets = new Map()

  const checkResponse = async (check) => {
    const response = await fetch(`${origin}${check.path}`, { signal: AbortSignal.timeout(5_000) })
    assert.equal(response.status, check.status ?? 200, `${check.path} 状态码不符合预期`)
    const body = await response.text()
    if (check.contains) assert(body.includes(check.contains), `${check.path} 缺少预期内容`)
    if (check.contentType) {
      assert(response.headers.get('content-type')?.includes(check.contentType), `${check.path} 类型不正确`)
    }

    // 继续检查 HTML 实际引用的脚本和样式，避免页面有文字但资源已丢失的假通过。
    if (response.status === 200 && response.headers.get('content-type')?.includes('text/html')) {
      for (const [, path, extension] of body.matchAll(/(?:src|href)="(\/assets\/[^"?]+\.(js|css))"/g)) {
        assets.set(path, extension === 'js' ? 'javascript' : 'text/css')
      }
    }
    console.log(`PASS ${response.status} ${check.path}`)
  }

  for (const check of checks) await checkResponse(check)
  assert(assets.size > 0, '构建页面没有引用任何脚本或样式')
  for (const [path, contentType] of assets) await checkResponse({ path, contentType })
} finally {
  server.closeAllConnections()
  await new Promise((resolve) => server.close(resolve))
}