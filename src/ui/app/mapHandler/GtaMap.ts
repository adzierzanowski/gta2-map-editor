import type {
  BlockInfo,
  IZoneInfo,
  IAnim,
  ILight,
  MapObject,
  IJunctions,
} from '@lib/gbh'
import type { Palette } from './Palette'
import TileWorker from './tileWorker?worker'
import { Rect, type IRect } from '@lib/geometry'

export class GtaMap {
  blocks: Map<string, BlockInfo> = new Map()
  tiles: Map<number, ImageData> = new Map()
  zones: IZoneInfo[] = []
  palette: Palette
  animations: IAnim[] = []
  lights: ILight[] = []
  tileAtlas = new ImageData(64 * 32, 64 * 32)
  objects: MapObject[] = []
  junctions: IJunctions = {
    junctions: [],
    vSegments: [],
    hSegments: [],
  }

  private _tileWorkers: Worker[] = []
  private _tileResolvers: Map<number, (img: ImageData) => void> = new Map()

  constructor(palette: Palette) {
    this.palette = palette
    for (let i = 0; i < 8; i++) {
      const worker = new TileWorker()
      this._tileWorkers.push(worker)
      worker.addEventListener('message', e => {
        switch (e.data.kind) {
          case 'result':
            const resolver = this._tileResolvers.get(e.data.eid)
            if (resolver) {
              resolver(e.data.img)
              this.tiles.set(e.data.eid, e.data.img)
              this._tileResolvers.delete(e.data.eid)
            }
            break
        }
      })
    }
  }

  lightsForRect(rect_: IRect) {
    const rect = new Rect(rect_)

    return this.lights.filter(l => rect.contains(l.pos))
  }
}
