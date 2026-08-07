# 模型与能力

不同账号、渠道和时间段可用的模型可能不同。请始终以模型列表接口或控制台显示为准。

## 查询模型

```bash
curl https://nexlycn.guangnian.xin/v1/models \
  -H "Authorization: Bearer $NEXLY_API_KEY"
```

典型响应：

```json
{
  "object": "list",
  "data": [
    {
      "id": "gpt-4o-mini",
      "object": "model",
      "owned_by": "provider"
    }
  ]
}
```

将返回对象的 `id` 原样填写到请求的 `model` 字段：

```json
{
  "model": "gpt-4o-mini",
  "messages": [
    { "role": "user", "content": "你好" }
  ]
}
```

## 能力说明

模型可能支持以下一种或多种能力：

| 能力 | 常用接口 |
| --- | --- |
| 文本与多模态对话 | `/v1/chat/completions` |
| Responses API | `/v1/responses` |
| 文本向量 | `/v1/embeddings` |
| 图像生成 | `/v1/images/generations` |
| 语音合成 | `/v1/audio/speech` |
| 语音识别 | `/v1/audio/transcriptions` |

::: warning 接口可用性
并非每个模型都支持所有参数和能力。若上游模型不支持某个参数，API 可能返回 `400` 错误。
:::
