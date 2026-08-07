# 客户端配置

大多数支持“自定义 OpenAI API 地址”的工具都可以接入 Nexly API。

## 通用配置

| 配置项 | 填写内容 |
| --- | --- |
| API 类型 | OpenAI / OpenAI Compatible |
| API Key | 在 Nexly API 控制台创建的令牌 |
| Base URL | `https://nexlycn.guangnian.xin/v1` |
| 模型 | 使用 `/v1/models` 返回的模型 ID |

::: info Base URL 的 `/v1`
SDK 和客户端通常要求填写带 `/v1` 的地址；直接调用 HTTP 接口时，则在根地址后拼接完整路径。若某个客户端会自动添加 `/v1`，请按其界面提示填写。
:::

## 常见客户端

在 Cherry Studio、Chatbox、NextChat、LobeChat 等客户端中：

1. 新建 OpenAI 或 OpenAI Compatible 提供商。
2. 填入 API Key。
3. 将 API 地址改为 `https://nexlycn.guangnian.xin/v1`。
4. 手动添加模型，或者尝试从 `/v1/models` 拉取。
5. 保存后发送一条短消息进行测试。

## CC Switch

如果你同时使用 Codex、Claude Code 等命令行工具，可以通过 CC Switch 保存多个供应商并快速切换：

- [从 Nexly 平台快速导入（推荐）](/tools/cc-switch-quick-import)
- [安装 CC Switch 并添加 Nexly](/tools/cc-switch)
- [通过 CC Switch 配置 Codex](/tools/cc-switch-codex)
- [通过 CC Switch 配置 Claude Code](/tools/cc-switch-claude)

## 常见问题

### 请求路径出现 `/v1/v1`

客户端已经自动添加 `/v1`。将地址末尾的 `/v1` 删除后重试。

### 模型列表为空

确认 API Key 有效，并检查账号是否已经获得对应模型的访问权限。也可以手动填写控制台展示的模型 ID。

### 浏览器提示 CORS

优先使用客户端的服务端代理模式。纯浏览器应用会受到跨域策略限制，不建议把长期密钥保存在浏览器中。
