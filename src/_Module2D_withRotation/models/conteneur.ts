import type { Position } from '../types'
import { Form } from './form'
import { rasterize } from './polygon'

export class Conteneur {
  private cells: number[][]
  readonly formes: Form[] = []
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

  private isInBounds(cell: Position): boolean {
    return cell.x >= 0 && cell.y >= 0 && cell.x < this.width && cell.y < this.height
  }

  private isFree(cells: Position[]): boolean {
    return cells.every(c => this.isInBounds(c) && this.cells[c.y]![c.x] === 0)
  }

  private mark(cells: Position[]): void {
    cells.forEach(c => { this.cells[c.y]![c.x] = 1 })
  }

  /** Place la forme à sa position actuelle si l'espace qu'elle occupe (déduit de
   *  son polygone) est entièrement libre et dans les limites du conteneur. */
  place(forme: Form): boolean {
    const cells = rasterize(forme.getEspaceOccupe())
    if (cells.length === 0 || !this.isFree(cells)) return false
    this.mark(cells)
    this.formes.push(forme)
    return true
  }

  remove(forme: Form): void {
    const idx = this.formes.indexOf(forme)
    if (idx === -1) return
    this.formes.splice(idx, 1)
    this.rebuild()
  }

  private rebuild(): void {
    this.cells = this.build(this.width, this.height)
    this.formes.forEach(f => this.mark(rasterize(f.getEspaceOccupe())))
  }

  resize(w: number, h: number): void {
    this.width = w
    this.height = h
    this.rebuild()
  }

  reset(): void {
    this.formes.length = 0
    this.cells = this.build(this.width, this.height)
  }
}
