const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function generateId(): string {
  const a = LETTERS[Math.floor(Math.random() * LETTERS.length)]
  const b = LETTERS[Math.floor(Math.random() * LETTERS.length)]
  const n = Math.floor(Math.random() * 10)
  return `${a}${b}${n}`
}
