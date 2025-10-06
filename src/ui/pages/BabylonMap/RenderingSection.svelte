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
    materialAlpha,
    motionBlurStrength,
    maxSimLights,
  } = babylonCfg
</script>

<SideSection title="Rendering Options" expandedInitial={true}>
  <main>
    <section>
      <header>Objects</header>
      <div>
        <Toggle bind:checked={$showArrows}>Show Arrows</Toggle>
      </div>
    </section>
    <section>
      <header>Lighting</header>
      <div class="h-flex">
        <Toggle bind:checked={$showLights}>Show Lights</Toggle>
        <span class="label">Preset</span>
        <button
          onclick={() => {
            $showLights = false
            $ambientLightIntensity = 1.5
            $motionBlurStrength = 4
          }}>Day</button>
        <button
          onclick={() => {
            $showLights = true
            $ambientLightIntensity = 0.15
            $mapLightIntensity = 0.0122
            $mapLightRange = 1.7
            $motionBlurStrength = 0.2
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
      <fieldset>
        <legend>
          Max Simultaneous Lights

          <span>
            {$maxSimLights}
          </span>
        </legend>
        <input
          type="range"
          min="0"
          max="128"
          step="1"
          bind:value={$maxSimLights} />
      </fieldset>
    </section>

    <section>
      <fieldset>
        <legend>
          Material Alpha
          <span>
            {$materialAlpha.toFixed(2)}
          </span>
        </legend>
        <input
          min="0"
          max="1"
          step="0.01"
          type="range"
          bind:value={$materialAlpha} />
      </fieldset>
      <fieldset>
        <legend>
          Motion Blur Strength
          <span>
            {$motionBlurStrength.toFixed(1)}
          </span>
        </legend>
        <input
          min="0"
          max="16"
          step="0.1"
          type="range"
          bind:value={$motionBlurStrength} />
      </fieldset>
    </section>
    <div style:display="flex" style:flex-direction="row" style:gap="8px"></div>
  </main>
</SideSection>

<style lang="scss">
  main,
  section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  section {
    padding: 16px 0;
    border-bottom: 1px solid #458588;
    header {
      font-size: 14px;
      color: #458588;
    }
  }

  .label {
    font-size: 12px;
  }

  .h-flex {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
  }
</style>
