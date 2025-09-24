import type { Rect, IRect } from '@lib/geometry'
import type { Observable } from 'babylonjs'

export interface IBabylonSettings {
  showArrows: boolean
  showLights: boolean
  ambientLightIntensity: number
  mapLightIntensity: number
  mapLightRange: number
  mapLightRadius: number
  rect: Rect
  rectConstraint: IRect
  zRange: [min: number, max: number]
  onRectChangedObservable: Observable<Rect>
}

export interface ISettings {
  babylon: IBabylonSettings
  loadMapOnStart: boolean
}
