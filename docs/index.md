---
layout: home

hero:
  name: Nexly API
  text: 一个接口，连接主流 AI 模型
  tagline: 兼容 OpenAI 协议，几分钟完成接入。使用熟悉的 SDK，不改业务逻辑。
  image:
    src: /logo.png
    alt: Nexly API
  actions:
    - theme: brand
      text: 5 分钟快速开始
      link: /guide/quickstart
    - theme: alt
      text: 查看 API Reference
      link: /api-reference

features:
  - icon: ⚡
    title: 快速接入
    details: 兼容 OpenAI SDK，只需替换 Base URL 和 API Key。
  - icon: ◈
    title: 统一接口
    details: 通过统一协议调用对话、嵌入、图像和音频模型。
  - icon: ⛨
    title: 安全鉴权
    details: 使用 Bearer Token 鉴权，密钥可随时在控制台管理。
  - icon: ‹›
    title: 多语言示例
    details: 提供 cURL、Python、Node.js 等可直接运行的代码。
  - icon: ◎
    title: 在线调试
    details: 在 API Reference 中输入自己的密钥即可发送测试请求。
  - icon: ↗
    title: OpenAI 兼容
    details: 可用于大多数支持自定义 OpenAI 地址的客户端和应用。
---

<div class="api-base-url">
  <strong>API Base URL</strong>
  <code>https://nexlycn.guangnian.xin</code>
</div>

## 第一次请求

```bash
curl https://nexlycn.guangnian.xin/v1/chat/completions \
  -H "Authorization: Bearer $NEXLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "你好！"}]
  }'
```

::: tip 模型名称
示例中的模型仅用于演示。请先调用 `GET /v1/models`，或在控制台查看你的账号当前可用模型。
:::
