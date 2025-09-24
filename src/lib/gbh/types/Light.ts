import type { IPoint3D } from '@lib/geometry'

export interface ILight {
  color: { r: number; g: number; b: number; a: number }
  intensity: number
  pos: IPoint3D
  radius: number
  shape: number
  onTime: number
  offTime: number
}
