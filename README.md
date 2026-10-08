# Nexly API 文档

基于 VitePress、Scalar 和 OpenAPI 的自托管中文接口文档。

## 本地开发

需要 Node.js 22 或更新版本。请在项目目录执行：

```bash
npm ci
npm run docs:dev
```

默认访问 `http://localhost:4174`。

## 构建

```bash
npm run docs:build
npm run docs:preview
```

静态文件输出到 `docs/.vitepress/dist`，可以直接上传到 Nginx 网站目录。`package-lock.json` 需要与 `package.json` 一并纳入版本管理，Docker 构建通过 `npm ci` 使用锁定依赖。

发布前执行：

```bash
npm run docs:check
```

该命令先运行 OpenAPI 契约与示例回归、首页粒子一致性测试和页面资源隔离检查，再启动新构建的临时预览检查页面、资源和 404；不会使用之前的 `dist`，也不会连接已有的固定端口。完整检查要求运行环境允许监听本地端口。

不需要启动服务的检查：

- `npm run docs:contract`：OpenAPI 关键契约与示例回归。
- `npm run docs:phase2`：粒子计算回归 + 新构建的 JS/CSS 页面依赖、直达样式与导航清单检查。

这些检查不等于完整类型检查、浏览器交互或真实 API 验证。在线调试仍需检查 CORS；验收时使用测试 Key，不调用计费接口。

## Docker 部署

```bash
docker compose up -d --build
```

容器只监听宿主机 `127.0.0.1:8080`。在宿主机已有的 HTTPS Nginx、Caddy 或宝塔反向代理中，将 `nexlydocs.guangnian.xin` 转发到 `http://127.0.0.1:8080`。

## 修改接口文档

- 普通文档：`docs/**/*.md`
- 网站配置：`docs/.vitepress/config.mts`
- OpenAPI 接口定义：`docs/public/openapi.yaml`
- 主题样式：`docs/.vitepress/theme/custom.css`

提交真实 API Key 前，请确认它没有出现在任何文件和 Git 历史中。
