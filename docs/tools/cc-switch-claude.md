# CC Switch：配置 Claude Code

Claude Code 原生使用 Anthropic Messages API。如果 Nexly 的对应模型支持该协议，可以直接连接；如果模型只支持 OpenAI Chat Completions，则需要 CC Switch 做本地协议转换。

## 方式一：Anthropic Messages 直连

适用于能够通过下面路径调用的模型：

```text
POST https://nexlycn.guangnian.xin/v1/messages
```

配置步骤：

1. 打开 CC Switch，在左侧选择 **Claude Code**。
2. 点击右上角 **+**，选择 **应用专属供应商**。
3. 预设选择 **自定义**。
4. 名称填写 `Nexly API`。
5. API Key 填写 Nexly API Key。
6. Base URL 填写 `https://nexlycn.guangnian.xin`。
7. API 格式选择 **Anthropic Messages**。
8. 填写或选择支持 Claude Code 的模型 ID。
9. 保存并点击 **启用**。

CC Switch 生成的核心配置类似：

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "你的 Nexly API Key",
    "ANTHROPIC_BASE_URL": "https://nexlycn.guangnian.xin"
  }
}
```

如果服务要求 Bearer Token 而不是 `x-api-key`，可以在 CC Switch 的高级 JSON 中改用 `ANTHROPIC_AUTH_TOKEN`。通常只需要保留一种认证变量，不要同时填写多个不同密钥。

## 方式二：OpenAI Chat 协议转换

当模型只能调用 `/v1/chat/completions` 时：

1. 添加或编辑 Claude Code 的 Nexly 供应商。
2. Base URL 填写 `https://nexlycn.guangnian.xin`。
3. 展开 **高级选项**。
4. API 格式选择 **OpenAI Chat Completions**。
5. 在模型映射中填写 Nexly 返回的真实模型 ID。
6. 打开 CC Switch 的 **代理服务 / 本地路由服务**。
7. 对 Claude Code 开启 **应用接管**。
8. 保存并启用供应商。

转换模式下，Claude Code 仍然发送 Anthropic Messages 请求，CC Switch 本地代理会转换成 Nexly 的 OpenAI Chat 请求。工具调用、流式输出等能力是否完整可用，取决于所选模型和上游接口。

::: warning 保持 CC Switch 运行
使用协议转换时，本地路由服务必须保持运行。退出 CC Switch 前请确认它仍在系统托盘中，而不是完全结束进程。
:::

## 配置默认模型

优先在 CC Switch 供应商编辑界面中设置模型。模型名称必须与 `/v1/models` 返回的 `id` 完全一致，包括大小写和连字符。

不同 Claude 角色可以映射到不同模型：

| Claude Code 角色 | 建议用途 |
| --- | --- |
| Sonnet | 日常编码和主要任务 |
| Opus | 复杂推理和大型重构 |
| Haiku | 快速、低成本任务 |

具体映射应根据 Nexly 当前提供的模型选择，不要把表格中的角色名称直接当成模型 ID。

## 验证配置

在新终端中启动：

```bash
claude
```

然后发送一条简短请求，例如：

```text
只回复“连接成功”，不要执行任何工具。
```

直连模式不依赖 CC Switch 本地代理；转换模式可以同时观察 CC Switch 的代理状态和请求日志。

## 常见问题

### Claude Code 仍然要求官方登录

确认 Nexly 供应商已经点击 **启用**，并检查 Claude Code 配置中是否写入 `ANTHROPIC_API_KEY` 或 `ANTHROPIC_AUTH_TOKEN`。

### 返回 404

- 直连模式：确认 Nexly 和所选模型支持 `/v1/messages`。
- 转换模式：确认 API 格式为 OpenAI Chat Completions，并开启本地路由与 Claude Code 接管。

### 模型不存在

通过 CC Switch 的 **获取模型** 重新拉取列表，然后把角色映射修改为实际模型 ID。

### 工具调用失败

先使用纯文本问题测试基础连接。如果纯文本正常、工具调用失败，通常是当前模型或协议转换对工具调用支持不完整。可以更换模型，或改用 Anthropic Messages 直连。

### 环境变量覆盖了 CC Switch

终端中已有的 `ANTHROPIC_BASE_URL`、`ANTHROPIC_API_KEY` 或 `ANTHROPIC_AUTH_TOKEN` 可能覆盖配置。清理冲突的系统环境变量后，重新打开终端。
