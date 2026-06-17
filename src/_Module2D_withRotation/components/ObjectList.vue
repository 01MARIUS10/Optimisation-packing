<script setup lang="ts">
import type { Form } from '../models/form'
import { Rectangle } from '../models/rectangle'
import { Cercle } from '../models/cercle'
import { TriangleIsocele } from '../models/triangleIsocele'
import { Geometrie } from '../algorithme/geometrie'
import RectangleView from './Rectangle.vue'
import CercleView from './Cercle.vue'
import TriangleView from './Triangle.vue'

defineProps<{ titre: string; objectList: Form[] }>()

function previewBox(forme: Form) {
  return Geometrie.etendue(forme)
}
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4">
    <h2 class="font-semibold text-gray-700 mb-2">{{ titre }}</h2>
    <div v-if="objectList.length" class="flex flex-wrap gap-3">
      <div
        v-for="obj in objectList"
        :key="obj.id"
        class="border-2 border-gray-700 overflow-hidden"
        :style="{ width: previewBox(obj).w + 'px', height: previewBox(obj).h + 'px' }"
      >
        <v-stage :config="{ width: previewBox(obj).w, height: previewBox(obj).h }">
          <v-layer>
            <!-- décale la forme pour que sa boîte englobante s'aligne sur (0,0), peu importe sa position réelle -->
            <v-group :config="{ x: -previewBox(obj).minX, y: -previewBox(obj).minY }">
              <RectangleView v-if="obj instanceof Rectangle" :config="obj" />
              <CercleView v-else-if="obj instanceof Cercle" :config="obj" />
              <TriangleView v-else-if="obj instanceof TriangleIsocele" :config="obj" />
            </v-group>
          </v-layer>
        </v-stage>
      </div>
    </div>
    <p v-else class="text-sm text-gray-400">Aucun objet</p>
  </div>
</template>
