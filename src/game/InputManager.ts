import type { InputState } from './types'

export class InputManager {
  private keys: { [key: string]: boolean } = {}
  private mouseButtons: { [button: number]: boolean } = {}
  private inputState: InputState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    attack: false,
    jump: false,
    sprint: false
  }

  constructor() {
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    // 键盘事件
    document.addEventListener('keydown', (event) => {
      this.keys[event.code] = true
      this.updateInputState()
    })

    document.addEventListener('keyup', (event) => {
      this.keys[event.code] = false
      this.updateInputState()
    })

    // 鼠标事件
    document.addEventListener('mousedown', (event) => {
      this.mouseButtons[event.button] = true
      this.updateInputState()
    })

    document.addEventListener('mouseup', (event) => {
      this.mouseButtons[event.button] = false
      this.updateInputState()
    })

    // 防止按键重复
    document.addEventListener('keydown', (event) => {
      if (event.repeat) {
        event.preventDefault()
      }
    })
  }

  private updateInputState(): void {
    this.inputState = {
      forward: this.keys['KeyW'] || this.keys['ArrowUp'],
      backward: this.keys['KeyS'] || this.keys['ArrowDown'],
      left: this.keys['KeyA'] || this.keys['ArrowLeft'],
      right: this.keys['KeyD'] || this.keys['ArrowRight'],
      attack: this.keys['Space'] || this.mouseButtons[0], // 空格键或左键
      jump: this.keys['Space'],
      sprint: this.keys['ShiftLeft'] || this.keys['ShiftRight']
    }
  }

  public getInput(): InputState {
    return { ...this.inputState }
  }

  public isKeyPressed(keyCode: string): boolean {
    return this.keys[keyCode] || false
  }

  public isMouseButtonPressed(button: number): boolean {
    return this.mouseButtons[button] || false
  }

  public getMovementVector(): { x: number, y: number } {
    let x = 0
    let y = 0

    if (this.inputState.forward) y += 1
    if (this.inputState.backward) y -= 1
    if (this.inputState.left) x -= 1
    if (this.inputState.right) x += 1

    // 标准化对角线移动
    if (x !== 0 && y !== 0) {
      x *= 0.707 // Math.cos(45°)
      y *= 0.707 // Math.sin(45°)
    }

    return { x, y }
  }

  public isMoving(): boolean {
    return this.inputState.forward || this.inputState.backward || 
           this.inputState.left || this.inputState.right
  }

  public isAttacking(): boolean {
    return this.inputState.attack
  }

  public isSprinting(): boolean {
    return this.inputState.sprint
  }

  public dispose(): void {
    // 清理事件监听器（如果需要的话）
    // 在实际应用中，可能需要更复杂的事件管理
  }
} 