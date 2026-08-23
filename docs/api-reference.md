---
layout: page
title: API Reference
description: Nexly API 完整接口参考与在线调试
pageClass: api-reference-shell
sidebar: false
aside: false
footer: false
---

<section class="api-reference-guide" aria-label="API Reference 使用提示">
  <div class="api-reference-guide__title">
    <span>ONLINE DEBUG / 使用提示</span>
    <strong>在浏览器中完成一次接口验证</strong>
  </div>
  <div class="api-reference-guide__steps">
    <span><i>01</i>选择接口与模型</span>
    <span><i>02</i>填写 Bearer Token</span>
    <span><i>03</i>发送请求并检查响应</span>
  </div>
  <p>使用 Nexly API 控制台创建的 Key 完成认证。共享设备测试完成后请清除认证信息。</p>
</section>

::: warning 浏览器在线调试
Nexly API 当前可能拦截来自文档站的浏览器跨域请求。如果在线发送提示网络错误，请复制生成的请求到终端运行；这不影响 SDK、CLI 或服务端调用。后续放行 `https://nexlydocs.guangnian.xin` 后即可直接在线调试。
:::

<ClientOnly>
  <ApiReference />
</ClientOnly>
