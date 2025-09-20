<script lang="ts">
  import SlopeIcon from '../components/SlopeIcon.svelte'
  import FloatingWindow from '../containers/FloatingWindow.svelte'

  let { onchange }: { onchange?: (slope: number) => void } = $props()
</script>

<FloatingWindow
  title="Slope Picker"
  initialRect={{ x: 20, y: 50, w: 420, h: 600 }}
>
  <main>
    <SlopeIcon width={48} slope={0} />
    <div>
      {#each new Array(8).fill(0).map((_, i) => i + 1) as i}
        <button title={i.toString()} onclick={() => onchange?.(i)}
          ><SlopeIcon width={48} slope={i} /></button
        >
      {/each}
    </div>
    <div>
      {#each new Array(8).fill(0).map((_, i) => i + 9) as i}
        <button title={i.toString()} onclick={() => onchange?.(i)}
          ><SlopeIcon width={48} slope={i} /></button
        >
      {/each}
    </div>
    <div>
      {#each new Array(8).fill(0).map((_, i) => i + 17) as i}
        <button title={i.toString()} onclick={() => onchange?.(i)}
          ><SlopeIcon width={48} slope={i} /></button
        >
      {/each}
    </div>
    <div>
      {#each new Array(8).fill(0).map((_, i) => i + 25) as i}
        <button title={i.toString()} onclick={() => onchange?.(i)}
          ><SlopeIcon width={48} slope={i} /></button
        >
      {/each}
    </div>
    <div>
      {#each new Array(8).fill(0).map((_, i) => i + 33) as i}
        <button title={i.toString()} onclick={() => onchange?.(i)}
          ><SlopeIcon width={48} slope={i} /></button
        >
      {/each}
    </div>
    <div>
      {#each new Array(4).fill(0).map((_, i) => i + 37) as i}
        <button title={i.toString()} onclick={() => onchange?.(i)}
          ><SlopeIcon width={48} slope={i} /></button
        >
      {/each}
    </div>
    <div>
      {#each new Array(4).fill(0).map((_, i) => i + 41) as i}
        <button title={i.toString()} onclick={() => onchange?.(i)}
          ><SlopeIcon width={48} slope={i} /></button
        >
      {/each}
    </div>
    <div>
      {#each new Array(4).fill(0).map((_, i) => i + 45) as i}
        <button title={i.toString()} onclick={() => onchange?.(i)}
          ><SlopeIcon width={48} slope={i} /></button
        >
      {/each}
    </div>
    <div>
      {#each new Array(4).fill(0).map((_, i) => i + 49) as i}
        <button title={i.toString()} onclick={() => onchange?.(i)}
          ><SlopeIcon width={48} slope={i} /></button
        >
      {/each}
    </div>
    <div>
      {#each new Array(4).fill(0).map((_, i) => i + 53) as i}
        <button title={i.toString()} onclick={() => onchange?.(i)}
          ><SlopeIcon width={48} slope={i} /></button
        >
      {/each}
    </div>
    <div>
      {#each new Array(5).fill(0).map((_, i) => i + 57) as i}
        <button title={i.toString()} onclick={() => onchange?.(i)}
          ><SlopeIcon width={48} slope={i} /></button
        >
      {/each}
    </div>
  </main>
</FloatingWindow>

<style lang="scss">
  main {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: space-between;
    padding: 8px;
    background-color: #689d6a15;
    gap: 4px;

    & > div {
      flex-wrap: wrap;
      display: flex;
      flex-direction: row;
    }

    button {
      background-color: #0000;
      border-radius: 2px;
      border: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      cursor: pointer;
    }
  }
</style>
