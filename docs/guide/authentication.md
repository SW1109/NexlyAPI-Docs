# 身份认证

Nexly API 使用 API Key 认证请求。Key 必须通过标准 HTTP Bearer Authentication 发送：

```http
Authorization: Bearer YOUR_API_KEY
```

`Bearer`、一个空格和完整 API Key 缺一不可。

## 使用环境变量

不要把 Key 直接写进源代码。建议在启动应用前设置环境变量：

::: code-group

```bash [macOS / Linux]
export NEXLY_API_KEY="你的 API Key"
```

```powershell [Windows PowerShell]
$env:NEXLY_API_KEY="你的 API Key"
```

:::

请求示例：

```bash
curl --fail-with-body https://nexlycn.guangnian.xin/v1/models \
  -H "Authorization: Bearer $NEXLY_API_KEY"
```

::: danger 不要公开密钥
文档中的 `YOUR_API_KEY` 和 `$NEXLY_API_KEY` 都是占位符。不要把真实 Key 发布到 GitHub、网页前端、截图、聊天记录或公开 Issue。
:::

## Key 的隔离原则

建议按照“环境 + 项目 + 用途”拆分 Key：

| 场景 | 建议命名 | 原因 |
| --- | --- | --- |
| 本地开发 | `project-dev-local` | 可以设置较低额度并随时撤销 |
| 测试环境 | `project-staging` | 与生产用量和权限隔离 |
| 生产服务 | `project-prod-service` | 便于审计、告警和轮换 |
| Codex / Claude Code | `cli-user-device` | 避免与业务服务共用长期 Key |

不要让多个无关项目共用同一个 Key。这样发生泄露或异常用量时，可以只撤销受影响的 Key。

## 安全存储位置

- 本地开发：使用环境变量或未提交到 Git 的 `.env` 文件。
- CI/CD：使用平台提供的 Secrets，不要写入流水线 YAML 明文。
- 生产环境：使用云密钥管理服务、容器 Secret 或部署平台的加密变量。
- 桌面客户端：只在可信设备中保存，并为客户端单独创建低权限 Key。

如果使用 `.env`，请确认它已经加入 `.gitignore`：

```text
.env
.env.*
!.env.example
```

前端网页、浏览器扩展和移动 App 中的内容都可以被最终用户读取，不应直接保存长期 API Key。需要浏览器访问时，应由自己的服务端代理请求。

## 轮换和撤销

推荐按以下顺序轮换 Key，避免服务中断：

1. 在控制台创建新 Key，并配置与旧 Key 相同的必要权限。
2. 在测试环境验证新 Key 可以查询模型并完成一次请求。
3. 更新部署平台或密钥管理服务中的环境变量。
4. 重启或滚动发布应用，确认新请求已经使用新 Key。
5. 删除或禁用旧 Key。
6. 检查旧 Key 停用后是否仍有异常请求。

如果确认 Key 已泄露，不要等待正常轮换窗口，应立即撤销旧 Key。

## 401 自检顺序

收到 `401` 时按以下顺序检查：

1. 确认 Key 没有复制缺失、换行或前后空格。
2. 确认请求头格式为 `Authorization: Bearer <Key>`。
3. 确认当前终端确实设置了 `NEXLY_API_KEY`。
4. 确认 Key 没有被删除、禁用或超过有效期。
5. 使用 `/v1/models` 发送最小验证请求，排除业务请求参数问题。
6. 仍然失败时创建新 Key 复测，不要反复重试同一个无效 Key。

更多状态码说明请查看[错误处理](/help/errors)。

## 在线调试

[API Reference](/api-reference) 支持在当前浏览器中保存 Bearer Token，方便连续测试。请只在可信设备上使用：

1. 打开需要测试的接口。
2. 在认证区域填写临时或低权限 Key。
3. 完成测试后清除认证信息。
4. 使用共享设备时关闭页面，并在控制台撤销临时 Key。
