import { Conteneur } from '../models/conteneur'
import type { Rectangle } from '../models/rectangle'



/** Brute Force (étagères, hauteur décroissante) : parmi toutes les étagères où le
 *  rectangle rentre en largeur, choisit celle qui laisse le moins de largeur
 *  restante, sinon ouvre une nouvelle étagère. */
export function bruteForce(rects: Rectangle[], width: number, height: number): Conteneur {
  let meilleurConteneur = new Conteneur(width, height);
  let maxRectanglesPlaces = -1;
  let maxSurfaceOccupee = -1;

  // Tableau pour suivre quels rectangles ont déjà été traités dans la branche courante
  const utilise = new Array<boolean>(rects.length).fill(false);

  /**
   * Fonction de backtracking explorant les permutations d'insertion
   * @param conteneurActuel L'état du conteneur dans la branche de recherche actuelle
   * @param nbPlaces Nombre de rectangles réussis dans cette branche
   * @param surfaceActuelle Somme des surfaces des rectangles placés
   */
  function explorer(conteneurActuel: Conteneur, nbPlaces: number, surfaceActuelle: number): void {
    // Si cette branche permet de placer plus de rectangles (ou plus de surface en cas d'égalité),
    // on met à jour notre meilleure solution globale.
    if (nbPlaces > maxRectanglesPlaces || (nbPlaces === maxRectanglesPlaces && surfaceActuelle > maxSurfaceOccupee)) {
      maxRectanglesPlaces = nbPlaces;
      maxSurfaceOccupee = surfaceActuelle;
      
      // Sauvegarde d'une copie profonde du conteneur gagnant
      meilleurConteneur = new Conteneur(width, height);
      for (const r of conteneurActuel.rects) {
        meilleurConteneur.placeExisting({ x: r.position.x, y: r.position.y }, r);
      }
    }

    // On parcourt tous les rectangles pour tester le prochain à insérer
    for (let i = 0; i < rects.length; i++) {
      if (utilise[i]) continue;

      const rect = rects[i]!;

      // Tente d'ajouter le rectangle via votre méthode native (First-Fit 2D)
      if (conteneurActuel.addRectangle(rect)) {
        utilise[i] = true;

        // Calcul de la surface du rectangle ajouté
        const surfaceRect = rect.shape.w * rect.shape.h;

        // Exploration récursive avec ce choix
        explorer(conteneurActuel, nbPlaces + 1, surfaceActuelle + surfaceRect);

        // Retour sur trace (backtracking) : on libère le rectangle et l'espace
        utilise[i] = false;
        conteneurActuel.remove(rect.id);
      }
    }
  }

  // Lancement de la recherche exhaustive si la liste n'est pas vide
  if (rects.length > 0) {
    const conteneurDeTravail = new Conteneur(width, height);
    explorer(conteneurDeTravail, 0, 0);
  }

  console.log('ALGO bruteForce', meilleurConteneur);
  return meilleurConteneur;
}
