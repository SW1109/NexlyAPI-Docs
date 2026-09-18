<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useNexusParticles } from './useNexusParticles'

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
useNexusParticles(canvas)
</script>

<template>
  <canvas ref="canvas" class="nexus-particle-field" aria-hidden="true" />
</template>

<style scoped>
.nexus-particle-field {
  position: absolute;
  top: -10%;
  bottom: -10%;
  left: -26%;
  right: -8%;
  width: 134%;
  height: 120%;
  pointer-events: none;
  /* 水平平滑柔化 + 径向平滑边缘，彻底消除与左侧文案交界处的任何硬切竖线 */
  mask-image:
    linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.08) 6%, rgba(0, 0, 0, 0.65) 18%, #000 32%, #000 82%, transparent 100%),
    radial-gradient(ellipse 92% 84% at 54% 50%, #000 48%, rgba(0, 0, 0, 0.8) 72%, transparent 100%);
  mask-composite: intersect;
  -webkit-mask-composite: source-in;
}
</style>
