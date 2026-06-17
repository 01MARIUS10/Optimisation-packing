import type { Position, SegmentShape } from '../types'
import { getRandomColor } from '../../helpers/color'
import { generateId } from '../../helpers/id'

export class Segment {
  readonly id: string
  position: Position
  shape: SegmentShape
  fill: string

  constructor(position: Position, shape: SegmentShape) {
    this.id = generateId() + '-' + shape.w.toString()
    this.position = position
    this.shape = shape
    this.fill = getRandomColor()
  }

  /** Vérifie si cet espace libre peut accueillir le segment cible */
  canFit(other: Segment): boolean {
    return this.shape.w >= other.shape.w
  }

  /** Retourne true si cet espace libre est un meilleur fit que l'autre
   *  (plus petit espace restant après placement = meilleur fit) */
  isBetterThan(other: Segment): boolean {
    return this.shape.w < other.shape.w
  }
}
