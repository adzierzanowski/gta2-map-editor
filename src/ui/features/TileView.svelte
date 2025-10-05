<script lang="ts">
  import type { GtaMap } from '@app/mapHandler'

  let { map, id, width }: { map?: GtaMap; id: number; width?: number } =
    $props()
</script>

<canvas
  width="64"
  height="64"
  style:width={`${width ?? 64}px`}
  {@attach cvs => {
    const ctx = cvs.getContext('2d')
    if (ctx && map) {
      const tile = map.tiles.get(id)
      if (tile) {
        ctx.putImageData(tile, 0, 0)
      }
    }
  }}></canvas>
