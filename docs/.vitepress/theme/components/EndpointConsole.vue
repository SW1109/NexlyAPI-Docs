<script setup lang="ts">
import { onBeforeUnmount, shallowRef } from 'vue'

interface Props {
  endpoint: string
  model: string
}

const props = defineProps<Props>()
const copyState = shallowRef<'idle' | 'copied' | 'error'>('idle')
let resetTimer: ReturnType<typeof setTimeout> | undefined

const fallbackCopy = (value: string) => {
  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  textarea.remove()
  if (!copied) throw new Error('Copy command failed')
}

const copyEndpoint = async () => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(props.endpoint)
    } else {
      fallbackCopy(props.endpoint)
    }
    copyState.value = 'copied'
  } catch {
    copyState.value = 'error'
  }

  if (resetTimer) clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    copyState.value = 'idle'
  }, 1800)
}

onBeforeUnmount(() => {
  if (resetTimer) clearTimeout(resetTimer)
})
</script>

<template>
  <div class="console-card" aria-label="Nexly API 请求示例">
    <div class="console-card__topbar">
      <div class="console-card__window-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <span class="console-card__label">NEXLY GATEWAY</span>
      <span class="console-card__status"><i /> LIVE</span>
    </div>

    <div class="console-card__endpoint">
      <span class="console-card__method">POST</span>
      <code>{{ endpoint }}/v1/chat/completions</code>
      <button
        class="console-card__copy"
        type="button"
        :aria-label="copyState === 'copied' ? '已复制 API 地址' : '复制 API 地址'"
        @click="copyEndpoint"
      >
        <svg v-if="copyState === 'idle'" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 7V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M5 8h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z" />
        </svg>
        <svg v-else-if="copyState === 'copied'" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m5 12 4 4L19 6" />
        </svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 8v5m0 3h.01M10.3 4.5 2.7 18a2 2 0 0 0 1.74 3h15.12a2 2 0 0 0 1.74-3L13.7 4.5a2 2 0 0 0-3.4 0Z" />
        </svg>
        <span>{{ copyState === 'copied' ? '已复制' : copyState === 'error' ? '复制失败' : '复制' }}</span>
      </button>
    </div>

    <div class="console-card__code" aria-label="cURL 示例">
      <div class="console-card__line"><span class="line-number">01</span><span class="token-command">curl</span> <span class="token-url">{{ endpoint }}/v1/chat/completions</span> <span class="token-slash">\</span></div>
      <div class="console-card__line"><span class="line-number">02</span><span class="token-flag">-H</span> <span class="token-string">"Authorization: Bearer $NEXLY_API_KEY"</span> <span class="token-slash">\</span></div>
      <div class="console-card__line"><span class="line-number">03</span><span class="token-flag">-d</span> <span class="token-string">'{ "model": "{{ model }}", ... }'</span></div>
    </div>

    <div class="console-card__response">
      <div>
        <span class="console-card__response-label">RESPONSE</span>
        <strong>200 OK</strong>
      </div>
      <div class="console-card__latency">
        <span>GATEWAY</span>
        <strong>READY</strong>
      </div>
    </div>
  </div>
</template>

<style scoped>
.console-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--console-border);
  border-radius: 24px;
  background: var(--console-bg);
  box-shadow: var(--console-shadow);
  font-family: var(--nexly-font-mono);
  transition: border-color 220ms ease, background 220ms ease, box-shadow 220ms ease;
}

.console-card::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 32%, var(--console-scan), transparent 68%);
  content: '';
  pointer-events: none;
  transform: translateX(-100%);
  animation: console-scan 7s ease-in-out infinite;
}

.console-card__topbar,
.console-card__endpoint,
.console-card__response {
  display: flex;
  align-items: center;
}

.console-card__topbar {
  min-height: 54px;
  padding: 0 18px;
  border-bottom: 1px solid var(--console-divider);
  color: var(--console-meta);
  font-size: 10px;
  letter-spacing: 0.14em;
}

.console-card__window-dots {
  display: flex;
  gap: 6px;
  margin-right: 14px;
}

.console-card__window-dots span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--console-dot);
}

.console-card__window-dots span:first-child {
  background: var(--console-accent);
  box-shadow: 0 0 14px var(--console-accent-soft);
}

.console-card__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  color: var(--console-accent);
}

.console-card__status i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--console-accent);
  box-shadow: 0 0 12px var(--console-accent-soft);
}

.console-card__endpoint {
  gap: 11px;
  margin: 18px;
  padding: 11px 12px;
  border: 1px solid var(--console-divider);
  border-radius: 12px;
  background: var(--console-endpoint-bg);
}

.console-card__endpoint code {
  min-width: 0;
  overflow: hidden;
  color: var(--console-code);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.console-card__method {
  color: var(--console-accent);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.console-card__copy {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex: none;
  min-height: 30px;
  margin-left: auto;
  padding: 0 9px;
  border: 1px solid var(--console-copy-border);
  border-radius: 8px;
  color: var(--console-copy-text);
  background: var(--console-copy-bg);
  cursor: pointer;
  font: inherit;
  font-size: 10px;
  transition: border-color 160ms ease, color 160ms ease, background 160ms ease;
}

.console-card__copy:hover,
.console-card__copy:focus-visible {
  border-color: var(--console-copy-hover-border);
  color: var(--console-copy-hover-text);
  background: var(--console-copy-hover-bg);
  outline: none;
}

.console-card__copy svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.console-card__code {
  padding: 8px 18px 24px;
  color: var(--console-code);
  font-size: 11px;
  line-height: 2.1;
}

.console-card__line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-number {
  display: inline-block;
  width: 31px;
  color: var(--console-line-number);
  user-select: none;
}

.token-command,
.token-flag {
  color: var(--console-accent);
}

.token-url {
  color: var(--console-url);
}

.token-string {
  color: var(--console-string);
}

.token-slash {
  color: var(--console-slash);
}

.console-card__response {
  justify-content: space-between;
  padding: 15px 18px;
  border-top: 1px solid var(--console-divider);
  background: var(--console-response-bg);
}

.console-card__response > div {
  display: grid;
  gap: 3px;
}

.console-card__response-label,
.console-card__latency span {
  color: var(--console-response-label);
  font-size: 9px;
  letter-spacing: 0.12em;
}

.console-card__response strong,
.console-card__latency strong {
  color: var(--console-accent);
  font-size: 11px;
  font-weight: 700;
}

.console-card__latency {
  text-align: right;
}

@keyframes console-scan {
  0%, 55% { transform: translateX(-100%); }
  80%, 100% { transform: translateX(100%); }
}

@media (max-width: 520px) {
  .console-card {
    border-radius: 18px;
  }

  .console-card__endpoint {
    margin: 12px;
  }

  .console-card__code {
    padding: 6px 14px 20px;
    font-size: 9.5px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .console-card::after {
    animation: none;
  }
}
</style>
