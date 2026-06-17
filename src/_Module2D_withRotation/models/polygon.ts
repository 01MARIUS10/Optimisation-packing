import type { Polygone, Position } from '../types'

/** Rasterise un polygone arbitraire (rectangle, cercle ou triangle discrétisé,
 *  peu importe) en une liste de cellules de grille qu'il recouvre. Échantillonne
 *  le centre de chaque cellule pour décider si elle est "dans" le polygone
 *  (règle pair-impair), ce qui fonctionne pour n'importe quelle forme simple. */
export function rasterize(polygone: Polygone): Position[] {
  const pts = polygone.length > 1 && samePoint(polygone[0]!, polygone[polygone.length - 1]!)
    ? polygone.slice(0, -1)
    : polygone

  if (pts.length < 3) return []

  const ys = pts.map(p => p.y)
  const minY = Math.floor(Math.min(...ys))
  const maxY = Math.ceil(Math.max(...ys))

  const cells: Position[] = []

  for (let y = minY; y <= maxY; y++) {
    const scanY = y + 0.5
    const xs: number[] = []

    for (let i = 0; i < pts.length; i++) {
      const a = pts[i]!
      const b = pts[(i + 1) % pts.length]!
      if (a.y === b.y) continue

      const [lo, hi] = a.y < b.y ? [a, b] : [b, a]
      if (scanY >= lo.y && scanY < hi.y) {
        const t = (scanY - lo.y) / (hi.y - lo.y)
        xs.push(lo.x + t * (hi.x - lo.x))
      }
    }

    xs.sort((a, b) => a - b)

    for (let i = 0; i + 1 < xs.length; i += 2) {
      const xStart = Math.ceil(xs[i]! - 0.5)
      const xEnd = Math.floor(xs[i + 1]! - 0.5)
      for (let x = xStart; x <= xEnd; x++) {
        cells.push({ x, y })
      }
    }
  }

  return cells
}

function samePoint(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y
}
