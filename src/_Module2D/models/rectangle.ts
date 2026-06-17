import type { Position, RectangleShape } from '../types'
import { getRandomColor } from '../../helpers/color'

export class Rectangle {
  readonly id: string
  position: Position
  shape: RectangleShape
  fill: string

  constructor(position: Position, shape: RectangleShape) {
    this.id = crypto.randomUUID()
    this.position = position
    this.shape = shape
    this.fill =  getRandomColor()
  }

  /** Vérifie si cet espace libre peut accueillir le rectangle cible */
  canFit(other: Rectangle): boolean {
    return this.shape.w >= other.shape.w && this.shape.h >= other.shape.h
  }

  /** Retourne true si cet espace libre est un meilleur fit que l'autre
   *  (plus petite surface restante après placement = meilleur fit) */
  isBetterFitThan(other: Rectangle): boolean {
    return this.shape.w * this.shape.h < other.shape.w * other.shape.h
  }
}
