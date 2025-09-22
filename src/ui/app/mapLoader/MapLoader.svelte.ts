import { Chunk, type IChunkHeader } from '../../../lib/gbh'
import { BlockInfo } from '../../../lib/gbh/data/Block'
import { Color } from '../../../lib/gbh/data/Color'
import type { IPaletteBase } from '../../../lib/gbh/data/GtaMap'
import BlockWorker from './blockWorker?worker'
import { GtaMap } from './GtaMap'
import { Palette } from './Palette'
import type { IZoneInfo } from '../../../lib/gbh/data/Zone'
import { DA } from './MeshPoints'
import type { IPoint, IPoint3D } from '../../../lib/geometry'
import { Fix16 } from '../../../lib/gbh/fix16'

export interface MapLoaderStageInfo {
  progress: number
  status?: string
  stage: string
  details?: string
  start: number
  end?: number
}

/**
- [x] DMAP
- [x] ZONE
- [x] ANIM
- [ ] MOBJ
- [ ] LGHT
- [ ] RGEN
 */

export class MapLoader {
  pending = $state(false)
  chunks: Map<string, IChunkHeader> = new Map()
  stages: { [key: string]: MapLoaderStageInfo } = $state({})
  tileEids: Set<number> = new Set()

  async parseHeaders(data: Uint8Array) {
    const dv = new DataView(data.buffer)

    const fileHeaderName = [0, 0, 0, 0]
      .map((_, i) => String.fromCharCode(dv.getUint8(i)))
      .join('')
    const fileVersion = dv.getUint16(4, true)
    let offset = 6

    while (offset < data.byteLength) {
      const chunk: IChunkHeader = {
        name: [0, 0, 0, 0]
          .map((_, i) => String.fromCharCode(dv.getUint8(offset + i)))
          .join(''),
        offset: offset + 8,
        size: dv.getUint32(offset + 4, true),
      }
      console.log(chunk.name)
      this.chunks.set(chunk.name, chunk)
      offset += 8 + chunk.size
    }
  }

  async loadDefault() {
    this.pending = true

    const styBytes = await (await fetch('/ste.sty')).bytes()
    const gmpBytes = await (await fetch('/ste.gmp')).bytes()

    const styBuf = new SharedArrayBuffer(styBytes.byteLength)
    const gmpBuf = new SharedArrayBuffer(gmpBytes.byteLength)

    const sty = new Uint8Array(styBuf)
    sty.set(styBytes)
    const gmp = new Uint8Array(gmpBuf)
    gmp.set(gmpBytes)

    return await this.load(sty, gmp)
  }

  async load(styRaw: Uint8Array, gmpRaw: Uint8Array) {
    await this.parseHeaders(styRaw)
    await this.parseHeaders(gmpRaw)

    const pal = await this.loadPalette(styRaw.buffer)
    const map = new GtaMap(pal)

    await Promise.all([
      this.loadBlocks(map, gmpRaw.buffer),
      this.loadTiles(map, styRaw.buffer),
      this.loadZones(map, gmpRaw.buffer),
      this.loadAnims(map, gmpRaw.buffer),
      this.loadLights(map, gmpRaw.buffer),
      this.loadObjects(map, gmpRaw.buffer),
    ])

    const cvs = new OffscreenCanvas(32 * 64, 32 * 64)
    const ctx = cvs.getContext('2d')!
    for (let i = 1; i < map.tiles.size; i++) {
      const img = map.tiles.get(i)
      if (img) {
        ctx.putImageData(img, (i % 32) * 64, Math.floor(i / 32) * 64)
      }
    }
    map.tileAtlas = ctx.getImageData(0, 0, cvs.width, cvs.height)

    const stage = $state({
      progress: 0,
      stage: 'Working',
      start: performance.now(),
    })

    stage.stage = 'Done'

    this.pending = false

    return map
  }

  getChunk(name: string, buf: ArrayBufferLike) {
    const chunkHeader = this.chunks.get(name)
    if (!chunkHeader) {
      throw new Error(`No ${name} chunk found`)
    }
    return new Chunk(chunkHeader, buf)
  }

  async loadBlocks(map: GtaMap, buf: ArrayBufferLike) {
    const stage: MapLoaderStageInfo = $state({
      stage: 'Loading',
      progress: 0,
      start: performance.now(),
    })
    this.stages['Blocks'] = stage

    return await new Promise<void>(resolve => {
      const chunk = this.getChunk('DMAP', buf)
      const worker = new BlockWorker()
      const onMessage = (e: MessageEvent) => {
        if (e.data.kind === 'progress') {
          stage.progress = e.data.progress
        } else if (e.data.kind === 'block') {
          map.blocks.set(e.data.pos, new BlockInfo(e.data.block))
        } else if (e.data.kind === 'tile') {
          this.tileEids.add(e.data.eid)
        } else if (e.data.kind === 'done') {
          stage.end = performance.now()
          stage.stage = 'Done'

          worker.removeEventListener('message', onMessage)
          resolve()
        }
      }
      worker.addEventListener('message', onMessage)
      worker.postMessage({ kind: 'loadBlocks', buf, chunk })
    })
  }

  async loadPalette(buf: ArrayBufferLike): Promise<Palette> {
    const stage: MapLoaderStageInfo = $state({
      stage: 'Loading Bases',
      progress: 0,
      start: performance.now(),
    })

    this.stages['Palettes'] = stage

    let chunk = this.getChunk('PALB', buf)
    const tile = chunk.u16()
    const sprite = chunk.u16()
    const carRemap = chunk.u16()
    const pedRemap = chunk.u16()
    const codeObjRemap = chunk.u16()
    const mapObjRemap = chunk.u16()
    const userRemap = chunk.u16()
    const fontRemap = chunk.u16()
    const palb: IPaletteBase = {
      carRemap,
      codeObjRemap,
      fontRemap,
      mapObjRemap,
      pedRemap,
      sprite,
      tile,
      userRemap,
    }

    stage.stage = 'Loading Palette Index'
    chunk = this.getChunk('PALX', buf)
    const palxBuf = new SharedArrayBuffer(chunk.size)
    const palx = new Uint16Array(palxBuf)
    let i = 0
    while (!chunk.eof) {
      palx[i] = chunk.u16()
      i++
      stage.progress = chunk._localOffset / chunk.size
    }

    const ppal: Uint8Array[] = []
    stage.stage = 'Loading Palette Pages'
    chunk = this.getChunk('PPAL', buf)
    while (!chunk.eof) {
      stage.progress = chunk._localOffset / chunk.size
      ppal.push(chunk.u8arr(0x10000))
    }

    stage.progress = 1
    stage.end = performance.now()
    stage.stage = 'Done'
    return new Palette(palb, palx, ppal)
  }

  async loadTiles(map: GtaMap, buf: ArrayBufferLike) {
    const stage: MapLoaderStageInfo = $state({
      stage: 'Loading Tile Data',
      progress: 0,
      start: performance.now(),
    })
    this.stages['Tiles'] = stage

    const chunk = this.getChunk('TILE', buf)
    const arr = chunk.u8arr()
    let page = arr.subarray(0, 0x10000)

    let tileId = 0
    let offset = 0

    while (offset < chunk.size) {
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          const imgData = new ImageData(64, 64)
          const ppalId = map.palette.ppalForTile(tileId)

          const tileOffset = y * 256 * 64 + x * 64
          for (let line = 0; line < 64; line++) {
            const lineOffset = tileOffset + line * 256
            for (let i = 0; i < 64; i++) {
              const x = page.subarray(lineOffset)[i]
              const color = map.palette.colorForPpal(ppalId, x)
              imgData.data.set(color.rgba, line * 64 * 4 + i * 4)
            }
          }
          map.tiles.set(tileId, imgData)
          tileId++
        }
      }
      stage.progress = offset / chunk.size
      await new Promise(resolve => setTimeout(resolve, 0))

      offset += 0x10000
      page = arr.subarray(offset, offset + 0x10000)
    }

    stage.end = performance.now()
    stage.progress = 1
    stage.stage = 'Done'
  }

  async loadZones(map: GtaMap, buf: ArrayBufferLike) {
    const stage: MapLoaderStageInfo = $state({
      stage: 'Loading Zones',
      progress: 0,
      start: performance.now(),
    })
    this.stages['Zones'] = stage

    const chunk = this.getChunk('ZONE', buf)

    while (!chunk.eof) {
      const zoneType = chunk.u8()
      const x = chunk.u8()
      const y = chunk.u8()
      const w = chunk.u8()
      const h = chunk.u8()
      const nameLength = chunk.u8()
      const td = new TextDecoder()
      const name = td.decode(chunk.u8arr(nameLength).slice())

      const zone: IZoneInfo = {
        zoneType,
        h,
        name,
        nameLength,
        w,
        x,
        y,
      }
      map.zones.push(zone)
    }
    console.log(map.zones)

    stage.end = performance.now()
    stage.progress = 1
    stage.stage = 'Done'
  }

  async loadAnims(map: GtaMap, buf: ArrayBufferLike) {
    const stage: MapLoaderStageInfo = $state({
      stage: 'Loading Animations',
      progress: 0,
      start: performance.now(),
    })
    this.stages['Anims'] = stage

    const chunk = this.getChunk('ANIM', buf)

    while (!chunk.eof) {
      const base = chunk.u16()
      const frameRate = chunk.u8()
      const repeat = chunk.u8()
      const length = chunk.u8()
      chunk.u8() // unused field
      const tiles = []
      for (let i = 0; i < length; i++) {
        tiles.push(chunk.u16())
      }

      map.animations.push({ base, frameRate, length, repeat, tiles })
      stage.progress = chunk._localOffset / chunk.size
    }

    stage.end = performance.now()
    stage.progress = 1
    stage.stage = 'Done'
  }

  async loadLights(map: GtaMap, buf: ArrayBufferLike) {
    const stage: MapLoaderStageInfo = $state({
      stage: 'Loading Lights',
      progress: 0,
      start: performance.now(),
    })
    this.stages['Light'] = stage

    const chunk = this.getChunk('LGHT', buf)

    while (!chunk.eof) {
      const b = chunk.u8()
      const g = chunk.u8()
      const r = chunk.u8()
      const a = chunk.u8()
      const color = new Color(r, g, b, a)

      const xFix = new Fix16(chunk.u16())
      const yFix = new Fix16(chunk.u16())
      const zFix = new Fix16(chunk.u16())
      const rFix = new Fix16(chunk.u16())

      const pos: IPoint3D = {
        x: xFix.asFloat(),
        y: yFix.asFloat(),
        z: zFix.asFloat(),
      }

      const radius = rFix.asFloat()
      const intensity = chunk.u8()
      const shape = chunk.u8()
      const onTime = chunk.u8()
      const offTime = chunk.u8()

      map.lights.push({ color, intensity, offTime, onTime, pos, radius, shape })
      stage.progress += chunk._localOffset / chunk.size
    }
    console.log(map.lights)

    stage.end = performance.now()
    stage.progress = 1
    stage.stage = 'Done'
  }

  async loadObjects(map: GtaMap, buf: ArrayBufferLike) {
    const stage: MapLoaderStageInfo = $state({
      stage: 'Loading Map Objects',
      progress: 0,
      start: performance.now(),
    })
    this.stages['Objects'] = stage

    const chunk = this.getChunk('MOBJ', buf)

    while (!chunk.eof) {
      const xFix = new Fix16(chunk.u16())
      const yFix = new Fix16(chunk.u16())
      const angle = chunk.u8()
      const type = chunk.u8()
      const pos: IPoint = { x: xFix.asFloat(), y: yFix.asFloat() }

      map.objects.push({ angle, pos, type })
      stage.progress += chunk._localOffset / chunk.size
    }

    console.log(map.objects)

    stage.end = performance.now()
    stage.progress = 1
    stage.stage = 'Done'
  }
}
