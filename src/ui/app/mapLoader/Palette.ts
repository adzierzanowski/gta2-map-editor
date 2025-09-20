import { Color } from '../../../lib/gbh/data/Color'
import type { IPaletteBase } from '../../../lib/gbh/data/GtaMap'

export class Palette {
  palb: IPaletteBase
  palx: Uint16Array
  ppal: Uint8Array[]

  constructor(palb: IPaletteBase, palx: Uint16Array, ppal: Uint8Array[]) {
    this.palb = palb
    this.palx = palx
    this.ppal = ppal
  }

  ppalForTile(tileId: number) {
    return this.palx[tileId]
  }

  colorForPpal(ppalId: number, colorId: number) {
    const pageId = Math.floor(ppalId / 64)
    const page = this.ppal[pageId]
    const colorOffset = 4 * (colorId * 64 + ppalId)
    const colorData = page.slice(colorOffset, colorOffset + 4)
    if (colorId > 0) {
      colorData.set([0xff], 3)
    } else {
      colorData.set([0], 3)
    }
    const color: Color = new Color(colorData)
    return color
  }
}
