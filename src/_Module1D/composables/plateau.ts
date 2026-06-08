import { ref, reactive, watch } from 'vue'
import { Ligne } from '../models/ligne'
import { useConteneur } from './conteneur'
import type { Position, SegmentShape } from '../types'

const { conteneurLength } = useConteneur()

const ligne = reactive(new Ligne(conteneurLength.value)) as unknown as Ligne
const error = ref<string | null>(null)

watch(conteneurLength, l => ligne.resize(l))

export function usePlateau() {
  function addSegment(config: { position: Position; shape: SegmentShape }): boolean {
    error.value = null
    if (!ligne.canPlaceInto(config.position, config.shape)) {
      error.value = `Zone déjà occupée ou hors limites (x:${config.position.x}, w:${config.shape.w})`
      return false
    }
    return true
  }

  function addSegmentAuto(shape: SegmentShape): boolean {
    error.value = null
    const pos = ligne.findPosition(shape)
    if (!pos) {
      error.value = `Aucune position disponible pour w:${shape.w}`
      return false
    }
    ligne.canPlaceInto(pos, shape)
    return true
  }

  function removeSegment(id: string): void {
    ligne.remove(id)
  }

  function clearSegments(): void {
    ligne.reset()
    error.value = null
  }

  return { ligne, error, addSegment, addSegmentAuto, removeSegment, clearSegments }
}
