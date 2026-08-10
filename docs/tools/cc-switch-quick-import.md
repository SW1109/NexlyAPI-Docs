# 从 Nexly 平台快速导入 CC Switch

Nexly 工作台可以直接生成 CC Switch 配置，并通过系统协议唤起 CC Switch。相比手动填写 Base URL、API Key 和协议参数，这种方式更快，也更不容易填错。

本教程以导入到 **Codex** 为例，Claude Code 和 Gemini 的操作入口相同。

## 开始前准备

请先确认：

- 已安装并至少启动过一次 [CC Switch](https://ccswitch.io)。
- 已安装需要使用的 CLI；本教程为 Codex。
- 浏览器允许 Nexly 工作台打开外部应用。
- CC Switch 没有被安全软件禁止注册 `ccswitch://` 协议。

::: tip 整个流程
创建 API Key → 打开操作菜单 → 选择 CC Switch → 选择 CLI 和模型 → 打开 CC Switch → 重启 CLI。
:::

## 第一步：创建 API Key

1. 登录 [Nexly API 工作台](https://nexlycn.guangnian.xin)。
2. 在左侧菜单进入 **API 密钥**。
3. 点击页面右上角的 **创建 API 密钥**。
4. 设置密钥名称、额度、可调用模型等权限并保存。

建议为不同 CLI 单独创建密钥，例如 `codex-work`，这样后续可以独立查看用量、调整权限或撤销密钥。

## 第二步：打开 CC Switch 导入入口

找到刚创建的密钥，在最右侧 **操作** 列点击三个点 `…`，然后选择 **CC Switch**。

<figure class="docs-screenshot">
  <img src="/images/cc-switch/platform-import-api-key.png" alt="在 Nexly API 密钥操作菜单中选择 CC Switch" loading="lazy" />
  <figcaption>API 密钥 → 操作菜单 → CC Switch</figcaption>
</figure>

::: warning 不要点击“复制密钥”后公开粘贴
平台会自动把当前密钥写入待导入配置，不需要手动复制到聊天、文档或截图中。
:::

## 第三步：选择 CLI 和默认模型

在 **填入 CC Switch** 弹窗中完成以下配置：

1. **应用**选择 `Codex`。
2. **名称**填写一个容易识别的供应商名称，例如 `Nexly Codex`。
3. **主模型**选择该密钥允许调用的默认模型。
4. 点击 **打开 CC Switch**。

<figure class="docs-screenshot docs-screenshot-dialog">
  <img src="/images/cc-switch/platform-import-dialog.png" alt="选择 Codex、供应商名称和默认模型后打开 CC Switch" loading="lazy" />
  <figcaption>以 Codex 为例选择应用、名称和主模型</figcaption>
</figure>

模型下拉框只应选择当前 API Key 有权限调用的模型。如果之后修改了密钥的模型权限，请同时更新 CC Switch 中的默认模型。

## 第四步：允许浏览器打开 CC Switch

点击按钮后，浏览器会尝试打开 `ccswitch://` 链接：

1. 浏览器询问是否打开外部应用时，选择 **允许**或**打开 CC Switch**。
2. 如果 CC Switch 显示导入确认页，检查应用、名称、端点和模型。
3. 确认导入。

<figure class="docs-screenshot docs-screenshot-dialog">
  <img src="/images/cc-switch/platform-import-api-succ.png" alt="导入成功后 CC Switch 自动打开" loading="lazy" />
  <figcaption>导入成功后</figcaption>
</figure>

导入完成后，CC Switch 的 Codex 供应商列表中会新增一条数据。确认新供应商处于启用状态；如果没有自动启用，点击供应商卡片上的 **启用**。

::: danger 不要分享导入链接
`ccswitch://` 导入链接中可能包含 API 配置和密钥。不要复制给他人，也不要发送到聊天群或公开 Issue。
:::

## 第五步：重启 Codex

完全退出正在运行的 Codex，然后重新启动：

```bash
codex
```

Codex 会在启动时重新读取供应商、API Key 和默认模型。仅关闭当前对话通常不够，建议退出进程后重新打开终端。

## 验证是否成功

进入 Codex 后执行以下检查：

1. 使用 `/model` 查看当前默认模型。
2. 发送一句简短测试，例如“只回复连接成功”。
3. 返回内容正常且 CC Switch 显示 Nexly 供应商已启用，即表示导入成功。

## 常见问题

### 点击“打开 CC Switch”没有反应

- 确认 CC Switch 已安装并至少手动启动过一次。
- 检查浏览器地址栏或页面顶部是否拦截了外部应用。
- 更换 Chrome、Edge 或系统默认浏览器重试。
- 在 Windows 默认应用设置中确认 `ccswitch` 协议已关联到 CC Switch。

如果仍无法唤起，可以改用[手动添加 Nexly](/tools/cc-switch)。

### CC Switch 打开了，但没有新增数据

- 回到浏览器重新点击一次 **打开 CC Switch**。
- 保持 CC Switch 已启动，再次触发导入。
- 检查是否出现了被其他窗口遮挡的导入确认弹窗。
- 更新到最新稳定版 CC Switch 后重试。

### 新供应商已经出现，但 Codex 仍使用旧配置

在 CC Switch 中确认新供应商已经点击 **启用**，然后完全退出 Codex、关闭旧终端并重新启动。

### 默认模型无法调用

返回 Nexly 工作台检查 API Key 的可调用模型范围，或者在 CC Switch 中改成 `/v1/models` 返回的其他模型 ID。

### 返回 401

API Key 可能被删除、禁用或导入不完整。重新创建密钥并执行一次快速导入，不要手工拼接或修改密钥。

## 需要高级配置时

快速导入适合大多数用户。如果需要自定义 Responses 协议、本地路由或模型映射，可以继续阅读：

- [CC Switch 配置 Codex](/tools/cc-switch-codex)
- [CC Switch 配置 Claude Code](/tools/cc-switch-claude)
