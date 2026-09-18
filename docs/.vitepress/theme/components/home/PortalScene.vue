<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from 'vue'
import { withBase } from 'vitepress'
import NexusParticleField from './NexusParticleField.vue'

const Ripple = defineAsyncComponent(() => import('../canvasui/Ripple.vue'))
const scene = useTemplateRef<HTMLElement>('scene')
const showRipple = shallowRef(false)
let dispose: (() => void) | undefined

// 装饰层按需挂载：移动端、离屏、后台和减少动态效果时释放 GPU 资源。
onMounted(() => {
  const media = matchMedia('(min-width: 761px) and (prefers-reduced-motion: no-preference)')
  let visible = false
  const sync = () => { showRipple.value = visible && media.matches && !document.hidden }
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
  if (scene.value) observer.observe(scene.value)
  media.addEventListener('change', sync)
  document.addEventListener('visibilitychange', sync)
  dispose = () => { observer.disconnect(); media.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync) }
})
onBeforeUnmount(() => dispose?.())
</script>

<template>
  <div ref="scene" class="portal-scene" aria-hidden="true">
    <div class="portal-aura" />
    <NexusParticleField />
    <div class="nexus-grid" />
    <div class="portal-parallax">
      <span class="nexus-bracket nexus-bracket--top" />
      <span class="nexus-bracket nexus-bracket--bottom" />
      <div class="portal-core-position">
        <div class="portal-core">
          <span class="portal-core__glow" />
          <img :src="withBase('/logo.png')" alt="" />
        </div>
      </div>
      <div class="portal-chip portal-chip--top"><span class="chip-signal" /><span>LIVE PARTICLE FIELD</span><span class="chip-detail">↗</span></div>
      <div class="portal-chip portal-chip--bottom"><span class="chip-icon chip-icon--code">{ }</span><span>MOVE TO DISTURB</span></div>
      <span class="nexus-signal nexus-signal--one" />
      <span class="nexus-signal nexus-signal--two" />
      <span class="nexus-signal nexus-signal--three" />
    </div>
    <Ripple v-if="showRipple" class="portal-ripple" :capture-content="false" :amplitude="0.22" :refraction="12" :dispersion="0.1" :shine="0.34" :wavelength="110" :decay="1.8" trigger="click" :interval="0"><div class="ripple-surface" /></Ripple>
    <div class="portal-coordinate"><span>01 / NEXUS</span><span>∞</span></div>
  </div>
</template>

<style scoped>
.portal-scene { position: absolute; z-index: 2; width: min(62vw, 920px); aspect-ratio: 1; right: -3%; top: 50%; transform: translateY(-50%); isolation: isolate; }
.portal-aura { position: absolute; inset: 10%; border-radius: 50%; background: radial-gradient(ellipse, rgba(45, 165, 232, .12), rgba(130, 118, 247, .045) 42%, transparent 71%); filter: blur(38px); }
.nexus-grid { position: absolute; inset: 11%; opacity: .24; background-image: linear-gradient(rgba(88, 215, 195, .09) 1px, transparent 1px), linear-gradient(90deg, rgba(88, 215, 195, .09) 1px, transparent 1px); background-size: 48px 48px; mask-image: radial-gradient(circle, #000, transparent 67%); }
.portal-parallax { position: absolute; inset: 0; z-index: 2; will-change: transform; }
.portal-core-position { position: absolute; top: 50%; left: 50%; width: 17%; aspect-ratio: 1; transform: translate(-50%, -50%); }
.portal-core { position: relative; width: 100%; height: 100%; transform-origin: center; }
.portal-core::before { position: absolute; inset: -48%; border: 1px solid rgba(88, 215, 195, .12); border-radius: 36%; background: radial-gradient(circle, rgba(39, 88, 110, .3), rgba(10, 24, 35, .12) 46%, transparent 70%); box-shadow: inset 0 0 42px rgba(88, 215, 195, .035), 0 0 70px rgba(45, 165, 232, .08); content: ''; transform: rotate(45deg); }
.portal-core__glow { position: absolute; inset: -14%; border-radius: 28%; background: rgba(13, 27, 41, .82); box-shadow: 0 20px 60px rgba(9, 17, 41, .7), inset 0 1px rgba(255, 255, 255, .05); }
.portal-core img { position: relative; width: 100%; height: 100%; border-radius: 22%; object-fit: contain; filter: drop-shadow(0 12px 20px rgba(32, 45, 99, .55)); }
.portal-chip { position: absolute; display: flex; align-items: center; gap: 10px; border: 1px solid rgba(88, 215, 195, .19); border-radius: 999px; padding: 10px 14px; background: rgba(8, 24, 34, .68); backdrop-filter: blur(14px); box-shadow: 0 12px 35px rgba(0, 0, 0, .16), inset 0 1px rgba(255, 255, 255, .04); font: 8px var(--nexly-font-mono); letter-spacing: 1.4px; color: #b9d2d4; }
.portal-chip--top { top: 24%; right: 7%; }.portal-chip--bottom { bottom: 21%; left: 8%; }
.chip-signal { width: 5px; height: 5px; border-radius: 50%; background: #58d7c3; box-shadow: 0 0 12px #58d7c3; }.chip-icon--code { color: #9183fa; font-size: 12px; }.chip-detail { margin-left: 8px; color: #83bfc9; }
.nexus-bracket { position: absolute; width: 64px; height: 64px; opacity: .35; }.nexus-bracket::before, .nexus-bracket::after { position: absolute; background: #6ab9c3; content: ''; }.nexus-bracket::before { width: 38px; height: 1px; }.nexus-bracket::after { width: 1px; height: 38px; }.nexus-bracket--top { top: 15%; left: 16%; }.nexus-bracket--bottom { right: 12%; bottom: 15%; transform: rotate(180deg); }
.nexus-signal { position: absolute; width: 5px; height: 5px; border-radius: 50%; background: #7be4d3; box-shadow: 0 0 16px rgba(88, 215, 195, .75); }.nexus-signal--one { top: 30%; left: 31%; }.nexus-signal--two { right: 24%; bottom: 34%; background: #39afe7; }.nexus-signal--three { left: 36%; bottom: 23%; width: 3px; height: 3px; background: #9c91ff; }
.portal-ripple { position: absolute !important; inset: 13%; z-index: 3; border-radius: 42%; overflow: hidden; }.ripple-surface { height: 100%; min-height: 100%; }
.portal-coordinate { position: absolute; left: 29%; right: 29%; bottom: 5%; display: flex; align-items: center; justify-content: space-between; color: #799da8; font: 8px var(--nexly-font-mono); letter-spacing: 2px; }.portal-coordinate > span:last-child { font-size: 20px; color: #7fd4cd; }
@media(max-width:1100px) and (min-width:761px) { .portal-scene { width: 67vw; right: -14%; opacity: .84; }.portal-chip { font-size: 7px; padding: 9px 12px; }.portal-chip--top { right: 14%; } }
@media(max-width:760px) { .portal-scene { position: relative; top: auto; right: auto; transform: none; width: min(100%, 490px); margin: -8px auto -10px; }.portal-chip { font-size: 6px; padding: 8px 10px; gap: 7px; }.portal-chip--top { right: 5%; }.portal-coordinate { bottom: 4%; font-size: 7px; }.nexus-grid { background-size: 34px 34px; } }
@media(prefers-reduced-motion:reduce) { .nexus-signal { box-shadow: none; } }
</style>
