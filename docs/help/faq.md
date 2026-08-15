# 常见问题

## Nexly API 可以直接使用 OpenAI SDK 吗？

可以。把 SDK 的 Base URL 修改为 `https://nexlycn.guangnian.xin/v1`，并使用 Nexly API Key 和 `/v1/models` 返回的模型 ID。完整示例见 [OpenAI SDK](/sdk/openai)。

## Base URL 到底要不要带 `/v1`？

OpenAI SDK 和大多数客户端填写 `https://nexlycn.guangnian.xin/v1`。如果客户端明确说明会自动添加 `/v1`，则填写根地址。详细判定见[客户端配置](/guide/client-config#先确认地址类型)。

## 为什么示例模型无法调用？

模型名称只用于展示请求结构。调用 `GET /v1/models` 或登录控制台查询当前账号可用模型，并把返回的 `id` 原样填入 `model`。

## 模型列表能获取，但聊天仍失败？

模型列表只证明 Key 和基础服务正常。继续确认模型是否支持 `/v1/chat/completions`、`/v1/responses` 或当前客户端使用的其他协议。

## API Key 应该放在哪里？

放在服务端环境变量、CI/CD Secret 或密钥管理服务中。不要提交到 Git，不要写入公开网页，也不要打包进客户端应用。详细建议见[身份认证](/guide/authentication)。

## 为什么返回 401？

检查请求头是否为 `Authorization: Bearer YOUR_API_KEY`，注意 `Bearer` 后有一个空格，并确认 Key 没有被删除、禁用、过期或复制不完整。

## 为什么返回 429？

可能是请求频率超过限制、并发过高、账号额度不足或上游渠道限流。请先查看完整错误消息和控制台用量，再决定是否重试。

## 支持流式输出吗？

支持流式输出的模型可以设置 `"stream": true`。cURL 测试时使用 `-N`。不同模型的能力以实际请求结果为准。

## 为什么流式响应一次性返回？

客户端或反向代理可能缓冲了 SSE 响应。先使用 `curl -N` 直连测试，再检查 Nginx、网关或客户端的响应缓冲设置。

## 可以在浏览器前端直接调用吗？

不建议。浏览器会暴露 API Key，并可能受到 CORS 限制。生产项目应由自己的服务端保存 Key 并代理请求。

## 在线调试会保存 API Key 吗？

API Reference 可以在当前浏览器中保存认证状态，方便连续测试。不要在公共或共享设备上使用长期 Key；测试完成后清除认证信息。

## 反馈问题需要提供什么？

请提供请求时间、状态码、错误响应、接口路径、模型 ID、SDK 或客户端版本，以及响应头中的请求 ID。不要提供完整 API Key。详情见[错误处理](/help/errors#反馈问题时提供)。
