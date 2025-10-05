import { Rect, type IRect } from '@lib/geometry'
import { writable, type Writable } from 'svelte/store'

export interface IBabylonSettings {
  showArrows: boolean
  showLights: boolean
  ambientLightIntensity: number
  mapLightIntensity: number
  mapLightRange: number
  rect: Rect
  rectConstraint: IRect
  zRange: [min: number, max: number]
}

export interface IAppSettings {
  loadMapOnStart: boolean
}

export interface IIntricateSettings {
  blockRendererYield: number
}

export const babylonCfg: {
  [key in keyof IBabylonSettings]: Writable<IBabylonSettings[key]>
} = {
  ambientLightIntensity: writable(1.2),
  mapLightIntensity: writable(0.025),
  mapLightRange: writable(1),
  showArrows: writable(false),
  showLights: writable(false),
  rect: writable(new Rect({ x: 103, y: 105, w: 32, h: 32 })),
  rectConstraint: writable({ x: 0, y: 0, w: 255, h: 255 }),
  zRange: writable([0, 7]),
}

export const appCfg: {
  [key in keyof IAppSettings]: Writable<IAppSettings[key]>
} = {
  loadMapOnStart: writable(true),
}

export const intricateCfg: {
  [key in keyof IIntricateSettings]: Writable<IIntricateSettings[key]>
} = {
  blockRendererYield: writable(256),
}
