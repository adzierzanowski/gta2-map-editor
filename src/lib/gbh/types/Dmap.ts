import type { IBlockInfo } from './Block'

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
