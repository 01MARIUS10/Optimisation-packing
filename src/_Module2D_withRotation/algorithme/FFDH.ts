import { Conteneur } from '../models/conteneur'
import type { Form } from '../models/form'
import { Geometrie } from './geometrie'

interface Niveau {
  y: number
  height: number
  usedWidth: number
}

/** First-Fit Decreasing Height : place chaque forme dans le premier niveau
 *  existant où elle rentre (largeur restante × hauteur du niveau, rotations
 *  comprises — 90° puis 180° si 0° ne convient pas), sinon ouvre un nouveau
 *  niveau. Ne connaît rien des formes concrètes — uniquement
 *  `getEspaceOccupe()`/`rotate()`, via la façade `Geometrie`. */
export function ffdh(formes: Form[], width: number, height: number): Conteneur {
  const conteneur = new Conteneur(width, height)
  const sorted = [...formes].sort(Geometrie.comparerHauteur)
  const niveaux: Niveau[] = []

  for (const forme of sorted) {
    let placed = false

    //parcours tout les niveaux ouverts
    for (const niveau of niveaux) {
      if (Geometrie.essayerOrientations(forme, width - niveau.usedWidth, niveau.height) === null) continue
      const { w } = Geometrie.etendue(forme)
      Geometrie.placeAt(forme, niveau.usedWidth, height - niveau.y)
      if (conteneur.place(forme)) {
        niveau.usedWidth += w
        placed = true
        break
      }
    }
    if (placed) continue

    //ouvrir un nouveau niveau, rotations comprises
    const newY = niveaux.length ? niveaux[niveaux.length - 1]!.y + niveaux[niveaux.length - 1]!.height : 0
    const espaceRestant = height - newY
    if (Geometrie.essayerOrientations(forme, width, espaceRestant) === null) continue

    const { w, h } = Geometrie.etendue(forme)
    Geometrie.placeAt(forme, 0, height - newY)
    if (conteneur.place(forme)) {
      niveaux.push({ y: newY, height: h, usedWidth: w })
    }
  }

  return conteneur
}
