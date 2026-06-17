import type { Position } from '../types'
import { Rectangle } from './rectangle'

export class Conteneur {
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

  getFreeSpace(): Rectangle | null {
    let bestX = -1
    let bestY = -1
    let bestW = 0
    let bestH = 0
    let bestArea = 0

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.cells[y]![x] !== 0) continue

        let w = 0
        while (x + w < this.width && this.cells[y]![x + w] === 0) w++

        let h = 1
        outer: while (y + h < this.height) {
          for (let col = x; col < x + w; col++) {
            if (this.cells[y + h]![col] !== 0) break outer
          }
          h++
        }

        const area = w * h
        if (area > bestArea) {
          bestArea = area
          bestX = x
          bestY = y
          bestW = w
          bestH = h
        }
      }
    }

    if (bestArea === 0) return null

    return new Rectangle(
      { x: bestX, y: bestY },
      { w: bestW, h: bestH }
    )
  }

  /** Tente de placer un rectangle à la première position libre suffisante.
   *  Retourne true si le placement a réussi, false sinon. */
  addRectangle(rect: Rectangle): boolean {
    const { w, h } = rect.shape

    for (let y = 0; y <= this.height - h; y++) {
      for (let x = 0; x <= this.width - w; x++) {
        if (!this.isOccupied(x, y, w, h)) {
          this.mark(x, y, w, h)
          rect.position = { x, y }
          this.rects.push(rect)
          return true
        }
      }
    }
    return false
  }

  placeExisting(pos: Position, rect: Rectangle): boolean {
    if (this.isOccupied(pos.x, pos.y, rect.shape.w, rect.shape.h)) return false
    this.mark(pos.x, pos.y, rect.shape.w, rect.shape.h)
    rect.position = pos
    this.rects.push(rect)
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
      this.placeExisting(r.position, r)
    }
  }

  reset(): void {
    this.cells = this.build(this.width, this.height)
    this.rects.length = 0
  }
}
