import { Conteneur } from '../models/conteneur'
import type { Form } from '../models/form'
import type { Degre } from '../types'
import { Geometrie } from './geometrie'

interface Niveau {
  y: number
  height: number
  usedWidth: number
}

/** Best-Fit (niveaux, hauteur décroissante) : parmi tous les niveaux où la forme
 *  rentre (rotations comprises — 90° puis 180° si 0° ne convient pas), choisit
 *  celui qui laisse le moins de largeur restante, sinon ouvre un nouveau niveau.
 *  Ne connaît rien des formes concrètes — uniquement `getEspaceOccupe()`/`rotate()`,
 *  via la façade `Geometrie`. */
export function bf(formes: Form[], width: number, height: number): Conteneur {
  const conteneur = new Conteneur(width, height)
  const sorted = [...formes].sort(Geometrie.comparerHauteur)
  const niveaux: Niveau[] = []

  for (const forme of sorted) {
    let meilleurNiveau: Niveau | null = null
    let meilleurDegre: Degre = 0

    //parcours tout les niveaux ouverts, en essayant chaque orientation
    for (const niveau of niveaux) {
      const degre = Geometrie.essayerOrientations(forme, width - niveau.usedWidth, niveau.height)
      if (degre === null) continue
      if (meilleurNiveau === null || niveau.usedWidth > meilleurNiveau.usedWidth) {
        //le plus petit reste
        meilleurNiveau = niveau
        meilleurDegre = degre
      }
    }

    if (meilleurNiveau) {
      forme.rotate(meilleurDegre) // ré-applique l'orientation gagnante (un niveau suivant a pu la changer)
      const { w } = Geometrie.etendue(forme)
      Geometrie.placeAt(forme, meilleurNiveau.usedWidth, height - meilleurNiveau.y)
      if (conteneur.place(forme)) meilleurNiveau.usedWidth += w
      continue
    }

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
