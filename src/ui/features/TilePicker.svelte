<script lang="ts">
  import type { GtaMap } from '../app/mapLoader/GtaMap'
  import SlopeIcon from '../components/SlopeIcon.svelte'
  import FloatingWindow from '../containers/FloatingWindow.svelte'

  let { onchange, map }: { map?: GtaMap; onchange?: (tileId: number) => void } =
    $props()
</script>

<FloatingWindow
  title="Tile Picker"
  initialRect={{ x: window.innerWidth - 780, y: 40, w: 300, h: 400 }}
>
  <main>
    {#if map}
      <button onclick={() => onchange?.(1023)}>1023</button>
      {#each map.tiles.values() as tile, i}
        <canvas
          onclick={() => onchange?.(i)}
          width={64}
          height={64}
          {@attach cvs => {
            const ctx = cvs.getContext('2d')
            if (ctx && map) {
              ctx.putImageData(tile, 0, 0)
            }
          }}
        ></canvas>
      {/each}
    {/if}
  </main>
</FloatingWindow>

<style lang="scss">
  main {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 8px;
    background-color: #689d6a15;
    gap: 4px;

    button {
      background-color: #0000;
      border-radius: 2px;
      border: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      cursor: pointer;
    }
  }
</style>
