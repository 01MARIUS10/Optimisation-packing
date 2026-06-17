import { Conteneur } from '../models/conteneur'
import type { Rectangle } from '../models/rectangle'

/** Next-Fit Decreasing Height : ne considère jamais que le niveau courant. Un
 *  rectangle qui ne rentre nulle part (ni dans le niveau courant, ni dans un
 *  nouveau niveau faute de hauteur disponible) n'est pas placé. */
export function nfdh(rects: Rectangle[], width: number, height: number): Conteneur {
  const conteneur = new Conteneur(width, height)

  // 1. Trier les rectangles par hauteur décroissante.
  const sorted = [...rects].sort((a, b) => b.shape.h - a.shape.h)

  let niveauY = 0
  let niveauX = 0
  let niveauHeight = 0
  let niveauOuvert = false

  for (const rect of sorted) {
    const { w, h } = rect.shape
    if (w > width) continue

    // completer le niveau courant
    if (niveauOuvert && niveauX + w <= width) {
      conteneur.placeFromBottomLeft({ x: niveauX, y: niveauY }, rect)
      niveauX += w
      continue
    }

    // nouveau niveau 
    const nouveauNiveauY = niveauOuvert ? niveauY + niveauHeight : 0
    if (nouveauNiveauY + h > height) continue

    niveauY = nouveauNiveauY
    niveauHeight = h
    niveauX = 0
    niveauOuvert = true
    conteneur.placeFromBottomLeft({ x: niveauX, y: niveauY }, rect)
    niveauX += w
  }

  console.log('ALGO NFDH', conteneur);
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
