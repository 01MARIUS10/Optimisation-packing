import type { Position, RectangleShape } from '../types'
import { Rectangle } from './rectangle'

export class Matrice {
  private cells: number[][]
  readonly rects: Rectangle[] = []
  width: number
  height: number

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.cells = this.build(width, height)
  }

  private build(w: number, h: number): number[][] {
    return Array.from({ length: h }, () => new Array<number>(w).fill(0))
  }

  private isOccupied(x: number, y: number, w: number, h: number): boolean {
    if (x < 0 || y < 0 || x + w > this.width || y + h > this.height) return true
    for (let row = y; row < y + h; row++) {
      for (let col = x; col < x + w; col++) {
        if (this.cells[row]![col] === 1) return true
      }
    }
    return false
  }

  private mark(x: number, y: number, w: number, h: number): void {
    for (let row = y; row < y + h; row++) {
      for (let col = x; col < x + w; col++) {
        this.cells[row]![col] = 1
      }
    }
  }

  findPosition(shape: RectangleShape): Position | null {
    for (let y = 0; y <= this.height - shape.h; y++) {
      for (let x = 0; x <= this.width - shape.w; x++) {
        if (!this.isOccupied(x, y, shape.w, shape.h)) return { x, y }
      }
    }
    return null
  }

  canPlaceInto(pos: Position, shape: RectangleShape): boolean {
    if (this.isOccupied(pos.x, pos.y, shape.w, shape.h)) return false
    this.mark(pos.x, pos.y, shape.w, shape.h)
    this.rects.push(new Rectangle(pos, shape))
    return true
  }

  remove(id: string): void {
    const idx = this.rects.findIndex(r => r.id === id)
    if (idx === -1) return
    this.rects.splice(idx, 1)
    this.cells = this.build(this.width, this.height)
    this.rects.forEach(r => this.mark(r.position.x, r.position.y, r.shape.w, r.shape.h))
  }

  resize(w: number, h: number): void {
    const saved = [...this.rects]
    this.width = w
    this.height = h
    this.cells = this.build(w, h)
    this.rects.length = 0
    for (const r of saved) {
      this.canPlaceInto(r.position, r.shape)
    }
  }

  reset(): void {
    this.cells = this.build(this.width, this.height)
    this.rects.length = 0
  }
}
