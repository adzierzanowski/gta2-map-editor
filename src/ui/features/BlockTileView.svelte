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

  let {
    info,
    selectedSide = $bindable('lid'),
    map,
    onBlockInfoChange,
  }: {
    info: BlockInfo
    selectedSide: BlockSide
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

    <TileView {map} id={tileInfo.id} width={64} />
    <div class="info">
      <button>
        <Flat width={24} color={tileInfo.flat ? '#b8bb26' : '#7c6f64'} />
      </button>
      <button>
        <Flip width={24} color={tileInfo.flip ? '#b8bb26' : '#7c6f64'} />
      </button>
      <button>
        <Wall width={24} color={tileInfo.wall ? '#b8bb26' : '#7c6f64'} />
      </button>
      <button>
        <Bulletwall
          width={24}
          color={tileInfo.bulletWall ? '#b8bb26' : '#7c6f64'} />
      </button>
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

    aside {
      display: grid;
      grid-template-areas: '. top .' 'left lid right' '. bottom .';
    }

    canvas {
      width: 64px;
      height: 64px;
      padding: 4px;
    }

    .selectedSide {
      border: 1px solid #83a598;
    }

    .info {
      display: flex;
      flex-direction: row;
      padding: 4px;

      button {
        background-color: #282828;
        color: #504945;
        border: none;
        font-size: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px;
        padding: 2px 4px;
        cursor: pointer;
        .toggle-indicator {
          width: 8px;
          height: 8px;
          background-color: #000;
        }

        &:not(:last-of-type) {
          border-right: 1px solid #504945;
        }

        &.active {
          color: #ebdbb2;
          .toggle-indicator {
            background-color: #b8bb26;
          }
        }
      }
    }
  }
</style>
