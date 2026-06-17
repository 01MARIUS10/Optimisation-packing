<script setup lang="ts">
import { watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useConteneur } from './composables/conteneur'
import { usePlateau } from './composables/plateau'
import type { Strategy } from './types'
import Control from './components/Control.vue'
import ObjectList from './components/ObjectList.vue'
import Window from './components/Window.vue'

const { conteneurLength } = useConteneur()
const {
  objects, conteneurs, error,
  addSegmentToCurrentAt, addSegmentToCurrent, initContainers,
  clearConteneurAndObjects, reinit,
} = usePlateau()

watch(error, val => {
  if (val) setTimeout(() => (error.value = null), 4000)
})

const reinitAlgos: { value: Strategy; label: string }[] = [
  { value: 'first-fit', label: 'First Fit' },
  { value: 'best-fit', label: 'Best Fit' },
  { value: 'worst-fit', label: 'Worst Fit' },
  { value: 'brute-force', label: 'Brute Force' },
]
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6 flex flex-col gap-6">
    <div class="flex items-center gap-4">
      <RouterLink to="/" class="text-sm text-gray-500 hover:text-gray-700">← Accueil</RouterLink>
      <h1 class="text-2xl font-bold text-gray-800">Module 1D</h1>
    </div>

    <Control
      v-model:conteneurLength="conteneurLength"
      @newSegmentAt="addSegmentToCurrentAt"
      @newSegment="addSegmentToCurrent"
      @initContainers="initContainers"
      @clearConteneurAndObjects="clearConteneurAndObjects"
    />

    <ObjectList :objectList="objects" />

    <div class="flex items-center gap-2 text-sm">
      <span class="font-medium text-gray-600">Réorganiser avec :</span>
      <button
        v-for="a in reinitAlgos"
        :key="a.value"
        @click="reinit(a.value)"
        class="bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700"
      >
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
      {{ conteneurs.reduce((sum, c) => sum + c.segments.length, 0) }} segment(s) — {{ conteneurs.length }} fenêtre(s)
    </div>

    <div v-for="(conteneur, i) in conteneurs" :key="i" class="overflow-auto">
      <Window :model-value="conteneur" :index="i" />
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
