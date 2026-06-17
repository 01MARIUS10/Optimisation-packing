import { describe, it, expect } from 'vitest'
import { nfdh } from '../algorithme/NFDH'
import { ffdh } from '../algorithme/FFDH'
import { bf } from '../algorithme/BF'
import { Rectangle } from '../models/rectangle'
import { TriangleIsocele } from '../models/triangleIsocele'

// Conteneur étroit et haut : une forme 80×30 ne rentre PAS telle quelle
// (largeur 80 > largeur du conteneur 50) mais rentre une fois tournée à 90°
// (devient 30×80, largeur 30 <= 50, hauteur 80 <= 100).
const CONTAINER_W = 50
const CONTAINER_H = 100

describe('rotation automatique dans les algorithmes (NFDH/FFDH/BF)', () => {
  it.each([
    ['nfdh', nfdh],
    ['ffdh', ffdh],
    ['bf', bf],
  ] as const)('%s place un rectangle qui ne rentre qu apres rotation a 90°', (_name, algo) => {
    const rect = new Rectangle({ x: 0, y: 0 }, 80, 30)
    const conteneur = algo([rect], CONTAINER_W, CONTAINER_H)

    expect(conteneur.formes.length).toBe(1)
    // la forme a bien été tournée : largeur/hauteur sont échangées
    expect(rect.largeur).toBe(30)
    expect(rect.hauteur).toBe(80)
  })

  it.each([
    ['nfdh', nfdh],
    ['ffdh', ffdh],
    ['bf', bf],
  ] as const)('%s place un triangle qui ne rentre qu apres rotation a 90°', (_name, algo) => {
    const triangle = new TriangleIsocele({ x: 0, y: 0 }, 80, 30)
    const conteneur = algo([triangle], CONTAINER_W, CONTAINER_H)

    expect(conteneur.formes.length).toBe(1)
    expect(triangle.base).toBe(30)
    expect(triangle.hauteur).toBe(80)
  })

  it('nfdh laisse non placee une forme qui ne rentre dans aucune orientation', () => {
    const enorme = new Rectangle({ x: 0, y: 0 }, 200, 200)
    const conteneur = nfdh([enorme], CONTAINER_W, CONTAINER_H)
    expect(conteneur.formes.length).toBe(0)
  })
})
