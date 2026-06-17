<script setup lang="ts">
import type { Segment as SegmentModel } from '../models/segment'
import Segment from './Segment.vue'

const ITEM_HEIGHT = 50

defineProps<{ objectList: SegmentModel[] }>()
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4">
    <h2 class="font-semibold text-gray-700 mb-2">Objets</h2>
    <div v-if="objectList.length" class="flex flex-wrap gap-3">
      <div
        v-for="obj in objectList"
        :key="obj.id"
        class="border-2 border-gray-700 overflow-hidden"
        :style="{ width: obj.shape.w + 'px', height: ITEM_HEIGHT + 'px' }"
      >
        <v-stage :config="{ width: obj.shape.w, height: ITEM_HEIGHT }">
          <v-layer>
            <Segment 
              :config="{ ...obj, position: { x: 0 } }" 
              :height="ITEM_HEIGHT" 
            />
          </v-layer>
        </v-stage>
      </div>
    </div>
    <p v-else class="text-sm text-gray-400">Aucun objet</p>
  </div>
</template>
