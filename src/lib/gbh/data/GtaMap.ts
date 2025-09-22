import type { IBlockInfo } from './Block'

export interface IPaletteBase {
  tile: number
  sprite: number
  carRemap: number
  pedRemap: number
  codeObjRemap: number
  mapObjRemap: number
  userRemap: number
  fontRemap: number
}

export interface ISpriteBase {
  car: number
  ped: number
  codeObj: number
  mapObj: number
  user: number
  font: number
}

export interface ISpriteEntry {
  /** Offset relative to the start of the sprite graphics data. */
  ptr: number
  /** Sprite width (even number). */
  w: number
  /** Sprite height (even number). */
  h: number
}

export interface ISpriteData {
  sprb: ISpriteBase
  sprx: ISpriteEntry[]
  sprg: Uint8Array[]
}

export interface IPaletteData {
  palb: IPaletteBase
  palx: Uint16Array
  ppal: Uint8Array[]
}

export interface IDmap {
  /**
   * Linear mapping of the position on the map to columns of blocks the map is
   * made of.
   * */
  base: Uint32Array

  /** Number of the raw 32-bit words that column entries are made of. */
  columnSize: number

  /**
   * Raw data representing vertically stacked collection of blocks
   * */
  columns: Uint32Array

  /** Number of block definitions in the `blocks` */
  blockCount: number

  /** Single "map voxel" definition (ground type, slope type, textures) */
  blocks: IBlockInfo[]
}
