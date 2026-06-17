<script setup lang="ts">
import type { Rectangle as RectangleModel } from '../models/rectangle'
import Rectangle from './Rectangle.vue'

defineProps<{ objectList: RectangleModel[] }>()
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4">
    <h2 class="font-semibold text-gray-700 mb-2">Objets</h2>
    <div v-if="objectList.length" class="flex flex-wrap gap-3">
      <div
        v-for="obj in objectList"
        :key="obj.id"
        class="border-2 border-gray-700 overflow-hidden"
        :style="{ width: obj.shape.w + 'px', height: obj.shape.h + 'px' }"
      >
        <v-stage :config="{ width: obj.shape.w, height: obj.shape.h }">
          <v-layer>
            <Rectangle :config="{ ...obj, position: { x: 0, y: 0 } }" />
          </v-layer>
        </v-stage>
      </div>
    </div>
    <p v-else class="text-sm text-gray-400">Aucun objet</p>
  </div>
</template>
