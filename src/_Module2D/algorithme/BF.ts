import { Conteneur } from '../models/conteneur'
import type { Rectangle } from '../models/rectangle'

interface Shelf {
  y: number
  height: number
  usedWidth: number
}

/** Best-Fit (étagères, hauteur décroissante) : parmi toutes les étagères où le
 *  rectangle rentre en largeur, choisit celle qui laisse le moins de largeur
 *  restante, sinon ouvre une nouvelle étagère. */
export function bf(rects: Rectangle[], width: number, height: number): Conteneur {
  const conteneur = new Conteneur(width, height)
  const sorted = [...rects].sort((a, b) => b.shape.h - a.shape.h)
  const shelves: Shelf[] = []

  for (const rect of sorted) {
    const { w, h } = rect.shape
    if (w > width) continue

    let bestShelf: Shelf | null = null
    //parcours tout les etages ouverts
    for (const shelf of shelves) {
      if (shelf.usedWidth + w > width) continue
      if (bestShelf === null || shelf.usedWidth > bestShelf.usedWidth) {
        //le plus petit reste
        bestShelf = shelf
      }
    }

    if (bestShelf) {
      conteneur.placeFromBottomLeft({ x: bestShelf.usedWidth, y: bestShelf.y }, rect)
      bestShelf.usedWidth += w
      continue
    }

    //ouvrir un nouvel etage
    const newY = shelves.length ? shelves[shelves.length - 1]!.y + shelves[shelves.length - 1]!.height : 0
    if (newY + h > height) continue

    shelves.push({ y: newY, height: h, usedWidth: w })
    conteneur.placeFromBottomLeft({ x: 0, y: newY }, rect)
  }

  console.log('ALGO BF', conteneur);
  conteneur.rects.forEach((r, index) => {
    console.log(`=== Rectangle ${index + 1} ===`);
    console.table({
      w: r.shape.w,
      h: r.shape.h,
      x: r.position.x,
      y: r.position.y
    });
  });

  return conteneur
}
