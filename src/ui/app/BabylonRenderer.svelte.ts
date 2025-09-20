import {
  AbstractMesh,
  ArcRotateCamera,
  Color3,
  Color4,
  Engine,
  EventState,
  HemisphericLight,
  KeyboardEventTypes,
  KeyboardInfo,
  Mesh,
  PointerEventTypes,
  PointerInfo,
  RawTexture,
  Scene,
  StandardMaterial,
  TransformNode,
  Vector3,
} from 'babylonjs'
import type { IRect } from '../../lib/geometry'
import type { GtaMap } from './mapLoader/GtaMap'
import { createMeshForBlock, createSlopePrototype } from './mapLoader/BlockMesh'
import { slopeDefs } from './mapLoader/meshData'

export class BabylonRenderer {
  engine: Engine
  scene: Scene
  light: HemisphericLight
  camera: ArcRotateCamera

  pickedMesh?: AbstractMesh = $state()

  constructor(cvs: HTMLCanvasElement) {
    this.engine = new Engine(cvs)
    this.scene = new Scene(this.engine)

    this.scene.clearColor = new Color4(0.04, 0.05, 0.1, 1)

    this.createSlopePrototypes()

    this.light = new HemisphericLight('light', new Vector3(1, 1, 1), this.scene)
    this.light.intensity = 1.8
    this.camera = new ArcRotateCamera(
      'camera',
      0,
      0.8,
      32,
      new Vector3(8, 4, 8),
      this.scene,
    )

    this.camera.attachControl()
    this.scene.onPointerObservable.add(this.onPick.bind(this))
    this.scene.onKeyboardObservable.add(this.onKey.bind(this))

    // this.scene.debugLayer.show()
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }

  onKey(e: KeyboardInfo, s: EventState) {
    if (e.type === KeyboardEventTypes.KEYDOWN) {
      switch (e.event.code) {
        case 'KeyF':
          if (this.pickedMesh) {
            this.camera.setTarget(this.pickedMesh.position.clone())
          }
          break
        case 'KeyI':
          this.scene.debugLayer.show()
          break
      }
    }
  }

  onPick(e: PointerInfo, s: EventState) {
    if (e.type === PointerEventTypes.POINTERPICK) {
      const pickedMesh = e.pickInfo?.pickedMesh
      if (pickedMesh) {
        if (this.pickedMesh) {
          this.pickedMesh.disableEdgesRendering()
        }
        this.pickedMesh = pickedMesh
        pickedMesh.enableEdgesRendering()
        pickedMesh.edgesColor = new Color4(0, 1, 1, 1)
      }
    }
  }

  async createAtlas(map: GtaMap) {
    const material = new StandardMaterial('atlas', this.scene)
    const texture = new RawTexture(
      map.tileAtlas.data,
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
    // material.maxSimultaneousLights = 16
    material.specularColor = new Color3(0.1, 0.1, 0.1)
    material.diffuseTexture = texture
    material.useAlphaFromDiffuseTexture = true

    const material2 = material.clone('atlas-flat')
    material2.diffuseTexture = texture
    material2.backFaceCulling = false
    material2.separateCullingPass = true
    material2.useAlphaFromDiffuseTexture = true
    material2.alpha = 1
  }

  createSlopePrototypes() {
    const prototypes = new TransformNode('prototypes', this.scene)
    for (const slope of Object.keys(slopeDefs)) {
      createSlopePrototype(
        `slope${slope}`,
        parseInt(slope),
        this.scene,
      ).setParent(prototypes)
    }
    prototypes.setEnabled(false)
  }

  async populate(map: GtaMap, rect: IRect) {
    const existing = this.scene.getTransformNodeByName('blocks')
    if (existing) {
      existing.name = 'existing'
    }
    const blocksNode = new TransformNode('blocks', this.scene)

    for (let y = 0; y < rect.h; y++) {
      for (let x = 0; x < rect.w; x++) {
        for (let z = 0; z < 8; z++) {
          const block = map.blocks.get(
            JSON.stringify({ x: x + rect.x, y: y + rect.y, z }),
          )
          if (block) {
            if (
              [
                block.lid,
                block.bottom,
                block.right,
                block.top,
                block.left,
              ].every(x => x === 0)
            ) {
              continue
            }
            const pos = { x: rect.x + x, y: rect.y + y, z }
            const name = `block-${pos.x}-${pos.y}-${pos.z}`
            let blockMesh = this.scene.getMeshByName(name) as Mesh | undefined
            if (!blockMesh) {
              blockMesh = createMeshForBlock(pos, block, this.scene)
            }
            if (blockMesh) {
              blockMesh.position = new Vector3(y, z, x)
              blockMesh.setParent(blocksNode)
            }
          }
        }
      }
    }

    if (existing) {
      existing.dispose()
    }
  }
}
