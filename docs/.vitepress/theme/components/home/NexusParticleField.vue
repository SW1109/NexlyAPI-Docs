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
  inset: -8%;
  width: 116%;
  height: 116%;
  pointer-events: none;
  mask-image: radial-gradient(ellipse 88% 82% at 50% 50%, #000 48%, rgba(0, 0, 0, .88) 72%, transparent 100%);
}
</style>
