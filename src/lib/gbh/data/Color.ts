export class Color {
  b = 0
  g = 0
  r = 0
  a = 0

  constructor(r: number, g: number, b: number, a: number) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }

  static fromBGRA(data: Uint8Array) {
    const dv = new DataView(data.buffer)
    const b = dv.getUint8(0)
    const g = dv.getUint8(1)
    const r = dv.getUint8(2)
    const a = dv.getUint8(3)
    return new Color(r, g, b, a)
  }

  get rgba(): Uint8ClampedArray {
    return new Uint8ClampedArray([this.r, this.g, this.b, this.a])
  }

  get hex() {
    let r = this.r.toString(16)
    let g = this.g.toString(16)
    let b = this.b.toString(16)
    let a = this.a.toString(16)
    if (r.length < 2) {
      r = '0' + r
    }
    if (g.length < 2) {
      g = '0' + g
    }
    if (b.length < 2) {
      b = '0' + b
    }
    if (a.length < 2) {
      a = '0' + a
    }
    return `#${r}${g}${b}${a}`
  }
}
