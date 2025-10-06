<script lang="ts">
  import { MapLoader, type GtaMap } from '@app/mapHandler'
  import { appCfg } from '@app/state'
  import Progressbar from '@components/Progressbar.svelte'
  import MapExportModal from '@features/MapExportModal.svelte'
  import { onMount } from 'svelte'

  let { map = $bindable() }: { map: GtaMap | undefined } = $props()

  let { loadMapOnStart } = appCfg

  let showExportModal = $state(false)
  let tileAtlasURL = $state('')
  let loader = $state(new MapLoader())
  let pending = $state(false)

  const loadDefault = async () => {
    pending = true

    map = await loader.loadDefault()
    pending = false
  }

  onMount(async () => {
    if ($loadMapOnStart) {
      if (!map) {
        await loadDefault()
      }
    }
  })
</script>

<main>
  <aside>
    <h1>Map</h1>
    <button onclick={loadDefault} disabled={pending}>Load Map</button>

    <button
      disabled={map === undefined || pending}
      onclick={() => (showExportModal = true)}>Export Map</button>
    <MapExportModal bind:map bind:show={showExportModal} />

    <button
      disabled={map === undefined || pending}
      onclick={() => {
        const cvs = new OffscreenCanvas(
          map!.tileAtlas.width,
          map!.tileAtlas.height,
        )
        const ctx = cvs.getContext('2d')

        if (ctx) {
          ctx.putImageData(map!.tileAtlas, 0, 0)
          cvs.convertToBlob().then(blob => {
            tileAtlasURL = URL.createObjectURL(blob)
          })
        }
      }}>Export Texture Atlas</button>
  </aside>
  <section id="data">
    {#each Object.entries(loader.stages) as [name, info]}
      <div>
        <div>
          {name}: {info.stage}
        </div>
        <div
          style="display: grid; gap:16px; grid-template-columns: 80% 20%; width:100%; grid-auto-rows: auto;">
          <div style="max-width: 80%;">
            <Progressbar value={info.progress} />
          </div>
          <div>
            {#if info.end}
              {(info.end - info.start).toFixed(0)} ms
            {:else}
              {(info.progress * 100).toFixed(0)}%
            {/if}
          </div>
        </div>
        <div>{info.details}</div>
      </div>
    {/each}
  </section>
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
      <div>
        <a href={tileAtlasURL} download>{tileAtlasURL}</a>
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
      display: flex;
      flex-direction: column;
      gap: 8px;
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
