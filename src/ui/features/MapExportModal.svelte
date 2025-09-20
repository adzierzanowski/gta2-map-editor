<script lang="ts">
  import { onMount } from 'svelte'
  import type { GtaMap } from '../app/mapLoader/GtaMap'
  import Progressbar from '../components/Progressbar.svelte'
  import Modal from '../containers/Modal.svelte'
  import { MapExporter } from '../app/mapLoader/MapExporter.svelte'
  let {
    show = $bindable(),
    map = $bindable(undefined),
  }: { show?: boolean; map?: GtaMap } = $props()
  let exporter = $state(new MapExporter())
  let pending = $state(false)
  let out: string | undefined = $state(undefined)

  const onExport = async () => {
    pending = true
    if (map) {
      const data = await exporter.export(map)
      out = URL.createObjectURL(data)
    }
    pending = false
  }
</script>

<Modal {show}>
  <main>
    <section id="status">
      <h2>Export Map</h2>
      <button disabled={pending} onclick={onExport}>Export</button>
      <button disabled={pending} onclick={() => (show = false)}>Cancel</button>
      {#if out}
        <a href={out} download="test.gmp">download</a>
      {/if}
    </section>
    <section id="data">
      {#each Object.entries(exporter.stages) as [name, info]}
        <div>
          <div>
            {name}:{info.stage}
          </div>
          <div
            style="display: grid; gap:16px; grid-template-columns: 80% 20%; width:100%; grid-auto-rows: auto;"
          >
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
  </main>
</Modal>

<style lang="scss">
  main {
    background-color: #282828;
    border-radius: 16px;
    display: flex;
    gap: 16px;
    flex-direction: row;
    height: 480px;
    width: 640px;

    #status {
      padding: 32px;
      border-top-left-radius: inherit;
      border-bottom-left-radius: inherit;
      flex-direction: column;
      background-color: #000;
      width: 200px;
    }

    #data {
      padding: 32px;
      max-height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      flex-direction: column;
      flex-grow: 1;
    }

    button {
      background-color: #d65d0e;
      &.accept {
        background-color: #98971a;
      }
      border: 0;

      cursor: pointer;
      padding: 4px 16px;

      &:disabled {
        filter: grayscale(1);
      }
    }
  }
</style>
