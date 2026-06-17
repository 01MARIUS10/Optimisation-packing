export interface Position {
  x: number
}

export interface SegmentShape {
  w: number
}

export type Strategy = 'first-fit' | 'best-fit' | 'worst-fit' | 'brute-force'

export interface SegmentLike {
  id: string
  position: Position
  shape: SegmentShape
  fill: string
}
