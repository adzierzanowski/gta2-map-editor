import type { Anim } from '../../../lib/gbh/data/Anim'
import type { BlockInfo } from '../../../lib/gbh/data/Block'
import type { ILight } from '../../../lib/gbh/data/Light'
import type { IZoneInfo } from '../../../lib/gbh/data/Zone'
import type { Palette } from './Palette'
import TileWorker from './tileWorker?worker'

export class GtaMap {
  blocks: Map<string, BlockInfo> = new Map()
  tiles: Map<number, ImageData> = new Map()
  zones: IZoneInfo[] = []
  palette: Palette
  animations: Anim[] = []
  lights: ILight[] = []
  tileAtlas = new ImageData(64 * 32, 64 * 32)

  private _tileWorkers: Worker[] = []
  private _tileWorkerPtr: number = 0
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

  async tileImage(eid: number): Promise<ImageData> {
    const cached = this.tiles.get(eid)
    if (cached) {
      return cached
    }

    const img = this.tiles.get(eid & 0x3ff)
    const worker = this._tileWorkers[this._tileWorkerPtr++]
    this._tileWorkerPtr %= this._tileWorkers.length
    if (img) {
      return new Promise(resolve => {
        worker.postMessage({ kind: 'render', eid, img })
        this._tileResolvers.set(eid, resolve)
      })
    }

    return new ImageData(64, 64)
  }
}
