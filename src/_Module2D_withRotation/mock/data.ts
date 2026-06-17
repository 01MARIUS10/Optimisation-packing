import { Form } from '../models/form';
import { Rectangle } from '../models/rectangle';
import { TriangleIsocele } from '../models/triangleIsocele';
import { Cercle } from '../models/cercle';

// Une collection variée et équilibrée de formes géométriques discrétisées
export const MOCK_FORMS: Form[] = [
    new Rectangle({ x: 30, y: 120 }, 180, 80),
    new Rectangle({ x: 280, y: 70 }, 50, 50),
    new Rectangle({ x: 480, y: 220 }, 70, 140),
    new TriangleIsocele({ x: 150, y: 350 }, 120, 160),
    new TriangleIsocele({ x: 360, y: 440 }, 160, 40),
    new TriangleIsocele({ x: 520, y: 100 }, 60, 60),
    new Cercle({ x: 380, y: 220 }, 65),
    new Cercle({ x: 60, y: 420 }, 30),
    new Cercle({ x: 420, y: 60 }, 40)
];


export const containerWidth = 640;
export const containerHeight = 480;