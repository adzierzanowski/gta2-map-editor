<script lang="ts">
  import FloatingWindow from '@containers/FloatingWindow.svelte'
  import { Rect } from '@lib/geometry'

  let {
    rect = $bindable(new Rect({ x: 0, y: 0, w: 8, h: 8 })),
  }: { rect: Rect } = $props()
</script>

<FloatingWindow
  title="Map Position"
  initialRect={{ x: 570, y: 40, w: 200, h: 50 }}>
  <main>
    {rect.toString()}
  </main>
</FloatingWindow>

<style lang="scss">
  main {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 8px;
    background-color: #689d6a15;
    gap: 4px;
    height: 100%;

    button {
      background-color: #0000;
      border-radius: 2px;
      border: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      cursor: pointer;
    }
  }
</style>
