# 模型与能力

不同账号、渠道和时间段可用的模型可能不同。不要把文档中的示例名称当作固定模型，请始终以 `/v1/models` 或控制台当前显示为准。

## 1. 查询模型

```bash
curl --fail-with-body https://nexlycn.guangnian.xin/v1/models \
  -H "Authorization: Bearer $NEXLY_API_KEY"
```

典型响应：

```json
{
  "object": "list",
  "data": [
    {
      "id": "账号实际可用的模型 ID",
      "object": "model",
      "owned_by": "provider"
    }
  ]
}
```

## 2. 保存模型 ID

将返回对象的 `id` 原样保存。模型 ID 区分大小写，也不要自行删除后缀或版本号。

::: code-group

```bash [macOS / Linux]
export NEXLY_MODEL="从 data 中选择的 id"
```

```powershell [Windows PowerShell]
$env:NEXLY_MODEL="从 data 中选择的 id"
```

:::

请求中的 `model` 字段必须与该值完全一致：

```json
{
  "model": "从模型列表返回的真实 ID",
  "messages": [
    { "role": "user", "content": "你好" }
  ]
}
```

## 3. 验证模型能力

`/v1/models` 表示账号可以看到模型，不一定代表该模型支持所有接口。首次使用时应发送最小请求验证目标能力。

| 能力 | 常用接口 | 最小验证方式 |
| --- | --- | --- |
| 文本与多模态对话 | `/v1/chat/completions` | 发送一条纯文本消息 |
| Responses API | `/v1/responses` | 发送一个简单文本输入 |
| 文本向量 | `/v1/embeddings` | 对短文本生成向量 |
| 图像生成 | `/v1/images/generations` | 生成一张低成本测试图 |
| 语音合成 | `/v1/audio/speech` | 合成一段短文本 |
| 语音识别 | `/v1/audio/transcriptions` | 上传一段短音频 |

::: warning 接口可用性
并非每个模型都支持所有参数、工具调用、图片输入或流式输出。上游模型不支持某个参数时，API 可能返回 `400`；接口或协议不匹配时也可能返回 `404`。
:::

## 4. 选择模型

建议先明确业务目标，再选择模型：

- 日常对话和轻量任务：优先选择延迟低、成本可控的模型。
- 复杂推理和代码任务：选择推理或代码能力更强的模型，并适当提高超时。
- 工具调用：先验证模型能正确生成和接收工具调用结果。
- 多模态：确认模型和当前接口都支持图片、音频等输入类型。
- 批量任务：关注并发、速率限制和失败重试成本。

不要只根据模型名称判断能力。对上线必需的参数和响应格式，应使用实际 Key 做集成测试。

## 5. 处理模型变更

模型可能因为权限、版本升级或渠道调整而变化。生产应用建议：

1. 把模型 ID 放在环境变量或配置中心，不要散落在业务代码中。
2. 启动或发布前验证目标模型仍在 `/v1/models` 中。
3. 对关键功能准备经过验证的备用模型。
4. 切换模型后重新验证工具调用、结构化输出和最大上下文等能力。
5. 遇到 `model not found` 时先刷新模型列表，不要持续重试旧模型。

完成模型选择后，可继续阅读 [OpenAI SDK](/sdk/openai) 或 [HTTP 请求](/sdk/http)。
