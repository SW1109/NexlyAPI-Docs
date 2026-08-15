<script setup lang="ts">
import CapabilityGlyph from './CapabilityGlyph.vue'
import EndpointConsole from './EndpointConsole.vue'
import SystemTelemetry from './SystemTelemetry.vue'

const endpoint = 'https://nexlycn.guangnian.xin'

type CapabilityGlyphKind = 'protocol' | 'security' | 'developer' | 'reference'

interface Capability {
  index: string
  eyebrow: string
  title: string
  detail: string
  metric: string
  className: string
  glyph: CapabilityGlyphKind
}

const capabilities: readonly Capability[] = [
  {
    index: '01',
    eyebrow: 'ONE PROTOCOL',
    title: '一次接入，灵活切换',
    detail: '保持 OpenAI SDK 与请求结构不变，只替换 Base URL，即可在同一套业务逻辑中调用不同模型。',
    metric: 'OpenAI-compatible',
    className: 'capability-card--wide capability-card--mint',
    glyph: 'protocol'
  },
  {
    index: '02',
    eyebrow: 'SECURITY',
    title: '密钥边界清晰',
    detail: '统一使用 Bearer Token 鉴权，在控制台集中管理密钥与访问权限。',
    metric: 'Bearer Auth',
    className: 'capability-card--blue',
    glyph: 'security'
  },
  {
    index: '03',
    eyebrow: 'DEVELOPER UX',
    title: '从示例到请求',
    detail: 'cURL、Python、Node.js 示例可以直接运行，错误码与常见问题集中可查。',
    metric: '3+ Examples',
    className: 'capability-card--sand',
    glyph: 'developer'
  },
  {
    index: '04',
    eyebrow: 'API REFERENCE',
    title: '在线探索接口',
    detail: '基于 OpenAPI 的交互式参考文档，快速理解参数、响应和数据模型。',
    metric: 'Live Schema',
    className: 'capability-card--wide capability-card--navy',
    glyph: 'reference'
  }
]

const telemetry = [
  { label: 'GATEWAY', value: 'OPERATIONAL', meta: 'EDGE ROUTING ONLINE' },
  { label: 'PROTOCOL', value: 'OPENAI / V1', meta: 'DROP-IN COMPATIBLE' },
  { label: 'TRANSPORT', value: 'STREAM READY', meta: 'SSE CHANNEL ACTIVE' },
  { label: 'SCHEMA', value: 'LIVE SPEC', meta: 'OPENAPI SYNCHRONIZED' }
] as const

const pipeline = [
  { index: '01', label: 'YOUR APP', detail: '熟悉的 OpenAI SDK' },
  { index: '02', label: 'NEXLY API', detail: '统一鉴权与请求协议' },
  { index: '03', label: 'AI MODELS', detail: '按账号能力灵活调用' }
]
</script>

<template>
  <main class="nexly-home">
    <section class="hero-section">
      <div class="hero-section__grid" aria-hidden="true" />
      <div class="hero-section__glow hero-section__glow--one" aria-hidden="true" />
      <div class="hero-section__glow hero-section__glow--two" aria-hidden="true" />

      <div class="home-container hero-layout">
        <div class="hero-copy">
          <div class="hero-kicker">
            <span class="hero-kicker__signal"><i /></span>
            OpenAI compatible infrastructure
          </div>
          <h1>
            一套 API，<br>
            <span>连接每一种智能。</span>
          </h1>
          <p class="hero-description">
            使用熟悉的 SDK 与统一协议接入主流 AI 模型。更少的适配工作，
            更清晰的开发路径，让能力真正落到产品里。
          </p>
          <div class="hero-actions">
            <a class="home-button home-button--primary" href="/guide/quickstart">
              开始构建
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            </a>
            <a class="home-button home-button--ghost" href="/api-reference">
              浏览 API Reference
            </a>
          </div>
          <div class="hero-proof" aria-label="平台特性">
            <div><strong>5 min</strong><span>完成首个请求</span></div>
            <div><strong>1 API</strong><span>统一调用入口</span></div>
            <div><strong>24/7</strong><span>随时查阅文档</span></div>
          </div>
        </div>

        <div class="hero-console">
          <div class="hero-console__orbit hero-console__orbit--top" aria-hidden="true" />
          <EndpointConsole :endpoint="endpoint" model="gpt-4o-mini" />
          <div class="hero-console__note">
            <span>DROP-IN COMPATIBLE</span>
            <strong>只需替换 Base URL</strong>
          </div>
        </div>
      </div>

      <div class="home-container">
        <SystemTelemetry :items="telemetry" />
      </div>

      <div class="home-container hero-footer">
        <span>BUILT FOR SHIPPING</span>
        <div class="hero-footer__line" />
        <span>SDK · HTTP · OPENAPI</span>
      </div>
    </section>

    <section class="capabilities-section">
      <div class="home-container">
        <div class="section-heading">
          <div>
            <span class="section-index">01 / FOUNDATION</span>
            <h2>把复杂留在网关，<br>把专注还给开发者。</h2>
          </div>
          <p>
            Nexly 将模型差异收敛到统一协议中。从身份认证、请求示例到在线调试，
            每一步都围绕更短的接入路径设计。
          </p>
        </div>

        <div class="capability-grid">
          <article
            v-for="capability in capabilities"
            :key="capability.index"
            class="capability-card"
            :class="capability.className"
          >
            <div class="capability-card__topline">
              <span>{{ capability.index }}</span>
              <span>{{ capability.eyebrow }}</span>
            </div>
            <CapabilityGlyph :index="capability.index" :kind="capability.glyph" />
            <div class="capability-card__body">
              <h3>{{ capability.title }}</h3>
              <p>{{ capability.detail }}</p>
            </div>
            <div class="capability-card__metric">
              <i aria-hidden="true" />
              {{ capability.metric }}
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="flow-section">
      <div class="home-container flow-layout">
        <div class="flow-copy">
          <span class="section-index section-index--light">02 / ARCHITECTURE</span>
          <h2>熟悉的代码，<br><span>更自由的模型选择。</span></h2>
          <p>
            Nexly 不改变你的开发习惯。应用仍然通过标准 OpenAI 请求结构发起调用，
            网关负责统一入口与协议，让模型能力平滑进入现有系统。
          </p>
          <a class="flow-link" href="/guide/client-config">
            查看客户端配置
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
          </a>
        </div>

        <div class="pipeline-panel">
          <div class="pipeline-panel__header">
            <span>REQUEST PIPELINE</span>
            <span><i /> OPERATIONAL</span>
          </div>
          <div class="pipeline">
            <div v-for="(step, index) in pipeline" :key="step.index" class="pipeline-step">
              <div class="pipeline-step__marker">{{ step.index }}</div>
              <div>
                <strong>{{ step.label }}</strong>
                <span>{{ step.detail }}</span>
              </div>
              <svg v-if="index < pipeline.length - 1" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14m-5-5 5 5-5 5" />
              </svg>
            </div>
          </div>
          <div class="pipeline-panel__models">
            <span>CHAT</span>
            <span>EMBEDDINGS</span>
            <span>IMAGES</span>
            <span>AUDIO</span>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="home-container cta-card">
        <div class="cta-card__mark" aria-hidden="true">N</div>
        <div>
          <span class="section-index">03 / GET STARTED</span>
          <h2>下一次模型升级，<br>不必重写你的产品。</h2>
        </div>
        <div class="cta-card__actions">
          <a class="home-button home-button--dark" href="/guide/quickstart">阅读快速开始</a>
          <a class="cta-card__console" href="https://nexlycn.guangnian.xin">打开控制台 ↗</a>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.nexly-home {
  --nexly-ink: #0c1923;
  --nexly-muted: #5d6f78;
  --nexly-line: rgba(14, 43, 57, 0.13);
  --nexly-mint: #55e3c5;
  --nexly-blue: #54a9f4;
  --nexly-page-bg: #edf3f4;
  --nexly-focus: #087f83;
  --hero-bg: radial-gradient(circle at 82% 18%, rgba(39, 157, 165, 0.14), transparent 30%), linear-gradient(145deg, #f3f9f8 0%, #e7f1f2 56%, #f2f7f7 100%);
  --hero-text: #102630;
  --hero-grid: rgba(25, 82, 91, 0.1);
  --hero-kicker: #56757f;
  --hero-signal-border: rgba(15, 139, 137, 0.25);
  --hero-signal-shadow: rgba(21, 154, 147, 0.36);
  --hero-title: #0d222c;
  --hero-title-gradient: linear-gradient(100deg, #0c2029 0%, #087f83 48%, #17689a 100%);
  --hero-description: #536c75;
  --hero-primary-text: #f3fffc;
  --hero-primary-bg: linear-gradient(135deg, #0b9695, #087d83);
  --hero-primary-shadow: rgba(8, 125, 131, 0.2);
  --hero-ghost-border: rgba(20, 77, 87, 0.2);
  --hero-ghost-text: #173944;
  --hero-ghost-bg: rgba(255, 255, 255, 0.48);
  --hero-proof-line: rgba(24, 75, 85, 0.14);
  --hero-proof-strong: #15343e;
  --hero-proof-text: #627c85;
  --hero-orbit: rgba(15, 139, 137, 0.18);
  --hero-note-border: rgba(35, 126, 132, 0.2);
  --hero-note-bg: rgba(247, 252, 251, 0.82);
  --hero-note-shadow: rgba(28, 74, 82, 0.14);
  --hero-note-label: #5d7b83;
  --hero-note-text: #17353f;
  --hero-footer: #5a7881;
  --hero-footer-line: rgba(34, 86, 95, 0.16);
  --capabilities-bg: radial-gradient(circle at 92% 8%, rgba(80, 191, 194, 0.12), transparent 28%), #edf3f4;
  --section-index: #087f83;
  --card-bg: rgba(255, 255, 255, 0.58);
  --card-shadow: rgba(27, 64, 70, 0.055);
  --card-hover-border: rgba(34, 143, 151, 0.28);
  --card-hover-shadow: rgba(27, 64, 70, 0.1);
  --card-mint: linear-gradient(145deg, rgba(218, 249, 241, 0.84), rgba(246, 251, 249, 0.75));
  --card-blue: linear-gradient(145deg, rgba(220, 239, 251, 0.88), rgba(247, 251, 252, 0.72));
  --card-sand: linear-gradient(145deg, rgba(246, 238, 216, 0.85), rgba(250, 250, 246, 0.75));
  --card-navy-border: rgba(138, 191, 197, 0.16);
  --card-navy-text: #edf6f5;
  --card-navy-bg: linear-gradient(145deg, #132b37, #0e202b);
  --card-navy-shadow: rgba(11, 31, 41, 0.18);
  --card-meta: #6e858b;
  --card-navy-meta: #69848f;
  --card-navy-muted: #91a8b3;
  --card-metric: #61777d;
  --card-navy-metric: #89a5af;
  --flow-bg: #dce9eb;
  --flow-text: #102832;
  --flow-grid: rgba(32, 98, 105, 0.13);
  --flow-heading-muted: #5a7a83;
  --flow-muted: #58727b;
  --flow-link: #087f83;
  --pipeline-border: rgba(42, 113, 119, 0.18);
  --pipeline-bg: rgba(247, 252, 251, 0.72);
  --pipeline-shadow: rgba(39, 85, 91, 0.13);
  --pipeline-divider: rgba(42, 113, 119, 0.13);
  --pipeline-meta: #587780;
  --pipeline-accent: #087f83;
  --pipeline-marker-bg: rgba(12, 141, 137, 0.08);
  --pipeline-title: #17343d;
  --pipeline-muted: #647d85;
  --pipeline-arrow: #6d8990;
  --pipeline-tag-bg: rgba(255, 255, 255, 0.52);
  --cta-bg: #edf3f4;
  --cta-border: rgba(20, 55, 66, 0.14);
  --cta-card-bg: radial-gradient(circle at 92% 12%, rgba(85, 227, 197, 0.19), transparent 24%), rgba(255, 255, 255, 0.7);
  --cta-shadow: rgba(24, 60, 67, 0.08);
  --cta-mark-text: #e5fbf6;
  --cta-mark-bg: linear-gradient(145deg, #142b38, #0b1923);
  --cta-mark-shadow: rgba(12, 34, 45, 0.16);
  --cta-button-text: #eaf5f3;
  --cta-button-bg: #102631;
  --cta-button-hover: #173642;
  --cta-button-shadow: rgba(11, 35, 45, 0.16);
  --cta-link: #557077;
  --cta-link-hover: #127f81;
  --console-border: rgba(24, 93, 101, 0.18);
  --console-bg: linear-gradient(145deg, rgba(255, 255, 255, 0.88), rgba(233, 243, 243, 0.96));
  --console-shadow: 0 32px 90px rgba(31, 75, 82, 0.18), inset 0 1px rgba(255, 255, 255, 0.8);
  --console-scan: rgba(13, 142, 138, 0.06);
  --console-divider: rgba(25, 92, 99, 0.12);
  --console-meta: #627d85;
  --console-dot: #a2b7bc;
  --console-accent: #078b88;
  --console-accent-soft: rgba(7, 139, 136, 0.32);
  --console-endpoint-bg: rgba(255, 255, 255, 0.62);
  --console-code: #46636c;
  --console-copy-border: rgba(25, 92, 99, 0.16);
  --console-copy-text: #526e76;
  --console-copy-bg: rgba(225, 238, 238, 0.7);
  --console-copy-hover-border: rgba(7, 139, 136, 0.48);
  --console-copy-hover-text: #075f61;
  --console-copy-hover-bg: rgba(211, 234, 232, 0.86);
  --console-line-number: #92a7ad;
  --console-url: #176b96;
  --console-string: #8b6d17;
  --console-slash: #718b92;
  --console-response-bg: rgba(221, 237, 237, 0.56);
  --console-response-label: #718991;
  --telemetry-border: rgba(23, 92, 100, 0.18);
  --telemetry-bg: rgba(246, 252, 251, 0.68);
  --telemetry-shadow: 0 24px 70px rgba(28, 75, 82, 0.1);
  --telemetry-grid: rgba(35, 105, 111, 0.045);
  --telemetry-divider: rgba(31, 93, 100, 0.12);
  --telemetry-meta: #627c84;
  --telemetry-accent: #078b88;
  --telemetry-text: #17353f;
  --telemetry-dot: #8da7ad;
  --glyph-border: rgba(28, 99, 105, 0.14);
  --glyph-bg: rgba(255, 255, 255, 0.22);
  --glyph-grid: rgba(36, 105, 110, 0.055);
  --glyph-accent: #078b88;
  --glyph-accent-soft: rgba(7, 139, 136, 0.14);
  --glyph-meta: #789097;
  --glyph-line: #567b82;
  --glyph-detail: #91a7ac;
  --glyph-surface: rgba(255, 255, 255, 0.3);
  --glyph-node: #d9e7e7;
  overflow: hidden;
  color: var(--nexly-ink);
  background: var(--nexly-page-bg);
  font-family: var(--nexly-font-display);
  color-scheme: light;
  transition: color 220ms ease, background-color 220ms ease;
}

:global(.dark .nexly-home) {
  --nexly-ink: #e7f0ef;
  --nexly-muted: #91a8b3;
  --nexly-line: rgba(126, 180, 187, 0.16);
  --nexly-page-bg: #08131c;
  --nexly-focus: #74e6d2;
  --hero-bg: radial-gradient(circle at 82% 18%, rgba(46, 149, 175, 0.17), transparent 28%), linear-gradient(145deg, #08121d 0%, #0b1b27 56%, #08141f 100%);
  --hero-text: #f3f8f8;
  --hero-grid: rgba(135, 187, 199, 0.09);
  --hero-kicker: #91a8b4;
  --hero-signal-border: rgba(91, 231, 205, 0.25);
  --hero-signal-shadow: rgba(85, 227, 197, 0.72);
  --hero-title: #f4f8f8;
  --hero-title-gradient: linear-gradient(100deg, #f3f8f7 0%, #77e1d1 44%, #6bb5ef 100%);
  --hero-description: #9cb0bb;
  --hero-primary-text: #071a20;
  --hero-primary-bg: linear-gradient(135deg, #77ead6, #4ecfbc);
  --hero-primary-shadow: rgba(66, 211, 188, 0.2);
  --hero-ghost-border: rgba(160, 198, 207, 0.22);
  --hero-ghost-text: #d6e0e3;
  --hero-ghost-bg: rgba(255, 255, 255, 0.045);
  --hero-proof-line: rgba(148, 187, 197, 0.13);
  --hero-proof-strong: #e7f5f3;
  --hero-proof-text: #718894;
  --hero-orbit: rgba(88, 203, 202, 0.14);
  --hero-note-border: rgba(138, 218, 221, 0.18);
  --hero-note-bg: rgba(16, 37, 49, 0.88);
  --hero-note-shadow: rgba(0, 7, 16, 0.3);
  --hero-note-label: #68838f;
  --hero-note-text: #dcebea;
  --hero-footer: #4f6875;
  --hero-footer-line: rgba(120, 166, 176, 0.13);
  --capabilities-bg: radial-gradient(circle at 92% 8%, rgba(80, 191, 194, 0.08), transparent 28%), #08131c;
  --section-index: #58d5c1;
  --card-bg: rgba(16, 35, 45, 0.72);
  --card-shadow: rgba(0, 6, 13, 0.22);
  --card-hover-border: rgba(88, 213, 193, 0.3);
  --card-hover-shadow: rgba(0, 6, 13, 0.34);
  --card-mint: linear-gradient(145deg, rgba(17, 55, 56, 0.92), rgba(13, 35, 43, 0.88));
  --card-blue: linear-gradient(145deg, rgba(17, 44, 64, 0.94), rgba(12, 31, 42, 0.9));
  --card-sand: linear-gradient(145deg, rgba(51, 46, 31, 0.9), rgba(26, 34, 37, 0.9));
  --card-navy-border: rgba(126, 180, 187, 0.18);
  --card-navy-text: #edf6f5;
  --card-navy-bg: linear-gradient(145deg, #132b37, #0e202b);
  --card-navy-shadow: rgba(0, 6, 13, 0.28);
  --card-meta: #79939d;
  --card-navy-meta: #79939d;
  --card-navy-muted: #91a8b3;
  --card-metric: #89a5af;
  --card-navy-metric: #89a5af;
  --flow-bg: #0b1923;
  --flow-text: #e7f0ef;
  --flow-grid: rgba(138, 195, 199, 0.14);
  --flow-heading-muted: #6b8995;
  --flow-muted: #8da2ad;
  --flow-link: #6fe1ce;
  --pipeline-border: rgba(133, 194, 199, 0.17);
  --pipeline-bg: rgba(15, 37, 49, 0.72);
  --pipeline-shadow: rgba(0, 7, 13, 0.34);
  --pipeline-divider: rgba(133, 194, 199, 0.13);
  --pipeline-meta: #617d88;
  --pipeline-accent: #66d8c5;
  --pipeline-marker-bg: rgba(77, 205, 185, 0.06);
  --pipeline-title: #e0eceb;
  --pipeline-muted: #708995;
  --pipeline-arrow: #3d5964;
  --pipeline-tag-bg: rgba(7, 22, 31, 0.45);
  --cta-bg: #08131c;
  --cta-border: rgba(126, 180, 187, 0.16);
  --cta-card-bg: radial-gradient(circle at 92% 12%, rgba(85, 227, 197, 0.11), transparent 24%), rgba(16, 35, 45, 0.74);
  --cta-shadow: rgba(0, 6, 13, 0.28);
  --cta-mark-text: #071a20;
  --cta-mark-bg: linear-gradient(145deg, #77ead6, #4ecfbc);
  --cta-mark-shadow: rgba(66, 211, 188, 0.18);
  --cta-button-text: #071a20;
  --cta-button-bg: #66dfca;
  --cta-button-hover: #7ce8d5;
  --cta-button-shadow: rgba(66, 211, 188, 0.18);
  --cta-link: #91a8b3;
  --cta-link-hover: #71dfcc;
  --console-border: rgba(139, 213, 224, 0.2);
  --console-bg: linear-gradient(145deg, rgba(21, 42, 58, 0.88), rgba(7, 19, 31, 0.96));
  --console-shadow: 0 32px 90px rgba(0, 6, 16, 0.48), inset 0 1px rgba(255, 255, 255, 0.07);
  --console-scan: rgba(87, 225, 219, 0.045);
  --console-divider: rgba(139, 213, 224, 0.13);
  --console-meta: #79909e;
  --console-dot: #314958;
  --console-accent: #61e0cd;
  --console-accent-soft: rgba(85, 217, 199, 0.6);
  --console-endpoint-bg: rgba(3, 12, 21, 0.62);
  --console-code: #aabcc7;
  --console-copy-border: rgba(139, 213, 224, 0.16);
  --console-copy-text: #9db2bf;
  --console-copy-bg: rgba(23, 49, 62, 0.62);
  --console-copy-hover-border: rgba(87, 227, 194, 0.52);
  --console-copy-hover-text: #dffcf7;
  --console-copy-hover-bg: rgba(33, 72, 83, 0.78);
  --console-line-number: #405765;
  --console-url: #9ccdf2;
  --console-string: #d6c98f;
  --console-slash: #5d7481;
  --console-response-bg: rgba(5, 18, 29, 0.52);
  --console-response-label: #526d7b;
  --telemetry-border: rgba(139, 213, 224, 0.16);
  --telemetry-bg: rgba(11, 29, 41, 0.68);
  --telemetry-shadow: 0 24px 70px rgba(0, 6, 16, 0.28);
  --telemetry-grid: rgba(135, 187, 199, 0.045);
  --telemetry-divider: rgba(139, 213, 224, 0.11);
  --telemetry-meta: #607986;
  --telemetry-accent: #61e0cd;
  --telemetry-text: #dcebea;
  --telemetry-dot: #3f5966;
  --glyph-border: rgba(139, 213, 224, 0.12);
  --glyph-bg: rgba(4, 17, 25, 0.16);
  --glyph-grid: rgba(139, 213, 224, 0.04);
  --glyph-accent: #61e0cd;
  --glyph-accent-soft: rgba(97, 224, 205, 0.12);
  --glyph-meta: #607986;
  --glyph-line: #53717c;
  --glyph-detail: #405b67;
  --glyph-surface: rgba(17, 45, 55, 0.32);
  --glyph-node: #173744;
  color-scheme: dark;
}

.home-container {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
}

.hero-section {
  position: relative;
  isolation: isolate;
  min-height: calc(100vh - var(--vp-nav-height));
  padding: clamp(82px, 10vw, 132px) 0 28px;
  color: var(--hero-text);
  background: var(--hero-bg);
  transition: color 220ms ease, background 220ms ease;
}

.hero-section__grid {
  position: absolute;
  z-index: -2;
  inset: 0;
  opacity: 0.26;
  background-image:
    linear-gradient(var(--hero-grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--hero-grid) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: linear-gradient(to bottom, black 0%, transparent 88%);
}

.hero-section__glow {
  position: absolute;
  z-index: -1;
  border-radius: 50%;
  filter: blur(10px);
  pointer-events: none;
}

.hero-section__glow--one {
  top: 18%;
  right: 6%;
  width: 280px;
  height: 280px;
  border: 1px solid var(--hero-orbit);
  box-shadow: inset 0 0 90px rgba(41, 166, 165, 0.07), 0 0 90px rgba(26, 130, 154, 0.08);
}

.hero-section__glow--two {
  bottom: 12%;
  left: -100px;
  width: 360px;
  height: 360px;
  background: rgba(17, 118, 150, 0.08);
  filter: blur(80px);
}

.hero-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(420px, 0.95fr);
  gap: clamp(54px, 7vw, 92px);
  align-items: center;
}

.hero-copy {
  animation: reveal-up 700ms cubic-bezier(.22, .75, .2, 1) both;
}

.hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  color: var(--hero-kicker);
  font-family: var(--nexly-font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.hero-kicker__signal {
  display: grid;
  width: 22px;
  height: 22px;
  border: 1px solid var(--hero-signal-border);
  border-radius: 50%;
  place-items: center;
}

.hero-kicker__signal i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--nexly-mint);
  box-shadow: 0 0 12px var(--hero-signal-shadow);
}

.hero-copy h1 {
  max-width: 720px;
  margin: 0;
  color: var(--hero-title);
  font-size: clamp(52px, 6vw, 82px);
  font-weight: 650;
  letter-spacing: -0.065em;
  line-height: 1.08;
}

.hero-copy h1 span {
  color: transparent;
  background: var(--hero-title-gradient);
  background-clip: text;
  -webkit-background-clip: text;
}

.hero-description {
  max-width: 620px;
  margin: 28px 0 0;
  color: var(--hero-description);
  font-size: clamp(17px, 1.45vw, 20px);
  letter-spacing: -0.012em;
  line-height: 1.85;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 36px;
}

.home-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 50px;
  padding: 0 22px;
  border: 1px solid transparent;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 650;
  text-decoration: none;
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
}

.home-button:hover {
  transform: translateY(-2px);
}

.home-button:focus-visible,
.flow-link:focus-visible,
.cta-card__console:focus-visible {
  outline: 2px solid var(--nexly-focus);
  outline-offset: 3px;
}

.home-button svg,
.flow-link svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.home-button--primary {
  color: var(--hero-primary-text);
  background: var(--hero-primary-bg);
  box-shadow: 0 12px 30px var(--hero-primary-shadow);
}

.home-button--primary:hover {
  box-shadow: 0 18px 36px var(--hero-primary-shadow);
}

.home-button--ghost {
  border-color: var(--hero-ghost-border);
  color: var(--hero-ghost-text);
  background: var(--hero-ghost-bg);
  backdrop-filter: blur(10px);
}

.home-button--ghost:hover {
  border-color: var(--hero-orbit);
  background: color-mix(in srgb, var(--hero-ghost-bg) 72%, var(--nexly-mint));
}

.hero-proof {
  display: flex;
  gap: clamp(24px, 4vw, 52px);
  margin-top: 50px;
  padding-top: 24px;
  border-top: 1px solid var(--hero-proof-line);
}

.hero-proof div {
  display: grid;
  gap: 4px;
}

.hero-proof strong {
  color: var(--hero-proof-strong);
  font-family: var(--nexly-font-mono);
  font-size: 13px;
  letter-spacing: 0.02em;
}

.hero-proof span {
  color: var(--hero-proof-text);
  font-size: 12px;
}

.hero-console {
  position: relative;
  padding: 38px 0 50px;
  animation: reveal-up 760ms 120ms cubic-bezier(.22, .75, .2, 1) both;
}

.hero-console__orbit {
  position: absolute;
  z-index: -1;
  inset: -22px 30px 12px -26px;
  border: 1px solid var(--hero-orbit);
  border-radius: 36px;
  transform: rotate(4deg);
}

.hero-console__note {
  position: absolute;
  right: -22px;
  bottom: 8px;
  display: grid;
  gap: 3px;
  width: 210px;
  padding: 13px 15px;
  border: 1px solid var(--hero-note-border);
  border-radius: 12px;
  background: var(--hero-note-bg);
  box-shadow: 0 18px 50px var(--hero-note-shadow);
  backdrop-filter: blur(16px);
}

.hero-console__note span {
  color: var(--hero-note-label);
  font-family: var(--nexly-font-mono);
  font-size: 8px;
  letter-spacing: 0.12em;
}

.hero-console__note strong {
  color: var(--hero-note-text);
  font-size: 12px;
}

.hero-footer {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 26px;
  color: var(--hero-footer);
  font-family: var(--nexly-font-mono);
  font-size: 9px;
  letter-spacing: 0.14em;
}

.hero-footer__line {
  height: 1px;
  flex: 1;
  background: var(--hero-footer-line);
}

.capabilities-section {
  padding: clamp(92px, 11vw, 150px) 0;
  background: var(--capabilities-bg);
}

.section-heading {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 80px;
  align-items: end;
  margin-bottom: 58px;
}

.section-index {
  display: block;
  margin-bottom: 18px;
  color: var(--section-index);
  font-family: var(--nexly-font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
}

.section-heading h2,
.flow-copy h2,
.cta-card h2 {
  margin: 0;
  font-size: clamp(38px, 4.5vw, 58px);
  font-weight: 620;
  letter-spacing: -0.052em;
  line-height: 1.14;
}

.section-heading > p {
  margin: 0 0 4px;
  color: var(--nexly-muted);
  font-size: 16px;
  line-height: 1.85;
}

.capability-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.capability-card {
  display: flex;
  flex-direction: column;
  min-height: 400px;
  padding: 24px;
  border: 1px solid var(--nexly-line);
  border-radius: 22px;
  background: var(--card-bg);
  box-shadow: 0 18px 60px var(--card-shadow);
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
}

.capability-card:hover {
  transform: translateY(-5px);
  border-color: var(--card-hover-border);
  box-shadow: 0 24px 70px var(--card-hover-shadow);
}

.capability-card--wide {
  grid-column: span 2;
}

.capability-card--mint {
  background: var(--card-mint);
}

.capability-card--blue {
  background: var(--card-blue);
}

.capability-card--sand {
  background: var(--card-sand);
}

.capability-card--navy {
  --glyph-border: rgba(139, 213, 224, 0.12);
  --glyph-bg: rgba(4, 17, 25, 0.16);
  --glyph-grid: rgba(139, 213, 224, 0.04);
  --glyph-accent: #61e0cd;
  --glyph-accent-soft: rgba(97, 224, 205, 0.12);
  --glyph-meta: #607986;
  --glyph-line: #53717c;
  --glyph-detail: #405b67;
  --glyph-surface: rgba(17, 45, 55, 0.32);
  --glyph-node: #173744;
  border-color: var(--card-navy-border);
  color: var(--card-navy-text);
  background: var(--card-navy-bg);
  box-shadow: 0 22px 60px var(--card-navy-shadow);
}

.capability-card__topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--card-meta);
  font-family: var(--nexly-font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
}

.capability-card--navy .capability-card__topline {
  color: var(--card-navy-meta);
}

.capability-card__body {
  max-width: 620px;
  margin-top: auto;
}

.capability-card__body h3 {
  margin: 24px 0 13px;
  font-size: clamp(24px, 2.3vw, 34px);
  font-weight: 620;
  letter-spacing: -0.04em;
}

.capability-card__body p {
  max-width: 590px;
  margin: 0;
  color: var(--nexly-muted);
  font-size: 15px;
  line-height: 1.8;
}

.capability-card--navy .capability-card__body p {
  color: var(--card-navy-muted);
}

.capability-card__metric {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 26px;
  color: var(--card-metric);
  font-family: var(--nexly-font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
}

.capability-card__metric i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #3ac9ae;
  box-shadow: 0 0 12px rgba(58, 201, 174, 0.38);
}

.capability-card--navy .capability-card__metric {
  color: var(--card-navy-metric);
}

.flow-section {
  position: relative;
  padding: clamp(100px, 12vw, 164px) 0;
  color: var(--flow-text);
  background: var(--flow-bg);
  transition: color 220ms ease, background-color 220ms ease;
}

.flow-section::before {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  background-image: linear-gradient(90deg, transparent 49.8%, var(--flow-grid) 50%, transparent 50.2%);
  background-size: 72px 100%;
  content: '';
  pointer-events: none;
}

.flow-layout {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.78fr) minmax(520px, 1.22fr);
  gap: clamp(68px, 8vw, 120px);
  align-items: center;
}

.section-index--light {
  color: var(--section-index);
}

.flow-copy h2 span {
  color: var(--flow-heading-muted);
}

.flow-copy p {
  margin: 28px 0 0;
  color: var(--flow-muted);
  font-size: 16px;
  line-height: 1.9;
}

.flow-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
  color: var(--flow-link);
  font-size: 14px;
  font-weight: 650;
  text-decoration: none;
}

.flow-link:hover svg {
  transform: translateX(4px);
}

.flow-link svg {
  transition: transform 180ms ease;
}

.pipeline-panel {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid var(--pipeline-border);
  border-radius: 24px;
  background: var(--pipeline-bg);
  box-shadow: 0 30px 80px var(--pipeline-shadow);
  backdrop-filter: blur(18px);
}

.pipeline-panel::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  background-image:
    linear-gradient(var(--pipeline-divider) 1px, transparent 1px),
    linear-gradient(90deg, var(--pipeline-divider) 1px, transparent 1px);
  background-size: 28px 28px;
  content: '';
  mask-image: radial-gradient(circle at 72% 48%, black, transparent 68%);
  opacity: 0.32;
  pointer-events: none;
}

.pipeline-panel__header {
  display: flex;
  justify-content: space-between;
  padding: 17px 20px;
  border-bottom: 1px solid var(--pipeline-divider);
  color: var(--pipeline-meta);
  font-family: var(--nexly-font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
}

.pipeline-panel__header span:last-child {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--pipeline-accent);
}

.pipeline-panel__header i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--pipeline-accent);
}

.pipeline {
  position: relative;
  display: grid;
  gap: 0;
  padding: 20px;
}

.pipeline::before {
  position: absolute;
  top: 66px;
  bottom: 66px;
  left: 59px;
  width: 1px;
  background: linear-gradient(transparent, var(--pipeline-accent) 24%, var(--pipeline-accent) 76%, transparent);
  content: '';
  opacity: 0.35;
}

.pipeline::after {
  position: absolute;
  top: 54px;
  left: 57px;
  width: 5px;
  height: 34px;
  border-radius: 999px;
  background: linear-gradient(transparent, var(--pipeline-accent), transparent);
  box-shadow: 0 0 12px var(--pipeline-accent);
  content: '';
  animation: route-pulse 3.8s ease-in-out infinite;
}

.pipeline-step {
  position: relative;
  display: grid;
  grid-template-columns: 44px 1fr auto;
  gap: 14px;
  align-items: center;
  min-height: 96px;
  padding: 16px;
  border-bottom: 1px solid var(--pipeline-divider);
  transition: background-color 180ms ease;
}

.pipeline-step:hover {
  background: color-mix(in srgb, var(--pipeline-marker-bg) 72%, transparent);
}

.pipeline-step:last-child {
  border-bottom: 0;
}

.pipeline-step__marker {
  position: relative;
  z-index: 1;
  display: grid;
  width: 40px;
  height: 40px;
  border: 1px solid var(--pipeline-border);
  border-radius: 12px;
  color: var(--pipeline-accent);
  background: var(--pipeline-marker-bg);
  font-family: var(--nexly-font-mono);
  font-size: 10px;
  place-items: center;
  transition: border-color 180ms ease, box-shadow 180ms ease;
}

.pipeline-step:hover .pipeline-step__marker {
  border-color: var(--pipeline-accent);
  box-shadow: 0 0 18px color-mix(in srgb, var(--pipeline-accent) 24%, transparent);
}

.pipeline-step > div:nth-child(2) {
  display: grid;
  gap: 5px;
}

.pipeline-step strong {
  color: var(--pipeline-title);
  font-family: var(--nexly-font-mono);
  font-size: 13px;
  letter-spacing: 0.05em;
}

.pipeline-step span {
  color: var(--pipeline-muted);
  font-size: 12px;
}

.pipeline-step svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: var(--pipeline-arrow);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.pipeline-panel__models {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 17px 20px 20px;
  border-top: 1px solid var(--pipeline-divider);
}

.pipeline-panel__models span {
  padding: 7px 9px;
  border: 1px solid var(--pipeline-divider);
  border-radius: 8px;
  color: var(--pipeline-meta);
  background: var(--pipeline-tag-bg);
  font-family: var(--nexly-font-mono);
  font-size: 8px;
  letter-spacing: 0.1em;
}

.cta-section {
  padding: clamp(78px, 9vw, 118px) 0;
  background: var(--cta-bg);
  transition: background-color 220ms ease;
}

.cta-card {
  position: relative;
  display: grid;
  grid-template-columns: 110px 1fr auto;
  gap: 34px;
  align-items: center;
  overflow: hidden;
  padding: clamp(36px, 5vw, 64px);
  border: 1px solid var(--cta-border);
  border-radius: 26px;
  background: var(--cta-card-bg);
  box-shadow: 0 26px 80px var(--cta-shadow);
}

.cta-card__mark {
  display: grid;
  width: 94px;
  height: 94px;
  border-radius: 24px;
  color: var(--cta-mark-text);
  background: var(--cta-mark-bg);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.08), 0 18px 30px var(--cta-mark-shadow);
  font-family: var(--nexly-font-display);
  font-size: 48px;
  font-weight: 700;
  letter-spacing: -0.08em;
  place-items: center;
}

.cta-card h2 {
  font-size: clamp(32px, 4vw, 48px);
}

.cta-card__actions {
  display: grid;
  gap: 14px;
  justify-items: center;
}

.home-button--dark {
  color: var(--cta-button-text);
  background: var(--cta-button-bg);
  box-shadow: 0 14px 30px var(--cta-button-shadow);
}

.home-button--dark:hover {
  background: var(--cta-button-hover);
}

.cta-card__console {
  color: var(--cta-link);
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
}

.cta-card__console:hover {
  color: var(--cta-link-hover);
}

@keyframes reveal-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes route-pulse {
  0%, 12% { transform: translateY(0); opacity: 0; }
  24% { opacity: 1; }
  76% { opacity: 1; }
  88%, 100% { transform: translateY(192px); opacity: 0; }
}

@media (max-width: 1040px) {
  .hero-layout,
  .flow-layout {
    grid-template-columns: 1fr;
  }

  .hero-copy {
    max-width: 760px;
  }

  .hero-console {
    width: min(680px, 100%);
  }

  .section-heading {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .section-heading > p {
    max-width: 680px;
  }

  .flow-layout {
    gap: 62px;
  }

  .pipeline-panel {
    max-width: 760px;
  }

  .cta-card {
    grid-template-columns: 90px 1fr;
  }

  .cta-card__actions {
    grid-column: 2;
    justify-items: start;
  }
}

@media (max-width: 760px) {
  .home-container {
    width: min(100% - 32px, 1180px);
  }

  .hero-section {
    padding-top: 70px;
  }

  .hero-layout {
    gap: 36px;
  }

  .hero-copy h1 {
    font-size: clamp(44px, 13vw, 66px);
  }

  .hero-description {
    font-size: 16px;
  }

  .hero-proof {
    gap: 20px;
  }

  .hero-proof span {
    font-size: 10px;
  }

  .hero-console__note {
    right: 8px;
  }

  .hero-footer {
    margin-top: 54px;
  }

  .hero-footer span:first-child {
    display: none;
  }

  .capability-grid {
    grid-template-columns: 1fr;
  }

  .capability-card--wide {
    grid-column: auto;
  }

  .capability-card {
    min-height: 380px;
  }

  .cta-card {
    grid-template-columns: 1fr;
    gap: 26px;
  }

  .cta-card__mark {
    width: 72px;
    height: 72px;
    border-radius: 20px;
    font-size: 38px;
  }

  .cta-card__actions {
    grid-column: auto;
  }
}

@media (max-width: 520px) {
  .hero-actions {
    display: grid;
  }

  .home-button {
    width: 100%;
  }

  .hero-proof {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  .hero-console {
    padding-top: 20px;
  }

  .hero-console__orbit,
  .hero-console__note {
    display: none;
  }

  .section-heading h2,
  .flow-copy h2 {
    font-size: 38px;
  }

  .pipeline {
    padding: 10px;
  }

  .pipeline-step {
    grid-template-columns: 40px 1fr;
    gap: 12px;
  }

  .pipeline-step svg {
    display: none;
  }

  .cta-card {
    padding: 30px 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-copy,
  .hero-console {
    animation: none;
  }

  .capability-card,
  .home-button,
  .flow-link svg,
  .pipeline-step,
  .pipeline-step__marker {
    transition: none;
  }

  .pipeline::after {
    animation: none;
    opacity: 0.5;
  }
}
</style>
