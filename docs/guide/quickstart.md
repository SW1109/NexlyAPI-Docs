# 快速开始

本教程带你完成一个可验证的 Nexly API 请求。全程通常需要 5～10 分钟。

<div class="api-base-url">
  <strong>API 服务地址</strong>
  <code>https://nexlycn.guangnian.xin</code>
</div>

::: tip 你将完成
创建 API Key → 保存到环境变量 → 查询账号可用模型 → 发送第一条消息 → 根据响应确认接入成功。
:::

## 开始前准备

请确认当前设备具备以下条件：

- 可以登录 [Nexly API 控制台](https://nexlycn.guangnian.xin)。
- 已安装 `curl`，或者已准备 Python 3.9+ / Node.js 18+。
- 使用终端执行示例，而不是在浏览器控制台中直接暴露 API Key。

本文使用两个环境变量：

| 环境变量 | 用途 |
| --- | --- |
| `NEXLY_API_KEY` | 保存从控制台创建的 API Key |
| `NEXLY_MODEL` | 保存 `/v1/models` 返回的真实模型 ID |

### macOS 图文演示

下面以 macOS 为例展示完整操作路径：左侧在 Nexly 控制台创建并保存 API Key，右侧在终端设置环境变量、查询当前账号可用模型并发送请求。点击图片可以放大查看命令细节。

<figure class="docs-screenshot docs-screenshot-macos">
  <img src="/images/quickstart/macos-api-quickstart.webp" alt="macOS 上从 Nexly 控制台创建 API Key，并在终端查询模型和发送首个请求" loading="lazy" />
  <figcaption>macOS 操作演示：创建 API Key → 查询模型 ID → 发起请求 → 返回 200 OK。图中 Key 和模型 ID 均为演示内容。</figcaption>
</figure>

## 1. 创建 API Key

1. 登录 [Nexly API 控制台](https://nexlycn.guangnian.xin)。
2. 进入 **API 密钥**或**令牌管理**页面。
3. 点击 **创建 API 密钥**。
4. 填写便于识别的名称，例如 `quickstart-local`。
5. 根据用途设置额度、有效期和可调用模型，然后保存。
6. 复制新创建的 Key，并存放到安全位置。

::: danger 不要公开 API Key
不要把真实 Key 写入 Git、网页前端、截图、聊天记录或客户端安装包。如果怀疑泄露，请立即删除旧 Key 并创建新 Key。
:::

如果已安装 CC Switch，也可以创建 Key 后使用[平台快速导入](/tools/cc-switch-quick-import)，跳过手工填写端点和模型的步骤。

## 2. 设置环境变量

环境变量只在当前终端会话中生效，关闭终端后需要重新设置。

::: code-group

```bash [macOS / Linux]
export NEXLY_API_KEY="粘贴你的 API Key"
```

```powershell [Windows PowerShell]
$env:NEXLY_API_KEY="粘贴你的 API Key"
```

:::

只检查变量是否存在，不要把完整 Key 打印到屏幕：

::: code-group

```bash [macOS / Linux]
test -n "$NEXLY_API_KEY" && echo "NEXLY_API_KEY 已设置"
```

```powershell [Windows PowerShell]
if ($env:NEXLY_API_KEY) { "NEXLY_API_KEY 已设置" }
```

:::

<strong>预期结果：</strong>终端输出 `NEXLY_API_KEY 已设置`。

## 3. 查询并选择模型

不要直接照抄文档中的示例模型。不同账号可用模型可能不同，应先查询模型列表。

::: code-group

```bash [macOS / Linux]
curl --fail-with-body https://nexlycn.guangnian.xin/v1/models \
  -H "Authorization: Bearer $NEXLY_API_KEY"
```

```powershell [Windows PowerShell]
$headers = @{ Authorization = "Bearer $env:NEXLY_API_KEY" }
Invoke-RestMethod `
  -Uri "https://nexlycn.guangnian.xin/v1/models" `
  -Headers $headers
```

:::

成功时会返回模型列表：

```json
{
  "object": "list",
  "data": [
    {
      "id": "账号实际可用的模型 ID",
      "object": "model"
    }
  ]
}
```

从 `data` 中选择一个 `id`，原样保存到 `NEXLY_MODEL`：

::: code-group

```bash [macOS / Linux]
export NEXLY_MODEL="把模型 ID 填在这里"
```

```powershell [Windows PowerShell]
$env:NEXLY_MODEL="把模型 ID 填在这里"
```

:::

<strong>预期结果：</strong>`/v1/models` 返回 HTTP `200`，并且 `data` 数组中至少包含一个模型。

## 4. 发送第一条消息

下面四种方式任选一种。首次测试建议使用 cURL 或 PowerShell，以减少 SDK 环境带来的干扰。

::: code-group

```bash [cURL]
curl --fail-with-body https://nexlycn.guangnian.xin/v1/chat/completions \
  -H "Authorization: Bearer $NEXLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"$NEXLY_MODEL\",
    \"messages\": [
      {\"role\": \"user\", \"content\": \"只回复：Nexly API 连接成功\"}
    ]
  }"
```

```powershell [PowerShell]
$headers = @{
  Authorization = "Bearer $env:NEXLY_API_KEY"
  "Content-Type" = "application/json"
}
$body = @{
  model = $env:NEXLY_MODEL
  messages = @(
    @{ role = "user"; content = "只回复：Nexly API 连接成功" }
  )
} | ConvertTo-Json -Depth 4

Invoke-RestMethod `
  -Method Post `
  -Uri "https://nexlycn.guangnian.xin/v1/chat/completions" `
  -Headers $headers `
  -Body $body
```

```python [Python]
# 安装依赖：python -m pip install --upgrade openai
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["NEXLY_API_KEY"],
    base_url="https://nexlycn.guangnian.xin/v1",
)

response = client.chat.completions.create(
    model=os.environ["NEXLY_MODEL"],
    messages=[
        {"role": "user", "content": "只回复：Nexly API 连接成功"}
    ],
)

print(response.choices[0].message.content)
```

```javascript [Node.js]
// 安装依赖：npm install openai
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.NEXLY_API_KEY,
  baseURL: 'https://nexlycn.guangnian.xin/v1',
})

const response = await client.chat.completions.create({
  model: process.env.NEXLY_MODEL,
  messages: [
    { role: 'user', content: '只回复：Nexly API 连接成功' },
  ],
})

console.log(response.choices[0].message.content)
```

:::

## 5. 确认接入成功

满足以下条件表示基础接入已经完成：

- 请求返回 HTTP `200`。
- 响应中包含 `choices[0].message.content`。
- 返回内容不是 HTML 登录页或网关错误页。
- 控制台用量记录中可以看到刚才的请求。

如果请求失败，先按下表检查：

| 现象 | 优先检查 |
| --- | --- |
| `401` | Key 是否完整、是否已删除，`Bearer` 后是否有一个空格 |
| `403` | Key 的权限、有效期、账号状态和模型授权 |
| `404` | 地址是否包含正确的 `/v1`，模型是否支持当前接口 |
| `429` | 账号额度、并发、频率限制和错误消息 |
| `400 model not found` | `NEXLY_MODEL` 是否与 `/v1/models` 返回的 `id` 完全一致 |

完整处理方法请查看[错误处理](/help/errors)。

## 接入检查清单

- [ ] API Key 只保存在本机环境变量或服务端密钥管理系统中。
- [ ] 模型 ID 来自当前账号的 `/v1/models` 响应。
- [ ] SDK 的 Base URL 使用 `https://nexlycn.guangnian.xin/v1`。
- [ ] 第一个请求已返回 HTTP `200`。
- [ ] 日志和错误反馈中没有包含完整 API Key。

## 下一步

- 阅读[身份认证](/guide/authentication)，了解 Key 的隔离、轮换和撤销。
- 阅读[模型与能力](/guide/models)，确认模型支持的接口和参数。
- 阅读[OpenAI SDK](/sdk/openai)或[HTTP 请求](/sdk/http)，接入流式输出和错误处理。
- 打开 [API Reference](/api-reference)，查看完整请求参数和响应结构。
