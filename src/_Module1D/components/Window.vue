<script setup lang="ts">
import type { Conteneur } from '../models/conteneur'
import Segment from './Segment.vue'

const TRACK_HEIGHT = 80

defineProps<{ modelValue: Conteneur; index?: number }>()
defineEmits<{ 'update:modelValue': [Conteneur] }>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <div v-if="index !== undefined" class="text-sm font-medium text-gray-600">
      Conteneur {{ index + 1 }}
    </div>
    <div
      class="border-2 border-gray-700 overflow-hidden"
      :style="{ width: modelValue.length + 'px', height: TRACK_HEIGHT + 'px' }"
    >
      <v-stage :config="{ width: modelValue.length, height: TRACK_HEIGHT }">
        <v-layer>
          <v-rect
            :config="{ x: 0, y: 0, width: modelValue.length, height: TRACK_HEIGHT, fill: '#f8fafc' }"
          />
          <Segment
            v-for="seg in modelValue.segments"
            :key="seg.id"
            :config="seg"
            :height="TRACK_HEIGHT"
          />
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>
