import { ref, reactive, watch } from 'vue'
import { Conteneur } from '../models/conteneur'
import { useWindow } from './window'
import { nfdh } from '../algorithme/NFDH'
import { ffdh } from '../algorithme/FFDH'
import { bf } from '../algorithme/BF'
import { boundingBox } from '../algorithme/geometrie'
import type { Form } from '../models/form'
import type { Strategy } from '../types'

const { windowWidth, windowHeight } = useWindow()

const objects = reactive<Form[]>([])
const conteneur = reactive(new Conteneur(windowWidth.value, windowHeight.value)) as unknown as Conteneur
const error = ref<string | null>(null)

watch([windowWidth, windowHeight], ([w, h]) => conteneur.resize(w, h))

function runStrategy(formes: Form[], strategy: 'nfdh' | 'ffdh' | 'bf'): Conteneur {
  switch (strategy) {
    case 'nfdh': return nfdh(formes, windowWidth.value, windowHeight.value)
    case 'ffdh': return ffdh(formes, windowWidth.value, windowHeight.value)
    case 'bf': return bf(formes, windowWidth.value, windowHeight.value)
  }
}

function applyResult(result: Conteneur): void {
  conteneur.reset()
  for (const f of result.formes) conteneur.place(f)
  const unplaced = objects.length - conteneur.formes.length
  error.value = unplaced > 0 ? `${unplaced} forme(s) n'ont pas pu être placées` : null
}

function validFormes(formes: Form[]): Form[] {
  error.value = null
  const valid = formes.filter(f => {
    const box = boundingBox(f.getEspaceOccupe())
    return box.w <= windowWidth.value && box.h <= windowHeight.value
  })
  if (valid.length < formes.length) {
    error.value = `Certaines formes sont trop grandes pour le conteneur`
  }
  return valid
}

function clearConteneurAndObjects(): void {
  error.value = null
  conteneur.reset()
  objects.splice(0, objects.length)
}

export function usePlateau() {
  function initFormes(formes: Form[], strategy: Strategy): boolean {
    if (strategy === 'brute-force') {
      error.value = `Algorithme Brute Force : non implémenté`
      return false
    }
    const valid = validFormes(formes)
    clearConteneurAndObjects()

    objects.push(...valid)

    applyResult(runStrategy(valid, strategy))
    return conteneur.formes.length === formes.length
  }

  function reinit(strategy: Strategy): void {
    if (strategy === 'brute-force') {
      error.value = `Algorithme Brute Force : non implémenté`
      return
    }
    error.value = null
    applyResult(runStrategy(objects, strategy))
  }

  return {
    objects,
    conteneur,
    error,
    initFormes,
    reinit,
    clearConteneurAndObjects,
  }
}
