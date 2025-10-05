<script lang="ts">
  let { color, width }: { color?: string; width?: number } = $props()
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" {color} {width}>
  <path
    d="M80 16 v96"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="8"
    stroke="currentColor"
    fill="none" />
  <path
    d="M16 64 h64"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="6"
    stroke-dasharray="8 10"
    stroke="currentColor"
    fill="none" />

  <path
    d="M80 64 C70 38 60 23 35 15"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="3"
    stroke-dasharray="0 3"
    stroke="currentColor"
    fill="none" />
</svg>
