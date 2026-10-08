<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useData, withBase } from 'vitepress'
import { useScalarReference } from './useScalarReference'
import '@scalar/api-reference/style.css'

const { isDark } = useData()
const container = useTemplateRef<HTMLElement>('container')
const { state, errorMessage, authMessage, retry, clearAuth } = useScalarReference(container, isDark)
</script>

<template>
  <section class="api-reference" aria-label="接口文档与调试">
    <div class="api-reference__privacy">
      <p>密钥仅在本页临时使用，不持久保存。切换外观、刷新或离开本页会重置调试输入。</p>
      <button type="button" @click="clearAuth">清除认证信息</button>
      <p v-if="authMessage" class="api-reference__notice" role="status">{{ authMessage }}</p>
    </div>

    <div v-if="state === 'loading'" class="api-reference__status" role="status">
      <strong>正在加载接口文档…</strong>
      <p>首次打开需要加载调试组件，请稍候。</p>
    </div>
    <div v-else-if="state === 'error'" class="api-reference__status" role="alert">
      <strong>接口文档未能加载</strong>
      <p>{{ errorMessage }}</p>
      <div class="api-reference__actions">
        <button type="button" @click="retry">重新加载</button>
        <a :href="withBase('/openapi.yaml')" download>下载 OpenAPI 定义</a>
      </div>
    </div>
    <div
      ref="container"
      class="nexly-api-reference"
      :class="{ 'api-reference__loading': state !== 'ready' }"
      :aria-busy="state === 'loading'"
      :inert="state !== 'ready'"
    />
  </section>
</template>

<style scoped>
.api-reference__privacy,
.api-reference__status {
  margin: 16px 24px;
  padding: 16px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.api-reference__privacy {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.api-reference__privacy p,
.api-reference__status p {
  margin: 0;
  line-height: 1.7;
}

.api-reference__privacy p:first-child {
  flex: 1 1 340px;
}

.api-reference__notice {
  flex-basis: 100%;
}

.api-reference__status {
  display: grid;
  justify-items: start;
  gap: 12px;
  padding-block: 32px;
}

.api-reference__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

button {
  padding: 8px 14px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  color: var(--vp-c-brand-1);
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  background: var(--vp-c-brand-soft);
}

a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

button:focus-visible,
a:focus-visible {
  outline: 3px solid var(--vp-c-brand-2);
  outline-offset: 3px;
}

.api-reference__loading {
  visibility: hidden;
  height: 0;
  min-height: 0;
  overflow: hidden;
}

@media (max-width: 640px) {
  .api-reference__privacy,
  .api-reference__status {
    margin-inline: 12px;
    padding-inline: 16px;
  }
}
</style>