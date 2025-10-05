<script lang="ts">
  import type { BabylonRenderer } from '@app/babylonRenderer'
  import type { GtaMap } from '@app/mapHandler'
  import { babylonCfg } from '@app/state'
  import Coords from '@components/Coords.svelte'
  import GroundTypeIcon from '@components/GroundTypeIcon.svelte'
  import SlopeIcon from '@components/SlopeIcon.svelte'
  import SideSection from '@containers/SideSection.svelte'
  import BlockTileView from '@features/BlockTileView.svelte'
  import GroundTypePicker from '@features/GroundTypePicker.svelte'
  import SlopePicker from '@features/SlopePicker.svelte'
  import { BlockInfo, type BlockSide } from '@lib/gbh'
  import { gbhCoordsFromBabylon, type IPoint3D } from '@lib/geometry'

  let { renderer, map }: { renderer?: BabylonRenderer; map?: GtaMap } = $props()
  let pickedMesh = $derived(renderer?.pickedMesh)
  let pickedBlock = $derived(
    pickedMesh ? new BlockInfo(pickedMesh.metadata) : undefined,
  )
  let rect = babylonCfg.rect

  let showGroundTypePicker = $state(false)
  let showSlopePicker = $state(false)
  let selectedSide: BlockSide = $state('lid')

  $effect(() => {
    if (pickedBlock || pickedMesh) {
      showSlopePicker = false
      showGroundTypePicker = false
    }
  })
</script>

<SideSection title="Selection">
  <div class="info">
    {#if pickedMesh}
      {@const p: IPoint3D = gbhCoordsFromBabylon(pickedMesh.position)}
      {@const r = $rect}
      <Coords x={p.x + r.x} y={p.y + r.y} z={p.z} />
      {#if pickedBlock}
        <div class="ground-type">
          <button
            class="picker-btn"
            onclick={() => (showGroundTypePicker = !showGroundTypePicker)}>
            <GroundTypeIcon width={32} groundType={pickedBlock.slope & 3} />
            {pickedBlock.groundType?.toString()}
          </button>

          {#if showGroundTypePicker}
            <GroundTypePicker />
          {/if}
        </div>

        <div class="slope">
          <button
            class="picker-btn"
            onclick={() => (showSlopePicker = !showSlopePicker)}>
            <SlopeIcon slope={pickedBlock.slopeType} width={32} />
            {pickedBlock.slopeType}
          </button>
          {#if showSlopePicker}
            <SlopePicker
              onchange={slope => {
                showSlopePicker = false
              }} />
          {/if}
        </div>
      {/if}
    {/if}
  </div>

  <div>
    {#if pickedMesh && pickedBlock}
      <BlockTileView
        info={pickedBlock}
        {map}
        bind:selectedSide
        onBlockInfoChange={() => {}}></BlockTileView>
    {/if}
  </div>
</SideSection>

<style lang="scss">
  .info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .slope,
  .ground-type {
    display: flex;
    gap: 8px;
    position: relative;
    align-items: center;
  }

  .picker-btn {
    background-color: #282828;
    border: none;
    color: inherit;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    padding: 4px 8px;

    &:hover {
      color: #fe8019;
    }
  }
</style>
