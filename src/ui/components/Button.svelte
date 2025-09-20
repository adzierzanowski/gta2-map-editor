<script lang="ts">
  export type ButtonProps = {
    onclick?: () => void
    active?: boolean
    children?: any
    disabled?: boolean
    style?: string
    // className?: string
  }
  const { disabled, onclick, active, children, style }: ButtonProps = $props()
</script>

<button {style} {disabled} {onclick} class={{ active }}
  >{@render children?.()}</button
>

<style>
  button {
    background-color: #111;
    color: #ebdbb2;
    border: 0;
    cursor: pointer;
    padding: 4px;

    &:disabled {
      filter: grayscale(1);
      cursor: initial;
      color: gray;
    }

    &.active {
      color: #fe8019;
    }

    &:hover {
      background-color: #282828;
    }
  }
</style>
