# CC Switch：配置 Codex

Codex 原生使用 OpenAI Responses API。Nexly 提供对应接口时，可以通过 CC Switch 直接切换到 Nexly。

::: tip 推荐方式
如果能够登录 Nexly 工作台，优先使用[平台快速导入](/tools/cc-switch-quick-import)，无需手动填写以下配置。手动配置适合排查问题或需要自定义高级参数的用户。
:::

## 添加 Nexly Codex 供应商

1. 打开 CC Switch，在左侧选择 **Codex**。
2. 点击右上角 **+**，选择 **应用专属供应商**。
3. 预设选择 **自定义**。
4. 名称填写 `Nexly API`。
5. API Key 填写在 Nexly 控制台创建的令牌。
6. Base URL 填写 `https://nexlycn.guangnian.xin/v1`。
7. API 协议选择 **Responses**。
8. 点击 **获取模型**，选择当前账号可用的模型。
9. 保存并点击供应商卡片上的 **启用**。

::: warning 模型名称
不要直接照抄教程中的示例模型。请使用“获取模型”返回的模型 ID，或者以 Nexly 控制台当前展示为准。
:::

## 对应的 Codex 配置

CC Switch 会管理 `~/.codex/auth.json` 和 `~/.codex/config.toml`。正常情况下不需要手动修改文件。

其效果大致相当于：

::: code-group

```json [~/.codex/auth.json]
{
  "OPENAI_API_KEY": "你的 Nexly API Key"
}
```

```toml [~/.codex/config.toml]
model_provider = "nexly"
model = "从模型列表选择的 ID"
disable_response_storage = true

[model_providers.nexly]
name = "Nexly API"
base_url = "https://nexlycn.guangnian.xin/v1"
wire_api = "responses"
requires_openai_auth = true
```

:::

::: danger 不要复制真实密钥到文档
上面的密钥是占位符。实际密钥只应填写到本机 CC Switch，不要发送给其他人。
:::

## 验证配置

关闭正在运行的 Codex，然后重新打开终端并启动：

```bash
codex
```

进入 Codex 后：

1. 使用 `/model` 检查当前模型。
2. 发送一句简短问题。
3. 如果可以正常流式返回内容，说明配置成功。

## Responses 不可用时

如果模型只支持 `/v1/chat/completions`，可以使用 CC Switch 的本地路由转换：

1. 编辑 Nexly Codex 供应商。
2. 打开 **需要本地路由映射**。
3. 在模型映射表中添加从 `/v1/models` 获取的真实模型 ID。
4. 打开 CC Switch 的 **代理服务 / 本地路由服务**。
5. 对 Codex 开启 **应用接管**。
6. 保存后重启 Codex。

CC Switch 会把 Codex 的 Responses 请求转换为 Chat Completions 请求，再将结果转换回 Codex 能识别的格式。使用期间需要保持 CC Switch 的本地路由服务运行。

::: info 什么时候不需要本地路由
如果 `POST https://nexlycn.guangnian.xin/v1/responses` 对所选模型能够正常返回，就优先使用直连方式，配置更简单、链路也更短。
:::

## 常见问题

### 返回 401

重新复制 API Key，确认没有多余空格，并检查 `auth.json` 中使用的是 `OPENAI_API_KEY`。

### 返回 404

检查 Base URL 是否为：

```text
https://nexlycn.guangnian.xin/v1
```

如果所选模型不支持 Responses，请按上一节开启本地路由映射。

### 请求路径出现 `/v1/v1`

Base URL 被重复添加了版本路径。检查 CC Switch 中的端点，并关闭不必要的完整 URL或路径拼接设置。

### 切换后仍在使用旧供应商

完全退出 Codex，并重新打开终端。Codex 会在启动时读取 `config.toml` 和模型列表。

### `/model` 中没有刚添加的模型

重新编辑供应商并刷新模型映射，然后重启 Codex。CC Switch 的 `model_catalog_json` 通常在 Codex 启动时加载。
