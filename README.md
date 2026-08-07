# Nexly API 文档

基于 VitePress、Scalar 和 OpenAPI 的自托管中文接口文档。

## 本地开发

```bash
npm install
npm run docs:dev
```

默认访问 `http://localhost:5173`。

## 构建

```bash
npm run docs:build
npm run docs:preview
```

静态文件输出到 `docs/.vitepress/dist`，可以直接上传到 Nginx 网站目录。

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
