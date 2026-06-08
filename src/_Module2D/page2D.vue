<script setup lang="ts">
import { watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useWindow } from './composables/window'
import { usePlateau } from './composables/plateau'
import Control from './components/Control.vue'
import Window from './components/Window.vue'

const { windowWidth, windowHeight } = useWindow()
const { matrice, error, addRectangle, addRectangleAuto, clearRectangles } = usePlateau()

watch(error, val => {
  if (val) setTimeout(() => (error.value = null), 4000)
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6 flex flex-col gap-6">
    <div class="flex items-center gap-4">
      <RouterLink to="/" class="text-sm text-gray-500 hover:text-gray-700">← Accueil</RouterLink>
      <h1 class="text-2xl font-bold text-gray-800">2D Packing</h1>
    </div>

    <Control
      v-model:windowWidth="windowWidth"
      v-model:windowHeight="windowHeight"
      @newRectangle="addRectangle"
      @newRectangleAuto="addRectangleAuto"
      @clearRectangles="clearRectangles"
    />

    <transition name="fade">
      <div
        v-if="error"
        class="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-2 rounded-lg"
      >
        {{ error }}
      </div>
    </transition>

    <div class="text-sm text-gray-500">{{ matrice.rects.length }} rectangle(s)</div>

    <div class="overflow-auto">
      <Window v-model="matrice" />
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
