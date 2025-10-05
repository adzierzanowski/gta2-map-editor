<script lang="ts">
  import GroundTypeIcon from '@components/GroundTypeIcon.svelte'
  import FloatingWindow from '@containers/FloatingWindow.svelte'
</script>

<FloatingWindow
  initialRect={{ x: 0, y: 40, w: 180, h: 80 }}
  title="Ground Type">
  <main>
    <button>
      <GroundTypeIcon width={32} groundType={0} />
    </button>
    <button>
      <GroundTypeIcon width={32} groundType={1} />
    </button>
    <button>
      <GroundTypeIcon width={32} groundType={2} />
    </button>
    <button>
      <GroundTypeIcon width={32} groundType={3} />
    </button>
  </main>
</FloatingWindow>

<style lang="scss">
  main {
    display: flex;
    padding: 10px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  button {
    background-color: #0000;
    border: 0;
    padding: 0;
    cursor: pointer;

    &:hover {
      background-color: #282828;
    }
  }
</style>
