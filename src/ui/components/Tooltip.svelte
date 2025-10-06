<script lang="ts">
  let {
    children,
    content,
    pos = 'bottom',
  }: {
    children?: any
    content?: any
    pos?: 'top' | 'right' | 'left' | 'bottom'
  } = $props()
  let showTooltip = $state(false)

  let style: string = $derived.by(() => {
    switch (pos) {
      case 'right':
        return 'top: 50%; right: -8px; transform: translate(100%, -50%);'
      case 'top':
        return 'top: -8px; left: 50%; transform:translate(-50%, -100%);'
      default:
        return ''
    }
  })
</script>

<main
  onmouseenter={() => (showTooltip = true)}
  onmouseleave={() => (showTooltip = false)}>
  {@render children?.()}
  {#if showTooltip}
    <div class="tooltip" {style}>
      <div>{content}</div>
    </div>
  {/if}
</main>

<style lang="scss">
  main {
    position: relative;

    .tooltip {
      pointer-events: none;
      background-color: #00000020;
      backdrop-filter: blur(2px);
      font-size: 12px;
      padding: 8px 16px;
      position: absolute;
      z-index: 10000;
      width: max-content;
    }
  }
</style>
