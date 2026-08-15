# 客户端配置

大多数支持“OpenAI Compatible”或“自定义 OpenAI API 地址”的客户端都可以接入 Nexly API。

## 先确认地址类型

不同客户端对 `Base URL` 的定义不完全相同。填写前先判断它需要哪一种地址：

| 界面字段或使用场景 | 填写内容 |
| --- | --- |
| SDK 的 `base_url` / `baseURL` | `https://nexlycn.guangnian.xin/v1` |
| 客户端的 Base URL / API Host | 通常填写 `https://nexlycn.guangnian.xin/v1` |
| 客户端明确说明“自动添加 `/v1`” | `https://nexlycn.guangnian.xin` |
| 直接发送 HTTP 请求 | 使用完整地址，例如 `/v1/chat/completions` |
| 完整接口 URL 模式 | `https://nexlycn.guangnian.xin/v1/chat/completions` |

::: warning 不要默认填写完整接口路径
除非客户端明确要求“完整 URL”，否则不要把 `/chat/completions` 填入 Base URL。多数客户端会自己拼接接口路径。
:::

## 通用配置项

| 配置项 | 填写内容 |
| --- | --- |
| API 类型 / Provider | OpenAI / OpenAI Compatible |
| API Key | Nexly 控制台创建的 Key |
| Base URL | `https://nexlycn.guangnian.xin/v1` |
| 模型 | `/v1/models` 返回的模型 `id` |
| Chat 接口 | `/chat/completions` |
| Responses 接口 | `/responses`，仅在模型和客户端都支持时使用 |

## 通用配置步骤

在 Cherry Studio、Chatbox、NextChat、LobeChat 等客户端中，一般按以下步骤配置：

1. 新建一个提供商。
2. 类型选择 **OpenAI**或**OpenAI Compatible**。
3. 名称填写 `Nexly API`，便于与官方提供商区分。
4. 填入单独为该客户端创建的 API Key。
5. Base URL 先填写 `https://nexlycn.guangnian.xin/v1`。
6. 点击 **获取模型**；如果客户端不支持自动获取，则手动填写模型 ID。
7. 保存配置并将 Nexly 设为当前提供商。
8. 新建会话，发送“只回复连接成功”进行验证。

<strong>完成标志：</strong>模型列表可读取、测试消息返回正常、控制台能看到对应请求记录。

## 选择协议

客户端可能同时提供 Chat Completions 和 Responses 两种协议：

- 普通聊天客户端优先选择 **Chat Completions**，兼容范围更广。
- Codex 等原生使用 Responses 的工具优先选择 **Responses**。
- 如果 `/v1/responses` 返回 `404` 或模型不支持，应切换为 Chat Completions，或使用 CC Switch 的本地协议转换。

模型支持哪些能力，应以实际请求结果和[模型与能力](/guide/models)说明为准。

## 验证 Base URL

保存客户端配置前，可以先用同一个 Key 验证服务根地址：

```bash
curl --fail-with-body https://nexlycn.guangnian.xin/v1/models \
  -H "Authorization: Bearer $NEXLY_API_KEY"
```

如果命令成功但客户端失败，问题通常在客户端的路径拼接、代理、协议选择或模型配置，而不是 Key 本身。

## CC Switch

如果同时使用 Codex、Claude Code 等命令行工具，推荐通过 CC Switch 管理不同供应商：

- [从 Nexly 平台快速导入（推荐）](/tools/cc-switch-quick-import)
- [安装 CC Switch 并添加 Nexly](/tools/cc-switch)
- [通过 CC Switch 配置 Codex](/tools/cc-switch-codex)
- [通过 CC Switch 配置 Claude Code](/tools/cc-switch-claude)

## 常见问题

### 请求路径出现 `/v1/v1`

客户端已经自动添加 `/v1`。将 Base URL 末尾的 `/v1` 删除，再查看客户端预览的最终请求地址。

### 请求路径缺少 `/v1`

客户端没有自动添加版本路径。把 Base URL 改为 `https://nexlycn.guangnian.xin/v1`。

### 模型列表为空

1. 用上面的 cURL 命令确认 Key 能查询 `/v1/models`。
2. 检查客户端是否把请求错误拼成 `/v1/v1/models`。
3. 确认 Key 有模型权限且账号状态正常。
4. 如果自动获取仍失败，手动填写响应中的模型 `id`。

### 测试连接成功但对话失败

“测试连接”可能只验证 `/v1/models`。继续检查模型是否支持 `/v1/chat/completions`、消息格式是否正确，以及客户端选择的协议。

### 浏览器提示 CORS

优先启用客户端的服务端代理模式。纯浏览器应用会受到跨域策略限制，也不适合保存长期 Key。生产项目应由自己的服务端调用 Nexly API。
