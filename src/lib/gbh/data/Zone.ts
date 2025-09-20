import type { IRect } from '../../geometry'

export interface IZoneInfo extends IRect {
  zoneType: number
  nameLength: number
  name: string
}
