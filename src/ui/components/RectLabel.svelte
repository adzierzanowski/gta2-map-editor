<script lang="ts">
  import type { IRect } from '@lib/geometry'

  let { x, y, w, h }: IRect = $props()
</script>

<main>
  <span class="x-label">x:</span><span class="x-value">{x}</span>
  <span class="y-label">y:</span><span class="y-value">{y}</span>
  <span class="w-label">w:</span><span class="w-value">{w}</span>
  <span class="h-label">h:</span><span class="h-value">{h}</span>
</main>

<style lang="scss">
  .x-label {
    color: #cc2412;
  }
  .x-value {
    color: #fb4934;
  }
  .y-label {
    color: #98971a;
  }
  .y-value {
    color: #b8bb26;
  }
  .w-label {
    color: #b16286;
  }
  .w-value {
    color: #d3869b;
  }
  .h-label {
    color: #d79921;
  }
  .h-value {
    color: #fabd2f;
  }
</style>
