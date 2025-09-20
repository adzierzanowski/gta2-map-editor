import { Mesh, Vector3, VertexBuffer, VertexData, type Scene } from 'babylonjs'
import { slopeDefs } from './meshData'
import type { BlockInfo } from '../../../lib/gbh/data/Block'
import type { IPoint3D } from '../../../lib/geometry'

const dudv = (tileId: number) => {
  return { du: (tileId % 32) / 32, dv: 1 - (Math.floor(tileId / 32) + 1) / 32 }
}

export const createSlopePrototype = (
  name: string,
  slope: number,
  scene: Scene,
) => {
  const slopeDef = slopeDefs[slope]

  const vdata = new VertexData()
  const pos = slopeDef.flatMap(s => s.pts)
  const flatPos = pos.flatMap(v => v.asArray())
  const idxs = pos.map((_, i) => i)
  const normals: number[] = []
  VertexData.ComputeNormals(flatPos, idxs, normals)
  vdata.positions = flatPos
  vdata.indices = idxs
  vdata.normals = normals
  const mesh = new Mesh(name, scene)
  vdata.applyToMesh(mesh, true)
  mesh.setPivotPoint(mesh.position.add(new Vector3(0.5, 0.5, 0.5)))
  return mesh
}

export const createMeshForBlock = (
  pos: IPoint3D,
  info: BlockInfo,
  scene: Scene,
) => {
  let slopeType = info.slopeType
  if ([49, 50, 51, 52].includes(slopeType) && info.lid === 1023) {
    slopeType = 1024 | slopeType
  }

  const proto = scene.getMeshByName(`slope${slopeType}`) as Mesh

  if (!proto) {
    return
  }

  const name = `block-${pos.x}-${pos.y}-${pos.z}`
  const mesh = proto.clone(name, {})
  mesh.makeGeometryUnique()

  let material = scene.getMaterialByName('atlas')

  const uvs: number[] = []
  for (const faceDef of slopeDefs[slopeType]) {
    let tile = info.tiles[faceDef.side]
    let baseUVs = faceDef.baseUVs
    let flip = tile.flip
    let opflat =
      (faceDef.side === 'bottom' && info.tiles.top.flat) ||
      (faceDef.side === 'top' && info.tiles.bottom.flat) ||
      (faceDef.side === 'left' && info.tiles.right.flat) ||
      (faceDef.side === 'right' && info.tiles.left.flat)

    let tileId = !tile.flat && opflat ? 0 : tile.id
    if (!tile.flat && faceDef.flat) {
      tileId = 0
    }

    if (tile.flat && faceDef.flat) {
      switch (faceDef.side) {
        case 'top':
          tile = info.tiles.bottom
          tileId = tile.id
          flip = tile.flip
          break
        case 'bottom':
          tile = info.tiles.top
          tileId = tile.id
          flip = tile.flip
          break
        case 'left':
          tile = info.tiles.right
          tileId = tile.id
          flip = tile.flip
          break
        case 'right':
          tile = info.tiles.left
          flip = tile.flip
          tileId = tile.id
          break
      }
    }

    const { du, dv } = dudv(tileId)
    const faceUvs = transformUvs(baseUVs, tile.radians, flip)
      .flat()
      .map((x, i) => x / 32 + (i % 2 === 0 ? du : dv))
    uvs.push(...faceUvs)
  }

  mesh.setVerticesData(VertexBuffer.UVKind, uvs, true)
  mesh.metadata = { ...info, ...pos }

  if (material) {
    mesh.material = material
  }
  return mesh
}

export const transformUvs = (
  uvs: number[][],
  radians: number,
  flip: boolean,
) => {
  return uvs.map(([x, y]) => {
    let p = [x, y]
    if (flip) {
      p[0] = 1 - p[0]
    }
    p = [p[0] - 0.5, p[1] - 0.5]

    p = [
      Math.cos(radians) * p[0] - Math.sin(radians) * p[1],
      Math.sin(radians) * p[0] + Math.cos(radians) * p[1],
    ]
    p = [p[0] + 0.5, p[1] + 0.5]

    return p
  })
}
