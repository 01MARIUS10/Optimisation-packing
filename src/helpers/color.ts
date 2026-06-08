const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']

export function getRandomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)] ?? '#3b82f6'
}
