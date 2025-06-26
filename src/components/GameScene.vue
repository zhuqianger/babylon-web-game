<template>
  <div class="game-container">
    <canvas ref="renderCanvas" class="game-canvas"></canvas>
    <div v-if="showLoading" class="loading-screen">
      <div class="loading-content">
        <h2>游戏加载中...</h2>
        <div class="loading-bar">
          <div class="loading-progress" :style="{ width: loadingProgress + '%' }"></div>
        </div>
        <p>{{ loadingMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { GameEngine } from '../game/GameEngine'

const renderCanvas = ref<HTMLCanvasElement>()
const showLoading = ref(true)
const loadingProgress = ref(0)
const loadingMessage = ref('初始化游戏引擎...')

let gameEngine: GameEngine | null = null

const initializeGame = async () => {
  if (!renderCanvas.value) return

  try {
    loadingMessage.value = '创建游戏引擎...'
    loadingProgress.value = 20

    // 创建游戏引擎
    gameEngine = new GameEngine(renderCanvas.value)
    
    loadingMessage.value = '初始化游戏世界...'
    loadingProgress.value = 40

    // 等待一帧以确保引擎初始化完成
    await new Promise(resolve => setTimeout(resolve, 100))
    
    loadingMessage.value = '启动游戏循环...'
    loadingProgress.value = 80

    // 启动游戏
    gameEngine.start()
    
    loadingMessage.value = '游戏准备就绪!'
    loadingProgress.value = 100

    // 隐藏加载界面
    setTimeout(() => {
      showLoading.value = false
    }, 500)

  } catch (error) {
    console.error('游戏初始化失败:', error)
    loadingMessage.value = '游戏初始化失败，请刷新页面重试'
  }
}

onMounted(() => {
  initializeGame()
})

onUnmounted(() => {
  if (gameEngine) {
    gameEngine.dispose()
  }
})
</script>

<style scoped>
.game-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.game-canvas {
  width: 100%;
  height: 100%;
  outline: none;
  display: block;
}

.loading-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
  color: white;
  max-width: 400px;
  padding: 40px;
}

.loading-content h2 {
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 300;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.loading-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
}

.loading-progress {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  border-radius: 4px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.loading-content p {
  font-size: 16px;
  opacity: 0.8;
  margin: 0;
}
</style> 