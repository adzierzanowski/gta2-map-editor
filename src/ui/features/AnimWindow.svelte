<script lang="ts">
  import type { GtaMap } from '../app/mapLoader/GtaMap'
  import FloatingWindow from '../containers/FloatingWindow.svelte'
  let { map = $bindable() }: { map: GtaMap | undefined } = $props()
</script>

<FloatingWindow initialRect={{ x: 0, y: 0, w: 300, h: 300 }} title="Animations">
  {#if map}
    {#each map.animations as anim}
      <div>
        {anim.base},
        {anim.length}
      </div>
    {/each}
  {/if}
</FloatingWindow>

<style lang="scss">
  main {
  }
</style>
