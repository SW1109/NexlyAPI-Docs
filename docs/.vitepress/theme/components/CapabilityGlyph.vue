<script setup lang="ts">
type GlyphKind = 'protocol' | 'security' | 'developer' | 'reference'

defineProps<{
  index: string
  kind: GlyphKind
}>()
</script>

<template>
  <div class="capability-glyph" aria-hidden="true">
    <span class="capability-glyph__coordinate">MOD / {{ index }}</span>

    <svg v-if="kind === 'protocol'" viewBox="0 0 180 88">
      <path class="glyph-line glyph-line--pulse" d="M22 44h38l16-20h42l18 20h22" />
      <circle class="glyph-node" cx="22" cy="44" r="5" />
      <circle class="glyph-node glyph-node--active" cx="76" cy="24" r="7" />
      <circle class="glyph-node" cx="136" cy="44" r="5" />
      <circle class="glyph-node" cx="158" cy="44" r="3" />
      <path class="glyph-detail" d="M76 39v24m-10 0h20" />
    </svg>

    <svg v-else-if="kind === 'security'" viewBox="0 0 180 88">
      <path class="glyph-surface" d="m90 10 35 13v22c0 18-13 29-35 36-22-7-35-18-35-36V23Z" />
      <path class="glyph-line glyph-line--pulse" d="M69 44h42" />
      <circle class="glyph-node glyph-node--active" cx="90" cy="44" r="8" />
      <path class="glyph-detail" d="M90 52v10M44 29h-15m107 30h15" />
    </svg>

    <svg v-else-if="kind === 'developer'" viewBox="0 0 180 88">
      <rect class="glyph-surface" x="29" y="13" width="122" height="62" rx="9" />
      <path class="glyph-detail" d="M29 29h122M43 21h1m8 0h1m8 0h1" />
      <path class="glyph-line glyph-line--pulse" d="m48 45 10 8-10 8m20 0h25" />
      <path class="glyph-detail" d="M106 43h28m-28 10h20m-20 10h12" />
    </svg>

    <svg v-else viewBox="0 0 180 88">
      <path class="glyph-surface" d="M39 24 90 9l51 15-51 15Z" />
      <path class="glyph-line" d="m39 39 51 15 51-15M39 54l51 15 51-15" />
      <path class="glyph-line glyph-line--pulse" d="M90 39v30" />
      <circle class="glyph-node glyph-node--active" cx="90" cy="39" r="5" />
      <path class="glyph-detail" d="M29 24h-9m131 30h9" />
    </svg>

    <span class="capability-glyph__status"><i /> SYNCED</span>
  </div>
</template>

<style scoped>
.capability-glyph {
  position: relative;
  width: min(100%, 260px);
  height: 112px;
  margin: 22px 0 4px;
  border: 1px solid var(--glyph-border);
  border-radius: 14px;
  background:
    linear-gradient(var(--glyph-grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--glyph-grid) 1px, transparent 1px),
    var(--glyph-bg);
  background-size: 16px 16px;
}

.capability-glyph::after {
  position: absolute;
  width: 28px;
  height: 28px;
  right: -1px;
  bottom: -1px;
  border-right: 1px solid var(--glyph-accent);
  border-bottom: 1px solid var(--glyph-accent);
  border-radius: 0 0 14px;
  content: '';
}

.capability-glyph svg {
  width: 100%;
  height: 100%;
  padding: 14px 28px 10px;
  fill: none;
  overflow: visible;
}

.capability-glyph__coordinate,
.capability-glyph__status {
  position: absolute;
  z-index: 1;
  color: var(--glyph-meta);
  font-family: var(--nexly-font-mono);
  font-size: 7px;
  letter-spacing: 0.11em;
}

.capability-glyph__coordinate {
  top: 8px;
  left: 10px;
}

.capability-glyph__status {
  right: 9px;
  bottom: 7px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.capability-glyph__status i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--glyph-accent);
  box-shadow: 0 0 8px var(--glyph-accent);
}

.glyph-line,
.glyph-detail,
.glyph-surface {
  stroke-linecap: round;
  stroke-linejoin: round;
}

.glyph-line {
  stroke: var(--glyph-line);
  stroke-width: 1.4;
}

.glyph-line--pulse {
  stroke: var(--glyph-accent);
}

.glyph-detail {
  stroke: var(--glyph-detail);
  stroke-width: 1;
}

.glyph-surface {
  fill: var(--glyph-surface);
  stroke: var(--glyph-line);
  stroke-width: 1.2;
}

.glyph-node {
  fill: var(--glyph-node);
  stroke: var(--glyph-line);
  stroke-width: 1.2;
}

.glyph-node--active {
  fill: var(--glyph-accent-soft);
  stroke: var(--glyph-accent);
  filter: drop-shadow(0 0 5px var(--glyph-accent));
}
</style>
