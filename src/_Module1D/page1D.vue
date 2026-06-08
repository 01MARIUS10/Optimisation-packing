<script setup lang="ts">
import { watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useConteneur } from './composables/conteneur'
import { usePlateau } from './composables/plateau'
import Control from './components/Control.vue'
import Window from './components/Window.vue'

const { conteneurLength } = useConteneur()
const { ligne, error, addSegment, addSegmentAuto, clearSegments } = usePlateau()

watch(error, val => {
  if (val) setTimeout(() => (error.value = null), 4000)
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6 flex flex-col gap-6">
    <div class="flex items-center gap-4">
      <RouterLink to="/" class="text-sm text-gray-500 hover:text-gray-700">← Accueil</RouterLink>
      <h1 class="text-2xl font-bold text-gray-800">Module 1D</h1>
    </div>

    <Control
      v-model:conteneurLength="conteneurLength"
      @newSegment="addSegment"
      @newSegmentAuto="addSegmentAuto"
      @clearSegments="clearSegments"
    />

    <transition name="fade">
      <div
        v-if="error"
        class="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-2 rounded-lg"
      >
        {{ error }}
      </div>
    </transition>

    <div class="text-sm text-gray-500">{{ ligne.segments.length }} segment(s)</div>

    <div class="overflow-auto">
      <Window v-model="ligne" />
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
