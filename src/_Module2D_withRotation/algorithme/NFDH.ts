import { Conteneur } from '../models/conteneur'
import type { Form } from '../models/form'
import { boundingBox, placeAt } from './geometrie'

/** Next-Fit Decreasing Height : ne considère jamais que le niveau courant. Ne
 *  connaît rien des formes concrètes (rectangle, cercle, triangle…) — uniquement
 *  `getEspaceOccupe()`, via `boundingBox`/`placeAt`. Une forme qui ne rentre nulle
 *  part (ni dans le niveau courant, ni dans un nouveau niveau) n'est pas placée. */
export function nfdh(formes: Form[], width: number, height: number): Conteneur {
  const conteneur = new Conteneur(width, height)
  const sorted = [...formes].sort((a, b) => boundingBox(b.getEspaceOccupe()).h - boundingBox(a.getEspaceOccupe()).h)

  let niveauY = 0
  let niveauX = 0
  let niveauHeight = 0
  let niveauOuvert = false

  for (const forme of sorted) {
    const { w, h } = boundingBox(forme.getEspaceOccupe())
    if (w > width) continue

    // completer le niveau courant
    if (niveauOuvert && niveauX + w <= width) {
      placeAt(forme, niveauX, height - niveauY)
      if (conteneur.place(forme)) niveauX += w
      continue
    }

    // nouveau niveau
    const nouveauNiveauY = niveauOuvert ? niveauY + niveauHeight : 0
    if (nouveauNiveauY + h > height) continue

    placeAt(forme, 0, height - nouveauNiveauY)
    if (conteneur.place(forme)) {
      niveauY = nouveauNiveauY
      niveauHeight = h
      niveauX = w
      niveauOuvert = true
    }
  }

  return conteneur
}
