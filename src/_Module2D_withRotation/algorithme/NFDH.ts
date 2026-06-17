import { Conteneur } from '../models/conteneur'
import type { Form } from '../models/form'
import { Geometrie } from './geometrie'

/** Next-Fit Decreasing Height : ne considère jamais que le niveau courant. Ne
 *  connaît rien des formes concrètes (rectangle, cercle, triangle…) — uniquement
 *  `getEspaceOccupe()`/`rotate()`, via la façade `Geometrie`. Si une forme ne
 *  rentre pas telle quelle, on essaie 90° puis 180° avant de l'abandonner. Une
 *  forme qui ne rentre nulle part (ni dans le niveau courant, ni dans un
 *  nouveau niveau, dans aucune orientation) n'est pas placée. */
export function nfdh(formes: Form[], width: number, height: number): Conteneur {
  const conteneur = new Conteneur(width, height)
  const sorted = [...formes].sort(Geometrie.comparerHauteur)

  let niveauY = 0
  let niveauX = 0
  let niveauHeight = 0
  let niveauOuvert = false

  for (const forme of sorted) {
    // essaie de compléter le niveau courant (largeur restante × hauteur du niveau), rotations comprises
    if (niveauOuvert && Geometrie.essayerOrientations(forme, width - niveauX, niveauHeight) !== null) {
      const { w } = Geometrie.etendue(forme)
      Geometrie.placeAt(forme, niveauX, height - niveauY)
      if (conteneur.place(forme)) {
        niveauX += w
        continue
      }
    }

    // nouveau niveau, rotations comprises
    const nouveauNiveauY = niveauOuvert ? niveauY + niveauHeight : 0
    const espaceRestant = height - nouveauNiveauY
    if (Geometrie.essayerOrientations(forme, width, espaceRestant) === null) continue

    const { w, h } = Geometrie.etendue(forme)
    Geometrie.placeAt(forme, 0, height - nouveauNiveauY)
    if (conteneur.place(forme)) {
      niveauY = nouveauNiveauY
      niveauHeight = h
      niveauX = w
      niveauOuvert = true
    }
  }

  return conteneur
}
