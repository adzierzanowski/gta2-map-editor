import {
  BoundingInfo,
  Color3,
  Color4,
  EventState,
  KeyboardInfo,
  Mesh,
  MeshBuilder,
  StandardMaterial,
  Vector3,
} from 'babylonjs'
import type { BabylonRenderer } from '../Renderer.svelte'
import { BabylonTool } from './BabylonTool.svelte'
import { babylonCfg } from '@app/state'
import type { IPoint3D } from '@lib/geometry'
import { get } from 'svelte/store'

export class SelectionTool extends BabylonTool {
  selectionNode: Mesh
  selectionStartMesh: Mesh
  selectionEndMesh: Mesh

  constructor(rnd: BabylonRenderer) {
    super(rnd)

    this.selectionNode = new Mesh('selection', this.rnd.scene)
    this.selectionStartMesh = MeshBuilder.CreateBox(
      'selectionStart',
      { width: 1, height: 1, depth: 1 },
      this.rnd.scene,
    )
    this.selectionEndMesh = MeshBuilder.CreateBox(
      'selectionEnd',
      { width: 1, height: 1, depth: 1 },
      this.rnd.scene,
    )

    const transparentMaterial = new StandardMaterial(
      'transparent',
      this.rnd.scene,
    )
    transparentMaterial.alpha = 0
    this.selectionStartMesh.enableEdgesRendering(1, true, {
      useAlternateEdgeFinder: true,
      applyTessellation: true,
    })
    this.selectionStartMesh.material = transparentMaterial
    this.selectionStartMesh.isPickable = false
    this.selectionStartMesh.edgesWidth = 4
    this.selectionStartMesh.setParent(this.selectionNode)

    this.selectionEndMesh.enableEdgesRendering(1, true, {
      useAlternateEdgeFinder: true,
      applyTessellation: true,
    })
    this.selectionEndMesh.edgesColor = new Color4(1, 1, 0, 1)
    this.selectionEndMesh.material = transparentMaterial
    this.selectionEndMesh.isPickable = false
    this.selectionEndMesh.edgesWidth = 4
    this.selectionEndMesh.setParent(this.selectionNode)

    this.selectionNode.showBoundingBox = true

    babylonCfg.selection.subscribe(sel => {
      if (sel) {
        this.selectionStartMesh.setEnabled(true)
        this.selectionEndMesh.setEnabled(true)
        this.selectionStartMesh.position = new Vector3(
          sel.start.x,
          sel.start.y,
          sel.start.z,
        )
        this.selectionEndMesh.position = new Vector3(
          sel.end.x,
          sel.end.y,
          sel.end.z,
        )

        const { min, max } = this.selectionNode.getHierarchyBoundingVectors()
        this.selectionNode.setBoundingInfo(new BoundingInfo(min, max))
        this.rnd.blocksNode.getChildMeshes().forEach(node => {
          // if (node.intersectsMesh(this.selectionNode)) {
          if (this.selectionNode.intersectsPoint(node.position)) {
            node.renderOverlay = true
            node.overlayAlpha = 0.1
            node.overlayColor = new Color3(1, 1, 0)
          } else {
            node.renderOverlay = false
          }
        })
      } else {
        this.selectionStartMesh.setEnabled(false)
        this.selectionEndMesh.setEnabled(false)
      }
    })
  }

  onActivate() {
    this.selectionNode.setEnabled(true)
    this.rnd.pickedMesh?.disableEdgesRendering()
  }

  onDeactivate() {
    this.selectionNode.setEnabled(false)
    this.rnd.blocksNode
      .getChildMeshes()
      .forEach(node => (node.renderOverlay = false))
  }

  onKey(event: KeyboardInfo, state: EventState) {
    const e = event.event
    let handled = true
    const rect = get(babylonCfg.rect)
    const min: IPoint3D = { x: 0, y: 0, z: 0 }
    const max: IPoint3D = { x: rect.h - 1, y: 7, z: rect.w - 1 }

    switch (e.code) {
      case 'Escape':
        babylonCfg.selection.update(prev => prev?.singularity)
        break

      case 'KeyW': {
        const dp: IPoint3D = { x: -1, y: 0, z: 0 }
        babylonCfg.selection.update(prev =>
          e.shiftKey
            ? prev?.translateEnd(dp).clamp(min, max)
            : prev?.translate(dp).clamp(min, max),
        )
        break
      }

      case 'KeyS': {
        const dp: IPoint3D = { x: 1, y: 0, z: 0 }
        babylonCfg.selection.update(prev =>
          e.shiftKey
            ? prev?.translateEnd(dp).clamp(min, max)
            : prev?.translate(dp).clamp(min, max),
        )
        break
      }

      case 'KeyA': {
        const dp: IPoint3D = { x: 0, y: 0, z: -1 }
        babylonCfg.selection.update(prev =>
          e.shiftKey
            ? prev?.translateEnd(dp).clamp(min, max)
            : prev?.translate(dp).clamp(min, max),
        )
        break
      }

      case 'KeyD': {
        const dp: IPoint3D = { x: 0, y: 0, z: 1 }
        babylonCfg.selection.update(prev =>
          e.shiftKey
            ? prev?.translateEnd(dp).clamp(min, max)
            : prev?.translate(dp).clamp(min, max),
        )
        break
      }

      case 'KeyE': {
        const dp: IPoint3D = { x: 0, y: 1, z: 0 }
        babylonCfg.selection.update(prev =>
          e.shiftKey
            ? prev?.translateEnd(dp).clamp(min, max)
            : prev?.translate(dp).clamp(min, max),
        )
        break
      }

      case 'KeyQ': {
        const dp: IPoint3D = { x: 0, y: -1, z: 0 }
        babylonCfg.selection.update(prev =>
          e.shiftKey
            ? prev?.translateEnd(dp).clamp(min, max)
            : prev?.translate(dp).clamp(min, max),
        )
        break
      }

      case 'KeyF': {
        const sel = get(babylonCfg.selection)
        if (!sel) {
          return false
        }
        const c = sel.center
        console.log({ c })
        if (c) {
          this.rnd.camera.setTarget(new Vector3(c.x, c.y, c.z))
        }
        break
      }

      default:
        handled = false
    }
    return handled
  }
}
