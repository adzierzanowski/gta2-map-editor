<script lang="ts">
  let { color, width }: { color?: string; width?: number } = $props()
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" {color} {width}>
  <path
    d="M16 16 h96 v96 h-96z M32 16 v16 M 64 16 v 16 M 96 16 v 16 M16 32 h96 M48 32 v 16 M80 32 v 16 M16 48 h96 M32 48 v16 M 64 48 v16 M96 48v16M16 64h96 M48 64 v16 M80 64 v16 M16 80 h96 M32 80 v16 M64 80 v16 M 96 80 v16 M16 96 h96 "
    stroke-linecap="round" stroke-linejoin="round" stroke-width="4" stroke="currentColor" fill="none" />
</svg>
