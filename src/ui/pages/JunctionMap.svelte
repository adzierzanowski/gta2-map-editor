<script lang="ts">
  import type { GtaMap } from '@app/mapHandler'
  import type { ISettings } from '@app/state'
  import { getContext } from 'svelte'

  let cvs: HTMLCanvasElement
  let { map = $bindable() }: { map: GtaMap | undefined } = $props()
  let settings: ISettings = getContext('settings')

  const render = () => {
    if (cvs && map && settings) {
      const ctx = cvs.getContext('2d')
      if (ctx) {
        const w = cvs.width
        const h = cvs.height

        const dy = h / 256
        ctx.clearRect(0, 0, w, h)
        ctx.strokeStyle = '#fff'

        for (const j of map.junctions.junctions) {
          ctx.strokeRect(
            j.xMin * dy,
            j.yMin * dy,
            dy * (j.xMax - j.xMin),
            dy * (j.yMax - j.yMin),
          )
        }

        for (const s of map.junctions.hSegments) {
          ctx.beginPath()
          ctx.moveTo((s.xMin + 0.5) * dy, ((s.yMin + s.yMax) / 2) * dy)
          ctx.lineTo((s.xMax - 0.5) * dy, ((s.yMin + s.yMax) / 2) * dy)
          ctx.stroke()
        }

        for (const s of map.junctions.vSegments) {
          ctx.beginPath()
          ctx.moveTo(((s.xMin + s.xMax) / 2) * dy, (s.yMin + 1 / 2) * dy)
          ctx.lineTo(((s.xMin + s.xMax) / 2) * dy, (s.yMax - 1 / 2) * dy)
          ctx.stroke()
        }
      }
    }
  }

  const onResize: ResizeObserverCallback = entries => {
    if (cvs) {
      cvs.width = cvs.clientWidth
      cvs.height = cvs.clientHeight
      render()
    }
  }

  const resizeObserver: ResizeObserver = new ResizeObserver(onResize)

  $effect(() => {
    if (cvs) {
      resizeObserver.observe(cvs)
    }

    return () => {
      resizeObserver.unobserve(cvs)
    }
  })

  $effect(() => {
    if (settings) {
      render()
    }
  })
</script>

<main>
  <canvas bind:this={cvs}></canvas>
</main>

<style lang="scss">
  main {
    width: 100%;
    height: 100%;
    padding: 0;
    canvas {
      width: 100%;
      height: 100%;
    }
  }
</style>
