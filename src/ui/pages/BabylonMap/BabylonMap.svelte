<script lang="ts">
  import { BabylonRenderer } from '@app/babylonRenderer'
  import type { GtaMap } from '@app/mapHandler'
  import { babylonCfg, intricateCfg } from '@app/state'
  import { stats } from '@app/state/Stats.svelte'
  import SideSection from '@containers/SideSection.svelte'
  import { onMount } from 'svelte'
  import NavSection from './NavSection.svelte'
  import SelSection from './SelSection.svelte'
  import LightSection from './RenderingSection.svelte'

  let topOffset = $state(0)

  let {
    map = $bindable(),
    renderer = $bindable(),
  }: { map?: GtaMap; renderer?: BabylonRenderer } = $props()

  let cvs: HTMLCanvasElement
  let backCvs: HTMLCanvasElement

  let { tool } = babylonCfg
  let { blockRendererYield } = intricateCfg
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
        if ((e.target as HTMLElement).style.position === 'absolute') {
          return
        }
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
    <nav>
      <button
        onclick={() => ($tool = 'nav')}
        class={{ active: $tool === 'nav' }}>Move</button>
      <button
        onclick={() => ($tool = 'select')}
        class={{ active: $tool === 'select' }}>Select</button>
    </nav>
    <section id="cvs-wrapper">
      <canvas bind:this={backCvs} style:display="none !important"></canvas>
      <canvas bind:this={cvs}></canvas>
    </section>
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
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      nav {
        display: flex;
        flex-direction: row;
        align-items: center;

        button.active {
          color: #fe8019;
        }
      }
    }

    #cvs-wrapper {
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
