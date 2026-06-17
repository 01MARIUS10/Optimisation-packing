<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Strategy } from '../types'
import { Form } from '../models/form'
import { Rectangle } from '../models/rectangle'
import { Cercle } from '../models/cercle'
import { TriangleIsocele } from '../models/triangleIsocele'
import { MOCK_FORMS } from '../mock/data'

type FormeType = 'rectangle' | 'cercle' | 'triangle'

const formeTypeLabels: Record<FormeType, string> = {
  rectangle: 'Rectangle',
  cercle: 'Cercle',
  triangle: 'Triangle',
}

defineProps<{ windowWidth: number; windowHeight: number }>()

const emit = defineEmits<{
  'update:windowWidth': [value: number]
  'update:windowHeight': [value: number]
  initFormes: [formes: Form[], strategy: Strategy]
  clearConteneurAndObjects: []
}>()

const algos: { value: Strategy; label: string; disabled?: boolean }[] = [
  { value: 'nfdh', label: 'NFDH' },
  { value: 'ffdh', label: 'FFDH' },
  { value: 'bf', label: 'BF' },
  { value: 'brute-force', label: 'Brute Force', disabled: true },
]

const algo = ref<Strategy>('nfdh')
const formeType = ref<FormeType>('rectangle')
const rectangleParams = reactive({ largeur: 60, hauteur: 100 })
const cercleParams = reactive({ rayon: 50 })
const triangleParams = reactive({ base: 90, hauteur: 55 })

const queue = reactive<Form[]>([])

function buildForme(): Form {
  switch (formeType.value) {
    case 'rectangle': return new Rectangle({ x: 0, y: 0 }, rectangleParams.largeur, rectangleParams.hauteur)
    case 'cercle': return new Cercle({ x: 0, y: 0 }, cercleParams.rayon)
    case 'triangle': return new TriangleIsocele({ x: 0, y: 0 }, triangleParams.base, triangleParams.hauteur)
  }
}

function addToQueue(): void {
  queue.push(buildForme())
}

function loadMockData(): void {
  MOCK_FORMS.forEach(f => {
    if (!queue.includes(f)) queue.push(f)
  })
}

function applyQueue(): void {
  emit('initFormes', [...queue], algo.value)
  queue.splice(0, queue.length)
}

function queueLabel(f: Form): string {
  if (f instanceof Rectangle) return `Rectangle ${f.largeur}×${f.hauteur}`
  if (f instanceof Cercle) return `Cercle r=${f.rayon}`
  if (f instanceof TriangleIsocele) return `Triangle ${f.base}×${f.hauteur}`
  return 'Forme'
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
        <legend class="font-semibold text-gray-700 mb-1">Formes</legend>

        <div class="flex gap-1 border-b border-gray-200">
          <button
            v-for="t in (['rectangle', 'cercle', 'triangle'] as FormeType[])"
            :key="t"
            @click="formeType = t"
            type="button"
            class="px-4 py-1.5 text-sm font-medium transition-colors"
            :class="formeType === t
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'"
          >
            {{ formeTypeLabels[t] }}
          </button>
        </div>

        <div class="flex flex-wrap gap-2 items-end text-sm">
          <template v-if="formeType === 'rectangle'">
            <label class="flex items-center gap-1">
              Largeur <input v-model.number="rectangleParams.largeur" type="number" min="1" class="border rounded px-2 py-1 w-20" />
            </label>
            <label class="flex items-center gap-1">
              Hauteur <input v-model.number="rectangleParams.hauteur" type="number" min="1" class="border rounded px-2 py-1 w-20" />
            </label>
          </template>

          <template v-else-if="formeType === 'cercle'">
            <label class="flex items-center gap-1">
              Rayon <input v-model.number="cercleParams.rayon" type="number" min="1" class="border rounded px-2 py-1 w-20" />
            </label>
          </template>

          <template v-else>
            <label class="flex items-center gap-1">
              Base <input v-model.number="triangleParams.base" type="number" min="1" class="border rounded px-2 py-1 w-20" />
            </label>
            <label class="flex items-center gap-1">
              Hauteur <input v-model.number="triangleParams.hauteur" type="number" min="1" class="border rounded px-2 py-1 w-20" />
            </label>
          </template>

          <button
            @click="addToQueue"
            type="button"
            class="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700"
          >
            Ajouter à la liste
          </button>
          <button
            @click="applyQueue"
            type="button"
            :disabled="queue.length === 0"
            class="bg-emerald-600 text-white text-sm px-4 py-1.5 rounded hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Appliquer ({{ queue.length }})
          </button>
          <button
            @click="loadMockData"
            type="button"
            class="bg-amber-600 text-white text-sm px-4 py-1.5 rounded hover:bg-amber-700"
          >
            Charger les données mock
          </button>
        </div>

        <div v-if="queue.length" class="flex flex-wrap gap-2">
          <span
            v-for="(item, i) in queue"
            :key="item.id"
            class="flex items-center gap-1 bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {{ queueLabel(item) }}
            <button @click="queue.splice(i, 1)" type="button" class="text-gray-400 hover:text-red-500">×</button>
          </span>
        </div>
        <p v-else class="text-gray-400 text-sm">Aucune forme dans la liste</p>

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
      </fieldset>
    </div>

    <div>
      <button
        @click="emit('clearConteneurAndObjects')"
        type="button"
        class="bg-gray-200 text-gray-700 text-sm px-4 py-1.5 rounded hover:bg-gray-300"
      >
        Tout effacer
      </button>
    </div>
  </div>
</template>
