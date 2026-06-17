import { Conteneur } from '../models/conteneur'
import type { Rectangle } from '../models/rectangle'

export function firstFit(rects: Rectangle[], width: number, height: number): Conteneur[] {
  const conteneurs: Conteneur[] = []

  for (const rect of rects) {
    let placed = false

    for (const conteneur of conteneurs) {
      const freeSpace = conteneur.getFreeSpace()

      if (freeSpace !== null && freeSpace.canFit(rect)) {
        conteneur.addRectangle(rect)
        placed = true
        break
      }
    }

    if (!placed) {
      const nouveau = new Conteneur(width, height)
      nouveau.addRectangle(rect)
      conteneurs.push(nouveau)
    }
  }

  console.log('ALGO firstFit', conteneurs);
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
