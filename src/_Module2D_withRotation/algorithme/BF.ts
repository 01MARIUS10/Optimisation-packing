import { Conteneur } from '../models/conteneur'
import type { Form } from '../models/form'
import { boundingBox, placeAt } from './geometrie'

interface Niveau {
  y: number
  height: number
  usedWidth: number
}

/** Best-Fit (niveaux, hauteur décroissante) : parmi tous les niveaux où la forme
 *  rentre en largeur, choisit celui qui laisse le moins de largeur restante,
 *  sinon ouvre un nouveau niveau. Ne connaît rien des formes concrètes —
 *  uniquement `getEspaceOccupe()`. */
export function bf(formes: Form[], width: number, height: number): Conteneur {
  const conteneur = new Conteneur(width, height)
  const sorted = [...formes].sort((a, b) => boundingBox(b.getEspaceOccupe()).h - boundingBox(a.getEspaceOccupe()).h)
  const niveaux: Niveau[] = []

  for (const forme of sorted) {
    const { w, h } = boundingBox(forme.getEspaceOccupe())
    if (w > width) continue

    let meilleurNiveau: Niveau | null = null
    //parcours tout les niveaux ouverts
    for (const niveau of niveaux) {
      if (niveau.usedWidth + w > width) continue
      if (meilleurNiveau === null || niveau.usedWidth > meilleurNiveau.usedWidth) {
        //le plus petit reste
        meilleurNiveau = niveau
      }
    }

    if (meilleurNiveau) {
      placeAt(forme, meilleurNiveau.usedWidth, height - meilleurNiveau.y)
      if (conteneur.place(forme)) meilleurNiveau.usedWidth += w
      continue
    }

    //ouvrir un nouveau niveau
    const newY = niveaux.length ? niveaux[niveaux.length - 1]!.y + niveaux[niveaux.length - 1]!.height : 0
    if (newY + h > height) continue

    placeAt(forme, 0, height - newY)
    if (conteneur.place(forme)) {
      niveaux.push({ y: newY, height: h, usedWidth: w })
    }
  }

  return conteneur
}
