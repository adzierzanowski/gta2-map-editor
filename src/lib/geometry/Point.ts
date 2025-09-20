export interface IPoint {
  x: number
  y: number
}

export interface IPoint3D extends IPoint {
  z: number
}

export class Point implements IPoint {
  x: number = 0
  y: number = 0

  constructor(p: IPoint) {
    this.x = p.x
    this.y = p.y
  }

  translated(p: IPoint): Point {
    const q = new Point(this)
    q.x += p.x
    q.y += p.y
    return q
  }

  get negated() {
    return new Point({ x: -this.x, y: -this.y })
  }

  sub(p: IPoint) {
    return new Point({ x: this.x - p.x, y: this.y - p.y })
  }

  scaled(factor: number) {
    return new Point({ x: this.x * factor, y: this.y * factor })
  }

  toString() {
    return `(${this.x},${this.y})`
  }
}
