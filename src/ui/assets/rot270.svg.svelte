<script lang="ts">
  let { color, width }: { color?: string; width?: number } = $props()
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" {color} {width}>
  <path
    d="M16 68a48 48 90 0048 48 48 48 90 0048-48 48 48 90 00-48-48l11 19m-11-19 16-15"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="10"
    stroke="currentColor"
    fill="none" />
  <text fill="currentColor" y="85" x="30" font-size="44">270&deg;</text>
</svg>
