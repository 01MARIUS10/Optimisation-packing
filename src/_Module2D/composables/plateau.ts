import { ref, reactive, watch } from 'vue'
import { getRandomColor } from '../../helpers/color'
import { Matrice } from '../models/matrice'
import { useWindow } from './window'
import type { Position, RectangleShape } from '../types'

const { windowWidth, windowHeight } = useWindow()

const matrice = reactive(new Matrice(windowWidth.value, windowHeight.value)) as unknown as Matrice
const error = ref<string | null>(null)

watch([windowWidth, windowHeight], ([w, h]) => matrice.resize(w, h))

export function usePlateau() {
  function addRectangle(config: { position: Position; shape: RectangleShape }): boolean {
    error.value = null
    if (!matrice.canPlaceInto(config.position, config.shape)) {
      error.value = `Zone déjà occupée ou hors limites (x:${config.position.x}, y:${config.position.y}, ${config.shape.w}×${config.shape.h})`
      return false
    }
    return true
  }

  function addRectangleAuto(shape: RectangleShape): boolean {
    error.value = null
    const pos = matrice.findPosition(shape)
    if (!pos) {
      error.value = `Aucune position disponible pour ${shape.w}×${shape.h}`
      return false
    }
    matrice.canPlaceInto(pos, shape)
    return true
  }

  function removeRectangle(id: string): void {
    matrice.remove(id)
  }

  function clearRectangles(): void {
    matrice.reset()
    error.value = null
  }

  return { matrice, error, addRectangle, addRectangleAuto, removeRectangle, clearRectangles }
}
