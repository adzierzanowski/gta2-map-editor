import { Point } from './Point'
import type { IPoint, IPoint3D, IRect } from './types'

export class Rect implements IRect {
  x: number
  y: number
  w: number
  h: number

  constructor(r: IRect) {
    this.x = r.x
    this.y = r.y
    this.w = r.w
    this.h = r.h
  }

  translated(p: IPoint) {
    const r = new Rect(this)
    r.x += p.x
    r.y += p.y
    return r
  }

  scaled(factor: number) {
    return this.with({
      x: this.x * factor,
      y: this.y * factor,
      w: this.w * factor,
      h: this.h * factor,
    })
  }

  with(r: Partial<IRect>) {
    r.x ??= this.x
    r.y ??= this.y
    r.w ??= this.w
    r.h ??= this.h
    return new Rect(r as IRect)
  }

  /** Constrains the Rect not to overflow outside of the given one */
  clamp(constraint: IRect) {
    if (this.x < constraint.x) {
      this.x = constraint.x
    }

    if (this.x + this.w >= constraint.x + constraint.w) {
      this.x = constraint.w - this.w
    }

    if (this.y < constraint.y) {
      this.y = constraint.y
    }

    if (this.y + this.h >= constraint.y + constraint.h) {
      this.y = constraint.h - this.h
    }

    return this
  }

  equals(rect: IRect) {
    return (
      this.x === rect.x &&
      this.y === rect.y &&
      this.w === rect.w &&
      this.h === rect.h
    )
  }

  map<T>(cb: (p: Point, i: number) => T) {
    const out: T[][] = []

    let i = 0
    for (let dy = 0; dy < this.h; dy++) {
      const row: T[] = []
      for (let dx = 0; dx < this.w; dx++) {
        row.push(cb(new Point({ x: dx, y: dy }), i))
        i++
      }
      out.push(row)
    }

    return out
  }

  intersection(r: IRect): Rect {
    const x = Math.max(this.x, r.x)
    const y = Math.max(this.y, r.y)
    const b = Math.min(this.y + this.h, r.y + r.h)
    const right = Math.min(this.x + this.w, r.x + r.w)
    return new Rect({ x, y, w: right - x, h: b - y })
  }

  contains(p: IPoint) {
    return (
      p.x >= this.x &&
      p.x < this.x + this.w &&
      p.y >= this.y &&
      p.y < this.y + this.h
    )
  }

  flatMap<T>(cb: (p: Point, i: number) => T) {
    return this.map(cb).flat(1)
  }

  get pos() {
    return new Point(this)
  }

  get empty() {
    return this.w <= 0 || this.h <= 0
  }

  toString() {
    return `${this.w}×${this.h}+` + this.pos.toString()
  }

  get points() {
    const pts: Set<Point> = new Set()
    for (let y = this.y; y < this.y + this.h; y++) {
      for (let x = this.x; x < this.x + this.w; x++) {
        pts.add(new Point({ x, y }))
      }
    }
    return pts
  }

  points3d(zMin: number, zMax: number): Set<IPoint3D> {
    const pts: Set<IPoint3D> = new Set()
    for (let y = this.y; y < this.y + this.h; y++) {
      for (let x = this.x; x < this.x + this.w; x++) {
        for (let z = zMin; z <= zMax; z++) {
          pts.add({ x, y, z })
        }
      }
    }
    return pts
  }
}
