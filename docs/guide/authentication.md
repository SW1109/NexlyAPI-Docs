# 身份认证

Nexly API 使用 API Key 对请求进行认证。API Key 通过标准 HTTP Bearer Authentication 发送：

```http
Authorization: Bearer YOUR_API_KEY
```

## 请求示例

```bash
curl https://nexlycn.guangnian.xin/v1/models \
  -H "Authorization: Bearer $NEXLY_API_KEY"
```

## 安全建议

- 只在服务端使用 API Key，不要写入浏览器、App 安装包或公开仓库。
- 为不同项目创建不同的 Key，便于隔离用量和撤销权限。
- 使用环境变量或密钥管理服务，不要硬编码到源代码。
- 怀疑泄露时立即在控制台删除旧 Key，并创建新 Key。
- 分享日志前，先移除 `Authorization` 请求头。

::: danger 不要公开密钥
文档中的 `YOUR_API_KEY` 和 `$NEXLY_API_KEY` 都是占位符。不要把真实密钥粘贴到公开页面。
:::

## 在线调试

[API Reference](/api-reference) 支持临时输入 Bearer Token。密钥仅由你的浏览器用于发送请求，不会写入本站源代码。使用共享设备后，请清除认证信息并关闭浏览器页面。
