import type { IBlockInfo } from '../types'
import { TileInfo } from './Tile'

export class BlockTileInfo extends TileInfo {
  eid: number

  constructor(eid: number) {
    super(eid)
    this.eid = eid
  }

  /**
   * Indicates whether or not a car, ped or object
   * should collide with this tile.
   *
   * **Side only**
   * */
  get wall() {
    return !!(this.eid & (1 << 10))
  }

  /**
   * Indicates whether or not a bullet should collide with this tile.
   *
   * **Side only**
   */
  get bulletWall() {
    return !!(this.eid & (1 << 11))
  }

  /**
   * Shading level to apply to a lid tile.
   * 0 is normal brightness. 1-3 are increasing levels of darkness.
   *
   * **Lid only**
   */
  get lightLevel() {
    return (this.eid >> 10) & 3
  }
}

export class BlockInfo implements IBlockInfo {
  left: number
  right: number
  top: number
  bottom: number
  lid: number
  arrows: number
  slope: number
  tiles: { [key: string]: BlockTileInfo }

  constructor({ arrows, bottom, left, lid, right, slope, top }: IBlockInfo) {
    this.arrows = arrows
    this.bottom = bottom
    this.left = left
    this.lid = lid
    this.right = right
    this.slope = slope
    this.top = top
    this.tiles = {
      top: new BlockTileInfo(this.top),
      left: new BlockTileInfo(this.left),
      right: new BlockTileInfo(this.right),
      bottom: new BlockTileInfo(this.bottom),
      lid: new BlockTileInfo(this.lid),
    }
  }

  get empty() {
    return [this.lid, this.bottom, this.right, this.top, this.left].every(
      x => x === 0,
    )
  }

  get groundType() {
    switch (this.slope & 3) {
      case 0:
        return 'Air'
      case 1:
        return 'Road'
      case 2:
        return 'Pavement'
      case 3:
        return 'Field'
    }
  }

  get slopeType() {
    return this.slope >> 2
  }

  with({
    arrows,
    bottom,
    left,
    lid,
    right,
    slope,
    top,
  }: Partial<IBlockInfo>): BlockInfo {
    const newInfo: IBlockInfo = {
      arrows: arrows ?? this.arrows,
      bottom: bottom ?? this.bottom,
      top: top ?? this.top,
      left: left ?? this.left,
      right: right ?? this.right,
      lid: lid ?? this.lid,
      slope: slope ?? this.slope,
    }
    return new BlockInfo(newInfo)
  }

  // set slopeType(value: number) {
  //   this.slope = (this.slope & 3) | (value << 2)
  // }
}
