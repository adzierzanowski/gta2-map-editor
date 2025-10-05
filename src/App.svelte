<script lang="ts">
  import type { BabylonRenderer } from '@app/babylonRenderer'
  import type { GtaMap } from '@app/mapHandler'
  import BabylonMap from '@pages/BabylonMap/BabylonMap.svelte'
  import JunctionMap from '@pages/JunctionMap.svelte'
  import MapData from '@pages/MapData.svelte'

  let map: GtaMap | undefined = $state()

  let babylonRenderer: BabylonRenderer | undefined = $state()
  let currentPage: 'babylon' | 'junctions' | 'map' | 'settings' = $state('map')
</script>

<main>
  <nav>
    <button
      class={{ active: currentPage === 'map' }}
      onclick={() => (currentPage = 'map')}>Map</button>
    <button
      class={{ active: currentPage === 'babylon' }}
      onclick={() => (currentPage = 'babylon')}>3D View</button>
    <button
      class={{ active: currentPage === 'junctions' }}
      onclick={() => (currentPage = 'junctions')}>Junctions</button>
    <button
      class={{ active: currentPage === 'settings' }}
      onclick={() => (currentPage = 'settings')}>Settings</button>
  </nav>
  <section id="page">
    {#if currentPage === 'map'}
      <MapData bind:map />
    {:else if currentPage === 'junctions'}
      <JunctionMap bind:map />
    {:else if currentPage === 'babylon'}
      <BabylonMap bind:map bind:renderer={babylonRenderer} />
    {/if}
  </section>
</main>

<style lang="scss">
  main {
    background-color: #282828;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    #page {
      width: 100%;
      height: 100%;
    }

    nav {
      height: 24px;
      min-height: 24px;
      background-color: #000;
      border-bottom: 1px solid #3c3836;
      display: flex;
      z-index: 100;

      button {
        &.active {
          background-color: #fe8019;
        }
        &:hover {
          background-color: #d65d0e;
        }
      }
      button,
      .dropdown {
        background-color: #7c6f64;
        border: 0;
        padding: 0 16px;
        cursor: pointer;
        position: relative;
      }

      .dropdown {
        display: flex;
        justify-content: center;
        align-items: center;

        menu {
          position: absolute;
          top: 100%;
          z-index: 20;
          background-color: #7c6f64;
          margin: 0;
          padding: 0;
          flex-direction: column;
          display: none;

          button {
            padding: 4px 16px;
          }
        }

        &:hover menu {
          display: flex;
        }
      }
    }

    #workspace {
      position: relative;
      width: 100%;
      height: 100%;

      canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #111;
      }
    }
  }
</style>
