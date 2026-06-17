import type { Position, Polygone, Degre } from '../types'
import { Form } from './form'

// 3. Classe TriangleIsocèle
export class TriangleIsocele extends Form {
    // Dimensions telles que construites, indépendantes de la rotation courante
    private readonly baseOriginale: number
    private readonly hauteurOriginale: number

    constructor(
        position: Position, // Milieu de la base du triangle
        public base: number,
        public hauteur: number
    ) {
        super(position);
        this.baseOriginale = base
        this.hauteurOriginale = hauteur
    }

    // Rotation absolue (pas cumulative) : 90° échange base/hauteur (l'empreinte
    // largeur×hauteur s'inverse), 0° et 180° restaurent les dimensions d'origine
    public rotate(degre: Degre): void {
        if (degre === 90) {
            this.base = this.hauteurOriginale
            this.hauteur = this.baseOriginale
        } else {
            this.base = this.baseOriginale
            this.hauteur = this.hauteurOriginale
        }
    }

    public getEspaceOccupe(): Polygone {
        const points: Polygone = [];
        
        // On définit la direction du tracé (on monte en Y vers le sommet, donc y diminue)
        const yBase = this.position.y;
        const ySommet = this.position.y - this.hauteur;
        
        // --- ÉTAPE 1 : Construction de la pente gauche (de la base vers le sommet) ---
        // On parcourt chaque ligne (pixel) du bas vers le haut
        for (let y = yBase; y >= ySommet; y--) {
            // Progression de 0 (base) à 1 (sommet)
            const progression = (yBase - y) / this.hauteur; 
            
            // Largeur de la base à cette hauteur spécifique (se réduit à l'approche du sommet)
            const demiBaseActuelle = (this.base / 2) * (1 - progression);
            
            // Coordonnée X du bord gauche de la marche
            const xGauche = this.position.x - demiBaseActuelle;
            
            // Pour créer l'angle droit de la marche d'escalier,
            // on ajoute le point courant et le point juste au-dessus sur le même axe X
            points.push({ x: xGauche, y: y });
            if (y > ySommet) {
                points.push({ x: xGauche, y: y - 1 });
            }
        }

        // --- ÉTAPE 2 : Construction de la pente droite (du sommet vers la base) ---
        // On redescend du sommet vers la base pour fermer le polygone
        for (let y = ySommet; y <= yBase; y++) {
            const progression = (yBase - y) / this.hauteur;
            const demiBaseActuelle = (this.base / 2) * (1 - progression);
            
            // Coordonnée X du bord droit de la marche
            const xDroit = this.position.x + demiBaseActuelle;
            
            // De la même manière, on dessine la marche droite
            points.push({ x: xDroit, y: y });
            if (y < yBase) {
                points.push({ x: xDroit, y: y + 1 });
            }
        }

        // On ferme le polygone en revenant au tout premier point
        if (points.length > 0) {
            points.push(points[0]!);
        }

        return points;
    }
}