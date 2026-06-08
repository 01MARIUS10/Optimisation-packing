<script setup lang="ts">
import { Segment } from '../models/segment'

defineProps<{ config: Segment; height: number }>()
</script>

<template>
  <v-rect
    :config="{
      x: config.position.x,
      y: 0,
      width: config.shape.w,
      height: height,
      fill: config.fill,
      stroke: '#333',
      strokeWidth: 1,
    }"
  />
</template>
