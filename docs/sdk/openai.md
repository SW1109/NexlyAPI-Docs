# OpenAI SDK

Nexly API 兼容 OpenAI SDK。迁移现有项目时，通常只需要修改 API Key、Base URL 和模型 ID。

## 开始前确认

完成以下检查后再运行 SDK 示例：

1. `NEXLY_API_KEY` 已设置，并能请求 `/v1/models`。
2. `NEXLY_MODEL` 使用模型列表返回的真实 `id`。
3. Base URL 为 `https://nexlycn.guangnian.xin/v1`。

如果还没有完成这些步骤，请先阅读[快速开始](/guide/quickstart)。

## 迁移配置

| OpenAI SDK 配置 | Nexly 填写内容 |
| --- | --- |
| `api_key` / `apiKey` | `NEXLY_API_KEY` 环境变量 |
| `base_url` / `baseURL` | `https://nexlycn.guangnian.xin/v1` |
| `model` | `NEXLY_MODEL` 环境变量 |

不要在 Base URL 后继续拼接 `/chat/completions`，SDK 会自动生成接口路径。

## Python

### 1. 安装 SDK

```bash
python -m pip install --upgrade openai
```

确认安装版本：

```bash
python -m pip show openai
```

### 2. 创建请求

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["NEXLY_API_KEY"],
    base_url="https://nexlycn.guangnian.xin/v1",
    timeout=60.0,
    max_retries=2,
)

completion = client.chat.completions.create(
    model=os.environ["NEXLY_MODEL"],
    messages=[
        {"role": "system", "content": "你是一个专业的编程助手。"},
        {"role": "user", "content": "只回复：SDK 连接成功"},
    ],
)

print(completion.choices[0].message.content)
```

### 3. 使用流式输出

```python
stream = client.chat.completions.create(
    model=os.environ["NEXLY_MODEL"],
    messages=[{"role": "user", "content": "讲一个短故事"}],
    stream=True,
)

for chunk in stream:
    content = chunk.choices[0].delta.content
    if content:
        print(content, end="", flush=True)
```

## Node.js

### 1. 安装 SDK

```bash
npm install openai
```

使用 ESM `import` 时，项目的 `package.json` 应包含：

```json
{
  "type": "module"
}
```

### 2. 创建请求

```javascript
import OpenAI from 'openai'

if (!process.env.NEXLY_API_KEY || !process.env.NEXLY_MODEL) {
  throw new Error('请先设置 NEXLY_API_KEY 和 NEXLY_MODEL')
}

const client = new OpenAI({
  apiKey: process.env.NEXLY_API_KEY,
  baseURL: 'https://nexlycn.guangnian.xin/v1',
  timeout: 60_000,
  maxRetries: 2,
})

const completion = await client.chat.completions.create({
  model: process.env.NEXLY_MODEL,
  messages: [{ role: 'user', content: '只回复：SDK 连接成功' }],
})

console.log(completion.choices[0].message.content)
```

### 3. 使用流式输出

```javascript
const stream = await client.chat.completions.create({
  model: process.env.NEXLY_MODEL,
  messages: [{ role: 'user', content: '讲一个短故事' }],
  stream: true,
})

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? '')
}
```

## 判断是否成功

- 非流式请求返回 `choices[0].message.content`。
- 流式请求持续产生 `delta.content`，并正常结束。
- Nexly 控制台出现对应模型的请求记录。

如果 SDK 报错，可以先用同一组 Key 和模型执行[最小 cURL 诊断](/help/errors#最小诊断流程)。cURL 成功但 SDK 失败时，重点检查 SDK 版本、Base URL 和代理配置。

## 超时与重试

生成较长内容时可能需要更久。请根据业务设置合理超时，并只对 `408`、`429`、`500`、`502`、`503`、`504` 等临时错误进行带退避的有限重试。

不要自动重试认证错误、参数错误或不存在的模型。更多建议请查看[错误处理](/help/errors#重试策略)。
