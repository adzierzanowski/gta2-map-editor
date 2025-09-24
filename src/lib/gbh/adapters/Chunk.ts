import type { IChunkHeader } from '../types'

export class Chunk implements IChunkHeader {
  name: string
  offset: number
  size: number
  buf: ArrayBufferLike
  dv: DataView
  _localOffset = 0

  get _bufferOffset() {
    return this.offset + this._localOffset
  }

  constructor(c: IChunkHeader, buffer: ArrayBufferLike) {
    this.name = c.name
    this.offset = c.offset
    this.size = c.size
    this.buf = buffer
    this.dv = new DataView(this.buf)
  }

  seek(off = 0, cur = false) {
    if (cur) {
      this._localOffset += off
    } else {
      this._localOffset = off
    }
  }

  get eof() {
    return this._localOffset >= this.size
  }

  u8() {
    const val = this.dv.getUint8(this._bufferOffset)
    this._localOffset += 1
    return val
  }

  u16() {
    const val = this.dv.getUint16(this._bufferOffset, true)
    this._localOffset += 2
    return val
  }

  u32() {
    const val = this.dv.getUint32(this._bufferOffset, true)
    this._localOffset += 4
    return val
  }

  u8arr(length?: number): Uint8Array {
    const arr = new Uint8Array(this.buf, this._bufferOffset, length)
    this._localOffset += arr.byteLength
    return arr
  }

  u16arr(length?: number): Uint16Array {
    const arr = new Uint16Array(this.buf, this._bufferOffset, length)
    this._localOffset += arr.byteLength
    return arr
  }

  u32arr(length?: number): Uint32Array {
    const arr = new Uint32Array(this.buf, this._bufferOffset, length)
    this._localOffset += arr.byteLength
    return arr
  }
}
