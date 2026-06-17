<script setup lang="ts">
import type { RectangleLike } from '../types'

defineProps<{ config: RectangleLike }>()
</script>

<template>
  <v-rect
    :config="{
      x: config.position.x,
      y: config.position.y,
      width: config.shape.w,
      height: config.shape.h,
      fill: config.fill,
      stroke: '#333',
      strokeWidth: 1,
    }"
  />
</template>
