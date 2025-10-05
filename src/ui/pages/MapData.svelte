<script lang="ts">
  import type { GtaMap } from '@app/mapHandler'
  import { appCfg } from '@app/state'
  import MapExportModal from '@features/MapExportModal.svelte'
  import MapLoadModal from '@features/MapLoadModal.svelte'

  let { map = $bindable() }: { map: GtaMap | undefined } = $props()

  let loadMapOnStart = appCfg.loadMapOnStart

  let showLoadModal = $state($loadMapOnStart)
  let showExportModal = $state(false)
</script>

<main>
  <aside>
    <h1>Map</h1>
    <button onclick={() => (showLoadModal = true)}>Load Map</button>

    <button
      disabled={map === undefined}
      onclick={() => (showExportModal = true)}>Export Map</button>
    <MapLoadModal bind:map show={showLoadModal} />
    <MapExportModal bind:map show={showExportModal} />
  </aside>
  <section>
    {#if map}
      <h2>Current Map</h2>
      <div>
        {map.blocks.size} blocks
      </div>
      <div>
        {map.tiles.size} tiles
      </div>
      <div>
        {map.animations.length} animations
      </div>
      <div>
        {map.lights.length} lights
      </div>
      <div>
        {map.objects.length} map objects
      </div>
      <div>
        {map.zones.length} zones
      </div>
      <div>
        {map.junctions.junctions.length} junctions
      </div>
    {:else}
      No map is currently loaded
    {/if}
  </section>
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;

    aside {
      padding: 20px;
    }

    section {
      padding: 20px;
      background-color: #1d2021;
      flex-grow: 1;
    }

    button {
      background-color: #111;
      color: #ebdbb2;
      border: none;
      padding: 4px 16px;
      cursor: pointer;

      &:disabled {
        background-color: #665c54;
        color: #32302f;
      }

      &:not(:disabled):hover {
        background-color: #fe8019;
        color: #111;
      }
    }
  }
</style>
