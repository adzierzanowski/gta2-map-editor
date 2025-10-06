import { Color3, PointLight, TransformNode, Vector3 } from 'babylonjs'
import type { BabylonRenderer } from '../Renderer.svelte'
import { get } from 'svelte/store'
import { babylonCfg } from '@app/state'
import { p3dStr, type IRect } from '@lib/geometry'

export const updateLights = (rnd: BabylonRenderer, rect: IRect) => {
  rnd.lightsNode.dispose()
  rnd.lightsNode = new TransformNode('lights', rnd.scene)

  if (get(babylonCfg.showLights)) {
    const lights = rnd.map?.lightsForRect(rect) ?? []
    const mapLightIntensity = get(babylonCfg.mapLightIntensity)
    const mapLightRange = get(babylonCfg.mapLightRange)

    for (const l of lights) {
      const light = new PointLight(
        `L${p3dStr(l.pos)}`,
        new Vector3(0, 0, 0),
        rnd.scene,
      )
      light.parent = rnd.lightsNode

      light.position = new Vector3(l.pos.y - rect.y, l.pos.z, l.pos.x - rect.x)
      light.diffuse = new Color3(l.color.r, l.color.g, l.color.b)
      light.intensity = mapLightIntensity
      light.range = l.radius * mapLightRange
      light.state = l.radius.toString()
      light.shadowEnabled = false
    }
  }
}
