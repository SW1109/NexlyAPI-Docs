# HTTP 请求

不使用 SDK 时，可以直接发送标准 HTTPS 请求。

## 请求约定

- 根地址：`https://nexlycn.guangnian.xin`
- 鉴权：`Authorization: Bearer YOUR_API_KEY`
- JSON 请求：`Content-Type: application/json`
- 字符编码：UTF-8

## 非流式请求

```bash
curl https://nexlycn.guangnian.xin/v1/chat/completions \
  -H "Authorization: Bearer $NEXLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "你好"}],
    "stream": false
  }'
```

## 流式请求

将 `stream` 设置为 `true`。服务端会通过 Server-Sent Events 持续返回增量数据：

```bash
curl -N https://nexlycn.guangnian.xin/v1/chat/completions \
  -H "Authorization: Bearer $NEXLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "写一首短诗"}],
    "stream": true
  }'
```

流结束时通常会收到：

```text
data: [DONE]
```

## 请求 ID

若响应头中包含请求 ID，请在反馈问题时一并提供。不要在工单或聊天中提供完整 API Key。
