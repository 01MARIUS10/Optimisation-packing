import type { Conteneur } from '../models/conteneur'

export function overlaps(a: { position: { x: number; y: number }; shape: { w: number; h: number } },
  b: { position: { x: number; y: number }; shape: { w: number; h: number } }): boolean {
  return (
    a.position.x < b.position.x + b.shape.w &&
    b.position.x < a.position.x + a.shape.w &&
    a.position.y < b.position.y + b.shape.h &&
    b.position.y < a.position.y + a.shape.h
  )
}

export function hasNoOverlapOrOutOfBounds(conteneur: Conteneur): boolean {
  for (let i = 0; i < conteneur.rects.length; i++) {
    const a = conteneur.rects[i]!
    const outOfBounds =
      a.position.x < 0 ||
      a.position.y < 0 ||
      a.position.x + a.shape.w > conteneur.width ||
      a.position.y + a.shape.h > conteneur.height
    if (outOfBounds) return false

    for (let j = i + 1; j < conteneur.rects.length; j++) {
      if (overlaps(a, conteneur.rects[j]!)) return false
    }
  }
  return true
}
