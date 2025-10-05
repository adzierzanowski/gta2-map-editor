<script lang="ts">
  import { BabylonRenderer } from '@app/babylonRenderer'
  import type { GtaMap } from '@app/mapHandler'
  import { babylonCfg, intricateCfg } from '@app/state'
  import { stats } from '@app/state/Stats.svelte'
  import SideSection from '@containers/SideSection.svelte'
  import { onMount } from 'svelte'
  import NavSection from './NavSection.svelte'
  import SelSection from './SelSection.svelte'
  import LightSection from './LightSection.svelte'

  let topOffset = $state(0)

  let {
    map = $bindable(),
    renderer = $bindable(),
  }: { map?: GtaMap; renderer?: BabylonRenderer } = $props()

  let cvs: HTMLCanvasElement
  let backCvs: HTMLCanvasElement

  let blockRendererYield = intricateCfg.blockRendererYield
  let { lastBlockUpdateTime, blockMeshesCount } = stats

  $effect(() => {
    if (cvs) {
      if (renderer) {
        renderer.reattach(cvs)
      } else if (backCvs) {
        renderer = new BabylonRenderer(backCvs, cvs, map)
      }
    }
  })

  $effect(() => {
    if (renderer && map) {
      renderer.rebuild()
    }
  })

  onMount(() => {
    return () => {
      renderer?.pause()
    }
  })
</script>

<main>
  <aside
    {@attach node => {
      const onWheel = (e: WheelEvent) => {
        topOffset -= e.deltaY
        if (topOffset > 0) {
          topOffset = 0
        }
        if (
          topOffset <
          -(node.scrollHeight - (node.parentElement?.clientHeight ?? 0))
        ) {
          topOffset = -(
            node.scrollHeight - (node.parentElement?.clientHeight ?? 0)
          )
        }
      }
      node.addEventListener('wheel', onWheel)
      return () => {
        node.removeEventListener('wheel', onWheel)
      }
    }}
    style:top={`${topOffset}px`}>
    <section>
      <NavSection />
      <SelSection {renderer} {map} />
      <LightSection />
      <SideSection title="Intricate">
        <fieldset>
          <legend>
            Block Renderer Yield

            <span>
              {$blockRendererYield}
            </span>
          </legend>
          <input
            type="range"
            min="1"
            max="4096"
            step="1"
            bind:value={$blockRendererYield} />
        </fieldset>
      </SideSection>
      <SideSection title="stats">
        <div>
          <div>Last Block Update: {$lastBlockUpdateTime.toFixed(2)} ms</div>
          <div>Cached Block Meshes: {$blockMeshesCount}</div>
        </div>
      </SideSection>
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
    background-color: #32302f;

    aside {
      min-width: 400px;
      display: flex;
      flex-direction: column;
      max-height: 100%;
      height: 100%;
      position: relative;
      & > section {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
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

  :global {
    input {
      background-color: #1d2021;
      border: none;
      color: #d5c4a1;
      padding: 4px;
    }

    button {
      background-color: #1d2021;
      border: none;
      padding: 4px 8px;
      color: #ebdbb2;
      cursor: pointer;

      &:hover {
        color: #fe8019;
      }
    }
  }
</style>
