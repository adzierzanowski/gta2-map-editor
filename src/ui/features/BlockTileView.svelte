<script lang="ts">
  import type { GtaMap } from '@app/mapHandler'
  import { BlockInfo, type BlockSide, type BlockTileInfo } from '@lib/gbh'
  import Flip from '@assets/flip.svg.svelte'
  import Flat from '@assets/flat.svg.svelte'
  import Wall from '@assets/wall.svg.svelte'
  import Bulletwall from '@assets/bulletwall.svg.svelte'
  import Rot0 from '@assets/rot0.svg.svelte'
  import Rot180 from '@assets/rot180.svg.svelte'
  import Rot270 from '@assets/rot270.svg.svelte'
  import Rot90 from '@assets/rot90.svg.svelte'
  import TileView from './TileView.svelte'
  import Tooltip from '@components/Tooltip.svelte'
  import TilePicker from './TilePicker.svelte'

  let {
    info,
    selectedSide = $bindable('lid'),
    showPicker = $bindable(false),
    map,
    onBlockInfoChange,
  }: {
    info: BlockInfo
    selectedSide: BlockSide
    showPicker?: boolean
    map?: GtaMap
    onBlockInfoChange: (info: BlockInfo) => void
  } = $props()
  let tileInfo: BlockTileInfo = $derived(info.tiles[selectedSide])
</script>

<main>
  <section>
    <div>
      {selectedSide}
      {tileInfo.eid}/{tileInfo.id}
    </div>

    <button class="current-tile" onclick={() => (showPicker = !showPicker)}>
      <TileView {map} id={tileInfo.id} width={64} />
      {#if showPicker}
        <TilePicker {map} />
      {/if}
    </button>

    <div class="info">
      <Tooltip content="flat" pos="top">
        <button>
          <Flat width={24} color={tileInfo.flat ? '#b8bb26' : '#7c6f64'} />
        </button>
      </Tooltip>

      <Tooltip content="flip" pos="top">
        <button>
          <Flip width={24} color={tileInfo.flip ? '#b8bb26' : '#7c6f64'} />
        </button>
      </Tooltip>

      <Tooltip content="wall" pos="top">
        <button>
          <Wall width={24} color={tileInfo.wall ? '#b8bb26' : '#7c6f64'} />
        </button>
      </Tooltip>

      <Tooltip content="bullet wall" pos="top">
        <button>
          <Bulletwall
            width={24}
            color={tileInfo.bulletWall ? '#b8bb26' : '#7c6f64'} />
        </button>
      </Tooltip>

      <Tooltip content="rotation" pos="top">
        <button>
          {#if tileInfo.rotation === 0}
            <Rot0 width={24} color="#7c6f64" />
          {:else if tileInfo.rotation === 1}
            <Rot90 width={24} color="#b8bb26" />
          {:else if tileInfo.rotation === 2}
            <Rot180 width={24} color="#b8bb26" />
          {:else if tileInfo.rotation === 3}
            <Rot270 width={24} color="#b8bb26" />
          {/if}
        </button>
      </Tooltip>
    </div>
  </section>
  <aside>
    {#each ['top', 'left', 'lid', 'right', 'bottom'] as side}
      <button
        onclick={() => {
          selectedSide = side as BlockSide
        }}
        style:grid-area={side}
        class={{ selectedSide: side === selectedSide }}>
        <TileView {map} id={info.tiles[side].id} width={32} />
      </button>
    {/each}
  </aside>
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: row;
    padding: 4px;
    justify-content: space-between;
    align-items: center;
    gap: 8px;

    section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
    }

    .current-tile {
      padding: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    aside {
      display: grid;
      grid-template-areas: '. top .' 'left lid right' '. bottom .';

      button {
        border: 1px solid #0000;
        display: flex;
        justify-content: center;
        padding: 4px;
        align-items: center;

        &.selectedSide {
          border: 1px solid #83a598;
        }
      }
    }

    canvas {
      width: 64px;
      height: 64px;
      padding: 4px;
    }

    .info {
      display: flex;
      flex-direction: row;
      padding: 4px;

      button {
        background-color: #282828;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:not(:last-of-type) {
          border-right: 1px solid #504945;
        }
      }

      // button {
      //   background-color: #282828;
      //   color: #504945;
      //   aspect-ratio: 1;
      //   border: none;
      //   display: flex;
      //   align-items: center;
      //   justify-content: center;
      //   padding: 2px;
      //   cursor: pointer;

      //   .toggle-indicator {
      //     width: 8px;
      //     height: 8px;
      //     background-color: #000;
      //   }

      //   &:not(:last-of-type) {
      //     border-right: 1px solid #504945;
      //   }

      //   &.active {
      //     color: #ebdbb2;
      //     .toggle-indicator {
      //       background-color: #b8bb26;
      //     }
      //   }
      // }
    }
  }
</style>
