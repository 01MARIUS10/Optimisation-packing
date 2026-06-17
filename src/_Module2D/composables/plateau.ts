import { ref, reactive, watch } from 'vue'
import { Conteneur } from '../models/conteneur'
import { Rectangle } from '../models/rectangle'
import { useWindow } from './window'
import { firstFit } from '../algorithme/FirstFit'
import { bestFit } from '../algorithme/BestFit'
import { worstFit } from '../algorithme/WorstFit'
import type { Position, RectangleShape, Strategy } from '../types'

const { windowWidth, windowHeight } = useWindow()

const objects = reactive<Rectangle[]>([])
const conteneurs = reactive<Conteneur[]>([new Conteneur(windowWidth.value, windowHeight.value)]) as unknown as Conteneur[]
const error = ref<string | null>(null)

watch([windowWidth, windowHeight], ([w, h]) => conteneurs.forEach(conteneur => conteneur.resize(w, h)))

//placer dynamiquement
function placeOne(rect: Rectangle): void {
  for (const conteneur of conteneurs) {
    const freeSpace = conteneur.getFreeSpace()
    if (freeSpace !== null && freeSpace.canFit(rect)) {
      conteneur.addRectangle(rect)
      return
    }
  }
  if (rect.shape.w > windowWidth.value || rect.shape.h > windowHeight.value) return
  const conteneur = new Conteneur(windowWidth.value, windowHeight.value)
  conteneurs.push(conteneur)
  conteneur.addRectangle(rect)
}

function clearConteneurAndObjects(): void {
  clearConteneurOnly()
  objects.splice(0, objects.length)
}
function clearConteneurOnly(): void {
  error.value = null
  conteneurs.splice(0, conteneurs.length, new Conteneur(windowWidth.value, windowHeight.value))
}

export function usePlateau() {
  //placer sur une position
  function addRectangleToCurrentAt(config: { position: Position; shape: RectangleShape }): boolean {
    error.value = null
    const rect = new Rectangle(config.position, config.shape)
    if (!conteneurs[0]!.placeExisting(config.position, rect)) {
      error.value = `Zone déjà occupée ou hors limites (x:${config.position.x}, y:${config.position.y}, ${config.shape.w}×${config.shape.h})`
      return false
    }
    objects.push(rect)
    return true
  }

  //placer dynamiquement
  function addRectangleToCurrent(shape: RectangleShape): boolean {
    error.value = null
    if (shape.w > windowWidth.value || shape.h > windowHeight.value) {
      error.value = `Aucune position disponible pour ${shape.w}×${shape.h}`
      return false
    }
    const rect = new Rectangle({ x: 0, y: 0 }, shape)
    objects.push(rect)
    placeOne(rect)
    return true
  }

  function validShapes(shapes: RectangleShape[]): RectangleShape[] {
    error.value = null
    const valid = shapes.filter(s => s.w <= windowWidth.value && s.h <= windowHeight.value)
    if (valid.length < shapes.length) {
      error.value = `Certains rectangles sont trop grands pour le conteneur`
    }
    return valid
  }

  function initContainers(shapes: RectangleShape[], strategy: Strategy): boolean {
    if (strategy === 'brute-force') {
      error.value = `Algorithme Brute Force : non implémenté`
      return false
    }
    const valid = validShapes(shapes)
    clearConteneurAndObjects()

    for (const shape of valid) {
      objects.push(new Rectangle({ x: 0, y: 0 }, shape))
    }

    switch (strategy) {
      case 'first-fit':
        conteneurs.splice(0, conteneurs.length, ...firstFit(objects, windowWidth.value, windowHeight.value))
        break
      case 'best-fit':
        conteneurs.splice(0, conteneurs.length, ...bestFit(objects, windowWidth.value, windowHeight.value))
        break
      case 'worst-fit':
        conteneurs.splice(0, conteneurs.length, ...worstFit(objects, windowWidth.value, windowHeight.value))
        break
    }
    return valid.length === shapes.length
  }

  function removeRectangle(id: string): void {
    const idx = objects.findIndex(o => o.id === id)
    if (idx !== -1) objects.splice(idx, 1)
    for (const conteneur of conteneurs) conteneur.remove(id)
  }

  function reinit(strategy: Strategy): void {
    clearConteneurOnly()

    if (strategy === 'brute-force') {
      error.value = `Algorithme Brute Force : non implémenté`
      return
    }
    switch (strategy) {
      case 'first-fit':
        conteneurs.splice(0, conteneurs.length, ...firstFit(objects, windowWidth.value, windowHeight.value))
        break
      case 'best-fit':
        conteneurs.splice(0, conteneurs.length, ...bestFit(objects, windowWidth.value, windowHeight.value))
        break
      case 'worst-fit':
        conteneurs.splice(0, conteneurs.length, ...worstFit(objects, windowWidth.value, windowHeight.value))
        break
    }
    error.value = null
  }

  return {
    objects,
    conteneurs,
    error,
    addRectangleToCurrentAt,
    addRectangleToCurrent,
    initContainers,
    removeRectangle,
    clearConteneurAndObjects,
    reinit,
  }
}
