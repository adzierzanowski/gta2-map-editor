import { type IChunkHeader } from '../../../lib/gbh'
import { GtaMap } from './GtaMap'

export interface MapExporterStageInfo {
  progress: number
  status?: string
  stage: string
  details?: string
  start: number
  end?: number
}

export class MapExporter {
  pending = $state(false)
  chunks: Map<string, IChunkHeader> = new Map()
  stages: { [key: string]: MapExporterStageInfo } = $state({})

  async export(map: GtaMap) {
    const header = new Uint8Array(6)

    const te = new TextEncoder()
    te.encodeInto('GBMP', header)
    let dv = new DataView(header.buffer)
    dv.setUint16(4, 500, true)

    const umapHeader = new Uint8Array(8)
    te.encodeInto('UMAP', umapHeader)
    dv = new DataView(umapHeader.buffer)
    dv.setUint32(4, 256 * 256 * 8 * 12, true)

    const umap = new Uint8Array(256 * 256 * 8 * 12)
    dv = new DataView(umap.buffer)

    let offset = 0
    for (let z = 0; z < 8; z++) {
      for (let y = 0; y < 256; y++) {
        for (let x = 0; x < 256; x++) {
          const block = map.blocks.get(JSON.stringify({ x, y, z }))
          if (block) {
            dv.setUint16(offset, block.left, true)
            dv.setUint16(offset + 2, block.right, true)
            dv.setUint16(offset + 4, block.top, true)
            dv.setUint16(offset + 6, block.bottom, true)
            dv.setUint16(offset + 8, block.lid, true)
            dv.setUint8(offset + 10, block.arrows)
            dv.setUint8(offset + 11, block.slope)
          }
          offset += 12
        }
      }
    }

    const zoneHeader = new Uint8Array(8)
    te.encodeInto('ZONE', zoneHeader)

    const zoneData: Uint8Array[] = []
    let zoneSize = 0
    for (const zone of map.zones) {
      const data = new Uint8Array(6 + zone.nameLength)
      const dv = new DataView(data.buffer)
      dv.setUint8(0, zone.zoneType)
      dv.setUint8(1, zone.x)
      dv.setUint8(2, zone.y)
      dv.setUint8(3, zone.w)
      dv.setUint8(4, zone.h)
      dv.setUint8(5, zone.nameLength)

      let offset = 6
      for (const c of zone.name) {
        dv.setInt8(offset++, c.charCodeAt(0))
      }
      zoneSize += offset
      zoneData.push(data)
    }

    dv = new DataView(zoneHeader.buffer)
    dv.setUint32(4, zoneSize, true)

    const blobdata = [header, umapHeader, umap, zoneHeader]
    for (const zone of zoneData) {
      blobdata.push(zone as Uint8Array<ArrayBuffer>)
    }

    return new Blob(blobdata, {
      type: 'application/octet-stream',
    })
  }
}
