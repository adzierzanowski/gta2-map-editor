import { Point3D } from './Point'
import type { IPoint3D } from './types'

export class Box {
  start: Point3D
  end: Point3D

  constructor(start: IPoint3D, end: IPoint3D) {
    this.start = new Point3D(start)
    this.end = new Point3D(end)
  }

  translate({ x, y, z }: Partial<IPoint3D>) {
    this.start.x += x ?? 0
    this.start.y += y ?? 0
    this.start.z += z ?? 0
    this.end.x += x ?? 0
    this.end.y += y ?? 0
    this.end.z += z ?? 0
    return this
  }

  translateStart({ x, y, z }: Partial<IPoint3D>) {
    this.start.x += x ?? 0
    this.start.y += y ?? 0
    this.start.z += z ?? 0
    return this
  }

  translateEnd({ x, y, z }: Partial<IPoint3D>) {
    this.end.x += x ?? 0
    this.end.y += y ?? 0
    this.end.z += z ?? 0
    return this
  }

  clamp(min: IPoint3D, max: IPoint3D) {
    this.start.clamp(min, max)
    this.end.clamp(min, max)

    return this
  }

  get center(): Point3D {
    return new Point3D({
      x: -(this.start.x - this.end.x) / 2,
      y: -(this.start.y - this.end.y) / 2,
      z: -(this.start.z - this.end.z) / 2,
    }).translated(this.start)
  }

  get singularity(): Box {
    return new Box(this.start, this.start)
  }
}
