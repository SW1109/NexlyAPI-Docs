# OpenAI SDK

Nexly API 兼容 OpenAI SDK。迁移现有项目时，通常只需要修改 `api_key` 和 `base_url`。

## Python

安装 SDK：

```bash
pip install --upgrade openai
```

创建对话：

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["NEXLY_API_KEY"],
    base_url="https://nexlycn.guangnian.xin/v1",
)

completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "你是一个专业的编程助手。"},
        {"role": "user", "content": "写一个 Python 快速排序。"},
    ],
)

print(completion.choices[0].message.content)
```

流式输出：

```python
stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "讲一个短故事"}],
    stream=True,
)

for chunk in stream:
    content = chunk.choices[0].delta.content
    if content:
        print(content, end="", flush=True)
```

## Node.js

安装 SDK：

```bash
npm install openai
```

创建对话：

```javascript
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.NEXLY_API_KEY,
  baseURL: 'https://nexlycn.guangnian.xin/v1',
})

const completion = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: '你好！' }],
})

console.log(completion.choices[0].message.content)
```

## 超时与重试

生成较长内容时可能需要更久。请根据业务设置合理超时，并只对 `429`、`500`、`502`、`503`、`504` 等临时错误进行带退避的有限重试。
