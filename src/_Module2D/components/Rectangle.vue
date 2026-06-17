<script setup lang="ts">
import type { RectangleLike } from '../types'

defineProps<{ config: RectangleLike }>()
</script>

<template>
  <v-group>
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
    <v-text
      :config="{
        x: config.position.x,
        y: config.position.y,
        width: config.shape.w,
        height: config.shape.h,
        text: `${config.shape.w}×${config.shape.h}`,
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 12,
        fontStyle: 'bold',
        fill: '#1f2937',
      }"
    />
  </v-group>
</template>
