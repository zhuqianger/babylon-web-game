import { Engine, Scene, Vector3 } from 'babylonjs'
import { Player } from './Player'
import { CameraController } from './CameraController'
import { World } from './World'
import { InputManager } from './InputManager'
import { GameUI } from './GameUI'

export class GameEngine {
  private engine: Engine
  private scene: Scene
  private player: Player
  private cameraController: CameraController
  private world: World
  private inputManager: InputManager
  private gameUI: GameUI
  private isRunning: boolean = false
  private lastUIUpdate: number = 0
  private uiUpdateInterval: number = 100 // UI更新间隔（毫秒）

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true, {
      preserveDrawingBuffer: false,
      stencil: false,
      antialias: false, // 关闭抗锯齿以提高性能
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: false
    })
    
    this.scene = new Scene(this.engine)
    this.setupScene()
    
    this.inputManager = new InputManager()
    this.world = new World(this.scene)
    this.player = new Player(this.scene, this.inputManager)
    this.cameraController = new CameraController(this.scene, this.player)
    this.gameUI = new GameUI()
    
    this.setupEventListeners()
  }

  private setupScene(): void {
    // 优化场景性能
    this.scene.clearCachedVertexData()
    this.scene.autoClear = false
    this.scene.autoClearDepthAndStencil = false
    this.scene.skipPointerMovePicking = true
    
    // 启用场景优化
    this.scene.freezeActiveMeshes()
    this.scene.disableDepthRenderer()
  }

  private setupEventListeners(): void {
    // 处理窗口大小变化
    window.addEventListener('resize', () => {
      this.engine.resize()
    })
  }

  public start(): void {
    if (this.isRunning) return
    
    this.isRunning = true
    this.world.initialize()
    this.player.initialize()
    this.cameraController.initialize()
    this.gameUI.initialize()
    
    this.engine.runRenderLoop(() => {
      this.update()
      this.scene.render()
    })
  }

  public stop(): void {
    this.isRunning = false
    this.engine.stopRenderLoop()
  }

  private update(): void {
    if (!this.isRunning) return
    
    const deltaTime = this.engine.getDeltaTime() / 1000
    const currentTime = performance.now()
    
    // 更新游戏逻辑
    this.player.update(deltaTime)
    this.cameraController.update(deltaTime)
    this.world.update(deltaTime)
    
    // 限制UI更新频率
    if (currentTime - this.lastUIUpdate > this.uiUpdateInterval) {
      this.gameUI.update(this.player.getStats())
      this.lastUIUpdate = currentTime
    }
  }

  public dispose(): void {
    this.stop()
    this.player.dispose()
    this.cameraController.dispose()
    this.world.dispose()
    this.gameUI.dispose()
    this.scene.dispose()
    this.engine.dispose()
  }

  public getScene(): Scene {
    return this.scene
  }

  public getPlayer(): Player {
    return this.player
  }
} 