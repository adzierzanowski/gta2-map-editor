<script lang="ts">
  import Button from '@components/Button.svelte'
  import wasted from '@assets/wasted.png'

  let {
    error = $bindable(undefined),
    reset,
  }: { error: any; reset: () => void } = $props()

  const onReset = () => {
    error = undefined
    reset()
  }
</script>

<main style={`background-image: url(${wasted})`}>
  <div class="info">
    <h1>the following thing went wrong</h1>

    <section class="details">
      {error}
    </section>

    <nav><Button onclick={onReset}>well, that sucks :/</Button></nav>
  </div>
</main>

<style>
  main {
    border: 8px dashed #fb4934;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fb4934;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    /* .details */

    .info {
      backdrop-filter: brightness(0.25) blur(2px);
      padding: 40px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      border: 1px solid #fb4934;
    }

    h1 {
      font-size: 3rem;
      margin: 0;
    }

    :global(button) {
      padding: 10px 20px;
      background-color: #d79921;
      color: black;
      font-weight: bold;

      &:hover {
        background-color: #fabd2f;
      }
    }
    nav {
      align-self: flex-end;
    }
  }
</style>
