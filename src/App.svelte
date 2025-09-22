<script lang="ts">
  import { BabylonRenderer } from './ui/app/BabylonRenderer.svelte'
  import MapLoadModal from './ui/features/MapLoadModal.svelte'
  import { Rect, type IPoint3D, type IRect } from './lib/geometry'
  import SlopePicker from './ui/features/SlopePicker.svelte'
  import MapNavigation from './ui/features/MapNavigation.svelte'
  import type { GtaMap } from './ui/app/mapLoader/GtaMap'
  import BlockInfoView from './ui/features/BlockInfo.svelte'
  import { onMount } from 'svelte'
  import {
    BlockInfo,
    type BlockSide,
    type IBlockInfo,
  } from './lib/gbh/data/Block'
  import TilePicker from './ui/features/TilePicker.svelte'
  import MapExportModal from './ui/features/MapExportModal.svelte'
  import NewBlockWindow from './ui/features/NewBlockWindow.svelte'
  import AnimWindow from './ui/features/AnimWindow.svelte'

  let showMapLoadModal = $state(true)
  let showMapExportModal = $state(false)
  let map: GtaMap | undefined = $state()
  let cvs: HTMLCanvasElement
  let babylon: BabylonRenderer | undefined = $state()
  let rect: Rect = $state(new Rect({ x: 109, y: 121, w: 32, h: 32 }))
  // let rect: Rect = $state(new Rect({ x: 0, y: 0, w: 32, h: 32 }))
  let newX = $state('0')
  let newY = $state('0')
  let newZ = $state('0')
  let mode: 'tiles' | '3d' | '2d' = $state('3d')
  const rectConstraint: IRect = { x: 0, y: 0, w: 256, h: 256 }
  let selectedSide: BlockSide | undefined = $state(undefined)

  $effect(() => {
    if (cvs && map && !babylon) {
      babylon = new BabylonRenderer(cvs)
    }
  })

  $effect(() => {
    if (map !== undefined) {
      showMapLoadModal = false
    }
  })

  $effect(() => {
    if (rect && map && babylon && mode === '3d') {
      if (babylon.scene.getMaterialByName('atlas')) {
        babylon.populate(map, rect)
      } else {
        babylon.createAtlas(map).then(x => {
          babylon!.populate(map!, rect)
        })
      }
    }
  })

  $effect(() => {
    if (babylon?.pickedMesh) {
      newX = babylon.pickedMesh.metadata.x.toString()
      newY = babylon.pickedMesh.metadata.y.toString()
      newZ = babylon.pickedMesh.metadata.z.toString()
    }
  })

  const onSlopeChange = (slope: number) => {
    if (map && babylon?.pickedMesh) {
      const meta = babylon.pickedMesh.metadata as IBlockInfo & IPoint3D
      const block = map.blocks.get(
        JSON.stringify({ x: meta.x, y: meta.y, z: meta.z }),
      )
      if (block) {
        const gType = block.slope & 3
        block.slope = (slope << 2) | gType
        map.blocks.set(
          JSON.stringify({ x: meta.x, y: meta.y, z: meta.z }),
          new BlockInfo(block),
        )
      }

      babylon.pickedMesh.dispose()
      babylon.populate(map, rect)

      console.log({ block })
    }
  }

  const onTileChange = (tileId: number) => {
    if (map && babylon?.pickedMesh && selectedSide) {
      const meta = babylon.pickedMesh.metadata as IBlockInfo & IPoint3D
      const block = map.blocks.get(
        JSON.stringify({ x: meta.x, y: meta.y, z: meta.z }),
      )
      if (block) {
        block[selectedSide] = tileId

        map.blocks.set(
          JSON.stringify({ x: meta.x, y: meta.y, z: meta.z }),
          new BlockInfo(block),
        )
      }

      babylon.pickedMesh.dispose()
      babylon.populate(map, rect)
    }
  }

  const onAddBlock = () => {
    if (map && babylon && newX && newY && newZ) {
      console.log({ x: newX, y: newY, z: newZ })
      let newBlock = new BlockInfo({
        arrows: 0,
        bottom: 0,
        left: 0,
        top: 0,
        lid: 549,
        right: 0,
        slope: 0,
      })
      if (babylon.pickedMesh) {
        newBlock = new BlockInfo(babylon.pickedMesh.metadata)
      }
      map.blocks.set(
        JSON.stringify({
          x: parseInt(newX),
          y: parseInt(newY),
          z: parseInt(newZ),
        }),
        newBlock,
      )
      babylon.populate(map, rect)
    }
  }

  const onBlockInfoChange = (info: BlockInfo) => {
    if (map && babylon) {
      if (babylon.pickedMesh) {
        const { x, y, z } = babylon.pickedMesh.metadata
        const newBlock = new BlockInfo(info)
        console.log('onBlockInfoChange', { x, y, z, newBlock })
        map.blocks.set(JSON.stringify({ x, y, z }), newBlock)
        babylon.pickedMesh.dispose()
        babylon.populate(map, rect)
        const newMesh = babylon.scene.getMeshByName(`block-${x}-${y}-${z}`)
        if (newMesh) {
          babylon.pickedMesh = newMesh
        }
      }
    }
  }

  onMount(() => {
    document.addEventListener('keydown', e => {
      switch (e.code) {
        case 'KeyW':
          rect = rect
            .translated({ y: e.shiftKey ? -Math.floor(rect.h / 2) : -1, x: 0 })
            .clamp(rectConstraint)
          break
        case 'KeyS':
          rect = rect
            .translated({ y: e.shiftKey ? Math.floor(rect.h / 2) : 1, x: 0 })
            .clamp(rectConstraint)
          break
        case 'KeyA':
          rect = rect
            .translated({ x: e.shiftKey ? -Math.floor(rect.w / 2) : -1, y: 0 })
            .clamp(rectConstraint)
          break
        case 'KeyD':
          rect = rect
            .translated({ x: e.shiftKey ? Math.floor(rect.w / 2) : 1, y: 0 })
            .clamp(rectConstraint)
          break
        case 'KeyX':
          if (map && babylon?.pickedMesh) {
            const { x, y, z } = babylon.pickedMesh.metadata
            map.blocks.delete(JSON.stringify({ x, y, z }))
            babylon.populate(map, rect)
          }
          break
      }
    })
  })
</script>

<main>
  <nav>
    <button onclick={() => (showMapLoadModal = true)}>Import</button>
    <button onclick={() => (showMapExportModal = true)}>Export</button>
    <div class="dropdown">
      <button>View</button>
      <menu>
        <button>Zones</button>
        <button>Position</button>
        <button>Lights</button>
        <button>New Block</button>
        <button>Animations</button>
        <button>Objects</button>
      </menu>
    </div>
  </nav>
  <section id="workspace">
    <canvas bind:this={cvs}></canvas>
  </section>
  <SlopePicker onchange={onSlopeChange} />
  {#if selectedSide}
    <TilePicker onchange={onTileChange} {map} />
  {/if}
  <MapNavigation bind:rect />
  <BlockInfoView
    bind:selectedSide
    info={babylon?.pickedMesh?.metadata}
    {map}
    {onBlockInfoChange}
  />
  <MapLoadModal bind:show={showMapLoadModal} bind:map></MapLoadModal>
  <MapExportModal bind:show={showMapExportModal} bind:map></MapExportModal>
  <NewBlockWindow bind:newX bind:newY bind:newZ {onAddBlock} />
  <!-- <AnimWindow bind:map /> -->
</main>

<style lang="scss">
  main {
    background-color: #282828;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    nav {
      height: 24px;
      background-color: #000;
      border-bottom: 1px solid #3c3836;
      display: flex;
      button,
      .dropdown {
        background-color: #7c6f64;
        border: 0;
        padding: 0 16px;
        cursor: pointer;
        position: relative;
      }

      .dropdown {
        display: flex;
        justify-content: center;
        align-items: center;

        menu {
          position: absolute;
          top: 100%;
          z-index: 20;
          background-color: #7c6f64;
          margin: 0;
          padding: 0;
          flex-direction: column;
          display: none;

          button {
            padding: 4px 16px;
          }
        }

        &:hover menu {
          display: flex;
        }
      }
    }

    #workspace {
      position: relative;
      width: 100%;
      height: 100%;

      canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #111;
      }
    }
  }
  :global(#scene-explorer-host) {
    z-index: 1;
  }
</style>
