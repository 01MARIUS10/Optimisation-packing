<script setup lang="ts">
import type { TriangleIsocele } from '../models/triangleIsocele'

defineProps<{ config: TriangleIsocele }>()

function points(t: TriangleIsocele): number[] {
  const { x, y } = t.position
  return [
    x, y - t.hauteur,    // sommet
    x - t.base / 2, y,   // base gauche
    x + t.base / 2, y,   // base droite
  ]
}
</script>

<template>
  <v-group>
    <v-line
      :config="{
        points: points(config),
        closed: true,
        fill: config.fill,
        stroke: '#333',
        strokeWidth: 1,
      }"
    />
    <v-text
      :config="{
        x: config.position.x - config.base / 2,
        y: config.position.y - config.hauteur,
        width: config.base,
        height: config.hauteur,
        text: `${config.base}×${config.hauteur}`,
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 12,
        fontStyle: 'bold',
        fill: '#1f2937',
      }"
    />
  </v-group>
</template>
