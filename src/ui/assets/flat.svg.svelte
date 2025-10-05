<script lang="ts">
  let { color, width }: { color?: string; width?: number } = $props()
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" {color} {width}>
  <path
    d="M16 96 h96 M 16 80 h96"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="8"
    stroke="currentColor"
    fill="none" />
</svg>
