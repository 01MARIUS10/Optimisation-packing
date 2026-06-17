<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import type { Conteneur } from '../models/conteneur'
import type { Rectangle as RectangleModel } from '../models/rectangle'
import Rectangle from './Rectangle.vue'

const props = defineProps<{ modelValue: Conteneur; resetKey?: string }>()
defineEmits<{ 'update:modelValue': [Conteneur] }>()

const STEP_DELAY_MS = 500

const visibleRects = ref<RectangleModel[]>([])
let timers: ReturnType<typeof setTimeout>[] = []

function clearTimers(): void {
  timers.forEach(clearTimeout)
  timers = []
}

function sync(): void {
  clearTimers()

  const currentIds = new Set(props.modelValue.rects.map(r => r.id))
  visibleRects.value = visibleRects.value.filter(r => currentIds.has(r.id))

  const visibleIds = new Set(visibleRects.value.map(r => r.id))
  const toAnimate = props.modelValue.rects.filter(r => !visibleIds.has(r.id))

  toAnimate.forEach((rect, i) => {
    timers.push(setTimeout(() => {
      visibleRects.value = [...visibleRects.value, rect]
    }, i * STEP_DELAY_MS))
  })
}

function reset(): void {
  clearTimers()
  visibleRects.value = []
  sync()
}

// Reset complet quand resetKey change (réinit algo)
watch(() => props.resetKey, reset)

// Sync incrémentale quand les rects changent
watch(
  () => props.modelValue.rects,
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
        <Rectangle v-for="rect in visibleRects" :key="rect.id" :config="rect" />
      </v-layer>
    </v-stage>
  </div>
</template>
