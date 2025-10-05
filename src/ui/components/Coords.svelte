<script lang="ts">
  import type { IPoint3D } from '@lib/geometry'

  let { x, y, z }: IPoint3D = $props()
</script>

<main>
  <span class="x-label">x:</span><span class="x-value">{x}</span>
  <span class="y-label">y:</span><span class="y-value">{y}</span>
  <span class="z-label">z:</span><span class="z-value">{z}</span>
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
  .z-label {
    color: #458588;
  }
  .z-value {
    color: #83a598;
  }
</style>
