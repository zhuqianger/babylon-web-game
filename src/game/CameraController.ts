import { Scene, FollowCamera, Vector3, ArcRotateCamera } from 'babylonjs'
import { Player } from './Player'

export class CameraController {
  private scene: Scene
  private player: Player
  private camera!: FollowCamera
  private distance: number = 8
  private height: number = 3
  private rotationSpeed: number = 2.0
  private zoomSpeed: number = 1.0
  private minDistance: number = 3
  private maxDistance: number = 15
  private currentRotation: number = 0
  private lastUpdateTime: number = 0
  private updateInterval: number = 16 // 约60fps的更新频率

  constructor(scene: Scene, player: Player) {
    this.scene = scene
    this.player = player
  }

  public initialize(): void {
    // 创建跟随相机
    this.camera = new FollowCamera(
      'camera',
      new Vector3(0, this.height, -this.distance),
      this.scene
    )

    // 设置相机参数
    this.camera.radius = this.distance
    this.camera.heightOffset = this.height
    this.camera.rotationOffset = this.currentRotation
    this.camera.cameraAcceleration = 0.1 // 增加加速度
    this.camera.maxCameraSpeed = 20 // 增加最大速度
    this.camera.lockedTarget = this.player.getMesh()

    // 设置相机控制
    this.setupCameraControls()
  }

  private setupCameraControls(): void {
    // 鼠标滚轮缩放
    this.scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === 2) { // 滚轮事件
        const wheelEvent = pointerInfo.event as WheelEvent
        const delta = wheelEvent.deltaY
        this.zoom(delta > 0 ? -1 : 1)
      }
    })

    // 鼠标右键旋转视角
    let isRightMouseDown = false
    let lastMouseX = 0

    this.scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === 1) { // 指针按下
        if (pointerInfo.event.button === 2) { // 右键
          isRightMouseDown = true
          lastMouseX = pointerInfo.event.clientX
        }
      } else if (pointerInfo.type === 0) { // 指针移动
        if (isRightMouseDown) {
          const deltaX = pointerInfo.event.clientX - lastMouseX
          this.rotate(deltaX * 0.01)
          lastMouseX = pointerInfo.event.clientX
        }
      } else if (pointerInfo.type === 3) { // 指针抬起
        if (pointerInfo.event.button === 2) {
          isRightMouseDown = false
        }
      }
    })

    // 禁用右键菜单
    this.scene.getEngine().getRenderingCanvas()?.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    })
  }

  public update(deltaTime: number): void {
    const currentTime = performance.now()
    
    // 限制相机更新频率
    if (currentTime - this.lastUpdateTime < this.updateInterval) {
      return
    }
    
    this.lastUpdateTime = currentTime
    
    // 让FollowCamera自动处理跟随逻辑，减少手动计算
    // 只需要更新相机参数
    this.camera.radius = this.distance
    this.camera.heightOffset = this.height
    this.camera.rotationOffset = this.currentRotation
  }

  public rotate(delta: number): void {
    this.currentRotation += delta * this.rotationSpeed
  }

  public zoom(direction: number): void {
    this.distance += direction * this.zoomSpeed
    this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, this.distance))
  }

  public setDistance(distance: number): void {
    this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, distance))
  }

  public setHeight(height: number): void {
    this.height = height
  }

  public getCamera(): FollowCamera {
    return this.camera
  }

  public getDistance(): number {
    return this.distance
  }

  public getHeight(): number {
    return this.height
  }

  public getRotation(): number {
    return this.currentRotation
  }

  public dispose(): void {
    if (this.camera) {
      this.camera.dispose()
    }
  }
} 