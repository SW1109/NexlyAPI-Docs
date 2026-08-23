# Nexly API 工作台

本页介绍完成 API 接入所需的最短流程：登录、获取可用订阅、创建密钥、复制接入信息和查看用量。

## 1. 登录控制台

访问 [nexly.guangnian.xin](https://nexly.guangnian.xin) 登录或注册。进入控制台后，先确认右上角显示的是你准备使用的账号。

<ScreenshotPlaceholder
  src="/images/nexlyapi/01-dashboard.png"
  title="Nexly API 控制台首页"
  description="建议截图包含左侧导航、账号状态与订阅概览，请遮挡余额或个人信息。"
/>

## 2. 获取订阅或兑换额度

根据控制台当前提供的方式完成其中一种：

- 进入 **购买订阅**，选择适合的套餐并完成购买。
- 已有兑换码时进入 **兑换**，输入兑换码并确认。

完成后在 **我的订阅**中检查状态、有效期和剩余额度。只有处于有效状态的订阅才能正常调用对应模型分组。

<ScreenshotPlaceholder
  src="/images/nexlyapi/02-subscription.png"
  title="购买订阅或兑换额度"
  description="建议截图套餐选择或兑换页面，并遮挡订单、兑换码和支付信息。"
/>

## 3. 创建 API Key

1. 在左侧菜单进入 **API 密钥**。
2. 点击 **创建密钥**。
3. 填写一个能识别用途的名称，例如 `macbook-codex`。
4. 选择与订阅相匹配的模型分组。
5. 按需设置有效期、额度和 IP 限制；首次测试可保持简单配置。
6. 保存并复制新 Key。

<ScreenshotPlaceholder
  src="/images/nexlyapi/03-create-key.png"
  title="创建 Nexly API 密钥"
  description="建议同时展示密钥名称、分组和创建按钮；真实 API Key 必须打码。"
/>

::: danger 立即保存 API Key
API Key 只应保存到密码管理器或本机环境变量。不要把完整 Key 放进截图、聊天记录、网页前端或 Git 仓库。
:::

## 4. 获取接入配置

在密钥列表找到刚创建的 Key，使用 **使用密钥**或对应操作入口。页面会给出支持的 CLI、环境变量和端点配置；也可以直接复制服务地址：

```text
Base URL：https://nexly.guangnian.xin
```

<ScreenshotPlaceholder
  src="/images/nexlyapi/04-use-key.png"
  title="查看密钥接入配置"
  description="建议截图“使用密钥”弹窗中的客户端标签和 Base URL，完整 Key 必须打码。"
/>

使用 CC Switch 时，可以继续阅读[Nexly API 快速导入](/tools/cc-switch-quick-import)。

## 5. 查看用量

发送请求后进入 **使用记录**：

- 按 API Key、模型或时间筛选请求。
- 检查请求状态、Token 用量、耗时和计费来源。
- 出现错误时记录请求时间、状态码和请求 ID。

<ScreenshotPlaceholder
  src="/images/nexlyapi/05-usage.png"
  title="Nexly API 使用记录"
  description="建议展示模型、状态、Token 和耗时列，遮挡 API Key、IP 和请求 ID。"
/>

## 完成检查

- [ ] **我的订阅**中存在有效订阅。
- [ ] API Key 选择了正确分组且状态正常。
- [ ] `/v1/models` 可以返回模型列表。
- [ ] 测试请求后能在 **使用记录**中找到对应记录。

完成后即可继续配置 [OpenAI SDK](/sdk/openai) 或其他[客户端](/guide/client-config)。
