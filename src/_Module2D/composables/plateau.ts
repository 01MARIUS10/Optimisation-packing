import { ref, reactive, watch } from 'vue'
import { Conteneur } from '../models/conteneur'
import { Rectangle } from '../models/rectangle'
import { useWindow } from './window'
import { nfdh } from '../algorithme/NFDH'
import { ffdh } from '../algorithme/FFDH'
import { bf } from '../algorithme/BF'
import { bruteForce } from '../algorithme/BruteForce'
import type { Position, RectangleShape, Strategy } from '../types'

const { windowWidth, windowHeight } = useWindow()

const objects = reactive<Rectangle[]>([])
const conteneur = reactive(new Conteneur(windowWidth.value, windowHeight.value)) as unknown as Conteneur
const error = ref<string | null>(null)

watch([windowWidth, windowHeight], ([w, h]) => conteneur.resize(w, h))

function runStrategy(rects: Rectangle[], strategy: Strategy): Conteneur {
  switch (strategy) {
    case 'nfdh': return nfdh(rects, windowWidth.value, windowHeight.value)
    case 'ffdh': return ffdh(rects, windowWidth.value, windowHeight.value)
    case 'bf': return bf(rects, windowWidth.value, windowHeight.value)
    case 'brute-force': return bruteForce(rects, windowWidth.value, windowHeight.value)
  }
}

function applyResult(result: Conteneur): void {
  conteneur.reset()
  for (const r of result.rects) conteneur.placeExisting(r.position, r)
  const unplaced = objects.length - conteneur.rects.length
  error.value = unplaced > 0 ? `${unplaced} rectangle(s) n'ont pas pu être placés` : null
}

function clearConteneurAndObjects(): void {
  clearConteneurOnly()
  objects.splice(0, objects.length)
}
function clearConteneurOnly(): void {
  error.value = null
  conteneur.reset()
}

export function usePlateau() {
  //placer sur une position
  function addRectangleToCurrentAt(config: { position: Position; shape: RectangleShape }): boolean {
    error.value = null
    const rect = new Rectangle(config.position, config.shape)
    if (!conteneur.placeExisting(config.position, rect)) {
      error.value = `Zone déjà occupée ou hors limites (x:${config.position.x}, y:${config.position.y}, ${config.shape.w}×${config.shape.h})`
      return false
    }
    objects.push(rect)
    return true
  }

  //placer dynamiquement
  function addRectangleToCurrent(shape: RectangleShape): boolean {
    error.value = null
    const rect = new Rectangle({ x: 0, y: 0 }, shape)
    const freeSpace = conteneur.getFreeSpace()
    if (freeSpace === null || !freeSpace.canFit(rect) || !conteneur.addRectangle(rect)) {
      error.value = `Aucune position disponible pour ${shape.w}×${shape.h}`
      return false
    }
    objects.push(rect)
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
    const valid = validShapes(shapes)
    clearConteneurAndObjects()

    const rects = valid.map(shape => new Rectangle({ x: 0, y: 0 }, shape))
    objects.push(...rects)

    applyResult(runStrategy(rects, strategy))
    return conteneur.rects.length === shapes.length
  }

  function removeRectangle(id: string): void {
    const idx = objects.findIndex(o => o.id === id)
    if (idx !== -1) objects.splice(idx, 1)
    conteneur.remove(id)
  }

  function reinit(strategy: Strategy): void {
    clearConteneurOnly()
    applyResult(runStrategy(objects, strategy))
  }

  return {
    objects,
    conteneur,
    error,
    addRectangleToCurrentAt,
    addRectangleToCurrent,
    initContainers,
    removeRectangle,
    clearConteneurAndObjects,
    reinit,
  }
}
