import type { IPoint3D } from '@lib/geometry'
import { AbstractMesh, Vector3 } from 'babylonjs'
import type { BabylonRenderer } from '../Renderer.svelte'

export const blockUpdater = function* (
  rnd: BabylonRenderer,
): Generator<unknown, any, AbstractMesh[] | undefined> {
  const rect = rnd.cfg.rect
  let blocks = rnd.blocksNode.getChildMeshes()

  const updateBlock = (block: AbstractMesh) => {
    const pos: IPoint3D = block.metadata
    if (
      pos.x >= rect.x &&
      pos.x < rect.x + rect.w &&
      pos.y >= rect.y &&
      pos.y < rect.y + rect.h
    ) {
      block.setEnabled(true)
      block.position = new Vector3(pos.y - rect.y, pos.z, pos.x - rect.x)
    } else {
      block.setEnabled(false)
    }
  }

  let i = 0
  for (const block of blocks) {
    updateBlock(block)
    if (i++ % (12 * rect.w) === 0) {
      yield
    }
  }

  let nblocks = yield
  nblocks ??= []

  for (const block of nblocks) {
    updateBlock(block)
    if (i++ % (12 * rect.w) === 0) {
      yield
    }
  }
}
