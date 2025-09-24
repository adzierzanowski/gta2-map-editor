import { Rect, type IPoint3D } from '@lib/geometry'
import { AbstractMesh, Vector3 } from 'babylonjs'
import type { BabylonRenderer } from '../Renderer.svelte'

export const blockSpawner = function* (rnd: BabylonRenderer) {
  const rect = new Rect(rnd.cfg.rect)
  let out: AbstractMesh[] = []

  for (let y = 0; y < rect.h; y++) {
    for (let x = 0; x < rect.w; x++) {
      for (let z = 0; z < 8; z++) {
        const pos: IPoint3D = {
          x: x + rect.x,
          y: y + rect.y,
          z,
        }

        let mesh: undefined | null | AbstractMesh = rnd.getBlockMesh(pos)
        if (!mesh) {
          mesh = rnd.createBlockMesh(pos)

          if (mesh) {
            out.push(mesh)
          }
        }
        if (mesh) {
          mesh.position = new Vector3(y, z, x)
        }
      }

      if (x % 12 == 0) {
        yield out

        out = []
      }
    }
  }
}
