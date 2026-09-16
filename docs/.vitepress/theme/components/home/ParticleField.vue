<script setup lang="ts">
type Particle = {
  id: string
  x: number
  y: number
  radius: number
  opacity: number
  pulse: boolean
}

type ParticleLink = {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
}

const createRandom = (seed: number) => {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

// 固定种子保证 SSR 与客户端生成完全一致，避免粒子坐标造成水合差异。
const createParticles = (count: number, seed: number, prefix: string, radius: [number, number]) => {
  const random = createRandom(seed)
  return Array.from({ length: count }, (_, index): Particle => ({
    id: `${prefix}-${index}`,
    x: Math.round(random() * 16000) / 10,
    y: Math.round(random() * 9000) / 10,
    radius: radius[0] + random() * (radius[1] - radius[0]),
    opacity: 0.16 + random() * 0.58,
    pulse: index % 7 === 0
  }))
}

const farParticles = createParticles(58, 1907, 'far', [0.6, 1.35])
const midParticles = createParticles(46, 7429, 'mid', [0.8, 1.8])
const nearParticles = createParticles(34, 3109, 'near', [1.1, 2.5])
const networkLinks: ParticleLink[] = midParticles.slice(0, 16).map((particle, index) => {
  const target = midParticles[(index * 3 + 9) % midParticles.length]
  return {
    id: `link-${index}`,
    x1: particle.x,
    y1: particle.y,
    x2: target.x,
    y2: target.y
  }
})
</script>

<template>
  <div class="particle-field" aria-hidden="true">
    <div class="particle-cursor" />
    <svg class="particle-map" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="particle-blue" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse">
          <stop stop-color="#a29aff" />
          <stop offset="0.46" stop-color="#43b9ed" />
          <stop offset="1" stop-color="#58d7c3" />
        </radialGradient>
        <filter id="particle-glow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>
      <g class="particle-links">
        <line v-for="link in networkLinks" :key="link.id" :x1="link.x1" :y1="link.y1" :x2="link.x2" :y2="link.y2" />
      </g>
      <g class="particle-layer particle-layer--far">
        <circle v-for="particle in farParticles" :key="particle.id" class="particle-dot" :class="{ 'particle-dot--pulse': particle.pulse }" :cx="particle.x" :cy="particle.y" :r="particle.radius" :opacity="particle.opacity" />
      </g>
      <g class="particle-layer particle-layer--mid">
        <circle v-for="particle in midParticles" :key="particle.id" class="particle-dot" :class="{ 'particle-dot--pulse': particle.pulse }" :cx="particle.x" :cy="particle.y" :r="particle.radius" :opacity="particle.opacity" />
      </g>
      <g class="particle-layer particle-layer--near">
        <circle v-for="particle in nearParticles" :key="particle.id" class="particle-dot" :class="{ 'particle-dot--pulse': particle.pulse }" :cx="particle.x" :cy="particle.y" :r="particle.radius" :opacity="particle.opacity" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.particle-field { position: absolute; z-index: 0; inset: 0; overflow: hidden; pointer-events: none; }
.particle-field::before { position: absolute; inset: 0; background: radial-gradient(circle at 72% 48%, rgba(45, 165, 232, .09), transparent 42%), radial-gradient(circle at 58% 56%, rgba(126, 112, 245, .06), transparent 52%); content: ''; }
.particle-map { width: 100%; height: 100%; overflow: visible; }
.particle-dot { fill: url(#particle-blue); }
.particle-layer--far { filter: blur(.15px); }
.particle-layer--near .particle-dot--pulse { filter: url(#particle-glow); }
.particle-links { fill: none; stroke: rgba(88, 215, 195, .12); stroke-width: .65; stroke-dasharray: 3 12; }
.particle-cursor { position: absolute; top: 0; left: 0; width: 340px; height: 340px; margin: -170px 0 0 -170px; border-radius: 50%; opacity: 0; background: radial-gradient(circle, rgba(88, 215, 195, .12), rgba(45, 165, 232, .055) 34%, rgba(126, 112, 245, .025) 52%, transparent 70%); filter: blur(4px); will-change: transform, opacity; }
@media(max-width:760px) { .particle-map { width: 170%; margin-left: -35%; }.particle-cursor { display: none; }.particle-links { opacity: .55; } }
@media(prefers-reduced-motion:reduce) { .particle-cursor { display: none; } }
</style>
