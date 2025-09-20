<script lang="ts">
  import FloatingWindow from '../containers/FloatingWindow.svelte'

  let {
    onAddBlock,
    newX = $bindable(),
    newY = $bindable(),
    newZ = $bindable(),
  }: {
    onAddBlock: () => void
    newX: string
    newY: string
    newZ: string
  } = $props()
</script>

<FloatingWindow
  initialRect={{ x: 450, y: 40, w: 100, h: 100 }}
  title="New Block"
>
  <main>
    <input class="x" bind:value={newX} />
    <input class="y" bind:value={newY} />
    <input class="z" bind:value={newZ} />
    <button onclick={onAddBlock}>Add</button>
  </main>
</FloatingWindow>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;

    input {
      background-color: #0000;
      border: 1px solid #504945;

      &.x {
        color: #fb4934;
      }
      &.y {
        color: #b8bb26;
      }
      &.z {
        color: #83a598;
      }
    }

    button {
      background-color: #7c6f64;
      color: #ebdbb2;
    }
  }
</style>
