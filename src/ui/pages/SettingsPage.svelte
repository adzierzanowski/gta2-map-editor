<script lang="ts">
  import { cfgStore } from '@app/state'
  let babylon = cfgStore.babylon
</script>

<main>
  {#each Object.entries($babylon) as e}
    <div>{e[0]}: {e[1]}</div>
  {/each}
  <button
    on:click={e => {
      $babylon.zRange = [4, 4]
    }}>
    aaa
  </button>
</main>

<style lang="scss">
  main {
  }
</style>
