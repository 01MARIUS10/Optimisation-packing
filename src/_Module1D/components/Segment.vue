<script setup lang="ts">
import type { SegmentLike } from '../types'

defineProps<{ config: SegmentLike; height: number }>()
</script>

<template>
  <v-group>
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
    <v-text
      :config="{
        x: config.position.x,
        y: 0,
        width: config.shape.w,
        height: height,
        text: config.id,
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 14,
        fontStyle: 'bold',
        fill: '#1f2937',
      }"
    />
  </v-group>
</template>
