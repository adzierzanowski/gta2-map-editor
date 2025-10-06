import type { IPoint, IPoint3D } from './types'

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

export class Point3D implements IPoint3D {
  x: number
  y: number
  z: number

  constructor(p: Partial<IPoint3D>) {
    this.x = p.x ?? 0
    this.y = p.y ?? 0
    this.z = p.z ?? 0
  }

  clamp(min: IPoint3D, max: IPoint3D) {
    if (this.x < min.x) {
      this.x = min.x
    }

    if (this.x > max.x) {
      this.x = max.x
    }

    if (this.y < min.y) {
      this.y = min.y
    }

    if (this.y > max.y) {
      this.y = max.y
    }
    if (this.z < min.z) {
      this.z = min.z
    }

    if (this.z > max.z) {
      this.z = max.z
    }

    return this
  }

  translated({ x, y, z }: IPoint3D) {
    return new Point3D({ x: this.x + x, y: this.y + y, z: this.z + z })
  }

  toString() {
    return `${this.x}:${this.y}:${this.z}`
  }
}

export const gbhCoordsFromBabylon = (bp: IPoint3D) => {
  return { x: bp.y, y: bp.x, z: bp.y } as IPoint3D
}

export const p3dStr = (p: IPoint3D) => {
  return `${p.x}:${p.y}:${p.z}`
}
