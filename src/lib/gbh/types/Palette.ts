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

export interface IPaletteData {
  palb: IPaletteBase
  palx: Uint16Array
  ppal: Uint8Array[]
}
