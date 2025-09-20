<script lang="ts">
  let { groundType, width }: { groundType: number; width?: number } = $props()
</script>

<svg viewBox="0 0 64 64" {width}>
  <g transform="translate(16,16)">
    {#if groundType === 0}
      <path
        d="M0 0c16-8 16 8 32 0 M0 8c16-8 16 8 32 0 M0 16c16-8 16 8 32 0"
        stroke="#fff"
        fill="none"
        transform="translate(0,8)"
      />
    {:else if groundType === 1}
      <path
        d="M0 0 v32 M32 0 v32 M16 0 v8 m0 4 v8 m0 4 v8"
        stroke="#fff"
        fill="none"
      />
    {:else if groundType === 2}
      <path
        d="M 0 0h32 v32 h-32 z M 0 8h32 m 0 8 h-32 m 0 8 h32 M8 0v32 m8 0 v-32 m8 0 v32"
        stroke="#fff"
        fill="none"
      />
    {:else if groundType === 3}
      <path
        d="M0 8 l4 -4 M8 8 l4 -4 M16 8 l4 -4 M24 8 l4 -4 M4 16 l4 -4 M12 16 l4 -4 M20 16 l4 -4 M28 16 l4 -4 M0 24 l4 -4 M8 24 l4 -4 M16 24 l4 -4 M24 24 l4 -4 M4 32 l4 -4 M12 32 l4 -4 M20 32 l4 -4 M28 32 l4 -4"
        stroke="#fff"
        fill="none"
      />
    {/if}
  </g>
</svg>

<style lang="scss">
</style>
