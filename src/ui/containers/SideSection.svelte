<script lang="ts">
  let {
    expanded = $bindable(true),
    children,
    title,
  }: { expanded?: boolean; children?: any; title: string } = $props()
</script>

<main>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <header onclick={() => (expanded = !expanded)}>
    <div>
      {title}
    </div>
    {#if expanded}
      &uarr;
    {:else}
      &darr;
    {/if}
  </header>
  <section class={{ expanded }}>
    {@render children?.()}
  </section>
</main>

<style lang="scss">
  main {
    section {
      padding: 10px;
      flex-direction: column;
      gap: 4px;
      display: none;

      & > * {
        padding: 10px;
      }

      &.expanded {
        display: flex;
      }
    }

    header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      background-color: #282828;
      padding: 4px 8px;
      border-bottom: 1px solid #32302f;
      cursor: pointer;
      &:hover {
        background-color: #1d2021;
      }
    }

    :global {
      & > div {
        padding: 10px;
      }
    }
  }
</style>
