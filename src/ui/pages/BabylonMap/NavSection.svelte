<script lang="ts">
  import { babylonCfg } from '@app/state'
  import RectLabel from '@components/RectLabel.svelte'
  import SideSection from '@containers/SideSection.svelte'
  import { Rect } from '@lib/geometry'

  let rect = babylonCfg.rect
  let rectConstraint = babylonCfg.rectConstraint
  let zRange = babylonCfg.zRange
  let x = $state($rect.x)
  let y = $state($rect.y)
  let w = $state($rect.w)
  let h = $state($rect.h)
</script>

<SideSection title="Navigation">
  <!-- <div> -->

  <!-- {$rect.toString()} -->
  <!-- </div> -->
  <RectLabel {...$rect} />
  <div>
    <input type="number" min="0" max="256" bind:value={x} />
    <input type="number" min="0" max="256" bind:value={y} />
    <input type="number" min="0" max="256" bind:value={w} />
    <input type="number" min="0" max="256" bind:value={h} />
    <button
      onclick={() => {
        $rect = new Rect({ x, y, w, h }).clamp($rectConstraint)
      }}>Go</button>
  </div>
  <div>
    z range
    <input type="number" min="0" max="7" bind:value={$zRange[0]} />
    <input type="number" min="0" max="7" bind:value={$zRange[1]} />
  </div>
</SideSection>

<style lang="scss">
</style>
