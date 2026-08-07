# 快速开始

只需获取 API Key、配置 Base URL，然后发送第一个请求。

<div class="api-base-url">
  <strong>API Base URL</strong>
  <code>https://nexlycn.guangnian.xin</code>
</div>

## 1. 获取 API Key

登录 [Nexly API 控制台](https://nexlycn.guangnian.xin)，在令牌管理页面创建 API Key。

API Key 只会用于请求鉴权。请像保管密码一样保管它，不要发布到 GitHub、网页前端或公开聊天记录中。

## 2. 设置环境变量

::: code-group

```bash [macOS / Linux]
export NEXLY_API_KEY="你的 API Key"
```

```powershell [Windows PowerShell]
$env:NEXLY_API_KEY="你的 API Key"
```

:::

## 3. 查询可用模型

```bash
curl https://nexlycn.guangnian.xin/v1/models \
  -H "Authorization: Bearer $NEXLY_API_KEY"
```

## 4. 发起对话

::: code-group

```bash [cURL]
curl https://nexlycn.guangnian.xin/v1/chat/completions \
  -H "Authorization: Bearer $NEXLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "system", "content": "你是一个简洁的中文助手。"},
      {"role": "user", "content": "用一句话介绍你自己。"}
    ]
  }'
```

```python [Python]
from openai import OpenAI

client = OpenAI(
    api_key="你的 API Key",
    base_url="https://nexlycn.guangnian.xin/v1",
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "你好！"}],
)

print(response.choices[0].message.content)
```

```javascript [Node.js]
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.NEXLY_API_KEY,
  baseURL: 'https://nexlycn.guangnian.xin/v1',
})

const response = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: '你好！' }],
})

console.log(response.choices[0].message.content)
```

:::

## 下一步

- 阅读[身份认证](/guide/authentication)，正确保管 API Key。
- 阅读[模型与能力](/guide/models)，了解如何查询可用模型。
- 打开 [API Reference](/api-reference)，在线查看请求参数和响应结构。
