import type { IRect } from '@lib/geometry'

export interface IZoneInfo extends IRect {
  zoneType: number
  nameLength: number
  name: string
}
