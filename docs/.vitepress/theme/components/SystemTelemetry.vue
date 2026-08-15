<script setup lang="ts">
interface TelemetryItem {
  label: string
  value: string
  meta: string
}

defineProps<{
  items: readonly TelemetryItem[]
}>()
</script>

<template>
  <section class="system-telemetry" aria-label="Nexly 系统运行状态">
    <div class="system-telemetry__header">
      <span>NEXLY / SYSTEM FABRIC</span>
      <span class="system-telemetry__status"><i /> ALL SYSTEMS NOMINAL</span>
    </div>

    <div class="system-telemetry__grid">
      <article v-for="item in items" :key="item.label" class="system-telemetry__item">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <small>{{ item.meta }}</small>
      </article>
    </div>

    <div class="system-telemetry__rail" aria-hidden="true">
      <i />
      <span v-for="index in 9" :key="index" />
    </div>
  </section>
</template>

<style scoped>
.system-telemetry {
  --telemetry-travel: min(1180px, calc(100vw - 48px));
  position: relative;
  overflow: hidden;
  margin-top: clamp(66px, 8vw, 104px);
  border: 1px solid var(--telemetry-border);
  border-radius: 18px;
  background: var(--telemetry-bg);
  box-shadow: var(--telemetry-shadow);
  backdrop-filter: blur(18px);
}

.system-telemetry::before {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--telemetry-grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--telemetry-grid) 1px, transparent 1px);
  background-size: 24px 24px;
  content: '';
  mask-image: linear-gradient(90deg, transparent, black 36%, black 64%, transparent);
  pointer-events: none;
}

.system-telemetry__header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 42px;
  padding: 0 16px;
  border-bottom: 1px solid var(--telemetry-divider);
  color: var(--telemetry-meta);
  font-family: var(--nexly-font-mono);
  font-size: 8px;
  font-weight: 650;
  letter-spacing: 0.14em;
}

.system-telemetry__status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--telemetry-accent);
}

.system-telemetry__status i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 12px var(--telemetry-accent);
}

.system-telemetry__grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.system-telemetry__item {
  display: grid;
  min-height: 100px;
  padding: 19px 20px 22px;
  border-right: 1px solid var(--telemetry-divider);
}

.system-telemetry__item:last-child {
  border-right: 0;
}

.system-telemetry__item > span,
.system-telemetry__item small {
  color: var(--telemetry-meta);
  font-family: var(--nexly-font-mono);
  font-size: 8px;
  letter-spacing: 0.12em;
}

.system-telemetry__item strong {
  align-self: end;
  margin-top: 14px;
  color: var(--telemetry-text);
  font-family: var(--nexly-font-mono);
  font-size: clamp(12px, 1.15vw, 15px);
  font-weight: 650;
  letter-spacing: 0.035em;
}

.system-telemetry__item small {
  margin-top: 4px;
  font-size: 7px;
}

.system-telemetry__rail {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 10px;
  padding: 0 3px;
  border-top: 1px solid var(--telemetry-divider);
}

.system-telemetry__rail::before {
  position: absolute;
  top: 4px;
  right: 3px;
  left: 3px;
  height: 1px;
  background: var(--telemetry-divider);
  content: '';
}

.system-telemetry__rail i {
  position: absolute;
  z-index: 1;
  top: 3px;
  left: 0;
  width: 54px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, var(--telemetry-accent), transparent);
  filter: drop-shadow(0 0 6px var(--telemetry-accent));
  animation: telemetry-scan 5.4s linear infinite;
}

.system-telemetry__rail span {
  position: relative;
  z-index: 2;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--telemetry-dot);
}

@keyframes telemetry-scan {
  from { transform: translateX(-54px); }
  to { transform: translateX(var(--telemetry-travel)); }
}

@media (max-width: 760px) {
  .system-telemetry {
    --telemetry-travel: calc(100vw - 32px);
  }

  .system-telemetry__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .system-telemetry__item:nth-child(2) {
    border-right: 0;
  }

  .system-telemetry__item:nth-child(-n + 2) {
    border-bottom: 1px solid var(--telemetry-divider);
  }
}

@media (max-width: 420px) {
  .system-telemetry__header {
    justify-content: center;
  }

  .system-telemetry__header > span:first-child {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .system-telemetry__rail i {
    animation: none;
    transform: translateX(24px);
  }
}
</style>
