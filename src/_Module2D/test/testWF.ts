import { describe, it, expect } from 'vitest'
import { worstFit } from '../algorithme/WorstFit'
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

const expectedOutput = [
  [
    { w: 70, h: 20, x: 0, y: 0 },
    { w: 10, h: 20, x: 70, y: 0 },
    { w: 60, h: 15, x: 0, y: 20 },
    { w: 20, h: 15, x: 60, y: 20 },
    { w: 50, h: 10, x: 0, y: 35 },
    { w: 30, h: 10, x: 50, y: 35 },
  ],
  [
    { w: 40, h: 25, x: 0, y: 0 },
    { w: 20, h: 25, x: 40, y: 0 },
    { w: 15, h: 15, x: 60, y: 0 },
    { w: 15, h: 15, x: 60, y: 15 },
  ],
]

describe('worstFit', () => {
  it('place chaque rectangle dans le conteneur et à la position attendue', () => {
    const rects = input.map(s => new Rectangle({ x: 0, y: 0 }, { ...s }))
    const conteneurs = worstFit(rects, width, height)

    expect(conteneurs).toHaveLength(expectedOutput.length)
    conteneurs.forEach((conteneur, i) => {
      const actual = conteneur.rects.map(r => ({ w: r.shape.w, h: r.shape.h, x: r.position.x, y: r.position.y }))
      expect(actual).toEqual(expectedOutput[i])
    })
  })

  it('ne perd aucun rectangle et ne produit ni chevauchement ni débordement', () => {
    const rects = input.map(s => new Rectangle({ x: 0, y: 0 }, { ...s }))
    const conteneurs = worstFit(rects, width, height)

    const placedCount = conteneurs.reduce((sum, c) => sum + c.rects.length, 0)
    expect(placedCount).toBe(input.length)
    expect(hasNoOverlapOrOutOfBounds(conteneurs)).toBe(true)
  })
})
