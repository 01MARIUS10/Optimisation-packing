
import type { Position, Polygone,Degre } from '../types'
import { getRandomColor } from '../../helpers/color'


// Le polygone représente la liste ordonnée des points reliés en trait

// 1. Classe de base abstraite
export abstract class Form {
    public position: Position
    public id = crypto.randomUUID();
    public fill = getRandomColor()

    constructor(position: Position) {
        this.position = position
    }

    // Chaque forme doit définir la zone qu'elle occupe
    //c'est comme une
    public abstract getEspaceOccupe(): Polygone;
    public abstract rotate(degre: Degre): void
}