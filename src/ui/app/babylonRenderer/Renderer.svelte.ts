import type { GtaMap } from '@app/mapHandler'
import { babylonCfg } from '@app/state'
import type { IPoint3D, Rect } from '@lib/geometry'
import {
  Engine,
  Scene,
  ArcRotateCamera,
  EngineView,
  HemisphericLight,
  AbstractMesh,
  TransformNode,
  Color4,
  Vector3,
  PointLight,
  StandardMaterial,
  RawTexture,
  Color3,
  PointerInfo,
  EventState,
  PointerEventTypes,
  KeyboardInfo,
  KeyboardEventTypes,
} from 'babylonjs'
import {
  createSlopePrototype,
  createArrowPrototype,
  createMeshForBlock,
} from './mesh'
import { slopeDefs } from './mesh/meshData'
import { get } from 'svelte/store'
import { updateLights } from './scene/LightUpdater'
import { blockUpdater } from './scene'
import { stats } from '@app/state/Stats.svelte'

export class BabylonRenderer {
  engine: Engine
  scene: Scene
  camera: ArcRotateCamera
  view?: EngineView
  light: HemisphericLight
  map?: GtaMap
  pickedMesh?: AbstractMesh = $state()

  rebuildCount: number = 0

  arrowsNode: TransformNode
  blocksNode: TransformNode
  lightsNode: TransformNode

  blockMeshes: Map<string, AbstractMesh | null> = new Map()
  lightNodes: Map<IPoint3D, PointLight> = new Map()

  constructor(
    backCvs: HTMLCanvasElement,
    cvs: HTMLCanvasElement,
    map?: GtaMap,
  ) {
    console.log('new renderer')
    this.map = $derived(map)

    this.engine = new Engine(backCvs, true)
    this.engine.inputElement = cvs
    this.scene = new Scene(this.engine)
    this.scene.clearColor = new Color4(0.04, 0.05, 0.1, 1)

    this.arrowsNode = new TransformNode('arrows', this.scene)
    this.blocksNode = new TransformNode('blocks', this.scene)
    this.lightsNode = new TransformNode('lights', this.scene)
    this.lightsNode.setEnabled(true)

    this.camera = new ArcRotateCamera(
      'camera',
      Math.PI * 2,
      Math.PI / 2,
      get(babylonCfg.rect).w * 1.5,
      Vector3.Zero(),
      this.scene,
    )
    this.light = new HemisphericLight('light', new Vector3(1, 1, 1), this.scene)

    this.scene.onKeyboardObservable.add(this.onKey, undefined, undefined, this)
    this.scene.onPointerObservable.add(
      this.onPointer,
      undefined,
      undefined,
      this,
    )

    babylonCfg.rect.subscribe(rect => {
      this.scene.onBeforeRenderObservable.runCoroutineAsync(
        this.updateScene(rect),
      )
    })

    babylonCfg.showArrows.subscribe(showArrows => {
      this.scene.onBeforeRenderObservable.runCoroutineAsync(
        this.updateScene(get(babylonCfg.rect)),
      )
    })

    babylonCfg.showLights.subscribe(showLights => {
      this.scene.resetDrawCache()
      this.scene.onBeforeRenderObservable.runCoroutineAsync(
        this.updateScene(get(babylonCfg.rect)),
      )
    })

    babylonCfg.mapLightIntensity.subscribe(intensity => {
      const lights: PointLight[] = this.lightsNode.getChildren()
      for (const l of lights) {
        l.intensity = intensity
      }
    })

    babylonCfg.mapLightRange.subscribe(range => {
      const lights: PointLight[] = this.lightsNode.getChildren()
      for (const l of lights) {
        l.range = parseFloat(l.state) * range
      }
    })

    babylonCfg.ambientLightIntensity.subscribe(
      val => (this.light.intensity = val),
    )

    this.reattach(cvs)
  }

  reattach(cvs: HTMLCanvasElement) {
    console.log('reattaching')
    this.engine.inputElement = cvs

    if (this.view) {
      this.engine.unRegisterView(this.view.target)
      this.view = undefined
    }

    this.view = this.engine.registerView(cvs, this.camera)

    this.camera.detachControl()

    this.camera.inputs.remove(this.camera.inputs.attached.keyboard)
    this.camera.inputs.addKeyboard()
    this.camera.inputs.remove(this.camera.inputs.attached.pointers)
    this.camera.inputs.addPointers()

    this.camera.attachControl(true)

    this.scene.detachControl()
    this.scene.attachControl(true, true, true)

    this.engine.resize()

    if (this.engine.activeRenderLoops.length === 0) {
      this.resume()
    }
  }

  async render() {
    this.scene.render()
  }

  resume() {
    this.engine.runRenderLoop(this.render.bind(this))
  }

  pause() {
    this.unpickBlock()
    this.engine.stopRenderLoop()
  }

  async rebuild() {
    await this.createAtlas()
    this.createSlopePrototypes()

    if (this.rebuildCount === 0) {
      this.resetCamera()
    }
    this.rebuildCount++
  }

  resetCamera() {
    this.camera.target = new Vector3(
      get(babylonCfg.rect).h / 2,
      4,
      get(babylonCfg.rect).w / 2,
    )
    this.camera.alpha = 2 * Math.PI
    this.camera.beta = Math.PI / 4
    this.camera.radius = (get(babylonCfg.rect).w * Math.PI) / 2
  }

  unpickBlock() {
    if (this.pickedMesh) {
      this.pickedMesh.disableEdgesRendering()
      this.pickedMesh = undefined
    }
  }

  async createAtlas() {
    if (this.scene.getMaterialByName('atlas')) {
      return
    }
    if (!this.map) {
      return
    }

    const material = new StandardMaterial('atlas', this.scene)
    const texture = new RawTexture(
      this.map.tileAtlas.data,
      64 * 32,
      64 * 32,
      Engine.TEXTUREFORMAT_RGBA,
      this.scene,
    )
    texture.hasAlpha = true
    texture.vScale = -1
    texture.vOffset = 1
    texture.updateSamplingMode(1)
    material.alpha = 1
    material.maxSimultaneousLights = 32
    material.specularColor = new Color3(0.1, 0.1, 0.1)
    material.diffuseTexture = texture
    material.useAlphaFromDiffuseTexture = true
    material.freeze()
  }

  createSlopePrototypes() {
    if (this.scene.getTransformNodeByName('prototypes')) {
      return
    }
    if (!this.map) {
      return
    }

    const prototypes = new TransformNode('prototypes', this.scene)

    for (const slope of Object.keys(slopeDefs)) {
      createSlopePrototype(
        `slope${slope}`,
        parseInt(slope),
        this.scene,
      ).setParent(prototypes)
    }

    const arrow = createArrowPrototype(this.scene)
    arrow.setParent(prototypes)

    prototypes.setEnabled(false)
  }

  *updateScene(rect: Rect) {
    updateLights(this, rect)

    yield

    this.arrowsNode.dispose()
    this.arrowsNode = new TransformNode('arrows', this.scene)

    const blockUpdateStart = performance.now()
    const bu = blockUpdater(this, rect)

    for (;;) {
      let { done: buDone } = bu.next()

      yield

      if (!get(babylonCfg.rect).equals(rect)) {
        return
      }

      if (buDone) {
        stats.lastBlockUpdateTime.set(performance.now() - blockUpdateStart)
        stats.blockMeshesCount.set(this.blockMeshes.size)
        return
      }
    }
  }

  createBlockMesh(pos: IPoint3D) {
    const blockInfo = this.map?.blocks.get(JSON.stringify(pos))
    if (!blockInfo) return
    if (blockInfo.empty) return
    const mesh = createMeshForBlock(
      JSON.stringify(pos),
      pos,
      blockInfo,
      this.scene,
    )
    if (mesh) {
      mesh.setParent(this.blocksNode)
    }
    return mesh
  }

  onPointer(event: PointerInfo, state: EventState) {
    if (event.type === PointerEventTypes.POINTERPICK) {
      const picked = event.pickInfo?.pickedMesh
      if (picked) {
        if (this.pickedMesh) {
          this.pickedMesh.disableEdgesRendering()
        }

        this.pickedMesh = picked
        this.pickedMesh.enableEdgesRendering()
        this.pickedMesh.edgesColor = new Color4(0, 1, 1, 1)
        this.pickedMesh.edgesWidth = 4
      }
    }
  }

  onKey(event: KeyboardInfo, state: EventState) {
    if (event.type === KeyboardEventTypes.KEYDOWN) {
      const e = event.event
      switch (e.code) {
        case 'Escape':
          this.unpickBlock()
          break

        case 'KeyF':
          if (this.pickedMesh) {
            this.camera.target = this.pickedMesh.position.clone()
          }
          break

        case 'KeyC':
          this.resetCamera()
          break

        case 'KeyW':
          babylonCfg.rect.update(prev =>
            prev
              .translated({
                y: e.shiftKey ? -Math.floor(prev.h / 2) : -1,
                x: 0,
              })
              .clamp(get(babylonCfg.rectConstraint)),
          )
          break

        case 'KeyS':
          babylonCfg.rect.update(prev =>
            prev
              .translated({
                y: e.shiftKey ? Math.floor(prev.h / 2) : 1,
                x: 0,
              })
              .clamp(get(babylonCfg.rectConstraint)),
          )
          break

        case 'KeyA':
          babylonCfg.rect.update(prev =>
            prev
              .translated({
                x: e.shiftKey ? -Math.floor(prev.h / 2) : -1,
                y: 0,
              })
              .clamp(get(babylonCfg.rectConstraint)),
          )
          break

        case 'KeyD':
          babylonCfg.rect.update(prev =>
            prev
              .translated({
                x: e.shiftKey ? Math.floor(prev.h / 2) : 1,
                y: 0,
              })
              .clamp(get(babylonCfg.rectConstraint)),
          )
          break

        case 'KeyI':
          const visible = this.scene.debugLayer.isVisible()
          this.scene.debugLayer.hide()
          if (!visible) {
            this.scene.debugLayer.show()
          }
          break
      }
    }
  }
}
