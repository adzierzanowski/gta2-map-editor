<script lang="ts">
  let {
    show,
    children,
    onclose,
  }: { show?: boolean; children?: any; onclose?: () => void } = $props()
</script>

{#if show}
  <main>
    <section>
      {@render children?.()}
    </section>
  </main>
{/if}

<style lang="scss">
  main {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(2px);

    section {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
