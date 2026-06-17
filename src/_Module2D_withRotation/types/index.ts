export type Strategy = 'nfdh' | 'ffdh' | 'bf' | 'brute-force'

export interface Position {
  x: number
  y: number
}
export type Polygone = Position[];

export type Degre = 0 | 90 | 180 ;