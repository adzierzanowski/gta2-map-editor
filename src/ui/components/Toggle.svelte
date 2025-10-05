<script lang="ts">
  import { tick } from 'svelte'

  let {
    checked = $bindable(false),
    children,
  }: { checked: boolean; children?: any } = $props()
</script>

<button
  onclick={() => {
    checked = !checked
  }}
  class={{ checked }}>
  {#if children}
    {@render children?.()}
  {/if}

  <div class="indicator">
    <div class="thumb"></div>
  </div>
</button>

<style lang="scss">
  button {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    background-color: #504945;
    font-size: 12px;
    color: #1d2021;
    transition: color 0.2s;

    .indicator {
      width: 28px;
      height: 14px;
      background-color: #3c3836;
      position: relative;

      .thumb {
        position: absolute;
        top: 4px;
        left: 4px;
        width: 4px;
        height: 6px;
        background-color: #cc241280;
        transition: all 0.2s;
      }
    }

    &.checked {
      color: #98971a;
      .thumb {
        background-color: #b8bb26;
        width: 20px;
      }
    }
  }
</style>
