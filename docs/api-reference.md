---
layout: page
title: API Reference
description: Nexly API 完整接口参考与在线调试
pageClass: api-reference-shell
sidebar: false
aside: false
footer: false
---

<script setup>
import ApiReference from './.vitepress/theme/components/ApiReference.vue'
import './.vitepress/theme/api-reference.css'
</script>

<section class="api-reference-guide" aria-label="API Reference 使用提示">
  <div class="api-reference-guide__title">
    <span>ONLINE DEBUG / 使用提示</span>
    <strong>查看接口定义并生成调试请求</strong>
  </div>
  <div class="api-reference-guide__steps">
    <span><i>01</i>选择接口与模型</span>
    <span><i>02</i>填写 Bearer Token</span>
    <span><i>03</i>发送请求并检查响应</span>
  </div>
  <p>使用 Nexly API 控制台创建的短期 Key 完成认证。本页不持久保存密钥；测试完成后可点击“清除认证信息”重置调试输入。</p>
</section>

::: warning 浏览器在线调试
浏览器能否直接发送请求取决于 API 服务的 CORS 配置。若提示网络错误，请复制生成的请求到终端运行，再区分跨域限制、网络故障和接口错误。终端、SDK 与服务端调用不受浏览器 CORS 限制，但仍需正确的网络、地址和认证。不要把 Key 交给不可信的第三方代理。
:::

<ClientOnly>
  <ApiReference />
</ClientOnly>
