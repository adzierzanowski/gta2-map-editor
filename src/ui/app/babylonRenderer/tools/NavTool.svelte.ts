import type { BabylonRenderer } from '../Renderer.svelte'
import { BabylonTool } from './BabylonTool.svelte'

export class NavTool extends BabylonTool {
  constructor(rnd: BabylonRenderer) {
    super(rnd)
  }

  onActivate(): void {
    this.rnd.pickedMesh?.enableEdgesRendering()
  }

  onDeactivate(): void {}
}
