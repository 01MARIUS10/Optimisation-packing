import { describe, it, expect } from 'vitest'
import { ffdh } from '../algorithme/FFDH'
import { Rectangle } from '../models/rectangle'
import type { RectangleShape } from '../types'
import { hasNoOverlapOrOutOfBounds } from './helpers'

const width = 80
const height = 60

const input: RectangleShape[] = [
  { w: 70, h: 20 },
  { w: 10, h: 20 },
  { w: 60, h: 15 },
  { w: 20, h: 15 },
  { w: 50, h: 10 },
  { w: 30, h: 10 },
  { w: 40, h: 25 },
  { w: 20, h: 25 },
  { w: 15, h: 15 },
  { w: 15, h: 15 },
]

// Trié par hauteur décroissante. Contrairement à NFDH, (10,20) revient se loger dans
// la 1ère étagère (qui a encore 10 de large libre) plutôt que dans la 2ème.
// Toujours 3 étagères remplissant exactement les 60 de hauteur : les 4 derniers
// rectangles (2×15×15, 50×10, 30×10) sont rejetés.
// Les étagères sont empilées depuis le bas (comme NFDH) : la 1ère étagère (h25,
// la plus haute) se retrouve en bas du rendu (y=35), la dernière (h15) en haut (y=0).
const expectedOutput = [
  { w: 40, h: 25, x: 0, y: 35 },
  { w: 20, h: 25, x: 40, y: 35 },
  { w: 70, h: 20, x: 0, y: 15 },
  { w: 10, h: 20, x: 60, y: 40 },
  { w: 60, h: 15, x: 0, y: 0 },
  { w: 20, h: 15, x: 60, y: 0 },
]

describe('ffdh', () => {
  it('place les rectangles aux positions attendues (première étagère qui convient)', () => {
    const rects = input.map(s => new Rectangle({ x: 0, y: 0 }, { ...s }))
    const conteneur = ffdh(rects, width, height)

    const actual = conteneur.rects.map(r => ({ w: r.shape.w, h: r.shape.h, x: r.position.x, y: r.position.y }))
    expect(actual).toEqual(expectedOutput)
  })

  it('rejette les rectangles qui ne rentrent plus, sans chevauchement ni débordement', () => {
    const rects = input.map(s => new Rectangle({ x: 0, y: 0 }, { ...s }))
    const conteneur = ffdh(rects, width, height)

    expect(conteneur.rects.length).toBe(6)
    expect(hasNoOverlapOrOutOfBounds(conteneur)).toBe(true)
  })
})
