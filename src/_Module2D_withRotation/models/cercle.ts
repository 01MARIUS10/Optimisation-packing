import type { Position, Polygone } from '../types'
import { Form } from './form'

export class Cercle extends Form {
    constructor(
        position: Position, // Centre du cercle
        public rayon: number
    ) {
        super(position);
    }

    public getEspaceOccupe(): Polygone {
        const points: Polygone = [];
        
        // Bornes de balayage vertical (du haut vers le bas du cercle)
        const yDebut = this.position.y - this.rayon;
        const yFin = this.position.y + this.rayon;

        // --- ÉTAPE 1 : Arc Droit (du haut vers le bas) ---
        for (let y = yDebut; y <= yFin; y++) {
            // Distance verticale par rapport au centre du cercle
            const dy = y - this.position.y;
            
            // Calcul de la demi-largeur horizontale à cette hauteur via Pythagore
            const demiLargeur = Math.sqrt(Math.max(0, this.rayon * this.rayon - dy * dy));
            const xDroit = this.position.x + demiLargeur;

            // Création de la marche d'escalier à droite
            points.push({ x: xDroit, y: y });
            if (y < yFin) {
                points.push({ x: xDroit, y: y + 1 });
            }
        }

        // --- ÉTAPE 2 : Arc Gauche (du bas vers le haut pour fermer le polygone) ---
        for (let y = yFin; y >= yDebut; y--) {
            const dy = y - this.position.y;
            const demiLargeur = Math.sqrt(Math.max(0, this.rayon * this.rayon - dy * dy));
            const xGauche = this.position.x - demiLargeur;

            // Création de la marche d'escalier à gauche
            points.push({ x: xGauche, y: y });
            if (y > yDebut) {
                points.push({ x: xGauche, y: y - 1 });
            }
        }

        // --- ÉTAPE 3 : Fermeture stricte du polygone ---
        if (points.length > 0) {
            points.push(points[0]!);
        }

        return points;
    }
}