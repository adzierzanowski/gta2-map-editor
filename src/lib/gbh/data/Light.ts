import type { IPoint, IPoint3D } from '../../geometry'
import type { Color } from './Color'

export interface ILight {
  color: { r: number; g: number; b: number; a: number }
  intensity: number
  pos: IPoint3D
  radius: number
  shape: number
  onTime: number
  offTime: number
}
