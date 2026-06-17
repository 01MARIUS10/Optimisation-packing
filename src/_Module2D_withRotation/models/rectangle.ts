import { Form } from './form'
import type { Position, Polygone } from '../types'

// 2. Classe Rectangle
export class Rectangle extends Form {
    constructor(
        position: Position, // Coin inférieur gauche du rectangle
        public largeur: number,
        public hauteur: number
    ) {
        super(position);
    }

    public getEspaceOccupe(): Polygone {
        const points: Polygone = [
            { x: this.position.x,                y: this.position.y },                // 1. Coin Bas-Gauche
            { x: this.position.x + this.largeur, y: this.position.y },                // 2. Coin Bas-Droite
            { x: this.position.x + this.largeur, y: this.position.y - this.hauteur }, // 3. Coin Haut-Droite
            { x: this.position.x,                y: this.position.y - this.hauteur }  // 4. Coin Haut-Gauche
        ];

        // Fermeture stricte du polygone pour le moteur graphique
        if (points.length > 0) {
            points.push(points[0]!);
        }

        return points;
    }
}
