import { spawn } from 'node:child_process'
import process from 'node:process'

const host = '127.0.0.1'
const port = 4173
const origin = `http://${host}:${port}`
const vitepressBin = 'node_modules/vitepress/bin/vitepress.js'

const server = spawn(
  process.execPath,
  [vitepressBin, 'preview', 'docs', '--host', host, '--port', String(port)],
  {
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true
  }
)

let serverOutput = ''
server.stdout.on('data', (chunk) => {
  serverOutput += chunk.toString()
})
server.stderr.on('data', (chunk) => {
  serverOutput += chunk.toString()
})

const checks = [
  { path: '/', contains: 'Nexly API' },
  { path: '/guide/quickstart', contains: '快速开始' },
  { path: '/tools/cc-switch-quick-import', contains: '平台快速导入' },
  { path: '/tools/cc-switch', contains: '安装与添加 Nexly' },
  { path: '/tools/cc-switch-codex', contains: '配置 Codex' },
  { path: '/tools/cc-switch-claude', contains: '配置 Claude Code' },
  { path: '/api-reference', contains: 'API Reference' },
  { path: '/images/quickstart/macos-api-quickstart.webp', contentType: 'image/webp' },
  { path: '/images/cc-switch/platform-import-api-key.png', contentType: 'image/png' },
  { path: '/images/cc-switch/platform-import-dialog.png', contentType: 'image/png' },
  { path: '/openapi.yaml', contains: 'https://nexlycn.guangnian.xin' },
  { path: '/sitemap.xml', contains: 'nexlydocs.guangnian.xin' }
]

const waitForServer = async () => {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(origin, { signal: AbortSignal.timeout(1000) })
      if (response.ok) return
    } catch {
      // The preview server may still be starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  throw new Error(`预览服务启动失败。\n${serverOutput}`)
}

try {
  await waitForServer()

  for (const check of checks) {
    const response = await fetch(`${origin}${check.path}`)

    if (!response.ok) {
      throw new Error(`${check.path} 返回 HTTP ${response.status}`)
    }
    if (check.contains && !(await response.text()).includes(check.contains)) {
      throw new Error(`${check.path} 缺少预期内容：${check.contains}`)
    }
    if (check.contentType && !response.headers.get('content-type')?.includes(check.contentType)) {
      throw new Error(`${check.path} Content-Type 不是 ${check.contentType}`)
    }

    console.log(`PASS ${response.status} ${check.path}`)
  }
} finally {
  server.kill()
}
