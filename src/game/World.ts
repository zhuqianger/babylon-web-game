import { Scene, HemisphericLight, DirectionalLight, Vector3, Color3, Mesh, StandardMaterial, MeshBuilder } from 'babylonjs'

export class World {
  private scene: Scene
  private ground!: Mesh
  private obstacles: Mesh[] = []
  private lights: HemisphericLight[] = []
  private lastUpdateTime: number = 0
  private updateInterval: number = 100 // 世界更新间隔（毫秒）

  constructor(scene: Scene) {
    this.scene = scene
  }

  public initialize(): void {
    this.createLighting()
    this.createGround()
    this.createObstacles()
    this.createEnvironment()
  }

  private createLighting(): void {
    // 环境光
    const hemisphericLight = new HemisphericLight(
      'hemisphericLight',
      new Vector3(0, 1, 0),
      this.scene
    )
    hemisphericLight.intensity = 0.6
    hemisphericLight.groundColor = new Color3(0.2, 0.3, 0.4)
    this.lights.push(hemisphericLight)

    // 方向光（太阳光）
    const directionalLight = new DirectionalLight(
      'directionalLight',
      new Vector3(-0.5, -1, -0.5),
      this.scene
    )
    directionalLight.intensity = 0.8
    directionalLight.shadowMinZ = 0.1
    directionalLight.shadowMaxZ = 50

    // 暂时关闭阴影以提高性能
    // directionalLight.shadowEnabled = true
  }

  private createGround(): void {
    // 创建地面
    this.ground = MeshBuilder.CreateGround(
      'ground',
      { width: 50, height: 50 },
      this.scene
    )

    // 地面材质
    const groundMaterial = new StandardMaterial('groundMat', this.scene)
    groundMaterial.diffuseColor = new Color3(0.3, 0.6, 0.3)
    groundMaterial.specularColor = new Color3(0.1, 0.1, 0.1)
    groundMaterial.backFaceCulling = false
    this.ground.material = groundMaterial
  }

  private createObstacles(): void {
    // 障碍物位置
    const obstaclePositions = [
      { x: 8, z: 5, scale: { x: 2, y: 3, z: 2 } },
      { x: -6, z: 8, scale: { x: 1.5, y: 2.5, z: 1.5 } },
      { x: 12, z: -3, scale: { x: 3, y: 4, z: 3 } },
      { x: -10, z: -6, scale: { x: 2, y: 3, z: 2 } },
      { x: 4, z: 12, scale: { x: 1.8, y: 2.8, z: 1.8 } },
      { x: -8, z: -12, scale: { x: 2.2, y: 3.2, z: 2.2 } },
      { x: 15, z: 8, scale: { x: 2.5, y: 3.5, z: 2.5 } },
      { x: -15, z: 3, scale: { x: 1.8, y: 2.8, z: 1.8 } }
    ]

    obstaclePositions.forEach((pos, index) => {
      const obstacle = MeshBuilder.CreateBox(
        `obstacle${index}`,
        { width: pos.scale.x, height: pos.scale.y, depth: pos.scale.z },
        this.scene
      )
      obstacle.position = new Vector3(pos.x, pos.scale.y / 2, pos.z)

      // 障碍物材质
      const obstacleMaterial = new StandardMaterial(`obstacleMat${index}`, this.scene)
      obstacleMaterial.diffuseColor = new Color3(0.6, 0.4, 0.2)
      obstacleMaterial.specularColor = new Color3(0.2, 0.2, 0.2)
      obstacle.material = obstacleMaterial

      this.obstacles.push(obstacle)
    })
  }

  private createEnvironment(): void {
    // 创建装饰性物体
    this.createTrees()
    this.createRocks()
    this.createWater()
  }

  private createTrees(): void {
    const treePositions = [
      { x: 20, z: 15 },
      { x: -18, z: 18 },
      { x: 25, z: -10 },
      { x: -22, z: -15 },
      { x: 18, z: 25 },
      { x: -20, z: -25 }
    ]

    treePositions.forEach((pos, index) => {
      // 树干
      const trunk = MeshBuilder.CreateCylinder(
        `treeTrunk${index}`,
        { height: 4, diameter: 0.5 },
        this.scene
      )
      trunk.position = new Vector3(pos.x, 2, pos.z)

      const trunkMaterial = new StandardMaterial(`trunkMat${index}`, this.scene)
      trunkMaterial.diffuseColor = new Color3(0.4, 0.2, 0.1)
      trunk.material = trunkMaterial

      // 树冠
      const leaves = MeshBuilder.CreateSphere(
        `treeLeaves${index}`,
        { diameter: 3 },
        this.scene
      )
      leaves.position = new Vector3(pos.x, 5, pos.z)

      const leavesMaterial = new StandardMaterial(`leavesMat${index}`, this.scene)
      leavesMaterial.diffuseColor = new Color3(0.1, 0.5, 0.1)
      leaves.material = leavesMaterial
    })
  }

  private createRocks(): void {
    const rockPositions = [
      { x: 5, z: 20 },
      { x: -12, z: 10 },
      { x: 18, z: -8 },
      { x: -5, z: -18 }
    ]

    rockPositions.forEach((pos, index) => {
      const rock = MeshBuilder.CreateIcoSphere(
        `rock${index}`,
        { radius: 1, subdivisions: 2 },
        this.scene
      )
      rock.position = new Vector3(pos.x, 0.5, pos.z)
      rock.scaling = new Vector3(1, 0.5, 1)

      const rockMaterial = new StandardMaterial(`rockMat${index}`, this.scene)
      rockMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5)
      rock.material = rockMaterial
    })
  }

  private createWater(): void {
    // 创建一个小湖泊
    const water = MeshBuilder.CreateGround(
      'water',
      { width: 8, height: 6 },
      this.scene
    )
    water.position = new Vector3(-15, -0.1, 15)

    const waterMaterial = new StandardMaterial('waterMat', this.scene)
    waterMaterial.diffuseColor = new Color3(0.1, 0.3, 0.8)
    waterMaterial.alpha = 0.7
    waterMaterial.backFaceCulling = false
    water.material = waterMaterial
  }

  public update(deltaTime: number): void {
    const currentTime = performance.now()
    
    // 限制世界更新频率
    if (currentTime - this.lastUpdateTime < this.updateInterval) {
      return
    }
    
    this.lastUpdateTime = currentTime
    
    // 世界更新逻辑，比如天气效果、昼夜循环等
    // 这里可以添加更多动态效果
  }

  public getObstacles(): Mesh[] {
    return [...this.obstacles]
  }

  public getGround(): Mesh {
    return this.ground
  }

  public dispose(): void {
    // 清理所有网格和材质
    this.obstacles.forEach(obstacle => obstacle.dispose())
    this.obstacles = []

    if (this.ground) {
      this.ground.dispose()
    }

    this.lights.forEach(light => light.dispose())
    this.lights = []
  }
} 