<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import type { Conteneur } from '../models/conteneur'
import type { Form } from '../models/form'
import { Rectangle } from '../models/rectangle'
import { Cercle } from '../models/cercle'
import { TriangleIsocele } from '../models/triangleIsocele'
import RectangleView from './Rectangle.vue'
import CercleView from './Cercle.vue'
import TriangleView from './Triangle.vue'

const props = defineProps<{ modelValue: Conteneur; resetKey?: string }>()
defineEmits<{ 'update:modelValue': [Conteneur] }>()

const STEP_DELAY_MS = 500

const visibleFormes = ref<Form[]>([])
let timers: ReturnType<typeof setTimeout>[] = []

function clearTimers(): void {
  timers.forEach(clearTimeout)
  timers = []
}

function sync(): void {
  clearTimers()

  const currentIds = new Set(props.modelValue.formes.map(f => f.id))
  visibleFormes.value = visibleFormes.value.filter(f => currentIds.has(f.id))

  const visibleIds = new Set(visibleFormes.value.map(f => f.id))
  const toAnimate = props.modelValue.formes.filter(f => !visibleIds.has(f.id))

  toAnimate.forEach((forme, i) => {
    timers.push(setTimeout(() => {
      visibleFormes.value = [...visibleFormes.value, forme]
    }, i * STEP_DELAY_MS))
  })
}

function reset(): void {
  clearTimers()
  visibleFormes.value = []
  sync()
}

// Reset complet quand resetKey change (réinit algo)
watch(() => props.resetKey, reset)

// Sync incrémentale quand les formes changent
watch(
  () => props.modelValue.formes,
  sync,
  { deep: true, immediate: true }
)

onUnmounted(clearTimers)
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
        <template v-for="forme in visibleFormes" :key="forme.id">
          <RectangleView v-if="forme instanceof Rectangle" :config="forme" />
          <CercleView v-else-if="forme instanceof Cercle" :config="forme" />
          <TriangleView v-else-if="forme instanceof TriangleIsocele" :config="forme" />
        </template>
      </v-layer>
    </v-stage>
  </div>
</template>
