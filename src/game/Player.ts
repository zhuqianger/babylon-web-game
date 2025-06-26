import { Scene, Mesh, Vector3, StandardMaterial, Color3, Animation, AnimationGroup, MeshBuilder } from 'babylonjs'
import { InputManager } from './InputManager'
import type { PlayerStats } from './types'

export class Player {
  private scene: Scene
  private inputManager: InputManager
  private mesh!: Mesh
  private head!: Mesh
  private weapon!: Mesh
  private position: Vector3
  private rotation: Vector3
  private speed: number = 5.0
  private isAttacking: boolean = false
  private attackCooldown: number = 0
  private stats: PlayerStats
  private animations: Map<string, AnimationGroup> = new Map()
  private movementVector: Vector3 = new Vector3(0, 0, 0)
  private lastUpdateTime: number = 0
  private updateInterval: number = 16 // 约60fps

  constructor(scene: Scene, inputManager: InputManager) {
    this.scene = scene
    this.inputManager = inputManager
    this.position = new Vector3(0, 0, 0)
    this.rotation = new Vector3(0, 0, 0)
    this.stats = {
      health: 100,
      maxHealth: 100,
      stamina: 100,
      maxStamina: 100,
      level: 1,
      experience: 0
    }
  }

  public initialize(): void {
    this.createMesh()
    this.createAnimations()
  }

  private createMesh(): void {
    // 创建角色身体
    this.mesh = MeshBuilder.CreateBox('player', { width: 0.8, height: 1.8, depth: 0.4 }, this.scene)
    this.mesh.position = this.position

    // 创建角色材质
    const playerMaterial = new StandardMaterial('playerMat', this.scene)
    playerMaterial.diffuseColor = new Color3(0.8, 0.6, 0.2)
    this.mesh.material = playerMaterial

    // 创建头部
    this.head = MeshBuilder.CreateSphere('head', { diameter: 0.6 }, this.scene)
    this.head.position = new Vector3(0, 1.2, 0)
    this.head.parent = this.mesh

    const headMaterial = new StandardMaterial('headMat', this.scene)
    headMaterial.diffuseColor = new Color3(0.9, 0.7, 0.5)
    this.head.material = headMaterial

    // 创建武器（剑）
    this.weapon = MeshBuilder.CreateBox('weapon', { width: 0.08, height: 1.2, depth: 0.03 }, this.scene)
    this.weapon.position = new Vector3(0.6, 0.3, 0)
    this.weapon.parent = this.mesh

    const weaponMaterial = new StandardMaterial('weaponMat', this.scene)
    weaponMaterial.diffuseColor = new Color3(0.7, 0.7, 0.7)
    this.weapon.material = weaponMaterial
  }

  private createAnimations(): void {
    // 创建攻击动画
    const attackAnimation = new Animation(
      'attackAnimation',
      'rotation.z',
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    )

    const keyFrames = []
    keyFrames.push({ frame: 0, value: 0 })
    keyFrames.push({ frame: 10, value: Math.PI / 6 })
    keyFrames.push({ frame: 20, value: -Math.PI / 6 })
    keyFrames.push({ frame: 30, value: 0 })

    attackAnimation.setKeys(keyFrames)
    
    // 创建动画组
    const attackGroup = new AnimationGroup('attackGroup', this.scene)
    attackGroup.addTargetedAnimation(attackAnimation, this.weapon)
    this.animations.set('attack', attackGroup)
  }

  public update(deltaTime: number): void {
    const currentTime = performance.now()
    
    // 限制更新频率
    if (currentTime - this.lastUpdateTime < this.updateInterval) {
      return
    }
    
    this.lastUpdateTime = currentTime
    
    this.handleMovement(deltaTime)
    this.handleAttack(deltaTime)
    this.updatePosition()
    this.updateStats(deltaTime)
  }

  private handleMovement(deltaTime: number): void {
    const input = this.inputManager.getInput()
    
    // 重用Vector3对象，避免频繁创建
    this.movementVector.setAll(0)

    if (input.forward) this.movementVector.z += 1
    if (input.backward) this.movementVector.z -= 1
    if (input.left) this.movementVector.x -= 1
    if (input.right) this.movementVector.x += 1

    if (this.movementVector.length() > 0) {
      this.movementVector.normalize()
      this.movementVector.scaleInPlace(this.speed * deltaTime)
      this.position.addInPlace(this.movementVector)

      // 更新朝向
      const targetRotation = Math.atan2(this.movementVector.x, this.movementVector.z)
      this.rotation.y = targetRotation
    }
  }

  private handleAttack(deltaTime: number): void {
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime
      return
    }

    if (this.inputManager.getInput().attack && !this.isAttacking) {
      this.performAttack()
    }
  }

  private performAttack(): void {
    if (this.stats.stamina < 20) return

    this.isAttacking = true
    this.attackCooldown = 1.0
    this.stats.stamina -= 20

    const attackAnim = this.animations.get('attack')
    if (attackAnim) {
      attackAnim.play()
      attackAnim.onAnimationEndObservable.addOnce(() => {
        this.isAttacking = false
      })
    }
  }

  private updatePosition(): void {
    this.mesh.position = this.position
    this.mesh.rotation = this.rotation
  }

  private updateStats(deltaTime: number): void {
    // 恢复耐力
    if (this.stats.stamina < this.stats.maxStamina) {
      this.stats.stamina += 10 * deltaTime
      if (this.stats.stamina > this.stats.maxStamina) {
        this.stats.stamina = this.stats.maxStamina
      }
    }
  }

  public getPosition(): Vector3 {
    return this.position
  }

  public getMesh(): Mesh {
    return this.mesh
  }

  public getStats(): PlayerStats {
    return { ...this.stats }
  }

  public takeDamage(damage: number): void {
    this.stats.health -= damage
    if (this.stats.health < 0) {
      this.stats.health = 0
    }
  }

  public heal(amount: number): void {
    this.stats.health += amount
    if (this.stats.health > this.stats.maxHealth) {
      this.stats.health = this.stats.maxHealth
    }
  }

  public gainExperience(exp: number): void {
    this.stats.experience += exp
    // 简单的升级机制
    const expNeeded = this.stats.level * 100
    if (this.stats.experience >= expNeeded) {
      this.levelUp()
    }
  }

  private levelUp(): void {
    this.stats.level++
    this.stats.experience -= (this.stats.level - 1) * 100
    this.stats.maxHealth += 20
    this.stats.health = this.stats.maxHealth
    this.stats.maxStamina += 10
    this.stats.stamina = this.stats.maxStamina
  }

  public dispose(): void {
    this.animations.forEach(anim => anim.dispose())
    this.animations.clear()
    
    if (this.mesh) {
      this.mesh.dispose()
    }
  }
} 