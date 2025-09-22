<script lang="ts">
  import { BlockInfo, type IBlockInfo } from '../../lib/gbh/data/Block'
  import type { IPoint3D } from '../../lib/geometry'
  import type { GtaMap } from '../app/mapLoader/GtaMap'
  import type { BlockSide } from '../app/mapLoader/meshData'
  import GroundTypeIcon from '../components/GroundTypeIcon.svelte'
  import SlopeIcon from '../components/SlopeIcon.svelte'
  import FloatingWindow from '../containers/FloatingWindow.svelte'
  import BlockTileInfo from './BlockTileInfo.svelte'

  let {
    info,
    map,
    selectedSide = $bindable(),
    onBlockInfoChange,
  }: {
    info: IBlockInfo & IPoint3D
    map?: GtaMap
    selectedSide?: BlockSide
    onBlockInfoChange: (info: BlockInfo) => void
  } = $props()
  const blockInfo = $derived(new BlockInfo(info))
  const onGroundTypeChange = (groundType: number) => {
    const newBlock = new BlockInfo(info)
    newBlock.slope &= ~3
    newBlock.slope |= groundType
    onBlockInfoChange(newBlock)
  }
</script>

<FloatingWindow
  title="Block Info"
  initialRect={{ x: window.innerWidth - 450, y: 30, w: 450, h: 420 }}
>
  {#if info}
    <div style="display:flex; gap: 8px; align-items:center;">
      <SlopeIcon slope={info.slope >> 2} width={48} />
      <div class="ground-type">
        <GroundTypeIcon groundType={info.slope & 3} width={48} />
        <div class="ground-type-select">
          <button onclick={() => onGroundTypeChange(0)}
            ><GroundTypeIcon groundType={0} width={48} /></button
          >
          <button onclick={() => onGroundTypeChange(1)}
            ><GroundTypeIcon groundType={1} width={48} /></button
          >
          <button onclick={() => onGroundTypeChange(2)}
            ><GroundTypeIcon groundType={2} width={48} /></button
          >
          <button onclick={() => onGroundTypeChange(3)}
            ><GroundTypeIcon groundType={3} width={48} /></button
          >
        </div>
      </div>
      <div>slope: {blockInfo.slopeType} {blockInfo.groundType}</div>
      <div>{selectedSide}</div>
      <div>{info.x},{info.y},{info.z}</div>
    </div>
    <div class="tile-info">
      <BlockTileInfo
        {onBlockInfoChange}
        bind:selectedSide
        info={blockInfo}
        side="lid"
        {map}
      />
      <BlockTileInfo
        {onBlockInfoChange}
        bind:selectedSide
        info={blockInfo}
        side="bottom"
        {map}
      />
      <BlockTileInfo
        {onBlockInfoChange}
        bind:selectedSide
        info={blockInfo}
        side="right"
        {map}
      />
      <BlockTileInfo
        {onBlockInfoChange}
        bind:selectedSide
        info={blockInfo}
        side="top"
        {map}
      />
      <BlockTileInfo
        {onBlockInfoChange}
        bind:selectedSide
        info={blockInfo}
        side="left"
        {map}
      />
    </div>
  {/if}
</FloatingWindow>

<style lang="scss">
  .tile-info {
    display: grid;
    grid-template-areas: '. top .' 'left lid right' '. bottom .';
  }

  .ground-type {
    position: relative;

    .ground-type-select {
      position: absolute;
      display: none;
      top: 100%;
      left: 0;
      background-color: #282828;

      button {
        background-color: #0000;
        border: 0;
      }
    }

    &:hover {
      .ground-type-select {
        display: flex;
      }
    }
  }
</style>
