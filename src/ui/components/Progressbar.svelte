<script lang="ts">
  let { value = $bindable(0) } = $props()
</script>

<div class="progressbar">
  <div class="progress" style={`width:${value * 100}%`}></div>
</div>

<style lang="scss">
  .progressbar {
    width: 100%;
    height: 10px;
    border: 1px solid #83a598;

    display: flex;
  }

  .progress {
    top: 0;
    left: 0;
    transition: width 0.2s;
    background-color: #83a598;
  }
</style>
