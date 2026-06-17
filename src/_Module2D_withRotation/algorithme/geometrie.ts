import type { Form } from '../models/form'
import type { Degre } from '../types'
import { rasterize } from '../models/polygon'

const ORIENTATIONS: Degre[] = [0, 90, 180]

export interface Etendue {
  minX: number
  minY: number
  maxX: number
  maxY: number
  w: number
  h: number
}

/** Façade géométrique : les algorithmes ne lisent jamais une grille de cellules
 *  ou un polygone eux-mêmes, seulement ces comparaisons/déplacements. Chaque
 *  méthode repart directement de `forme.getEspaceOccupe()` (l'escalier de la
 *  forme), jamais d'une notion de "bounds" préconstruite et partagée. */
export class Geometrie {
  private constructor() {}

  /** Étendue de la forme déduite de son escalier rasterisé. */
  static etendue(forme: Form): Etendue {
    const cellules = rasterize(forme.getEspaceOccupe())
    const xs = cellules.map(c => c.x)
    const ys = cellules.map(c => c.y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    return { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 }
  }

  /** Compare deux formes par hauteur, pour trier par hauteur décroissante. */
  static comparerHauteur(a: Form, b: Form): number {
    return Geometrie.etendue(b).h - Geometrie.etendue(a).h
  }

  /** Essaie 0°, puis 90°, puis 180° jusqu'à ce que la forme rentre dans un
   *  espace de maxW × maxH. Laisse la forme tournée dans l'orientation
   *  gagnante (ou la remet à 0° si aucune ne convient) et retourne ce degré. */
  static essayerOrientations(forme: Form, maxW: number, maxH: number): Degre | null {
    for (const degre of ORIENTATIONS) {
      forme.rotate(degre)
      const e = Geometrie.etendue(forme)
      if (e.w <= maxW && e.h <= maxH) return degre
    }
    forme.rotate(0)
    return null
  }

  /** Déplace la forme pour que son escalier ait son coin bas-gauche au point
   *  (targetX, targetBottomY), sans jamais avoir besoin de savoir quel type de
   *  forme c'est. */
  static placeAt(forme: Form, targetX: number, targetBottomY: number): void {
    forme.position = { x: 0, y: 0 }
    const e = Geometrie.etendue(forme)
    forme.position = {
      x: targetX - e.minX,
      // `rasterize` exclut toujours la rangée pile sur la frontière inférieure
      // continue (test `scanY < hi.y` strict) : la dernière cellule remplie est
      // donc 1 rangée avant `targetBottomY`. On compense ici une fois pour tous
      // les appelants plutôt que de leur faire porter ce détail d'implémentation.
      y: targetBottomY - 1 - e.maxY,
    }
  }
}
