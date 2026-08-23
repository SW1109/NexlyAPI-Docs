# 从 Nexly API 快速导入 CC Switch

Nexly API 密钥页可以生成 CLI 配置或唤起 CC Switch。相比手动填写 Base URL、API Key 和协议参数，这是推荐接入方式。

本教程以 **Codex** 为例。不同版本的按钮名称可能略有区别，请以密钥页的 **使用密钥**或 **导入 CC Switch**入口为准。

## 开始前准备

- 已安装并至少启动过一次 [CC Switch](https://ccswitch.io)。
- 已安装要使用的 CLI，本教程为 Codex。
- Nexly API **我的订阅**中存在有效订阅。
- 浏览器允许打开 `ccswitch://` 外部应用协议。

::: tip 整个流程
创建 Nexly API Key → 打开使用密钥 → 选择 Codex / CC Switch → 检查模型和端点 → 导入 → 重启 Codex。
:::

## 第一步：创建 API Key

1. 登录 [Nexly API 控制台](https://nexly.guangnian.xin)。
2. 进入 **API 密钥**。
3. 点击 **创建密钥**。
4. 设置名称，例如 `Nexly Codex`。
5. 选择与当前订阅匹配的分组并保存。

<ScreenshotPlaceholder
  src="/images/nexlyapi/cc-switch-01-create-key.png"
  title="在 Nexly API 创建 Codex 专用密钥"
  description="建议展示密钥名称、分组和创建按钮，完整 API Key 必须打码。"
/>

## 第二步：打开接入配置

在密钥列表找到刚创建的 Key，点击 **使用密钥**、操作菜单或 **导入 CC Switch**。在弹窗中选择 Codex 对应标签。

<ScreenshotPlaceholder
  src="/images/nexlyapi/cc-switch-02-use-key.png"
  title="打开 Nexly API 的使用密钥配置"
  description="建议展示密钥操作入口和 CLI 选择区域，隐藏完整 Key。"
/>

确认配置使用 Nexly API 端点：

```text
https://nexly.guangnian.xin
```

默认模型必须来自当前 Key 可访问的 `/v1/models`。不要直接照抄其他教程中的模型名。

## 第三步：导入 CC Switch

如果页面提供 **打开 CC Switch**或 **导入到 CC Switch**：

1. 点击导入按钮。
2. 浏览器询问是否打开外部应用时选择允许。
3. 在 CC Switch 确认供应商名称、端点、协议和模型。
4. 完成导入，并启用新供应商。

建议命名为：

```text
Nexly API
```

<ScreenshotPlaceholder
  src="/images/nexlyapi/cc-switch-03-import.png"
  title="确认导入 Nexly API 到 CC Switch"
  description="建议截图浏览器唤起后的 CC Switch 确认页面，API Key 必须完全遮挡。"
  ratio="standard"
/>

::: danger 不要分享导入链接
`ccswitch://` 链接可能包含完整 API 配置和密钥。不要复制给他人，也不要发布到聊天群、Issue 或文档中。
:::

## 第四步：重启并验证 Codex

完全退出正在运行的 Codex，然后重新启动：

```bash
codex
```

1. 使用 `/model` 检查默认模型。
2. 发送一句简短测试，例如“只回复连接成功”。
3. 回到 Nexly API **使用记录**确认请求存在。
4. 检查 CC Switch 中启用的是 `Nexly API`。

<ScreenshotPlaceholder
  src="/images/nexlyapi/cc-switch-04-success.png"
  title="CC Switch 中的 Nexly API"
  description="建议展示新增供应商、启用状态和模型名称，隐藏 API Key。"
  ratio="standard"
/>

## 页面没有一键导入时

先复制密钥页提供的 Codex 配置，再按[配置 Codex](/tools/cc-switch-codex)手动创建供应商。核心配置为：

```text
Base URL：https://nexly.guangnian.xin
API Key：Nexly API 创建的 Key
模型：Nexly API `/v1/models` 返回的 ID
```

## 常见问题

### 点击导入没有反应

- 先手动启动一次 CC Switch。
- 检查浏览器是否拦截外部应用。
- 确认系统已将 `ccswitch` 协议关联到 CC Switch。
- 更新 CC Switch 后重新触发导入。

### 导入后仍使用旧供应商

在 CC Switch 中启用新供应商，完全退出 Codex，并新开终端重新启动。Codex 通常只在启动时读取配置。

### 模型无法调用

检查 Nexly API Key 的分组、订阅状态和模型权限，然后重新获取 `/v1/models`。必要时在 CC Switch 修改默认模型。
