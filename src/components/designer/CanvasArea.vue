<template>
  <div class="canvas-area p-6 flex items-center justify-center">
    <!-- 画布容器 -->
    <div
      ref="canvasRef"
      class="canvas-container bg-white shadow-lg rounded-lg overflow-hidden relative"
      :style="canvasStyle"
      @dragover="handleDragOver"
      @drop="handleDrop"
      @click="handleCanvasClick"
    >
      <!-- 网格背景 -->
      <div class="grid-background absolute inset-0 pointer-events-none"></div>

      <!-- 组件渲染区域 -->
      <div class="canvas-content relative w-full h-full p-4">
        <CanvasComponent
          v-for="component in components"
          :key="component.id"
          :component="component"
          :selected="selectedComponentId === component.id"
          @select="handleComponentSelect"
          @delete="handleComponentDelete"
        />
      </div>

      <!-- 空状态提示 -->
      <div
        v-if="components.length === 0"
        class="absolute inset-0 flex flex-col items-center justify-center text-gray-400"
      >
        <ea-icon name="drag" size="48" class="mb-2"></ea-icon>
        <p class="text-sm">从左侧拖拽组件到此处</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSchemaStore } from '@/stores/designer/schema'
import CanvasComponent from './CanvasComponent.vue'

const schemaStore = useSchemaStore()
const canvasRef = ref(null)

const components = computed(() => schemaStore.components)
const selectedComponentId = computed(() => schemaStore.selectedComponentId)

// 画布样式
const canvasStyle = computed(() => {
  const { viewport } = schemaStore.pageSchema.meta
  return {
    width: `${viewport.width}px`,
    height: `${viewport.height}px`,
    minWidth: '800px',
    minHeight: '600px',
    maxWidth: '100%',
    maxHeight: '100%',
  }
})

// 拖拽悬停
function handleDragOver(event) {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'copy'
}

// 放置组件
function handleDrop(event) {
  event.preventDefault()

  const data = event.dataTransfer.getData('application/json')
  if (!data) return

  try {
    const componentMeta = JSON.parse(data)
    const defaultProps = {}

    // 提取默认属性
    if (componentMeta.props) {
      componentMeta.props.forEach((prop) => {
        defaultProps[prop.name] = prop.default
      })
    }

    // 添加组件到画布
    const newComponent = schemaStore.addComponent(
      componentMeta.type,
      defaultProps
    )

    // 选中新组件
    schemaStore.selectComponent(newComponent.id)
  } catch (error) {
    console.error('拖拽放置失败:', error)
  }
}

// 点击画布空白处
function handleCanvasClick(event) {
  if (event.target === canvasRef.value || event.target.classList.contains('canvas-content')) {
    schemaStore.clearSelection()
  }
}

// 选中组件
function handleComponentSelect(componentId) {
  schemaStore.selectComponent(componentId)
}

// 删除组件
function handleComponentDelete(componentId) {
  schemaStore.removeComponent(componentId)
}
</script>

<style scoped>
.canvas-area {
  background-color: #f5f7fa;
}

.canvas-container {
  position: relative;
}

.grid-background {
  background-image:
    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
  background-size: 20px 20px;
}

.canvas-content {
  min-height: 100%;
}
</style>
