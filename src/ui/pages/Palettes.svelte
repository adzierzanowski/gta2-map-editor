<script lang="ts">
  import { mapProxy } from '../app/state.svelte'
  import Palette from '../components/Palette.svelte'
</script>

<main>
  {#if mapProxy.map}
    {#each new Array(64 * mapProxy.map.ppal.length).fill(0) as i, palId}
      <Palette {palId} />
    {/each}
  {/if}
</main>

<style lang="scss">
  main {
    display: flex;
    max-height: 100%;
    flex-wrap: wrap;
    padding: 20px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    overflow-y: auto;
  }
</style>
