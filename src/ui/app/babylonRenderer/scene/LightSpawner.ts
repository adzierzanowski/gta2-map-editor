import { Point, Rect } from '@lib/geometry'
import { PointLight, Vector3, Color3 } from 'babylonjs'
import type { BabylonRenderer } from '../Renderer.svelte'

export const lightSpawner = function* (rnd: BabylonRenderer) {
  const lights = rnd.map?.lights

  if (!lights) return

  const rect = new Rect(rnd.cfg.rect)

  for (const l of lights) {
    const lightName = 'L' + new Point(l.pos).toString()
    let lightNode = rnd.scene.getLightByName(lightName)

    if (rect.contains(l.pos)) {
      if (!lightNode) {
        const lightNode = new PointLight(
          lightName,
          new Vector3(l.pos.y - rect.y, l.pos.z, l.pos.x - rect.x),
          rnd.scene,
        )
        lightNode.diffuse = new Color3(l.color.r, l.color.g, l.color.b)
        lightNode.intensity = rnd.settings.babylon.mapLightIntensity
        lightNode.radius = l.radius * 2
        lightNode.range = l.radius * 2
        lightNode.parent = rnd.lightsNode
        lightNode.shadowEnabled = false
        lightNode.setEnabled(true)
      }
      yield
    } else {
      lightNode?.setEnabled(false)
    }
  }
}
