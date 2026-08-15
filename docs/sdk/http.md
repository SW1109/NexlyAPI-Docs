# HTTP 请求

不使用 SDK 时，可以直接发送标准 HTTPS 请求。开始前请先设置 `NEXLY_API_KEY` 和 `NEXLY_MODEL`，具体方法见[快速开始](/guide/quickstart)。

## 请求约定

| 项目 | 内容 |
| --- | --- |
| 服务根地址 | `https://nexlycn.guangnian.xin` |
| API 版本路径 | `/v1` |
| 鉴权 | `Authorization: Bearer YOUR_API_KEY` |
| JSON 请求 | `Content-Type: application/json` |
| 字符编码 | UTF-8 |

## 先验证认证

```bash
curl --fail-with-body https://nexlycn.guangnian.xin/v1/models \
  -H "Authorization: Bearer $NEXLY_API_KEY"
```

只有模型列表返回 `200` 后，再调试业务请求。

## 非流式请求

```bash
curl --fail-with-body https://nexlycn.guangnian.xin/v1/chat/completions \
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
curl -N --fail-with-body https://nexlycn.guangnian.xin/v1/chat/completions \
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

## 查看状态码和响应头

排错时添加 `-i`：

```bash
curl -i https://nexlycn.guangnian.xin/v1/models \
  -H "Authorization: Bearer $NEXLY_API_KEY"
```

请记录 HTTP 状态码和响应头中的请求 ID。反馈问题时可以提供请求 ID，但不要提供完整 API Key。

## 请求超时

可以限制连接和总请求时间：

```bash
curl --connect-timeout 10 --max-time 120 \
  https://nexlycn.guangnian.xin/v1/models \
  -H "Authorization: Bearer $NEXLY_API_KEY"
```

生成请求的总超时通常应高于模型列表请求。完整排错流程请查看[错误处理](/help/errors)。
