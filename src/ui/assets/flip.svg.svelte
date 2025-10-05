<script lang="ts">
  let { color, width }: { color?: string; width?: number } = $props()
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" {width} {color}>
  <path
    d=" M64 16 v 96 M56 64 l-24 -24 v48z M72 64 l24 24 v-48z"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="8"
    stroke="currentColor"
    fill="none" />
</svg>
