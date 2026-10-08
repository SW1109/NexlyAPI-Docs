# HTTP 请求

不使用 SDK 时，可以直接向 Nexly API 发送标准 HTTPS 请求。开始前请先设置 `NEXLY_API_KEY` 和 `NEXLY_MODEL`，具体方法见[快速开始](/guide/quickstart)。

## 请求约定

| 项目 | 内容 |
| --- | --- |
| 服务根地址 | `https://nexly.guangnian.xin` |
| API 版本路径 | `/v1` |
| 鉴权 | `Authorization: Bearer YOUR_API_KEY` |
| JSON 请求 | `Content-Type: application/json` |
| 字符编码 | UTF-8 |

## 先验证认证

```bash
curl --fail-with-body https://nexly.guangnian.xin/v1/models \
  -H "Authorization: Bearer $NEXLY_API_KEY"
```

只有模型列表返回 `200` 后，再调试业务请求。这里验证的是完整 HTTP 路径；SDK 的 Base URL 与客户端的自动拼接规则见[客户端配置](/guide/client-config#先确认地址类型)，不要把完整接口 URL 原样填入 SDK。

## 非流式请求

```bash
curl --fail-with-body https://nexly.guangnian.xin/v1/chat/completions \
  -H "Authorization: Bearer $NEXLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"$NEXLY_MODEL\",
    \"messages\": [
      {\"role\": \"user\", \"content\": \"只回复：HTTP 连接成功\"}
    ],
    \"stream\": false
  }"
```

成功响应中通常包含：

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "HTTP 连接成功"
      }
    }
  ]
}
```

## 流式请求

将 `stream` 设置为 `true`。服务端会通过 Server-Sent Events 持续返回增量数据：

```bash
curl -N --fail-with-body https://nexly.guangnian.xin/v1/chat/completions \
  -H "Authorization: Bearer $NEXLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"$NEXLY_MODEL\",
    \"messages\": [{\"role\": \"user\", \"content\": \"写一首短诗\"}],
    \"stream\": true
  }"
```

`curl -N` 会关闭客户端输出缓冲。流结束时通常会收到：

```text
data: [DONE]
```

如果非流式请求正常但流式请求没有增量输出，检查反向代理是否开启了响应缓冲。

上面的 `[DONE]` 结束标记属于 Chat Completions。`/v1/responses` 的 SSE 使用事件名，例如 `response.output_text.delta`、`response.completed`，也可能以失败或未完成事件结束；不要混用两种协议的解析逻辑。具体结构与示意见 [API Reference](/api-reference)，实际支持范围取决于模型和渠道。

## 查看状态码和响应头

排错时添加 `-i`：

```bash
curl -i https://nexly.guangnian.xin/v1/models \
  -H "Authorization: Bearer $NEXLY_API_KEY"
```

请记录 HTTP 状态码和响应头中的请求 ID。反馈问题时可以提供请求 ID，但不要提供完整 API Key。

## 请求超时

可以限制连接和总请求时间：

```bash
curl --connect-timeout 10 --max-time 120 \
  https://nexly.guangnian.xin/v1/models \
  -H "Authorization: Bearer $NEXLY_API_KEY"
```

生成请求的总超时通常应高于模型列表请求。完整排错流程请查看[错误处理](/help/errors)。
