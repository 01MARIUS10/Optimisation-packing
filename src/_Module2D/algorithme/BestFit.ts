import { Conteneur } from '../models/conteneur'
import type { Rectangle } from '../models/rectangle'

export function bestFit(rects: Rectangle[], width: number, height: number): Conteneur[] {
  const conteneurs: Conteneur[] = []

  for (const rect of rects) {
    let bestConteneur: Conteneur | null = null
    let bestFreeSpace: Rectangle | null = null

    for (const conteneur of conteneurs) {
      const freeSpace = conteneur.getFreeSpace()

      if (freeSpace !== null && freeSpace.canFit(rect)) {
        if (bestFreeSpace === null || freeSpace.isBetterFitThan(bestFreeSpace)) {
          bestConteneur = conteneur
          bestFreeSpace = freeSpace
        }
      }
    }

    if (bestConteneur !== null) {
      bestConteneur.addRectangle(rect)
    } else {
      const nouveau = new Conteneur(width, height)
      nouveau.addRectangle(rect)
      conteneurs.push(nouveau)
    }
  }

  console.log('ALGO bestFit', conteneurs);
  conteneurs.forEach((conteneur, index) => {
    console.log(`=== Conteneur ${index + 1} ===`);

    console.table(
        conteneur.rects.map(r => ({
            w: r.shape.w,
            h: r.shape.h,
            x: r.position.x,
            y: r.position.y
        }))
    );
  });
  return conteneurs
}
