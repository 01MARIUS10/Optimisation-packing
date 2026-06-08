<script setup lang="ts">
import type { Matrice } from '../models/matrice'
import Rectangle from './Rectangle.vue'

const props = defineProps<{ modelValue: Matrice }>()
defineEmits<{ 'update:modelValue': [Matrice] }>()
</script>

<template>
  <div
    class="border-2 border-gray-700 overflow-hidden"
    :style="{ width: modelValue.width + 'px', height: modelValue.height + 'px' }"
  >
    <v-stage :config="{ width: modelValue.width, height: modelValue.height }">
      <v-layer>
        <v-rect
          :config="{
            x: 0,
            y: 0,
            width: modelValue.width,
            height: modelValue.height,
            fill: '#f8fafc',
          }"
        />
        <Rectangle v-for="rect in modelValue.rects" :key="rect.id" :config="rect" />
      </v-layer>
    </v-stage>
  </div>
</template>
