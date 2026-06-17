import { ref, reactive, watch } from 'vue'
import { Conteneur } from '../models/conteneur'
import { Segment } from '../models/segment'
import { useConteneur } from './conteneur'
import { firstFit } from '../algotithm/FirstFit'
import { bestFit } from '../algotithm/BestFit'
import { worstFit } from '../algotithm/WorstFit'
import type { Position, SegmentShape, Strategy } from '../types'

const { conteneurLength } = useConteneur()

const objects = reactive<Segment[]>([])
const conteneurs = reactive<Conteneur[]>([new Conteneur(conteneurLength.value)]) as unknown as Conteneur[]
const error = ref<string | null>(null)

watch(conteneurLength, l => conteneurs.forEach(conteneur => conteneur.resize(l)))

//placer dynamiquement
function placeOne(segment: Segment): void {
  for (const conteneur of conteneurs) {
    const freeSegment = conteneur.getFreeSpace()
    if (freeSegment !== null && freeSegment.canFit(segment)) {
      conteneur.addSegment(segment)
      return
    }
  }
  if (segment.shape.w > conteneurLength.value) return
  const conteneur = new Conteneur(conteneurLength.value)
  conteneurs.push(conteneur)
  conteneur.addSegment(segment)
}

function clearConteneurAndObjects(): void {
  clearConteneurOnly()
  objects.splice(0, objects.length)
}
function clearConteneurOnly(): void {
  error.value = null
  conteneurs.splice(0, conteneurs.length, new Conteneur(conteneurLength.value))
}

export function usePlateau() {
  //placer sur une position
  function addSegmentToCurrentAt(config: { position: Position; shape: SegmentShape }): boolean {
    error.value = null
    const segment = new Segment(config.position, config.shape)
    if (!conteneurs[0]!.placeExisting(config.position, segment)) {
      error.value = `Zone déjà occupée ou hors limites (x:${config.position.x}, w:${config.shape.w})`
      return false
    }
    objects.push(segment)
    return true
  }

  //placer dynamiquement
  function addSegmentToCurrent(shape: SegmentShape): boolean {
    error.value = null
    if (shape.w > conteneurLength.value) {
      error.value = `Aucune position disponible pour w:${shape.w}`
      return false
    }
    const segment = new Segment({ x: 0 }, shape)
    objects.push(segment)
    placeOne(segment)
    return true
  }

  function validShapes(shapes: SegmentShape[]): SegmentShape[] {
    error.value = null
    const valid = shapes.filter(s => s.w <= conteneurLength.value)
    if (valid.length < shapes.length) {
      error.value = `Certains segments sont trop grands pour le conteneur`
    }
    return valid
  }

  function initContainers(shapes: SegmentShape[], strategy: Strategy): boolean {
    console.log('useplateau','Initializing containers with strategy:', strategy, objects);
    if (strategy === 'brute-force') {
      error.value = `Algorithme Brute Force : non implémenté`
      return false
    }
    const valid = validShapes(shapes)
    clearConteneurAndObjects()

    for (const shape of valid) {
      objects.push(new Segment({ x: 0 }, shape))
    }


    switch (strategy) {
      case 'first-fit': 
        console.log('first-fit', conteneurs);
        conteneurs.splice(0, conteneurs.length, ...firstFit(objects, conteneurLength.value));
        break
      case 'best-fit': 
        conteneurs.splice(0, conteneurs.length, ...bestFit(objects, conteneurLength.value)); 
        break
      case 'worst-fit': 
        conteneurs.splice(0, conteneurs.length, ...worstFit(objects, conteneurLength.value)); 
        break
    }
    return valid.length === shapes.length
  }

  function removeSegment(id: string): void {
    const idx = objects.findIndex(o => o.id === id)
    if (idx !== -1) objects.splice(idx, 1)
    for (const conteneur of conteneurs) conteneur.remove(id)
  }


  function reinit(strategy: Strategy): void {
    console.log('reinit', strategy, objects);
    clearConteneurOnly()

    if (strategy === 'brute-force') {
      error.value = `Algorithme Brute Force : non implémenté`
      return
    }
    switch (strategy) {
      case 'first-fit': 
        conteneurs.splice(0, conteneurs.length, ...firstFit(objects, conteneurLength.value));
        break
      case 'best-fit': 
        conteneurs.splice(0, conteneurs.length, ...bestFit(objects, conteneurLength.value)); 
        break
      case 'worst-fit': 
        conteneurs.splice(0, conteneurs.length, ...worstFit(objects, conteneurLength.value)); 
        break
    }
    error.value = null
  }

  return {
    objects,
    conteneurs,
    error,
    addSegmentToCurrentAt,
    addSegmentToCurrent,
    initContainers,
    removeSegment,
    clearConteneurAndObjects,
    reinit,
  }
}
