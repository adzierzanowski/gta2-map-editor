<script lang="ts">
  import { onMount } from 'svelte'
  import { Point, Rect, type IRect } from '../../lib/geometry'
  import { mapLoader, mapProxy, tileRenderer } from '../app/state.svelte'
  import Button from '../components/Button.svelte'
  import type { IZoneInfo } from '../../lib/gbh/data/Zone'
  import cvsBg from '../assets/cvsbg.svg'
  let cvs: HTMLCanvasElement
  let hud: HTMLCanvasElement
  let renders = $state(0)
  let showZones = $state(false)
  let showLights = $state(false)
  let showArrows = $state(false)

  const rectConstraint: IRect = {
    x: 0,
    y: 0,
    w: 256,
    h: 256,
  }
  let rect: Rect = $state(new Rect({ x: 0, y: 0, w: 16, h: 16 }))
  let zPos: number = $state(7)
  let scaledRect: Rect = $derived(rect.scaled(64))
  let lastRender: number = 0
  let zone: IZoneInfo | undefined = $state()

  const render = () => {
    const ctx = cvs.getContext('2d')!
    tileRenderer.renderColumns(rect).then(() => {
      ctx.clearRect(0, 0, cvs.width, cvs.height)
      for (const col of tileRenderer.columns) {
        for (const block of col) {
          if (block.zPos <= zPos && (block.info.lid & 0x3ff) > 0) {
            const p = new Point(block.pos)
              .translated(rect.pos.negated)
              .scaled(64)

            ctx.drawImage(block.bmp, p.x, p.y)

            if (showArrows) {
              console.log('rendering arrows')
              ctx.lineWidth = 2
              ctx.strokeStyle = '#0f0'
              if (block.info.arrows & 1) {
                const q = p.translated({ x: 36, y: 32 })
                ctx.beginPath()
                ctx.moveTo(q.x, q.y)
                ctx.lineTo(q.x + 4, q.y - 4)
                ctx.moveTo(q.x, q.y)
                ctx.lineTo(q.x + 4, q.y + 4)
                ctx.stroke()
              }
              if (block.info.arrows & (1 << 1)) {
                const q = p.translated({ x: 28, y: 32 })
                ctx.beginPath()
                ctx.moveTo(q.x, q.y)
                ctx.lineTo(q.x - 4, q.y - 4)
                ctx.moveTo(q.x, q.y)
                ctx.lineTo(q.x - 4, q.y + 4)
                ctx.stroke()
              }
              if (block.info.arrows & (1 << 2)) {
                const q = p.translated({ x: 32, y: 36 })
                ctx.beginPath()
                ctx.moveTo(q.x, q.y)
                ctx.lineTo(q.x - 4, q.y + 4)
                ctx.moveTo(q.x, q.y)
                ctx.lineTo(q.x + 4, q.y + 4)
                ctx.stroke()
              }
              if (block.info.arrows & (1 << 3)) {
                const q = p.translated({ x: 32, y: 28 })
                ctx.beginPath()
                ctx.moveTo(q.x, q.y)
                ctx.lineTo(q.x - 4, q.y - 4)
                ctx.moveTo(q.x, q.y)
                ctx.lineTo(q.x + 4, q.y - 4)
                ctx.stroke()
              }
              ctx.strokeStyle = '#f00'
              if (block.info.arrows & (1 << 4)) {
                const q = p.translated({ x: 40, y: 32 })
                ctx.beginPath()
                ctx.moveTo(q.x, q.y)
                ctx.lineTo(q.x + 4, q.y - 4)
                ctx.moveTo(q.x, q.y)
                ctx.lineTo(q.x + 4, q.y + 4)
                ctx.stroke()
              }
              if (block.info.arrows & (1 << 5)) {
                const q = p.translated({ x: 24, y: 32 })
                ctx.beginPath()
                ctx.moveTo(q.x, q.y)
                ctx.lineTo(q.x - 4, q.y - 4)
                ctx.moveTo(q.x, q.y)
                ctx.lineTo(q.x - 4, q.y + 4)
                ctx.stroke()
              }
              if (block.info.arrows & (1 << 6)) {
                const q = p.translated({ x: 32, y: 40 })
                ctx.beginPath()
                ctx.moveTo(q.x, q.y)
                ctx.lineTo(q.x - 4, q.y + 4)
                ctx.moveTo(q.x, q.y)
                ctx.lineTo(q.x + 4, q.y + 4)
                ctx.stroke()
              }
              if (block.info.arrows & (1 << 7)) {
                const q = p.translated({ x: 32, y: 24 })
                ctx.beginPath()
                ctx.moveTo(q.x, q.y)
                ctx.lineTo(q.x - 4, q.y - 4)
                ctx.moveTo(q.x, q.y)
                ctx.lineTo(q.x + 4, q.y - 4)
                ctx.stroke()
              }
            }

            if (showLights) {
              for (const light of mapProxy.lightsForRect(rect)) {
                ctx.fillStyle = `rgba(${light.color.r}, ${light.color.g}, ${light.color.b}, 0.1)`
                const lpos = new Point(light.pos)
                  .translated(rect.pos.negated)
                  .scaled(64)
                ctx.fillRect(lpos.x, lpos.y, 4 * light.radius, 4 * light.radius)
              }
            }
          }
        }
      }
      // tileRenderer.updateStats()
      renders++
    })
  }

  $effect(() => {
    if (rect && zPos) {
      render()
    }
  })

  $effect(() => {
    const ctx = hud.getContext('2d')!
    ctx.clearRect(0, 0, hud.width, hud.height)

    if (zone && showZones) {
      console.log({ zone })

      ctx.fillStyle = '#ff00ff80'
      ctx.lineWidth = 8
      const r = rect.intersection(zone).translated(rect.pos.negated).scaled(64)
      ctx.beginPath()
      ctx.fillRect(r.x, r.y, r.w, r.h)
    }
  })

  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyD':
        rect = rect
          .with({ x: rect.x + (e.shiftKey ? rect.w : 1) })
          .clamp(rectConstraint)
        break
      case 'KeyA':
        rect = rect
          .with({ x: rect.x - (e.shiftKey ? rect.w : 1) })
          .clamp(rectConstraint)
        break
      case 'KeyS':
        rect = rect
          .with({ y: rect.y + (e.shiftKey ? rect.h : 1) })
          .clamp(rectConstraint)
        break
      case 'KeyW':
        rect = rect
          .with({ y: rect.y - (e.shiftKey ? rect.h : 1) })
          .clamp(rectConstraint)
        break
      case 'KeyI':
        rect = rect.with({ h: rect.h + 1 }).clamp(rectConstraint)
        break
      case 'KeyK':
        rect = rect.with({ h: rect.h - 1 }).clamp(rectConstraint)
        break
      case 'KeyJ':
        rect = rect.with({ w: rect.w - 1 }).clamp(rectConstraint)
        break
      case 'KeyL':
        rect = rect.with({ w: rect.w + 1 }).clamp(rectConstraint)
        break
      case 'KeyR':
        rect = rect.with({ x: 0, y: 0, w: 16, h: 8 })
        zPos = 7
        break
      case 'KeyE':
        zPos = zPos < 7 ? zPos + 1 : 7
        break
      case 'KeyQ':
        zPos = zPos > 0 ? zPos - 1 : 0
        break
    }
  }

  const setZone = (zone?: IZoneInfo) => {
    zone = zone
  }

  onMount(() => {
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  })
</script>

<main>
  <nav>
    <div class="map-position">
      {rect.w}&times;{rect.h}+{rect.pos.toString()} z={zPos}
    </div>
    <div class="map-size-btns">
      {#each [16, 32, 64, 128, 256] as size}
        <Button
          onclick={() =>
            (rect = rect.with({ w: size, h: size }).clamp(rectConstraint))}
        >
          {size}&times;{size}
        </Button>
      {/each}
    </div>
  </nav>
  <section>
    <div class="map-view" style:background-image={`url("${cvsBg}")`}>
      <canvas width={scaledRect.w} height={scaledRect.h} bind:this={cvs}
      ></canvas>
      <canvas width={scaledRect.w} height={scaledRect.h} bind:this={hud}
      ></canvas>
    </div>
    <aside>
      <Button onclick={() => (showArrows = !showArrows)}>
        {#if showArrows}
          Hide Arrows
        {:else}
          Show Arrows
        {/if}
      </Button>

      <Button onclick={() => (showLights = !showLights)}>
        {#if showLights}
          Hide Lights
        {:else}
          ShowLights
        {/if}
      </Button>

      {#if mapProxy.map && showLights}
        <section class="lights">
          {#each mapProxy.lightsForRect(rect) as light, i}
            <div>
              {light.pos.x},{light.pos.y}:
              <div
                class="light-rect"
                style={`background-color: rgb(${light.color.r},${light.color.g}, ${light.color.b});`}
              ></div>
            </div>
          {/each}
        </section>
      {/if}

      <Button onclick={() => (showZones = !showZones)}>Zones</Button>
      {#if mapProxy.map && showZones}
        <section class="zones">
          {#each mapProxy.map.zones as zone_, i}
            {#if !rect.intersection(zone_).empty}
              <Button
                onclick={() => {
                  zone = zone_
                }}>{zone_.name}</Button
              >
            {/if}
          {/each}
        </section>
      {/if}
    </aside>
  </section>
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    max-height: 100%;

    nav {
      min-height: 40px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #665c54;

      padding: 0 20px;

      .map-size-btns {
        display: flex;
        gap: 4px;
        height: 100%;
      }
    }

    section {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 100%;

      .map-view {
        display: flex;
        justify-content: center;
        align-items: center;
        background-position: top left;
        background-repeat: repeat;
        background-size: 32px;
        flex-grow: 1;
        height: 100%;
        position: relative;
        max-height: 100%;

        canvas {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);

          // background-color: #282828;
          border: 1px solid #665c54;
          max-height: 100%;
          min-width: 512px;
          max-width: 100%;
        }
      }

      aside {
        background-color: #1d2021;
        flex-grow: 1;
        flex-shrink: 0;
        min-width: 300px;
        max-width: 300px;
        font-size: 10px;
        max-height: 100%;

        overflow: auto;

        section.zones {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        section.lights {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;

          .light-rect {
            width: 8px;
            height: 8px;
            display: inline-block;
          }
        }
      }
    }
  }
</style>
