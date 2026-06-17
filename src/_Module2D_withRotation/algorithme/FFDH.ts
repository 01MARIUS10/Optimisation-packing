import { Conteneur } from '../models/conteneur'
import type { Form } from '../models/form'
import { boundingBox, placeAt } from './geometrie'

interface Niveau {
  y: number
  height: number
  usedWidth: number
}

/** First-Fit Decreasing Height : place chaque forme dans le premier niveau
 *  existant où elle rentre en largeur, sinon ouvre un nouveau niveau. Ne connaît
 *  rien des formes concrètes — uniquement `getEspaceOccupe()`. */
export function ffdh(formes: Form[], width: number, height: number): Conteneur {
  const conteneur = new Conteneur(width, height)
  const sorted = [...formes].sort((a, b) => boundingBox(b.getEspaceOccupe()).h - boundingBox(a.getEspaceOccupe()).h)
  const niveaux: Niveau[] = []

  for (const forme of sorted) {
    const { w, h } = boundingBox(forme.getEspaceOccupe())
    if (w > width) continue

    //parcours tout les niveaux ouverts
    const niveau = niveaux.find(n => n.usedWidth + w <= width)
    if (niveau) {
      placeAt(forme, niveau.usedWidth, height - niveau.y)
      if (conteneur.place(forme)) niveau.usedWidth += w
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
