import { Form } from './form'
import type { Position, Polygone, Degre } from '../types'

// 2. Classe Rectangle
export class Rectangle extends Form {
    // Dimensions telles que construites, indépendantes de la rotation courante
    private readonly largeurOriginale: number
    private readonly hauteurOriginale: number

    constructor(
        position: Position, // Coin inférieur gauche du rectangle
        public largeur: number,
        public hauteur: number
    ) {
        super(position);
        this.largeurOriginale = largeur
        this.hauteurOriginale = hauteur
    }

    // Rotation absolue (pas cumulative) : 90° échange largeur/hauteur,
    // 0° et 180° donnent la même empreinte pour un rectangle axé sur les axes
    public rotate(degre: Degre): void {
        if (degre === 90) {
            this.largeur = this.hauteurOriginale
            this.hauteur = this.largeurOriginale
        } else {
            this.largeur = this.largeurOriginale
            this.hauteur = this.hauteurOriginale
        }
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
