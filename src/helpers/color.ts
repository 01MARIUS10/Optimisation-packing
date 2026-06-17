
const COLORS = [
    '#ef4444', // rouge
    '#3b82f6', // bleu
    '#22c55e', // vert
    '#f59e0b', // orange
    '#8b5cf6', // violet
    '#ec4899', // rose
    '#06b6d4', // cyan

    '#14b8a6', // teal
    '#84cc16', // lime
    '#eab308', // jaune
    '#f97316', // orange foncé
    '#d946ef', // fuchsia
    '#6366f1', // indigo
    '#0ea5e9', // sky
    '#10b981', // emerald
    '#a855f7', // purple
    '#f43f5e', // rose foncé
    '#64748b', // slate
    '#78716c', // stone
    '#a16207', // amber foncé
    '#15803d', // vert foncé
    '#1d4ed8', // bleu foncé
    '#7c3aed', // violet foncé
    '#be123c', // rouge bordeaux
    '#0891b2', // cyan foncé
    '#65a30d', // olive
    '#c2410c'  // orange brun
];
export function getRandomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)] ?? '#3b82f6'
}
