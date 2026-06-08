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
}
