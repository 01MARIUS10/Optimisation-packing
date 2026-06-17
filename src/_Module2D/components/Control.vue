<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Position, RectangleShape, Strategy } from '../types'
import { rectangles as mockRectangles } from '../mock/data'

type Mode = 'insertionAvecPosition' | 'insertion' | 'insertionMultiple'

const modeLabels: Record<Mode, string> = {
  insertionAvecPosition: 'Avec position',
  insertion: 'Sans position',
  insertionMultiple: 'Multiple',
}

const props = defineProps<{ windowWidth: number; windowHeight: number }>()

const emit = defineEmits<{
  'update:windowWidth': [value: number]
  'update:windowHeight': [value: number]
  newRectangleAt: [config: { position: Position; shape: RectangleShape }]
  newRectangle: [shape: RectangleShape]
  initContainers: [shapes: RectangleShape[], strategy: Strategy]
  clearConteneurAndObjects: []
}>()

const algos: { value: Strategy; label: string; disabled?: boolean }[] = [
  { value: 'first-fit', label: 'First Fit' },
  { value: 'best-fit', label: 'Best Fit' },
  { value: 'worst-fit', label: 'Worst Fit' },
  { value: 'brute-force', label: 'Brute Force', disabled: true },
]

const mode = ref<Mode>('insertionAvecPosition')
const algo = ref<Strategy>('first-fit')
const insertion = reactive({ position: { x: 0, y: 0 } as Position, shape: { w: 100, h: 80 } as RectangleShape })
const simple = reactive<RectangleShape>({ w: 100, h: 80 })
const multipleShape = reactive<RectangleShape>({ w: 100, h: 80 })
const multipleQueue = reactive<RectangleShape[]>([])

function applyMultiple() {
  emit('initContainers', multipleQueue.map(s => ({ ...s })), algo.value)
  multipleQueue.splice(0, multipleQueue.length)
}

function loadMockData() {
  multipleQueue.push(...mockRectangles.map(r => ({ ...r })))
}
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4 flex flex-col gap-4">
    <div class="flex flex-wrap gap-6 items-start">
      <fieldset class="flex flex-col gap-2">
        <legend class="font-semibold text-gray-700 mb-1">Conteneur</legend>
        <label class="flex items-center gap-2 text-sm">
          Largeur
          <input
            :value="windowWidth"
            @input="emit('update:windowWidth', +($event.target as HTMLInputElement).value)"
            type="number" min="100" max="2000"
            class="border rounded px-2 py-1 w-24"
          />
        </label>
        <label class="flex items-center gap-2 text-sm">
          Hauteur
          <input
            :value="windowHeight"
            @input="emit('update:windowHeight', +($event.target as HTMLInputElement).value)"
            type="number" min="100" max="2000"
            class="border rounded px-2 py-1 w-24"
          />
        </label>
      </fieldset>

      <fieldset class="flex flex-col gap-3">
        <legend class="font-semibold text-gray-700 mb-1">Insertion</legend>
        <div class="flex gap-1 border-b border-gray-200">
          <button
            v-for="m in (['insertionAvecPosition', 'insertion', 'insertionMultiple'] as Mode[])"
            :key="m"
            @click="mode = m"
            class="px-4 py-1.5 text-sm font-medium transition-colors"
            :class="mode === m
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'"
          >
            {{ modeLabels[m] }}
          </button>
        </div>

        <div v-if="mode === 'insertionAvecPosition'" class="flex flex-wrap gap-2 items-end text-sm">
          <label class="flex items-center gap-1">
            X <input v-model.number="insertion.position.x" type="number" class="border rounded px-2 py-1 w-20" />
          </label>
          <label class="flex items-center gap-1">
            Y <input v-model.number="insertion.position.y" type="number" class="border rounded px-2 py-1 w-20" />
          </label>
          <label class="flex items-center gap-1">
            W <input v-model.number="insertion.shape.w" type="number" min="1" class="border rounded px-2 py-1 w-20" />
          </label>
          <label class="flex items-center gap-1">
            H <input v-model.number="insertion.shape.h" type="number" min="1" class="border rounded px-2 py-1 w-20" />
          </label>
          <button
            @click="emit('newRectangleAt', { position: { ...insertion.position }, shape: { ...insertion.shape } })"
            class="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700"
          >
            Ajouter
          </button>
        </div>

        <div v-else-if="mode === 'insertion'" class="flex flex-wrap gap-2 items-end text-sm">
          <label class="flex items-center gap-1">
            W <input v-model.number="simple.w" type="number" min="1" class="border rounded px-2 py-1 w-20" />
          </label>
          <label class="flex items-center gap-1">
            H <input v-model.number="simple.h" type="number" min="1" class="border rounded px-2 py-1 w-20" />
          </label>
          <button
            @click="emit('newRectangle', { ...simple })"
            class="bg-emerald-600 text-white text-sm px-4 py-1.5 rounded hover:bg-emerald-700"
          >
            Ajouter
          </button>
        </div>

        <div v-else class="flex flex-col gap-3 text-sm">
          <div class="flex flex-wrap gap-2 items-end">
            <label class="flex items-center gap-1">
              W <input v-model.number="multipleShape.w" type="number" min="1" class="border rounded px-2 py-1 w-20" />
            </label>
            <label class="flex items-center gap-1">
              H <input v-model.number="multipleShape.h" type="number" min="1" class="border rounded px-2 py-1 w-20" />
            </label>
            <button
              @click="multipleQueue.push({ ...multipleShape })"
              class="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700"
            >
              Ajouter à la liste
            </button>
            <button
              @click="applyMultiple"
              :disabled="multipleQueue.length === 0"
              class="bg-emerald-600 text-white text-sm px-4 py-1.5 rounded hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Appliquer ({{ multipleQueue.length }})
            </button>
            <button
              @click="loadMockData"
              class="bg-amber-600 text-white text-sm px-4 py-1.5 rounded hover:bg-amber-700"
            >
              Charger les données mock
            </button>
          </div>
          <div v-if="multipleQueue.length" class="flex flex-wrap gap-2">
            <span
              v-for="(item, i) in multipleQueue"
              :key="i"
              class="flex items-center gap-1 bg-gray-100 border border-gray-300 rounded px-2 py-1"
            >
              {{ item.w }}×{{ item.h }}
              <button @click="multipleQueue.splice(i, 1)" class="text-gray-400 hover:text-red-500">×</button>
            </span>
          </div>
          <p v-else class="text-gray-400">Aucun objet dans la liste</p>

          <div class="flex flex-wrap gap-3 items-center pt-2 border-t border-gray-100">
            <span class="font-semibold text-gray-700">Algorithme</span>
            <label
              v-for="a in algos"
              :key="a.value"
              class="flex items-center gap-1"
              :class="a.disabled ? 'text-gray-400' : ''"
            >
              <input
                type="radio"
                name="algo"
                :value="a.value"
                v-model="algo"
                :disabled="a.disabled"
              />
              {{ a.label }}
              <span v-if="a.disabled" class="text-xs italic">(non implémenté)</span>
            </label>
          </div>
        </div>
      </fieldset>
    </div>

    <div>
      <button
        @click="emit('clearConteneurAndObjects')"
        class="bg-gray-200 text-gray-700 text-sm px-4 py-1.5 rounded hover:bg-gray-300"
      >
        Tout effacer
      </button>
    </div>
  </div>
</template>
