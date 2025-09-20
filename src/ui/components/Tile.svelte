<script lang="ts">
  import type { ITile } from '../../lib/gbh/data/Tile'
  import { tileRenderer } from '../app/state.svelte'

  let { tile, onclick }: { tile: ITile; onclick?: () => void } = $props()
  let result = $derived(tileRenderer.renderTile(tile.id))
</script>

<main>
  {#await result}
    {tile.id}
  {:then result}
    <canvas
      onclick={() => {
        onclick?.()
      }}
      width={64}
      height={64}
      {@attach cvs => {
        const ctx = cvs.getContext('2d')
        ctx?.putImageData(result, 0, 0)
        // ctx?.drawImage(result.bmp, 0, 0)
      }}
    ></canvas>
  {/await}
</main>

<style lang="scss">
  main {
    width: 128px;
    height: 128px;
    display: flex;
    border: 1px solid #3c3836;

    canvas {
      image-rendering: pixelated;
      shape-rendering: crispEdges;
    }
  }
</style>
