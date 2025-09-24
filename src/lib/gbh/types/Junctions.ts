export interface ISegment {
  junction1: number
  junction2: number
  xMin: number
  yMin: number
  xMax: number
  yMax: number
}

export interface ILink {
  junctionId: number
  arrows: number
}

export interface IJunction {
  north: ILink
  south: ILink
  east: ILink
  west: ILink

  /** This seems to always be 01 00 00 00 */
  // jType: never

  xMin: number
  yMin: number
  xMax: number
  yMax: number
}

export interface IJunctions {
  junctions: IJunction[]
  hSegments: ISegment[]
  vSegments: ISegment[]
}
