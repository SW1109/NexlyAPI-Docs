# CC Switch：安装与添加 Nexly

[CC Switch](https://ccswitch.io) 是一个开源的跨平台配置管理工具，可以在 Claude Code、Codex、OpenCode 等开发工具之间管理和切换不同的 API 供应商。

本教程适用于 CC Switch v3.16 及以上版本。不同版本的按钮名称可能略有差异，请以应用内界面为准。

::: tip 已经有 Nexly API Key？
推荐直接使用[平台快速导入](/tools/cc-switch-quick-import)。平台会自动生成配置并唤起 CC Switch，不需要手动填写 Base URL 和协议参数。
:::

## 准备工作

开始前需要准备：

1. 从 [Nexly API 控制台](https://nexlycn.guangnian.xin)创建一个 API Key。
2. 确认 API Key 能够查询模型列表。
3. 安装至少一个需要管理的 CLI，例如 Codex 或 Claude Code。

可以先用下面的命令验证密钥：

```bash
curl https://nexlycn.guangnian.xin/v1/models \
  -H "Authorization: Bearer $NEXLY_API_KEY"
```

## 下载 CC Switch

只从 CC Switch 官方网站或 GitHub 仓库下载：

- [CC Switch 官方网站](https://ccswitch.io)
- [GitHub Releases](https://github.com/farion1231/cc-switch/releases)

### Windows

下载 `CC-Switch-v{版本号}-Windows.msi` 安装包。无需安装时，也可以使用 `Windows-Portable.zip` 便携版。

### macOS

推荐使用 Homebrew：

```bash
brew install --cask cc-switch
```

升级：

```bash
brew upgrade --cask cc-switch
```

也可以从 Releases 页面下载 `.dmg`。

### Linux

根据发行版下载 `.deb`、`.rpm` 或 `.AppImage`。Arch Linux 可以使用：

```bash
paru -S cc-switch-bin
```

## 添加供应商

1. 启动 CC Switch。
2. 在左侧选择要配置的应用，例如 **Codex** 或 **Claude Code**。
3. 点击右上角的 **+**。
4. 选择 **应用专属供应商**。
5. 选择 **自定义**，名称填写 `Nexly API`。
6. 填入 Nexly API Key、端点和模型。
7. 保存后，在供应商卡片上点击 **启用**。

::: tip 推荐应用专属配置
第一次配置时建议为 Codex 和 Claude Code 分别建立供应商，因为两者使用的协议和端点格式不同。确认都能正常请求后，再考虑使用“统一供应商”。
:::

## 端点应该怎么填

| 使用场景 | 端点 | API 格式 |
| --- | --- | --- |
| Codex 直连 Responses | `https://nexlycn.guangnian.xin/v1` | Responses |
| Claude Code 直连 Anthropic | `https://nexlycn.guangnian.xin` | Anthropic Messages |
| Claude Code 经 CC Switch 转换 | `https://nexlycn.guangnian.xin` | OpenAI Chat Completions |

不要在端点中填写 `/chat/completions`，除非你明确开启了 CC Switch 的“完整 URL 模式”。

## 自动获取模型

填写端点和 API Key 后，点击模型输入框旁边的 **获取模型** 按钮。CC Switch 会请求：

```text
GET https://nexlycn.guangnian.xin/v1/models
```

从返回列表中选择模型即可。如果自动获取失败，也可以登录控制台查看模型 ID 并手动填写。

## 启用与切换

保存供应商后有两种切换方式：

- 在主界面选择 `Nexly API`，点击 **启用**。
- 在系统托盘中打开对应应用的子菜单，直接选择供应商。

Codex 等 CLI 通常需要重新启动才能读取新配置。Claude Code 可以动态生效，但建议新建终端会话进行首次验证。

## 密钥安全

- 不要截图或分享包含完整 API Key 的 CC Switch 配置页面。
- 不要把 CC Switch 导出的数据库备份上传到网盘或公开仓库。
- 公共电脑上使用完毕后，应删除供应商并撤销 API Key。
- 发现密钥泄露时，立即在 Nexly 控制台删除旧密钥。

## 下一步

- [从 Nexly 平台快速导入](/tools/cc-switch-quick-import)
- [配置 Codex](/tools/cc-switch-codex)
- [配置 Claude Code](/tools/cc-switch-claude)

完整软件功能请参考 [CC Switch 用户手册](https://github.com/farion1231/cc-switch/blob/main/docs/user-manual/zh/README.md)。
