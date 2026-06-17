import { Conteneur } from '../models/conteneur'
import type { Segment } from '../models/segment'


export function bruteForce(segments: Segment[], conteneurLength: number): Conteneur[] {
  const conteneurs: Conteneur[] = []

  // Stocke la meilleure configuration finale trouvée
  let meilleureConfiguration: Conteneur[] = [];
  // Initialise le record avec le pire cas théorique (1 conteneur par segment)
  let minConteneurs = segments.length + 1; 

  /**
   * Fonction récursive de backtracking
   * @param indexEnCours Index du segment que l'on cherche à placer
   * @param conteneursActuels Liste des conteneurs ouverts dans la branche de recherche actuelle
   */
  function explorer(indexEnCours: number, conteneursActuels: Conteneur[]): void {
    // Élagage : si on utilise déjà autant ou plus de conteneurs que le record, on arrête cette branche
    if (conteneursActuels.length >= minConteneurs) {
      return;
    }

    // Condition d'arrêt : tous les segments ont été placés avec succès
    if (indexEnCours === segments.length) {
      if (conteneursActuels.length < minConteneurs) {
        minConteneurs = conteneursActuels.length;
        // Sauvegarde d'une copie profonde de l'état des conteneurs gagnants
        meilleureConfiguration = conteneursActuels.map(c => {
          const copieConteneur = new Conteneur(conteneurLength);
          for (const s of c.segments) {
            copieConteneur.placeExisting({ x: s.position.x }, s);
          }
          return copieConteneur;
        });
      }
      return;
    }

    const segmentActuel = segments[indexEnCours]!;

    // OPTION A : Tenter de placer le segment dans un conteneur existant
    for (let i = 0; i < conteneursActuels.length; i++) {
      const conteneur = conteneursActuels[i]!;
      
      // Tente d'ajouter le segment (la méthode gère la première position X valide)
      if (conteneur.addSegment(segmentActuel)) {
        // Succès : on passe au segment suivant
        explorer(indexEnCours + 1, conteneursActuels);
        // Retour sur trace : on retire le segment pour tester d'autres combinaisons
        conteneur.remove(segmentActuel.id);
      }
    }

    // OPTION B : Ouvrir un nouveau conteneur pour ce segment (si on ne dépasse pas le record)
    if (conteneursActuels.length + 1 < minConteneurs) {
      const nouveauConteneur = new Conteneur(conteneurLength);
      
      if (nouveauConteneur.addSegment(segmentActuel)) {
        conteneursActuels.push(nouveauConteneur);
        explorer(indexEnCours + 1, conteneursActuels);
        // Retour sur trace : on retire le conteneur vide créé pour cette branche
        conteneursActuels.pop();
      }
    }
  }

  // Optionnel mais hautement recommandé pour la force brute :
  // Trier les segments par taille décroissante accélère drastiquement l'élagage (Pruning)
  const segmentsTries = [...segments].sort((a, b) => b.shape.w - a.shape.w);

  // Lancement de la recherche exhaustive
  if (segmentsTries.length > 0) {
    explorer(0, []);
  }

  console.log('ALGO bruteForce', meilleureConfiguration);
  return meilleureConfiguration
}

