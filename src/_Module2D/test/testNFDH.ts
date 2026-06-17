import { describe, it, expect } from 'vitest'
import { nfdh } from '../algorithme/NFDH'
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

// Trié par hauteur décroissante : (40,25)(20,25)(70,20)(10,20)(60,15)(20,15)(15,15)(15,15)(50,10)(30,10)
// Les 3 étagères (h25 + h20 + h15 = 60) remplissent exactement le conteneur :
// les 4 derniers rectangles (2×15×15, 50×10, 30×10) n'ont plus de place et sont rejetés.
// Les étagères sont empilées depuis le bas (y=0 = bas du conteneur en repère logique,
// converti en coordonnées canvas où y croît vers le bas) : la 1ère étagère (la plus
// haute, h25) se retrouve donc en bas du rendu (y=35), la dernière (h15) en haut (y=0).
const expectedOutput = [
  { w: 40, h: 25, x: 0, y: 35 },
  { w: 20, h: 25, x: 40, y: 35 },
  { w: 70, h: 20, x: 0, y: 15 },
  { w: 10, h: 20, x: 70, y: 15 },
  { w: 60, h: 15, x: 0, y: 0 },
  { w: 20, h: 15, x: 60, y: 0 },
]

describe('nfdh', () => {
  it('place les rectangles aux positions attendues (étagère courante uniquement)', () => {
    const rects = input.map(s => new Rectangle({ x: 0, y: 0 }, { ...s }))
    const conteneur = nfdh(rects, width, height)

    const actual = conteneur.rects.map(r => ({ w: r.shape.w, h: r.shape.h, x: r.position.x, y: r.position.y }))
    expect(actual).toEqual(expectedOutput)
  })

  it('rejette les rectangles qui ne rentrent plus, sans chevauchement ni débordement', () => {
    const rects = input.map(s => new Rectangle({ x: 0, y: 0 }, { ...s }))
    const conteneur = nfdh(rects, width, height)

    expect(conteneur.rects.length).toBe(6)
    expect(hasNoOverlapOrOutOfBounds(conteneur)).toBe(true)
  })
})
