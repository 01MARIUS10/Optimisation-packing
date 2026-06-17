import type { Polygone } from '../types'
import type { Form } from '../models/form'

export interface BoundingBox {
  minX: number
  minY: number
  maxX: number
  maxY: number
  w: number
  h: number
}

/** Boîte englobante d'un polygone — fonctionne pour n'importe quelle forme,
 *  puisqu'elle ne lit que la liste de points retournée par `getEspaceOccupe()`. */
export function boundingBox(polygone: Polygone): BoundingBox {
  const xs = polygone.map(p => p.x)
  const ys = polygone.map(p => p.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY }
}

/** Déplace la forme pour que sa boîte englobante ait son coin bas-gauche au point
 *  (targetX, targetBottomY), sans jamais avoir besoin de savoir quel type de forme
 *  c'est : on sonde sa boîte englobante à l'origine pour en déduire le décalage
 *  entre `forme.position` (l'ancre propre à chaque forme) et le bas-gauche réel. */
export function placeAt(forme: Form, targetX: number, targetBottomY: number): void {
  forme.position = { x: 0, y: 0 }
  const box = boundingBox(forme.getEspaceOccupe())
  forme.position = {
    x: targetX - box.minX,
    y: targetBottomY - box.maxY,
  }
}
