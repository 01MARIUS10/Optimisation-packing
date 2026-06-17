export interface RectangleShape {
  w: number
  h: number
}

export interface Position {
  x: number
  y: number
}

export type Strategy = 'nfdh' | 'ffdh' | 'bf' | 'brute-force'

export interface RectangleLike {
  id: string
  position: Position
  shape: RectangleShape
  fill: string
}
