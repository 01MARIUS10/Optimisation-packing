<script setup lang="ts">
import type { Conteneur } from '../models/conteneur'
import Rectangle from './Rectangle.vue'

const props = defineProps<{ modelValue: Conteneur; index?: number }>()
defineEmits<{ 'update:modelValue': [Conteneur] }>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <div v-if="index !== undefined" class="text-sm font-medium text-gray-600">
      Conteneur {{ index + 1 }}
    </div>
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
  </div>
</template>
