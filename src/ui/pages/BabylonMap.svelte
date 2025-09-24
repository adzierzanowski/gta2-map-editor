<script lang="ts">
  import { BabylonRenderer } from '@app/babylonRenderer'
  import type { GtaMap } from '@app/mapHandler'
  import type { ISettings } from '@app/state'
  import {
    type IRect,
    Rect,
    type IPoint3D,
    gbhCoordsFromBabylon,
  } from '@lib/geometry'
  import { getContext, onMount } from 'svelte'

  let {
    map = $bindable(),
    renderer = $bindable(),
  }: { map?: GtaMap; renderer?: BabylonRenderer } = $props()

  const settings: ISettings = getContext('settings')
  let cvs: HTMLCanvasElement
  let backCvs: HTMLCanvasElement
  let teleportRect: IRect = $state(settings.babylon.rect as IRect)

  $effect(() => {
    if (cvs) {
      if (renderer) {
        renderer.reattach(cvs)
      } else if (backCvs) {
        renderer = new BabylonRenderer(backCvs, cvs, settings, map)
      }
    }
  })

  $effect(() => {
    if (renderer && map && settings.babylon.rect) {
      renderer.rebuild()
    }
  })

  $effect(() => {
    // settings.babylon.onRectChangedObservable._coroutineScheduler()
    // console.log(settings.babylon.onRectChangedObservable.observers)
    settings.babylon.onRectChangedObservable.notifyObservers(
      settings.babylon.rect,
      undefined,
      settings.babylon,
      settings.babylon,
      performance.now(),
    )
  })

  onMount(() => {
    return () => {
      renderer?.pause()
    }
  })

  // let selectedSide: BlockSide | undefined = $state(undefined)
  // const rectConstraint: IRect = { x: 0, y: 0, w: 256, h: 256 }

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
</script>

<main>
  <aside>
    <section>
      <header>Navigation</header>
      <div>
        {settings.babylon.rect.toString()}
      </div>
      <div>
        <input type="number" min="0" max="256" bind:value={teleportRect.x} />
        <input type="number" min="0" max="256" bind:value={teleportRect.y} />
        <input type="number" min="0" max="256" bind:value={teleportRect.w} />
        <input type="number" min="0" max="256" bind:value={teleportRect.h} />
        <button
          onclick={() => {
            settings.babylon.rect = new Rect(teleportRect).clamp(
              settings.babylon.rectConstraint,
            )
          }}>Go</button>
      </div>
      <div>
        z range
        <input
          type="number"
          min="0"
          max="7"
          bind:value={settings.babylon.zRange[0]} />
        <input
          type="number"
          min="0"
          max="7"
          bind:value={settings.babylon.zRange[1]} />
      </div>
    </section>
    <section>
      <header>Selection</header>
      <div>
        {#if renderer?.pickedMesh}
          {@const p: IPoint3D = gbhCoordsFromBabylon(renderer.pickedMesh.position)}
          {@const r = settings.babylon.rect}
          ({p.x + r.x}, {p.y + r.y}, {p.z})
          {#if renderer.pickedBlock}
            {renderer.pickedBlock.groundType?.toString()}
          {/if}
        {/if}
      </div>
    </section>
    <section>
      <header>Settings</header>
      <div>
        <button
          onclick={() => {
            settings.babylon.showArrows = false
            settings.babylon.ambientLightIntensity = 1.5
            settings.babylon.showLights = false
          }}>Day</button>
        <button
          onclick={() => {
            settings.babylon.showArrows = true
            settings.babylon.ambientLightIntensity = 0.2
            settings.babylon.showLights = true
          }}>Night</button>
      </div>
      <div>
        Ambient Light
        <input
          min="0"
          max="2"
          step="0.01"
          type="range"
          bind:value={settings.babylon.ambientLightIntensity} />
        {settings.babylon.ambientLightIntensity.toFixed(2)}
      </div>
      <div>
        Map Light Intensity
        <input
          min="0"
          max="0.2"
          step="0.0001"
          type="range"
          bind:value={settings.babylon.mapLightIntensity} />
        {settings.babylon.mapLightIntensity.toFixed(4)}
      </div>
      <div>
        Map Light Radius
        <input
          min="0"
          max="16"
          step="0.0001"
          type="range"
          bind:value={settings.babylon.mapLightRadius} />
        {settings.babylon.mapLightRadius.toFixed(4)}
      </div>
      <div>
        Map Light Range
        <input
          min="0"
          max="16"
          step="0.0001"
          type="range"
          bind:value={settings.babylon.mapLightRange} />
        {settings.babylon.mapLightRange.toFixed(4)}
      </div>
      <div>
        Show Arrows
        <input type="checkbox" bind:checked={settings.babylon.showArrows} />
      </div>
      <div>
        Show Lights
        <input type="checkbox" bind:checked={settings.babylon.showLights} />
      </div>
    </section>
  </aside>
  <section>
    <canvas bind:this={backCvs} style:display="none !important"></canvas>
    <canvas bind:this={cvs}></canvas>
  </section>
</main>

<style lang="scss">
  main {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;

    aside {
      background-color: #1d2021;
      min-width: 400px;
      display: flex;
      flex-direction: column;

      section {
        header {
          background-color: #282828;
          padding: 4px 8px;
        }

        & > div {
          padding: 10px;
        }
      }
    }

    & > section {
      position: relative;
      flex-grow: 1;

      canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        &.back {
          visibility: hidden;
        }
      }
    }
  }

  :global(#scene-explorer-host) {
    z-index: 10;
  }
</style>
