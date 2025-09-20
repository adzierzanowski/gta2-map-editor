export type TileLike = TileInfo | number | ITile

export interface ITile {
  id: number
  raw: Uint8Array
}

export class TileInfo {
  eid: number

  /**
   * The ID of the tile in the STY file.
   * A value of 0 means leave it blank.
   * 992-1022 are reserved for internal use by the game engine.
   * 1023 is used as a dummy tile number to mark 3-sided diagonal slopes.
   */
  get id() {
    return this.eid & 0x3ff
  }

  /**
   * If true, the tile gets drawn transparently,
   * and (except for a lid) the tile opposite is used
   * as the graphic for the reverse side.
   * If both matching sides of a block (i.e. top/bottom or left/right) are flat,
   * then both tiles are drawn at both positions.
   */
  get flat() {
    return !!(this.eid & (1 << 12))
  }

  /**
   * Indicates whether or not this tile is to be drawn flipped left to right.
   */
  get flip() {
    return !!(this.eid & (1 << 13))
  }

  /**
   * Rotation level of the tile.
   * * 0 = no rotation
   * * 1 = 90 deg.
   * * 2 = 180 deg.
   * * 3 = 270 deg.
   * */
  get rotation() {
    return this.eid >> 14
  }

  /**
   * Rotation of the tile expressed in radians.
   */
  get radians() {
    return (Math.PI * this.rotation * 90) / 180
  }

  constructor(eid: number) {
    this.eid = eid
  }

  static fromValues(id: number, flat = false, flip = false, rotation = 0) {
    let eid = id
    if (flat) {
      eid |= 1 << 12
    }
    if (flip) {
      eid |= 1 << 13
    }
    eid |= rotation << 14
    return new TileInfo(eid)
  }
}
