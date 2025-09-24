export interface ISpriteEntry {
  /** Offset relative to the start of the sprite graphics data. */
  ptr: number
  /** Sprite width (even number). */
  w: number
  /** Sprite height (even number). */
  h: number
}

export interface ISpriteBase {
  car: number
  ped: number
  codeObj: number
  mapObj: number
  user: number
  font: number
}

export interface ISpriteData {
  sprb: ISpriteBase
  sprx: ISpriteEntry[]
  sprg: Uint8Array[]
}
