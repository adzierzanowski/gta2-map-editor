export type BlockSide = 'lid' | 'top' | 'left' | 'right' | 'bottom'

export enum BlockArrow {
  GreenLeft,
  GreenRight,
  GreenUp,
  GreenDown,
  RightLeft,
  RightRight,
  RightUp,
  RightDown,
}

export interface IBlockInfo {
  left: number
  right: number
  top: number
  bottom: number
  lid: number
  arrows: number
  slope: number
}

export interface IColumnInfo {
  height: number
  offset: number
  blockIds: Uint32Array
}
