import type { GtaMap } from '@app/mapHandler'
import type { ISettings } from '@app/state'
import { BlockInfo } from '@lib/gbh'
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
import { blockSpawner, blockUpdater, lightSpawner } from './scene'

export class BabylonRenderer {
  engine: Engine
  scene: Scene
  camera: ArcRotateCamera
  view?: EngineView
  light: HemisphericLight
  settings: ISettings
  map?: GtaMap
  pickedMesh?: AbstractMesh = $state()
  pickedBlock?: BlockInfo = $derived(
    this.pickedMesh ? new BlockInfo(this.pickedMesh.metadata) : undefined,
  )

  rebuildCount: number = 0

  blocksNode: TransformNode
  lightsNode: TransformNode

  constructor(
    backCvs: HTMLCanvasElement,
    cvs: HTMLCanvasElement,
    settings: ISettings,
    map?: GtaMap,
  ) {
    console.log('new renderer', { backCvs, cvs, eq: backCvs === cvs })
    this.map = $derived(map)
    this.settings = $derived(settings)

    this.engine = new Engine(backCvs, true)
    this.engine.inputElement = cvs
    this.scene = new Scene(this.engine)
    this.scene.clearColor = new Color4(0.04, 0.05, 0.1, 1)

    this.blocksNode = new TransformNode('blocks', this.scene)
    this.lightsNode = new TransformNode('lights', this.scene)

    this.camera = new ArcRotateCamera(
      'camera',
      Math.PI * 2,
      Math.PI / 2,
      settings.babylon.rect.w * 1.5,
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

    this.settings.babylon.onRectChangedObservable.add((rect, s) => {
      this.scene.onBeforeRenderObservable.runCoroutineAsync(
        this.updateScene(rect),
      )
    })

    this.reattach(cvs)
  }

  get cfg() {
    return this.settings.babylon
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

    this.camera.attachControl(true)

    this.scene.detachControl()
    this.scene.attachControl(true, true, true)

    this.engine.resize()

    if (this.engine.activeRenderLoops.length === 0) {
      this.resume()
    }
  }

  async render() {
    this.light.intensity = this.cfg.ambientLightIntensity

    const lights = this.lightsNode.getChildren()
    for (const l of lights) {
      ;(l as PointLight).intensity = this.cfg.mapLightIntensity
      ;(l as PointLight).radius = this.cfg.mapLightRadius
      ;(l as PointLight).range = this.cfg.mapLightRange
    }

    this.lightsNode.setEnabled(true)

    // if (this.cfg.showLights) {
    //   this.lightsNode.setEnabled(true)
    // } else {
    //   this.lightsNode.setEnabled(false)
    // }

    const arrows = this.scene.getTransformNodeByName('arrows')
    if (arrows) {
      arrows.setEnabled(this.cfg.showArrows)
    }

    this.scene.render()
  }

  resume() {
    this.engine.runRenderLoop(this.render.bind(this))
  }

  pause() {
    this.engine.stopRenderLoop()
  }

  async rebuild() {
    // const start = performance.now()
    // console.log('rebuild')

    await this.createAtlas()
    this.createSlopePrototypes()

    if (this.rebuildCount === 0) {
      this.resetCamera()
    }
    this.rebuildCount++
    // console.log('rebuild done', performance.now() - start, 'ms')
  }

  resetCamera() {
    this.camera.target = new Vector3(
      this.cfg.rect.h / 2,
      4,
      this.cfg.rect.w / 2,
    )
    this.camera.alpha = 2 * Math.PI
    this.camera.beta = Math.PI / 4
    this.camera.radius = (this.cfg.rect.w * Math.PI) / 2
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
    const bs = blockSpawner(this)
    const bu = blockUpdater(this)
    const ls = lightSpawner(this)

    for (;;) {
      if (!rect.equals(this.cfg.rect)) return

      const { done: bsDone, value } = bs.next()
      yield

      const { done: ulDone } = bu.next(value ?? undefined)
      yield

      const { done: lsDone } = ls.next()
      yield

      if (bsDone && ulDone && lsDone) {
        return
      }
    }
  }

  // *updateLights(rect: Rect) {
  //   if (!this.map) {
  //     return
  //   }

  //   if (this.cfg.showLights) {
  //     this.lightsNode.setEnabled(true)

  //     for (const l of this.map.lights) {
  //       const lightName = 'L' + JSON.stringify(l.pos)
  //       let lightNode = this.scene.getLightByName(lightName)

  //       if (
  //         l.pos.x >= rect.x &&
  //         l.pos.y >= rect.y &&
  //         l.pos.x <= rect.x + rect.w &&
  //         l.pos.y <= rect.y + rect.h
  //       ) {
  //         if (!lightNode) {
  //           lightNode = new PointLight(
  //             lightName,
  //             new Vector3(l.pos.y - rect.y, l.pos.z, l.pos.x - rect.x),
  //             this.scene,
  //           )
  //           lightNode.diffuse = new Color3(l.color.r, l.color.g, l.color.b)
  //           lightNode.intensity = 0.05
  //           lightNode.radius = l.radius * 2
  //           lightNode.range = l.radius * 2
  //           lightNode.parent = this.lightsNode
  //           lightNode.shadowEnabled = false
  //           lightNode.setEnabled(true)
  //         } else {
  //           lightNode.setEnabled(false)
  //         }
  //       }
  //     }
  //   } else {
  //     this.lightsNode.setEnabled(false)
  //   }
  // }

  getBlockMesh(pos: IPoint3D) {
    const mesh = this.scene.getMeshByName(JSON.stringify(pos))
    return mesh
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

  // getOrCreateBlock(pos: IPoint3D) {
  //   return this.getBlockMesh(pos) ?? this.createBlockMesh(pos)
  // }

  //         if (blockMesh) {
  //           blockMesh.position = new Vector3(y, z, x)
  //           blockMesh.setParent(blocks)

  //           if (this.settings.babylon.showArrows) {
  //             const arr = this.scene.getMeshByName('arrow')

  //             if (arr) {
  //               if (block.arrows & (1 << BlockArrow.GreenLeft)) {
  //                 const gl = arr.clone(name + '-gl', arrows)
  //                 if (gl) {
  //                   gl.position = blockMesh.position.add(
  //                     new Vector3(0, 0.51, 0),
  //                   )
  //                 }
  //               }

  //               if (block.arrows & (1 << BlockArrow.GreenRight)) {
  //                 const gl = arr.clone(name + '-gr', arrows)
  //                 if (gl) {
  //                   gl.position = blockMesh.position.add(
  //                     new Vector3(0, 0.51, 0),
  //                   )
  //                   gl.rotate(Vector3.Up(), Math.PI)
  //                 }
  //               }

  //               if (block.arrows & (1 << BlockArrow.GreenDown)) {
  //                 const gl = arr.clone(name + '-gd', arrows)
  //                 if (gl) {
  //                   gl.position = blockMesh.position.add(
  //                     new Vector3(0, 0.51, 0),
  //                   )
  //                   gl.rotate(Vector3.Up(), (3 * Math.PI) / 2)
  //                 }
  //               }

  //               if (block.arrows & (1 << BlockArrow.GreenUp)) {
  //                 const gl = arr.clone(name + '-gu', arrows)
  //                 if (gl) {
  //                   gl.position = blockMesh.position.add(
  //                     new Vector3(0, 0.51, 0),
  //                   )
  //                   gl.rotate(Vector3.Up(), Math.PI / 2)
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  // }
  //   }
  // }

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
    // console.log({ event })

    if (event.type === KeyboardEventTypes.KEYDOWN) {
      const cfg = this.cfg
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
          cfg.rect = cfg.rect
            .translated({
              y: e.shiftKey ? -Math.floor(cfg.rect.h / 2) : -1,
              x: 0,
            })
            .clamp(cfg.rectConstraint)
          break

        case 'KeyS':
          cfg.rect = cfg.rect
            .translated({
              y: e.shiftKey ? Math.floor(cfg.rect.h / 2) : 1,
              x: 0,
            })
            .clamp(cfg.rectConstraint)
          break

        case 'KeyA':
          cfg.rect = cfg.rect
            .translated({
              x: e.shiftKey ? -Math.floor(cfg.rect.h / 2) : -1,
              y: 0,
            })
            .clamp(cfg.rectConstraint)
          break

        case 'KeyD':
          cfg.rect = cfg.rect
            .translated({
              x: e.shiftKey ? Math.floor(cfg.rect.h / 2) : 1,
              y: 0,
            })
            .clamp(cfg.rectConstraint)
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
