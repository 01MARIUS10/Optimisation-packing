import type { Position, SegmentShape } from '../types'
import { Segment } from './segment'

export class Ligne {
  private cells: number[]
  readonly segments: Segment[] = []
  length: number

  constructor(length: number) {
    this.length = length
    this.cells = this.build(length)
  }

  private build(length: number): number[] {
    return new Array<number>(length).fill(0)
  }

  private isOccupied(x: number, w: number): boolean {
    if (x < 0 || x + w > this.length) return true
    for (let col = x; col < x + w; col++) {
      if (this.cells[col] === 1) return true
    }
    return false
  }

  private mark(x: number, w: number): void {
    for (let col = x; col < x + w; col++) {
      this.cells[col]! = 1
    }
  }

  findPosition(shape: SegmentShape): Position | null {
    for (let x = 0; x <= this.length - shape.w; x++) {
      if (!this.isOccupied(x, shape.w)) return { x }
    }
    return null
  }

  canPlaceInto(pos: Position, shape: SegmentShape): boolean {
    if (this.isOccupied(pos.x, shape.w)) return false
    this.mark(pos.x, shape.w)
    this.segments.push(new Segment(pos, shape))
    return true
  }

  remove(id: string): void {
    const idx = this.segments.findIndex(s => s.id === id)
    if (idx === -1) return
    this.segments.splice(idx, 1)
    this.cells = this.build(this.length)
    this.segments.forEach(s => this.mark(s.position.x, s.shape.w))
  }

  resize(length: number): void {
    const saved = [...this.segments]
    this.length = length
    this.cells = this.build(length)
    this.segments.length = 0
    for (const s of saved) {
      this.canPlaceInto(s.position, s.shape)
    }
  }

  reset(): void {
    this.cells = this.build(this.length)
    this.segments.length = 0
  }
}
