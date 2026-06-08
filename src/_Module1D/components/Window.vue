<script setup lang="ts">
import type { Ligne } from '../models/ligne'
import Segment from './Segment.vue'

const TRACK_HEIGHT = 80

defineProps<{ modelValue: Ligne }>()
defineEmits<{ 'update:modelValue': [Ligne] }>()
</script>

<template>
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
</template>
