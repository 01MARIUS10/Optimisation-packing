import { Conteneur } from '../models/conteneur'
import type { Rectangle } from '../models/rectangle'

export function worstFit(rects: Rectangle[], width: number, height: number): Conteneur[] {
  const conteneurs: Conteneur[] = []

  for (const rect of rects) {
    let worstConteneur: Conteneur | null = null
    let worstFreeSpace: Rectangle | null = null

    for (const conteneur of conteneurs) {
      const freeSpace = conteneur.getFreeSpace()

      if (freeSpace !== null && freeSpace.canFit(rect)) {
        if (worstFreeSpace === null || worstFreeSpace.isBetterFitThan(freeSpace)) {
          worstConteneur = conteneur
          worstFreeSpace = freeSpace
        }
      }
    }

    if (worstConteneur !== null) {
      worstConteneur.addRectangle(rect)
    } else {
      const nouveau = new Conteneur(width, height)
      nouveau.addRectangle(rect)
      conteneurs.push(nouveau)
    }
  }

  console.log('ALGO worstFit', conteneurs);
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
