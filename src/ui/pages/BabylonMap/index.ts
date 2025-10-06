export * from './BabylonMap.svelte'
export * from './LightSection.svelte'
export * from './NavSection.svelte'
export * from './SelSection.svelte'

// const onSlopeChange = (slope: number) => {
//   if (map && babylon?.pickedMesh) {
//     const meta = babylon.pickedMesh.metadata as IBlockInfo & IPoint3D
//     const block = map.blocks.get(
//       JSON.stringify({ x: meta.x, y: meta.y, z: meta.z }),
//     )
//     if (block) {
//       const gType = block.slope & 3
//       block.slope = (slope << 2) | gType
//       map.blocks.set(
//         JSON.stringify({ x: meta.x, y: meta.y, z: meta.z }),
//         new BlockInfo(block),
//       )
//     }

//     babylon.pickedMesh.dispose()
//     babylon.populate(map, rect)

//     console.log({ block })
//   }
// }

// const onTileChange = (tileId: number) => {
//   if (map && babylon?.pickedMesh && selectedSide) {
//     const meta = babylon.pickedMesh.metadata as IBlockInfo & IPoint3D
//     const block = map.blocks.get(
//       JSON.stringify({ x: meta.x, y: meta.y, z: meta.z }),
//     )
//     if (block) {
//       block[selectedSide] = tileId

//       map.blocks.set(
//         JSON.stringify({ x: meta.x, y: meta.y, z: meta.z }),
//         new BlockInfo(block),
//       )
//     }

//     babylon.pickedMesh.dispose()
//     babylon.populate(map, rect)
//   }
// }

// const onAddBlock = () => {
//   if (map && babylon && newX && newY && newZ) {
//     console.log({ x: newX, y: newY, z: newZ })
//     let newBlock = new BlockInfo({
//       arrows: 0,
//       bottom: 0,
//       left: 0,
//       top: 0,
//       lid: 549,
//       right: 0,
//       slope: 0,
//     })
//     if (babylon.pickedMesh) {
//       newBlock = new BlockInfo(babylon.pickedMesh.metadata)
//     }
//     map.blocks.set(
//       JSON.stringify({
//         x: parseInt(newX),
//         y: parseInt(newY),
//         z: parseInt(newZ),
//       }),
//       newBlock,
//     )
//     babylon.populate(map, rect)
//   }
// }

// const onBlockInfoChange = (info: BlockInfo) => {
//   if (map && babylon) {
//     if (babylon.pickedMesh) {
//       const { x, y, z } = babylon.pickedMesh.metadata
//       const newBlock = new BlockInfo(info)
//       console.log('onBlockInfoChange', { x, y, z, newBlock })
//       map.blocks.set(JSON.stringify({ x, y, z }), newBlock)
//       babylon.pickedMesh.dispose()
//       babylon.populate(map, rect)
//       const newMesh = babylon.scene.getMeshByName(`block-${x}-${y}-${z}`)
//       if (newMesh) {
//         babylon.pickedMesh = newMesh
//       }
//     }
//   }
// }
