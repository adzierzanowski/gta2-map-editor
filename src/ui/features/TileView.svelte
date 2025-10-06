<script lang="ts">
  import type { GtaMap } from '@app/mapHandler'

  let { map, id, width }: { map?: GtaMap; id: number; width?: number } =
    $props()

  let empty = $derived(id < 0 || id >= 992)
</script>

<canvas
  width="64"
  height="64"
  style:width={`${width ?? 64}px`}
  style:background-color={empty ? '#808080' : 'none'}
  {@attach cvs => {
    $effect(() => {
      const ctx = cvs.getContext('2d')
      if (ctx && map) {
        const tile = map.tiles.get(id)
        if (tile && id > 0 && id < 992) {
          if (tile) {
            ctx.putImageData(tile, 0, 0)
          }
        } else {
          ctx.clearRect(0, 0, 64, 64)
        }
      }
    })
  }}></canvas>
