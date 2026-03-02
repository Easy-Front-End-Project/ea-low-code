<template>
  <div class="canvas-area p-6 flex flex-col items-center justify-center">
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
      <div class="grid-background absolute inset-0 pointer-events-none h-full"></div>

      <!-- 组件渲染区域 -->
      <div ref="canvasContentRef" class="canvas-content relative w-full min-h-full p-4">
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
        class="absolute inset-0 flex flex-col items-center text-gray-400"
      >
        <ea-icon name="drag" size="48" class="mb-2"></ea-icon>
        <p class="text-sm">从左侧拖拽组件到此处</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUpdated } from 'vue'
import { useSchemaStore } from '@/stores/designer/schema'
import CanvasComponent from './CanvasComponent.vue'

const schemaStore = useSchemaStore()
const canvasRef = ref(null)
const canvasContentRef = ref(null)
const contentHeight = ref(0)

const components = computed(() => schemaStore.components)
const selectedComponentId = computed(() => schemaStore.selectedComponentId)

// 更新内容高度
function updateContentHeight() {
  if (canvasContentRef.value) {
    contentHeight.value = canvasContentRef.value.scrollHeight
  }
}

// 画布样式
const canvasStyle = computed(() => {
  const { viewport } = schemaStore.pageSchema.meta
  // 计算画布高度：取视口高度和内容高度+额外空间的最大值
  const minHeight = viewport.height
  const extraSpace = 100 // 额外空间，确保画布比内容多一部分
  const dynamicHeight = Math.max(minHeight, contentHeight.value + extraSpace)

  return {
    width: `${viewport.width}px`,
    height: `${dynamicHeight}px`,
    minWidth: 'auto',
    minHeight: `${minHeight}px`,
    maxWidth: '100%',
    overflow: 'auto',
  }
})

// 组件挂载和更新时重新计算高度
onMounted(updateContentHeight)
onUpdated(updateContentHeight)

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
    const newComponent = schemaStore.addComponent(componentMeta.type, defaultProps)

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
  flex: 1;
  background-color: #f5f7fa;
  height: auto;
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
