import type { Position, SegmentShape, Strategy } from '../types'
import { Segment } from './segment'

export class Conteneur {
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


  getFreeSpace(): Segment | null {
    let bestStart = -1
    let bestLen = 0
    let currentStart = -1
    let currentLen = 0

    for (let i = 0; i < this.length; i++) {
      if (this.cells[i] === 0) {
        if (currentStart === -1) currentStart = i
        currentLen++
        if (currentLen > bestLen) {
          bestLen = currentLen
          bestStart = currentStart
        }
      } else {
        currentStart = -1
        currentLen = 0
      }
    }

    if (bestLen === 0) return null

    return new Segment(
      { x: bestStart },
      { w: bestLen }
    )
  }

  /** Tente de placer un segment à la première position libre suffisante.
   *  Retourne true si le placement a réussi, false sinon. */
  addSegment(segment: Segment): boolean {
    const w = segment.shape.w

    // Cherche la première position x où w cellules consécutives sont libres
    for (let x = 0; x <= this.length - w; x++) {
      if (!this.isOccupied(x, w)) {
        this.mark(x, w)
        segment.position = { x }
        this.segments.push(segment)
        return true
      }
    }
    return false
  }

  placeExisting(pos: Position, segment: Segment): boolean {
    if (this.isOccupied(pos.x, segment.shape.w)) return false
    this.mark(pos.x, segment.shape.w)
    segment.position = pos
    this.segments.push(segment)
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
      this.placeExisting(s.position, s)
    }
  }

  reset(): void {
    this.cells = this.build(this.length)
    this.segments.length = 0
  }
}
