// 游戏相关的类型定义

export interface PlayerStats {
  health: number
  maxHealth: number
  stamina: number
  maxStamina: number
  level: number
  experience: number
}

export interface InputState {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  attack: boolean
  jump: boolean
  sprint: boolean
} 