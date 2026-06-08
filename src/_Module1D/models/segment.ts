import type { Position, SegmentShape } from '../types'
import { getRandomColor } from '../../helpers/color'

export class Segment {
  readonly id: string
  position: Position
  shape: SegmentShape
  fill: string

  constructor(position: Position, shape: SegmentShape) {
    this.id = crypto.randomUUID()
    this.position = position
    this.shape = shape
    this.fill = getRandomColor()
  }
}
