<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    src: string
    title: string
    description?: string
    ratio?: 'wide' | 'standard' | 'portrait'
  }>(),
  {
    description: '请将截图保存到下方路径，重新构建后会自动显示。',
    ratio: 'wide'
  }
)

const loaded = ref(false)
const failed = ref(false)
</script>

<template>
  <figure class="screenshot-slot" :class="`screenshot-slot--${ratio}`">
    <img
      v-if="!failed"
      :class="{ 'screenshot-slot__image--loaded': loaded }"
      :src="src"
      :alt="title"
      loading="lazy"
      class="screenshot-slot__image"
      @load="loaded = true"
      @error="failed = true"
    >
    <div v-if="!loaded" class="screenshot-slot__placeholder">
      <span class="screenshot-slot__index">SCREENSHOT</span>
      <strong>{{ title }}</strong>
      <p>{{ description }}</p>
      <code>{{ src }}</code>
    </div>
    <figcaption v-if="loaded">{{ title }}</figcaption>
  </figure>
</template>
