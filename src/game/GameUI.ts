import type { PlayerStats } from './types'

export class GameUI {
  private container: HTMLDivElement
  private healthBar: HTMLDivElement
  private staminaBar: HTMLDivElement
  private levelDisplay: HTMLDivElement
  private controlsInfo: HTMLDivElement
  private isInitialized: boolean = false

  constructor() {
    this.container = document.createElement('div')
    this.healthBar = document.createElement('div')
    this.staminaBar = document.createElement('div')
    this.levelDisplay = document.createElement('div')
    this.controlsInfo = document.createElement('div')
  }

  public initialize(): void {
    if (this.isInitialized) return

    this.setupContainer()
    this.setupHealthBar()
    this.setupStaminaBar()
    this.setupLevelDisplay()
    this.setupControlsInfo()
    this.setupStyles()

    document.body.appendChild(this.container)
    this.isInitialized = true
  }

  private setupContainer(): void {
    this.container.id = 'game-ui'
    this.container.style.position = 'fixed'
    this.container.style.top = '0'
    this.container.style.left = '0'
    this.container.style.width = '100%'
    this.container.style.height = '100%'
    this.container.style.pointerEvents = 'none'
    this.container.style.zIndex = '1000'
  }

  private setupHealthBar(): void {
    const healthContainer = document.createElement('div')
    healthContainer.style.position = 'absolute'
    healthContainer.style.top = '20px'
    healthContainer.style.left = '20px'
    healthContainer.style.width = '200px'
    healthContainer.style.height = '20px'
    healthContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
    healthContainer.style.border = '2px solid #333'
    healthContainer.style.borderRadius = '10px'
    healthContainer.style.overflow = 'hidden'
    healthContainer.style.pointerEvents = 'none'

    this.healthBar.style.width = '100%'
    this.healthBar.style.height = '100%'
    this.healthBar.style.backgroundColor = '#ff4444'
    this.healthBar.style.transition = 'width 0.3s ease'

    const healthLabel = document.createElement('div')
    healthLabel.textContent = '生命值'
    healthLabel.style.position = 'absolute'
    healthLabel.style.top = '-25px'
    healthLabel.style.left = '0'
    healthLabel.style.color = 'white'
    healthLabel.style.fontSize = '14px'
    healthLabel.style.fontWeight = 'bold'
    healthLabel.style.pointerEvents = 'none'

    healthContainer.appendChild(this.healthBar)
    healthContainer.appendChild(healthLabel)
    this.container.appendChild(healthContainer)
  }

  private setupStaminaBar(): void {
    const staminaContainer = document.createElement('div')
    staminaContainer.style.position = 'absolute'
    staminaContainer.style.top = '50px'
    staminaContainer.style.left = '20px'
    staminaContainer.style.width = '200px'
    staminaContainer.style.height = '20px'
    staminaContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
    staminaContainer.style.border = '2px solid #333'
    staminaContainer.style.borderRadius = '10px'
    staminaContainer.style.overflow = 'hidden'
    staminaContainer.style.pointerEvents = 'none'

    this.staminaBar.style.width = '100%'
    this.staminaBar.style.height = '100%'
    this.staminaBar.style.backgroundColor = '#44ff44'
    this.staminaBar.style.transition = 'width 0.3s ease'

    const staminaLabel = document.createElement('div')
    staminaLabel.textContent = '耐力值'
    staminaLabel.style.position = 'absolute'
    staminaLabel.style.top = '-25px'
    staminaLabel.style.left = '0'
    staminaLabel.style.color = 'white'
    staminaLabel.style.fontSize = '14px'
    staminaLabel.style.fontWeight = 'bold'
    staminaLabel.style.pointerEvents = 'none'

    staminaContainer.appendChild(this.staminaBar)
    staminaContainer.appendChild(staminaLabel)
    this.container.appendChild(staminaContainer)
  }

  private setupLevelDisplay(): void {
    this.levelDisplay.style.position = 'absolute'
    this.levelDisplay.style.top = '20px'
    this.levelDisplay.style.right = '20px'
    this.levelDisplay.style.padding = '10px 15px'
    this.levelDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
    this.levelDisplay.style.color = 'white'
    this.levelDisplay.style.borderRadius = '5px'
    this.levelDisplay.style.fontSize = '16px'
    this.levelDisplay.style.fontWeight = 'bold'
    this.levelDisplay.style.pointerEvents = 'none'

    this.container.appendChild(this.levelDisplay)
  }

  private setupControlsInfo(): void {
    this.controlsInfo.style.position = 'absolute'
    this.controlsInfo.style.bottom = '20px'
    this.controlsInfo.style.left = '20px'
    this.controlsInfo.style.padding = '15px'
    this.controlsInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
    this.controlsInfo.style.color = 'white'
    this.controlsInfo.style.borderRadius = '5px'
    this.controlsInfo.style.fontSize = '14px'
    this.controlsInfo.style.pointerEvents = 'none'

    this.controlsInfo.innerHTML = `
      <h3 style="margin: 0 0 10px 0; color: #ffaa00;">控制说明:</h3>
      <p style="margin: 5px 0;">WASD 或 方向键 - 移动角色</p>
      <p style="margin: 5px 0;">空格键 或 左键 - 攻击</p>
      <p style="margin: 5px 0;">Shift - 冲刺</p>
      <p style="margin: 5px 0;">鼠标滚轮 - 缩放视角</p>
      <p style="margin: 5px 0;">右键拖拽 - 旋转视角</p>
    `

    this.container.appendChild(this.controlsInfo)
  }

  private setupStyles(): void {
    // 添加全局样式
    const style = document.createElement('style')
    style.textContent = `
      #game-ui * {
        font-family: 'Arial', sans-serif;
      }
    `
    document.head.appendChild(style)
  }

  public update(stats: PlayerStats): void {
    if (!this.isInitialized) return

    // 更新生命值条
    const healthPercentage = (stats.health / stats.maxHealth) * 100
    this.healthBar.style.width = `${healthPercentage}%`

    // 更新耐力值条
    const staminaPercentage = (stats.stamina / stats.maxStamina) * 100
    this.staminaBar.style.width = `${staminaPercentage}%`

    // 更新等级显示
    this.levelDisplay.textContent = `等级 ${stats.level} | 经验 ${stats.experience}`
  }

  public showMessage(message: string, duration: number = 3000): void {
    const messageElement = document.createElement('div')
    messageElement.style.position = 'absolute'
    messageElement.style.top = '50%'
    messageElement.style.left = '50%'
    messageElement.style.transform = 'translate(-50%, -50%)'
    messageElement.style.padding = '15px 25px'
    messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
    messageElement.style.color = 'white'
    messageElement.style.borderRadius = '5px'
    messageElement.style.fontSize = '18px'
    messageElement.style.fontWeight = 'bold'
    messageElement.style.pointerEvents = 'none'
    messageElement.style.transition = 'opacity 0.5s ease'
    messageElement.textContent = message

    this.container.appendChild(messageElement)

    // 淡出效果
    setTimeout(() => {
      messageElement.style.opacity = '0'
      setTimeout(() => {
        if (messageElement.parentNode) {
          messageElement.parentNode.removeChild(messageElement)
        }
      }, 500)
    }, duration)
  }

  public showDamage(damage: number, position: { x: number, y: number }): void {
    const damageElement = document.createElement('div')
    damageElement.style.position = 'absolute'
    damageElement.style.left = `${position.x}px`
    damageElement.style.top = `${position.y}px`
    damageElement.style.color = '#ff4444'
    damageElement.style.fontSize = '20px'
    damageElement.style.fontWeight = 'bold'
    damageElement.style.pointerEvents = 'none'
    damageElement.style.transition = 'all 1s ease'
    damageElement.textContent = `-${damage}`

    this.container.appendChild(damageElement)

    // 动画效果
    setTimeout(() => {
      damageElement.style.transform = 'translateY(-50px)'
      damageElement.style.opacity = '0'
      setTimeout(() => {
        if (damageElement.parentNode) {
          damageElement.parentNode.removeChild(damageElement)
        }
      }, 1000)
    }, 100)
  }

  public dispose(): void {
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
    }
    this.isInitialized = false
  }
} 