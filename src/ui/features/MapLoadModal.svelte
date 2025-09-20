<script lang="ts">
  import { onMount } from 'svelte'
  import type { GtaMap } from '../app/mapLoader/GtaMap'
  import { MapLoader } from '../app/mapLoader/MapLoader.svelte'
  import Progressbar from '../components/Progressbar.svelte'
  import Modal from '../containers/Modal.svelte'
  let {
    show = $bindable(),
    map = $bindable(undefined),
  }: { show?: boolean; map?: GtaMap } = $props()
  let loader = $state(new MapLoader())
  let loaderResult: GtaMap | undefined = $state(undefined)

  const onLoadDefault = async () => {
    loaderResult = await loader.loadDefault()
  }

  const onAccept = async () => {
    if (loaderResult) {
      map = loaderResult
    }
  }

  // onMount(async () => {
  //   map = await loader.loadDefault()
  // })
</script>

<Modal {show}>
  <main>
    <section id="status">
      <h2>Load Map</h2>

      {#if loaderResult === undefined}
        <button disabled={loader.pending} onclick={onLoadDefault}
          >Load Default</button
        >
      {:else}
        <button class="accept" disabled={!loaderResult} onclick={onAccept}
          >Cool</button
        >
      {/if}
      <button disabled={loader.pending} onclick={() => (show = false)}
        >Close</button
      >
    </section>
    <section id="data">
      {#each Object.entries(loader.stages) as [name, info]}
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
