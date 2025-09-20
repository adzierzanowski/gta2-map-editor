<script lang="ts">
  import { BlockInfo, type BlockTileInfo } from '../../lib/gbh/data/Block'
  import type { GtaMap } from '../app/mapLoader/GtaMap'
  import type { BlockSide } from '../app/mapLoader/meshData'

  let {
    info,
    side,
    selectedSide = $bindable(),
    map,
    onBlockInfoChange,
  }: {
    info: BlockInfo
    side: BlockSide
    selectedSide?: BlockSide
    map?: GtaMap
    onBlockInfoChange: (info: BlockInfo) => void
  } = $props()
  let tileInfo: BlockTileInfo = $derived(info.tiles[side])
</script>

<main style={`grid-area: ${side};`}>
  <div>
    {side}
    {tileInfo.eid}/{tileInfo.id}
  </div>

  <section>
    <canvas
      class={{ selectedSide: selectedSide === side }}
      onclick={() => {
        if (selectedSide === side) {
          selectedSide = undefined
        } else {
          selectedSide = side
        }
      }}
      width={64}
      height={64}
      {@attach cvs => {
        const ctx = cvs.getContext('2d')
        if (ctx && map) {
          const tile = map.tiles.get(tileInfo.id)
          if (tile) {
            ctx.putImageData(tile, 0, 0)
          }
        }
      }}
    ></canvas>

    <div class="info">
      <button
        class={{ active: tileInfo.flat }}
        onclick={() => {
          const newInfo = new BlockInfo(info)
          if (tileInfo.flat) {
            newInfo[side] &= ~(1 << 12)
          } else {
            newInfo[side] |= 1 << 12
          }
          onBlockInfoChange(newInfo)
        }}
      >
        <div class="toggle-indicator"></div>
        flat
      </button>
      <button
        class={{ active: tileInfo.flip }}
        onclick={() => {
          const newInfo = new BlockInfo(info)
          if (tileInfo.flip) {
            newInfo[side] &= ~(1 << 13)
          } else {
            newInfo[side] |= 1 << 13
          }
          onBlockInfoChange(newInfo)
        }}
      >
        <div class="toggle-indicator"></div>
        flip
      </button>
      <button
        class={{ active: tileInfo.wall }}
        onclick={() => {
          const newInfo = new BlockInfo(info)
          if (tileInfo.wall) {
            newInfo[side] &= ~(1 << 10)
          } else {
            newInfo[side] |= 1 << 10
          }
          onBlockInfoChange(newInfo)
        }}
      >
        <div class="toggle-indicator"></div>
        wall
      </button>
      <button
        class={{ active: tileInfo.bulletWall }}
        onclick={() => {
          const newInfo = new BlockInfo(info)
          if (tileInfo.bulletWall) {
            newInfo[side] &= ~(1 << 11)
          } else {
            newInfo[side] |= 1 << 11
          }
          onBlockInfoChange(newInfo)
        }}
      >
        <div class="toggle-indicator"></div>
        bulletWall
      </button>
      <button
        class={{ active: true }}
        onclick={() => {
          const newInfo = new BlockInfo(info)
          let rot = tileInfo.rotation
          rot++
          rot %= 4
          newInfo[side] &= ~(3 << 14)
          newInfo[side] |= rot << 14
          onBlockInfoChange(newInfo)
        }}
      >
        {tileInfo.rotation * 90}&deg;
      </button>
    </div>
  </section>
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    padding: 4px;

    section {
      display: flex;
      flex-direction: row;
    }

    canvas {
      width: 64px;
      height: 64px;
      padding: 4px;

      &.selectedSide {
        border: 1px solid #faf;
      }
    }

    .info {
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
