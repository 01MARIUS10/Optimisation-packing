import { Conteneur } from '../models/conteneur'
import type { Rectangle } from '../models/rectangle'

interface Shelf {
  y: number
  height: number
  usedWidth: number
}

/** First-Fit Decreasing Height : trie par hauteur décroissante, puis place chaque
 *  rectangle dans la première étagère existante où il rentre en largeur, sinon
 *  ouvre une nouvelle étagère. Le tri garantit que la hauteur d'un rectangle est
 *  toujours ≤ la hauteur de n'importe quelle étagère déjà ouverte. */
export function ffdh(rects: Rectangle[], width: number, height: number): Conteneur {
  const conteneur = new Conteneur(width, height)
  const sorted = [...rects].sort((a, b) => b.shape.h - a.shape.h)
  const shelves: Shelf[] = []

  for (const rect of sorted) {
    const { w, h } = rect.shape
    if (w > width) continue

    //parcours tout les etages ouverts
    const shelf = shelves.find(s => s.usedWidth + w <= width)
    if (shelf) {
      //placer dans le premier libre
      conteneur.placeFromBottomLeft({ x: shelf.usedWidth, y: shelf.y }, rect)
      shelf.usedWidth += w
      continue
    }

    //ouvrir un nouvel etage
    const newY = shelves.length ? shelves[shelves.length - 1]!.y + shelves[shelves.length - 1]!.height : 0
    if (newY + h > height) continue
    
    shelves.push({ y: newY, height: h, usedWidth: w })
    conteneur.placeFromBottomLeft({ x: 0, y: newY }, rect)
  }
  
  console.log('ALGO FFDH', conteneur);
  conteneur.rects.forEach((r, index) => {
    console.log(`=== Rectangle ${index + 1} ===`);
    console.table({
      w: r.shape.w,
      h: r.shape.h,
      x: r.position.x,
      y: r.position.y
    });

  })

  return conteneur
}
