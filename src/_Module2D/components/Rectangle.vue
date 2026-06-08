<script setup lang="ts">
import { Rectangle } from '../models/rectangle'

defineProps<{ config: Rectangle }>()
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
