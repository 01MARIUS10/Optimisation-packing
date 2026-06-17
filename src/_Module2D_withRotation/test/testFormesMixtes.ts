import { describe, it, expect } from 'vitest'
import { nfdh } from '../algorithme/NFDH'
import { ffdh } from '../algorithme/FFDH'
import { bf } from '../algorithme/BF'
import { Rectangle } from '../models/rectangle'
import { Cercle } from '../models/cercle'
import { TriangleIsocele } from '../models/triangleIsocele'
import { rasterize } from '../models/polygon'
import type { Form } from '../models/form'
import { MOCK_FORMS, containerWidth, containerHeight } from '../mock/data'

function buildFormes(): Form[] {
  return [
    new Rectangle({ x: 0, y: 0 }, 40, 20),
    new Cercle({ x: 0, y: 0 }, 10),
    new TriangleIsocele({ x: 0, y: 0 }, 30, 25),
    new Rectangle({ x: 0, y: 0 }, 20, 15),
    new Cercle({ x: 0, y: 0 }, 6),
  ]
}

function checkNoOverlap(conteneur: ReturnType<typeof nfdh>): void {
  // rasterise chaque forme placée et vérifie qu'aucune cellule n'est partagée
  // entre deux formes, ni hors des limites du conteneur
  const seen = new Set<string>()
  for (const forme of conteneur.formes) {
    for (const cell of rasterize(forme.getEspaceOccupe())) {
      expect(cell.x).toBeGreaterThanOrEqual(0)
      expect(cell.y).toBeGreaterThanOrEqual(0)
      expect(cell.x).toBeLessThan(conteneur.width)
      expect(cell.y).toBeLessThan(conteneur.height)

      const key = `${cell.x},${cell.y}`
      expect(seen.has(key)).toBe(false)
      seen.add(key)
    }
  }
}

describe('algorithmes 2D avec formes mixtes (rectangle, cercle, triangle)', () => {
  it('nfdh place toutes les formes sans erreur', () => {
    const conteneur = nfdh(buildFormes(), 100, 80)
    expect(conteneur.formes.length).toBeGreaterThan(0)
    checkNoOverlap(conteneur)
  })

  it('ffdh place toutes les formes sans erreur', () => {
    const conteneur = ffdh(buildFormes(), 100, 80)
    expect(conteneur.formes.length).toBeGreaterThan(0)
    checkNoOverlap(conteneur)
  })

  it('bf place toutes les formes sans erreur', () => {
    const conteneur = bf(buildFormes(), 100, 80)
    expect(conteneur.formes.length).toBeGreaterThan(0)
    checkNoOverlap(conteneur)
  })

  it('rejette une forme trop grande pour le conteneur', () => {
    const formes = [new Rectangle({ x: 0, y: 0 }, 200, 20)]
    const conteneur = nfdh(formes, 100, 80)
    expect(conteneur.formes.length).toBe(0)
  })
})

describe('algorithmes 2D sur le jeu de données mock (mock/data.ts)', () => {
  it.each([
    ['nfdh', nfdh],
    ['ffdh', ffdh],
    ['bf', bf],
  ] as const)('%s place les formes du mock sans chevauchement ni débordement', (_name, algo) => {
    const conteneur = algo(MOCK_FORMS, containerWidth, containerHeight)
    expect(conteneur.formes.length).toBeGreaterThan(0)
    expect(conteneur.formes.length).toBeLessThanOrEqual(MOCK_FORMS.length)
    checkNoOverlap(conteneur)
  })
})
