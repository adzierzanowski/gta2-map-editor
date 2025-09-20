<script lang="ts">
  import { helperFunctions } from 'babylonjs'
  import { Point, Rect, type IRect } from '../../lib/geometry'
  let {
    children,
    title,
    initialRect,
  }: { children?: any; title?: string; initialRect?: IRect } = $props()

  let rect: Rect = $state(
    new Rect(initialRect ?? { x: 500, y: 500, w: 200, h: 400 }),
  )
  let dragRect: Rect | undefined = $state()
  let dragStart: Point | undefined = $state()
</script>

<main
  style={`top: ${rect.y}px; left: ${rect.x}px; width: ${rect.w}px; height: ${rect.h}px;`}
>
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <nav
    onmousedown={e => {
      dragStart = new Point({ x: e.clientX, y: e.clientY })
      dragRect = new Rect(rect)
    }}
    onmouseup={e => {
      dragStart = undefined
      dragRect = undefined
    }}
    onmousemove={e => {
      if (dragStart && dragRect) {
        const dragDelta = new Point({ x: e.clientX, y: e.clientY }).sub(
          dragStart,
        )
        rect = dragRect.translated(dragDelta)
      }
    }}
  >
    {title}
  </nav>
  <section>
    {@render children?.()}
  </section>
</main>

<style lang="scss">
  main {
    position: absolute;
    z-index: 2;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    border-radius: 4px;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;

    nav {
      width: 100%;
      height: 24px;
      background-color: #32302f;
      color: #bdae93;
      display: flex;
      align-items: center;
      padding: 0 4px;
      cursor: pointer;
      border-top-left-radius: inherit;
      border-top-right-radius: inherit;
    }

    section {
      width: 100%;
      height: 100%;
      overflow: auto;
      border: 1px solid #32302f;
      backdrop-filter: blur(4px) brightness(0.6);
    }
  }
</style>
