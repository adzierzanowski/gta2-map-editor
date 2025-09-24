import type { IChunkHeader } from '@lib/gbh'
import type { GtaMap } from './GtaMap'

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
    const header = await this.encodeFileHeader()
    const umap = await this.encodeUMAP(map)
    const zone = await this.encodeZONE(map)
    // const anim = await this.encodeANIM(map)

    const blobdata = [header, umap, zone]

    return new Blob(blobdata, {
      type: 'application/octet-stream',
    })
  }

  async encodeFileHeader() {
    const header = new Uint8Array(6)
    const te = new TextEncoder()
    te.encodeInto('GBMP', header)
    let dv = new DataView(header.buffer)
    dv.setUint16(4, 500, true)
    return header
  }

  async encodeChunk(chunkName: string, chunkData: Uint8Array) {
    const te = new TextEncoder()
    const chunk = new Uint8Array(8 + chunkData.byteLength)
    te.encodeInto(chunkName, chunk)
    const dv = new DataView(chunk.buffer)
    dv.setUint32(4, chunkData.byteLength, true)
    chunk.set(chunkData, 8)
    return chunk
  }

  async encodeUMAP(map: GtaMap) {
    const umap = new Uint8Array(256 * 256 * 8 * 12)
    const dv = new DataView(umap.buffer)

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
    return this.encodeChunk('UMAP', umap)
  }

  async encodeZONE(map: GtaMap) {
    const size = map.zones.map(z => z.nameLength + 6).reduce((a, b) => a + b)
    const zoneData = new Uint8Array(size)
    const dv = new DataView(zoneData.buffer)
    let offset = 0

    for (const zone of map.zones) {
      dv.setUint8(offset + 0, zone.zoneType)
      dv.setUint8(offset + 1, zone.x)
      dv.setUint8(offset + 2, zone.y)
      dv.setUint8(offset + 3, zone.w)
      dv.setUint8(offset + 4, zone.h)
      dv.setUint8(offset + 5, zone.nameLength)
      offset += 6
      for (const c of zone.name) {
        dv.setInt8(offset++, c.charCodeAt(0))
      }
    }
    return this.encodeChunk('ZONE', zoneData)
  }

  async encodeANIM(map: GtaMap) {
    const size = map.animations
      .map(a => a.length * 2 + 6)
      .reduce((a, b) => a + b)
    const animData = new Uint8Array(size)
    const dv = new DataView(animData.buffer)
    let offset = 0

    for (const anim of map.animations) {
      // console.log(anim)
      dv.setUint16(offset + 0, anim.base, true)
      dv.setUint8(offset + 2, anim.frameRate)
      dv.setUint8(offset + 3, anim.length)
      dv.setUint8(offset + 4, anim.repeat)
      offset += 6
      for (const tile of anim.tiles) {
        dv.setUint16(offset, tile, true)
        offset += 2
      }
    }
    // console.log(animData)

    return this.encodeChunk('ANIM', animData)
  }
}
