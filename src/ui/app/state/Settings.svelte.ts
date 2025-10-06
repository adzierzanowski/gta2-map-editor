import type { BabylonToolName } from '@app/babylonRenderer/tools/types'
import { Rect, type IRect } from '@lib/geometry'
import type { Box } from '@lib/geometry/Box'
import { writable, type Writable } from 'svelte/store'

export interface IBabylonSettings {
  ambientLightIntensity: number
  mapLightIntensity: number
  mapLightRange: number
  materialAlpha: number
  motionBlurStrength: number
  rect: Rect
  rectConstraint: IRect
  showArrows: boolean
  showLights: boolean
  tool: BabylonToolName
  zRange: [min: number, max: number]
  maxSimLights: number
  selection: Box | undefined
}

export interface IAppSettings {
  loadMapOnStart: boolean
}

export interface IIntricateSettings {
  blockRendererYield: number
  tileLoadWorkers: number
}

export const babylonCfg: {
  [key in keyof IBabylonSettings]: Writable<IBabylonSettings[key]>
} = {
  ambientLightIntensity: writable(1.2),
  tool: writable('nav'),
  mapLightIntensity: writable(0.025),
  mapLightRange: writable(1),
  materialAlpha: writable(1),
  motionBlurStrength: writable(4),
  rect: writable(new Rect({ x: 103, y: 105, w: 32, h: 32 })),
  rectConstraint: writable({ x: 0, y: 0, w: 255, h: 255 }),
  showArrows: writable(false),
  showLights: writable(false),
  zRange: writable([0, 7]),
  maxSimLights: writable(32),
  selection: writable(undefined),
}

export const appCfg: {
  [key in keyof IAppSettings]: Writable<IAppSettings[key]>
} = {
  loadMapOnStart: writable(true),
}

export const intricateCfg: {
  [key in keyof IIntricateSettings]: Writable<IIntricateSettings[key]>
} = {
  blockRendererYield: writable(512),
  tileLoadWorkers: writable(2),
}
