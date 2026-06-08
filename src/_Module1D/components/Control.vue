<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Position, SegmentShape } from '../types'

type Mode = 'insertion' | 'dynamique'

const props = defineProps<{ conteneurLength: number }>()

const emit = defineEmits<{
  'update:conteneurLength': [value: number]
  newSegment: [config: { position: Position; shape: SegmentShape }]
  newSegmentAuto: [config: SegmentShape]
  clearSegments: []
}>()

const mode = ref<Mode>('insertion')
const insertion = reactive({ position: { x: 0 } as Position, shape: { w: 100 } as SegmentShape })
const dynamique = reactive<SegmentShape>({ w: 100 })
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4 flex flex-col gap-4">
    <div class="flex flex-wrap gap-6">
      <fieldset class="flex flex-col gap-2">
        <legend class="font-semibold text-gray-700 mb-1">Conteneur</legend>
        <label class="flex items-center gap-2 text-sm">
          Longueur
          <input
            :value="conteneurLength"
            @input="emit('update:conteneurLength', +($event.target as HTMLInputElement).value)"
            type="number" min="100" max="5000"
            class="border rounded px-2 py-1 w-24"
          />
        </label>
      </fieldset>

      <div class="flex flex-col gap-3 flex-1">
        <div class="flex gap-1 border-b border-gray-200">
          <button
            v-for="m in (['insertion', 'dynamique'] as Mode[])"
            :key="m"
            @click="mode = m"
            class="px-4 py-1.5 text-sm font-medium transition-colors"
            :class="mode === m
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'"
          >
            {{ m === 'insertion' ? 'Insertion' : 'Liste dynamique' }}
          </button>
        </div>

        <div v-if="mode === 'insertion'" class="flex flex-wrap gap-2 items-end text-sm">
          <label class="flex items-center gap-1">
            X <input v-model.number="insertion.position.x" type="number" class="border rounded px-2 py-1 w-20" />
          </label>
          <label class="flex items-center gap-1">
            W <input v-model.number="insertion.shape.w" type="number" min="1" class="border rounded px-2 py-1 w-20" />
          </label>
          <button
            @click="emit('newSegment', { position: { ...insertion.position }, shape: { ...insertion.shape } })"
            class="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700"
          >
            Ajouter
          </button>
        </div>

        <div v-else class="flex flex-wrap gap-2 items-end text-sm">
          <label class="flex items-center gap-1">
            W <input v-model.number="dynamique.w" type="number" min="1" class="border rounded px-2 py-1 w-20" />
          </label>
          <button
            @click="emit('newSegmentAuto', { ...dynamique })"
            class="bg-emerald-600 text-white text-sm px-4 py-1.5 rounded hover:bg-emerald-700"
          >
            Ajouter (auto)
          </button>
        </div>

        <div>
          <button
            @click="emit('clearSegments')"
            class="bg-gray-200 text-gray-700 text-sm px-4 py-1.5 rounded hover:bg-gray-300"
          >
            Tout effacer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
