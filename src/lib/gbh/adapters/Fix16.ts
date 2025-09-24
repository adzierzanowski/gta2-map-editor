/**
 * 16-bit fixed point number
 *
 * | 15   | 14-8         | 7-0                           |
 * |------|--------------|-------------------------------|
 * | sign | integer part | fractional part (1/128 steps) |
 */
export class Fix16 {
  raw: number

  constructor(raw: number) {
    this.raw = raw
  }

  asFloat() {
    const sign = this.raw >>> 15
    const frac = this.raw & 0x7f
    const int = (this.raw >>> 7) & ~0x100

    return (sign ? -1 : 1) * (int + frac / 128)
  }

  static fromFloat(flt: number) {
    let raw = 0
    if (flt < 0) {
      raw |= 0x8000
    }

    raw |= Math.floor(flt) << 7
    raw |= 128 * (flt - Math.floor(flt))

    return new Fix16(raw)
  }
}
