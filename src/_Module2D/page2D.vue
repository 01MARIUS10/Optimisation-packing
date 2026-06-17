<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useWindow } from './composables/window'
import { usePlateau } from './composables/plateau'
import type { RectangleShape, Strategy } from './types'
import Control from './components/Control.vue'
import ObjectList from './components/ObjectList.vue'
import Window from './components/Window.vue'

const { windowWidth, windowHeight } = useWindow()
const {
  objects, conteneur, error,
  addRectangleToCurrentAt, addRectangleToCurrent, initContainers,
  clearConteneurAndObjects, reinit,
} = usePlateau()

watch(error, val => {
  if (val) setTimeout(() => (error.value = null), 4000)
})

const placedIds = computed(() => new Set(conteneur.rects.map(r => r.id)))
const placedObjects = computed(() => objects.filter(o => placedIds.value.has(o.id)))
const unplacedObjects = computed(() => objects.filter(o => !placedIds.value.has(o.id)))

const reinitAlgos: { value: Strategy; label: string }[] = [
  { value: 'nfdh', label: 'NFDH' },
  { value: 'ffdh', label: 'FFDH' },
  { value: 'bf', label: 'BF' },
  { value: 'brute-force', label: 'Brute Force' },
]

const activeStrategy = ref<Strategy | null>(null)

function handleInitContainers(shapes: RectangleShape[], strategy: Strategy): void {
  activeStrategy.value = strategy
  initContainers(shapes, strategy)
}

function handleReinit(strategy: Strategy): void {
  activeStrategy.value = strategy
  reinit(strategy)
}

function handleClear(): void {
  activeStrategy.value = null
  clearConteneurAndObjects()
}

const resetKey = computed(() => {
  return conteneur.rects.map(r => {
    return [r.id.slice(0, 3), r.position.x, r.position.y].join('-')
  }).join(';')
})

</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6 flex flex-col gap-6">
    <div class="flex items-center gap-4">
      <RouterLink to="/" class="text-sm text-gray-500 hover:text-gray-700">← Accueil</RouterLink>
      <h1 class="text-2xl font-bold text-gray-800">Module 2D</h1>
    </div>

    <Control
      v-model:windowWidth="windowWidth"
      v-model:windowHeight="windowHeight"
      @newRectangleAt="addRectangleToCurrentAt"
      @newRectangle="addRectangleToCurrent"
      @initContainers="handleInitContainers"
      @clearConteneurAndObjects="handleClear"
    />

    <div class="flex items-center gap-2 text-sm">
      <ObjectList titre="Objets insérés dans le conteneur" :objectList="placedObjects" />
      <ObjectList titre="Objets non insérés" :objectList="unplacedObjects" />
    </div>

    <div class="flex items-center gap-2 text-sm">
      <span class="font-medium text-gray-600">Réorganiser avec :</span>
      <button
        v-for="a in reinitAlgos"
        :key="a.value"
        :disabled="activeStrategy === a.value"
        @click="handleReinit(a.value)"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors"
        :class="activeStrategy === a.value
          ? 'bg-emerald-600 text-white cursor-not-allowed'
          : 'bg-indigo-600 text-white hover:bg-indigo-700'"
      >
        <svg v-if="activeStrategy === a.value" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
        </svg>
        {{ a.label }}
      </button>
    </div>

    <transition name="fade">
      <div
        v-if="error"
        class="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-2 rounded-lg"
      >
        {{ error }}
      </div>
    </transition>

    <div class="text-sm text-gray-500">
      {{ conteneur.rects.length }} / {{ objects.length }} rectangle(s) placé(s)
    </div>

    <div class="overflow-auto">
      <Window :reset-key="resetKey" :model-value="conteneur" />
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
