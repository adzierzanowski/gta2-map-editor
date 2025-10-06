import type { BabylonRenderer } from '../Renderer.svelte'

export abstract class BabylonTool {
  rnd: BabylonRenderer

  constructor(rnd: BabylonRenderer) {
    this.rnd = rnd
  }

  abstract onActivate(): void
  abstract onDeactivate(): void
}
