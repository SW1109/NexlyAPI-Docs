<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { withBase } from 'vitepress'
import ParticleField from './home/ParticleField.vue'
import PortalScene from './home/PortalScene.vue'
import { useGatewayMotion } from './home/useGatewayMotion'

const gateway = useTemplateRef<HTMLElement>('gateway')
const { energize, settle } = useGatewayMotion(gateway)
</script>

<template>
  <div ref="gateway" class="gateway">
    <ParticleField />
    <header class="gateway-header entrance">
      <div class="gateway-brand" aria-label="Nexly API">
        <img :src="withBase('/logo.png')" alt="" />
        <span>Nexly<span class="brand-api">API</span></span>
      </div>
      <div class="header-caption"><span class="caption-line" /> THE INTELLIGENCE GATEWAY</div>
      <span class="header-edition">DEVELOPER PORTAL <span>↗</span></span>
    </header>
    <main id="main-content" class="gateway-main">
      <div class="gateway-grid" aria-hidden="true" />
      <div class="gateway-copy">
        <p class="gateway-eyebrow entrance"><span /> ONE API. ENDLESS POSSIBILITIES.</p>
        <h1 class="gateway-title"><span class="title-line entrance">让想法，</span><span class="title-line title-accent entrance">接通智能<span class="title-period">。</span></span></h1>
        <p class="gateway-tagline entrance">下一种可能，从这里开始。</p>
        <div class="gateway-actions entrance">
          <a :href="withBase('/guide/quickstart.html')" class="gateway-button gateway-button--primary" @pointerenter="energize" @pointerleave="settle" @focus="energize" @blur="settle">
            <span>开始接入</span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
          </a>
          <a :href="withBase('/api-reference.html')" class="gateway-button gateway-button--secondary" @pointerenter="energize" @pointerleave="settle" @focus="energize" @blur="settle">
            <span>浏览 API Reference</span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
          </a>
        </div>
        <div class="protocol-mark entrance" aria-label="兼容 OpenAI 协议"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m5 4-4 4 4 4m6-8 4 4-4 4M9 2 7 14" /></svg> OpenAI compatible <span> / </span> Built for your next idea</div>
      </div>
      <PortalScene />
      <span class="edge-label" aria-hidden="true">NEXLY — CONNECT THE POSSIBLE</span>
    </main>
    <footer class="gateway-footer entrance">
      <div class="footer-signature"><span class="footer-dot" /> A SMALL CONNECTION. A BIG LEAP.</div>
      <span class="footer-center" aria-hidden="true">[ IMAGINE → CONNECT → CREATE ]</span>
      <span class="footer-copyright">© {{ new Date().getFullYear() }} NEXLY API</span>
    </footer>
  </div>
</template>

<style scoped>
.gateway { --gateway-bg: #08131c; --gateway-text: #edf6f5; --gateway-muted: #8ca1aa; --gateway-brand: #58d7c3; --gateway-blue: #2da5e8; --gateway-violet: #8276f7; position: relative; isolation: isolate; display: flex; flex-direction: column; min-height: 100svh; overflow: clip; background: var(--gateway-bg); color: var(--gateway-text); color-scheme: dark; font-family: var(--nexly-font-display); }
.gateway::before { content: ''; pointer-events: none; position: absolute; inset: 0; z-index: -1; background: radial-gradient(ellipse at 80% 46%, rgba(31, 86, 103, .22), transparent 56%); }
.gateway-header { position: relative; z-index: 4; margin: 0 4.4%; height: 94px; flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; gap: 20px; border-bottom: 1px solid rgba(126, 180, 187, .16); }
.gateway-brand { display: flex; align-items: center; gap: 11px; color: #eff8f1; font-size: 25px; font-weight: 650; letter-spacing: -1px; }
.gateway-brand > img { width: 34px; height: 34px; border-radius: 9px; object-fit: contain; box-shadow: 0 5px 18px rgba(37, 57, 95, .34); }
.brand-api { font-size: 12px; color: #a7bac0; letter-spacing: 1px; margin-left: 9px; font-weight: 500; }
.header-caption, .header-edition, .gateway-eyebrow, .protocol-mark, .gateway-footer, .edge-label { font-family: var(--nexly-font-mono); }
.header-caption { display: flex; align-items: center; gap: 12px; color: #899991; font-size: 10px; letter-spacing: 1.7px; }
.caption-line { width: 24px; height: 1px; background: rgba(88, 215, 195, .48); }
.header-edition { font-size: 10px; letter-spacing: 1px; color: #aab6b1; }
.header-edition > span { margin-left: 13px; color: var(--gateway-brand); font-size: 16px; }
.gateway-main { position: relative; z-index: 2; display: flex; align-items: center; flex: 1; min-height: 660px; padding: 70px 7.2% 85px; }
.gateway-grid { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(rgba(126, 180, 187, .025) 1px, transparent 1px), linear-gradient(90deg, rgba(126, 180, 187, .025) 1px, transparent 1px); background-size: 88px 88px; mask-image: radial-gradient(ellipse at 66% 50%, #000, transparent 74%); }
.gateway-copy { position: relative; z-index: 3; width: 56%; pointer-events: none; }
.gateway-eyebrow { display: flex; align-items: center; gap: 10px; margin: 0 0 30px; color: #79c9c2; font-size: 10px; letter-spacing: 2px; }
.gateway-eyebrow > span { width: 6px; height: 6px; background: var(--gateway-brand); box-shadow: 0 0 15px rgba(88, 215, 195, .5); }
.gateway-title { margin: 0; font-weight: 650; font-size: clamp(52px, 6.4vw, 98px); line-height: 1.24; letter-spacing: -.055em; }
.title-line { display: block; }.title-accent { color: var(--gateway-brand); background: linear-gradient(100deg, #64e4cf 2%, #38aee9 48%, #9183fa 92%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }.title-period { color: #7887c9; -webkit-text-fill-color: #7887c9; }
.gateway-tagline { margin: 27px 0 37px; color: #9baaa4; font-size: 15px; letter-spacing: 3px; }
.gateway-actions { display: flex; gap: 13px; flex-wrap: wrap; pointer-events: auto; width: fit-content; }
.gateway-button { display: inline-flex; align-items: center; justify-content: center; gap: 22px; min-height: 58px; padding: 0 25px; border: 1px solid transparent; border-radius: 12px; text-decoration: none; font-size: 14px; font-weight: 600; white-space: nowrap; transition: background .2s, box-shadow .2s, transform .2s, border-color .2s; }
.gateway-button svg { width: 19px; height: 19px; stroke: currentColor; stroke-width: 1.7; transition: transform .2s; }
.gateway-button--primary { color: #07191d; background: var(--gateway-brand); box-shadow: inset 0 1px 0 rgba(255, 255, 255, .48), 0 0 35px rgba(88, 215, 195, .08); }
.gateway-button--primary:hover { color: #07191d; background: #77e8d4; box-shadow: 0 8px 35px rgba(88, 215, 195, .24); }
.gateway-button--secondary { color: #dce9ea; border-color: rgba(126, 180, 187, .25); background: rgba(255, 255, 255, .025); backdrop-filter: blur(10px); }
.gateway-button--secondary:hover { color: #f3fbfb; background: rgba(88, 215, 195, .07); border-color: rgba(88, 215, 195, .48); }
.gateway-button:hover { transform: translateY(-3px); }.gateway-button:hover svg { transform: translateX(3px); }.gateway-button:active { transform: translateY(0) scale(.98); }.gateway-button:focus-visible { outline: 2px solid #77e8d4; outline-offset: 5px; }
.protocol-mark { margin-top: 28px; display: flex; align-items: center; gap: 9px; color: #8fa4aa; font-size: 10px; }.protocol-mark svg { width: 14px; height: 14px; stroke: #70c8c4; stroke-width: 1.1; }.protocol-mark > span { color: #465c66; margin: 0 2px; }
.edge-label { position: absolute; right: 24px; top: 50%; writing-mode: vertical-rl; color: #819187; font-size: 9px; letter-spacing: 2px; }
.gateway-footer { position: relative; z-index: 4; margin: 0 4.4%; padding: 22px 0; display: flex; justify-content: space-between; align-items: center; gap: 20px; border-top: 1px solid rgba(126, 180, 187, .16); font-size: 9px; letter-spacing: 1px; color: #7f969e; }
.footer-signature { display: flex; gap: 9px; align-items: center; }.footer-dot { width: 5px; height: 5px; border: 1px solid #a1b29b; border-radius: 50%; }.footer-center { color: #829083; font-size: 8px; letter-spacing: 1.4px; }
@media(min-width:1700px) { .gateway-main { padding-left: max(7.2%, calc((100vw - 1450px) / 2)); } }
@media(max-width:1100px) { .gateway-main { padding-left: 6%; }.gateway-copy { width: 64%; }.header-caption { display: none; }.gateway-title { font-size: 68px; }.gateway-button { padding: 0 20px; gap: 15px; }.footer-center { display: none; } }
@media(max-width:760px) {
  .gateway-header { height: 76px; margin: 0 24px; }.gateway-brand { font-size: 23px; }.header-edition { font-size: 8px; }.gateway-main { display: flex; flex-direction: column; align-items: stretch; min-height: auto; padding: 42px 24px 30px; }.gateway-copy { width: 100%; }.gateway-title { font-size: clamp(50px, 10vw, 70px); }.gateway-eyebrow { font-size: 8px; margin-bottom: 22px; letter-spacing: 1.4px; }.gateway-tagline { font-size: 13px; margin: 18px 0 26px; }.gateway-actions { gap: 10px; }.gateway-button { font-size: 13px; min-height: 54px; padding: 0 18px; gap: 14px; }.gateway-button--secondary { gap: 8px; }.protocol-mark { font-size: 8px; margin-top: 22px; }.edge-label { display: none; }.gateway-footer { margin: 0 24px; padding: 18px 0; font-size: 8px; letter-spacing: .3px; }.footer-signature { max-width: 65%; }
}
@media(max-width:520px) { .header-edition { display: none; } }
@media(max-width:380px) { .gateway-actions { width: 100%; }.gateway-button { width: 100%; justify-content: space-between; }.protocol-mark { flex-wrap: wrap; }.gateway-footer { flex-wrap: wrap; } }
@media(prefers-reduced-motion: reduce) { .gateway-button, .gateway-button svg { transition: none; }.gateway-button:hover { transform: none; } }
</style>
