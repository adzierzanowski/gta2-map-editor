<script lang="ts">
  import { babylonCfg } from '@app/state'
  import Toggle from '@components/Toggle.svelte'
  import SideSection from '@containers/SideSection.svelte'

  let {
    ambientLightIntensity,
    showLights,
    mapLightIntensity,
    mapLightRange,
    showArrows,
  } = babylonCfg
</script>

<SideSection title="Lighting">
  <div>
    <button
      onclick={() => {
        $ambientLightIntensity = 1.5
        $showLights = false
      }}>Day</button>
    <button
      onclick={() => {
        $ambientLightIntensity = 0.2
        $showLights = true
      }}>Night</button>
  </div>
  <fieldset>
    <legend>
      Ambient Light
      <span>
        {$ambientLightIntensity.toFixed(2)}
      </span>
    </legend>
    <input
      min="0"
      max="2"
      step="0.01"
      type="range"
      bind:value={$ambientLightIntensity} />
  </fieldset>
  <fieldset>
    <legend>
      Map Light Intensity
      <span>
        {$mapLightIntensity.toFixed(4)}
      </span>
    </legend>
    <input
      min="0"
      max="0.2"
      step="0.0001"
      type="range"
      bind:value={$mapLightIntensity} />
  </fieldset>
  <fieldset>
    <legend>
      Light Range
      <span>
        {$mapLightRange.toFixed(4)}
      </span>
    </legend>
    <input
      min="0"
      max="4"
      step="0.0001"
      type="range"
      bind:value={$mapLightRange} />
  </fieldset>
  <div style:display="flex" style:flex-direction="row" style:gap="8px">
    <Toggle bind:checked={$showArrows}>Show Arrows</Toggle>
    <Toggle bind:checked={$showLights}>Show Lights</Toggle>
  </div>
</SideSection>

<style lang="scss">
</style>
