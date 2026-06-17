<script setup lang="ts">
import type { Rectangle } from '../models/rectangle'

defineProps<{ config: Rectangle }>()
</script>

<template>
  <v-group>
    <v-rect
      :config="{
        x: config.position.x,
        y: config.position.y - config.hauteur,
        width: config.largeur,
        height: config.hauteur,
        fill: config.fill,
        stroke: '#333',
        strokeWidth: 1,
      }"
    />
    <v-text
      :config="{
        x: config.position.x,
        y: config.position.y - config.hauteur,
        width: config.largeur,
        height: config.hauteur,
        text: `${config.largeur}×${config.hauteur}`,
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 12,
        fontStyle: 'bold',
        fill: '#1f2937',
      }"
    />
  </v-group>
</template>
