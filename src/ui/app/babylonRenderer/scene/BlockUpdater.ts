import type { IPoint3D, Rect } from '@lib/geometry'
import { AbstractMesh, Vector3 } from 'babylonjs'
import type { BabylonRenderer } from '../Renderer.svelte'
import { babylonCfg, intricateCfg } from '@app/state'
import { get } from 'svelte/store'
import { S } from '../mesh/MeshPoints'
import { BlockArrow, type IBlockInfo } from '@lib/gbh'

export const blockUpdater = function* (
  rnd: BabylonRenderer,
  rect: Rect,
): Generator<unknown, any, AbstractMesh[] | undefined> {
  const enabledMeshes = rnd.blocksNode.getChildMeshes(true, node =>
    node.isEnabled(),
  )

  const rectPoints = rect.points3d(0, 6)
  const movedMeshes: Set<string> = new Set()
  const showArrows = get(babylonCfg.showArrows)
  const blockRendererYield = get(intricateCfg.blockRendererYield)

  let i = 0
  for (const mesh of enabledMeshes) {
    const pos: IPoint3D = mesh.metadata
    const k = JSON.stringify(pos)
    if (k in rectPoints) {
      movedMeshes.add(k)
      mesh.position = new Vector3(pos.y - rect.y, pos.z, pos.x - rect.x)
    } else {
      mesh.setEnabled(false)
    }

    if (i++ % blockRendererYield === 0) {
      yield
    }
  }

  for (const p of rectPoints.difference(movedMeshes)) {
    const k = JSON.stringify(p)
    let mesh = rnd.blockMeshes.get(k)
    if (mesh === undefined) {
      mesh = rnd.createBlockMesh(p)
      if (mesh === undefined) {
        rnd.blockMeshes.set(k, null)
      } else {
        rnd.blockMeshes.set(k, mesh)
      }
    }

    if (mesh) {
      mesh.position = new Vector3(p.y - rect.y, p.z, p.x - rect.x)
      mesh.setEnabled(true)

      if (showArrows) {
        const arr = rnd.scene.getMeshByName('arrow')
        if (!arr) {
          continue
        }

        const block: IBlockInfo = mesh.metadata

        if (block.arrows & (1 << BlockArrow.GreenLeft)) {
          const gl = arr.clone(mesh.name + '-gl', rnd.arrowsNode)
          if (gl) {
            gl.position = mesh.position.add(new Vector3(0, 0.51, 0))
          }
        }

        if (block.arrows & (1 << BlockArrow.GreenRight)) {
          const gl = arr.clone(mesh.name + '-gr', rnd.arrowsNode)
          if (gl) {
            gl.position = mesh.position.add(new Vector3(0, 0.51, 0))
            gl.rotate(Vector3.Up(), Math.PI)
          }
        }

        if (block.arrows & (1 << BlockArrow.GreenDown)) {
          const gl = arr.clone(mesh.name + '-gd', rnd.arrowsNode)
          if (gl) {
            gl.position = mesh.position.add(new Vector3(0, 0.51, 0))
            gl.rotate(Vector3.Up(), (3 * Math.PI) / 2)
          }
        }

        if (block.arrows & (1 << BlockArrow.GreenUp)) {
          const gl = arr.clone(mesh.name + '-gu', rnd.arrowsNode)
          if (gl) {
            gl.position = mesh.position.add(new Vector3(0, 0.51, 0))
            gl.rotate(Vector3.Up(), Math.PI / 2)
          }
        }
      }
    }

    if (i++ % blockRendererYield === 0) {
      yield
    }
  }
}
