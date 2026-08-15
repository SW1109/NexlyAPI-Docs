import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Nexly API',
  description: '一套 API，连接每一种智能。兼容 OpenAI 协议的统一 AI API 服务。',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: 'https://nexlydocs.guangnian.xin'
  },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['meta', { name: 'theme-color', content: '#0b1923' }],
    ['meta', { property: 'og:site_name', content: 'Nexly API 文档' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: 'https://nexlydocs.guangnian.xin/logo.png' }]
  ],
  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'Nexly API',
    nav: [
      { text: '开始使用', link: '/guide/quickstart' },
      { text: '开发指南', link: '/sdk/openai' },
      { text: 'API Reference', link: '/api-reference' },
      {
        text: '工具',
        items: [
          { text: 'CC Switch 快速导入', link: '/tools/cc-switch-quick-import' },
          { text: '配置 Codex', link: '/tools/cc-switch-codex' },
          { text: '配置 Claude Code', link: '/tools/cc-switch-claude' }
        ]
      },
      { text: '控制台', link: 'https://nexlycn.guangnian.xin' }
    ],
    sidebar: [
      {
        text: '开始使用',
        items: [
          { text: '快速开始', link: '/guide/quickstart' },
          { text: '身份认证', link: '/guide/authentication' },
          { text: '模型与能力', link: '/guide/models' },
          { text: '客户端配置', link: '/guide/client-config' }
        ]
      },
      {
        text: '开发指南',
        items: [
          { text: 'OpenAI SDK', link: '/sdk/openai' },
          { text: 'HTTP 请求', link: '/sdk/http' },
          { text: 'API Reference', link: '/api-reference' }
        ]
      },
      {
        text: 'CC Switch',
        items: [
          { text: '平台快速导入（推荐）', link: '/tools/cc-switch-quick-import' },
          { text: '安装与添加 Nexly', link: '/tools/cc-switch' },
          { text: '配置 Codex', link: '/tools/cc-switch-codex' },
          { text: '配置 Claude Code', link: '/tools/cc-switch-claude' }
        ]
      },
      {
        text: '帮助',
        items: [
          { text: '错误处理', link: '/help/errors' },
          { text: '常见问题', link: '/help/faq' }
        ]
      }
    ],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除查询',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    lastUpdated: {
      text: '最后更新于'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    darkModeSwitchLabel: '外观',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    footer: {
      message: 'Nexly API · OpenAI 兼容接口服务',
      copyright: '请勿在公开页面分享你的 API Key'
    }
  }
})
