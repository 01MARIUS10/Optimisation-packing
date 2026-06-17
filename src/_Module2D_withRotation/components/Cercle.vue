<script setup lang="ts">
import type { Cercle } from '../models/cercle'

defineProps<{ config: Cercle }>()
</script>

<template>
  <v-group>
    <v-circle
      :config="{
        x: config.position.x,
        y: config.position.y,
        radius: config.rayon,
        fill: config.fill,
        stroke: '#333',
        strokeWidth: 1,
      }"
    />
    <v-text
      :config="{
        x: config.position.x - config.rayon,
        y: config.position.y - config.rayon,
        width: config.rayon * 2,
        height: config.rayon * 2,
        text: `r=${config.rayon}`,
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 12,
        fontStyle: 'bold',
        fill: '#1f2937',
      }"
    />
  </v-group>
</template>
