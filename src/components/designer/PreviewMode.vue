<template>
  <div class="preview-mode h-full flex flex-col">
    <!-- 预览工具栏 -->
    <div class="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div class="flex items-center gap-2">
        <ea-icon name="view" size="18" color="#3b82f6"></ea-icon>
        <span class="font-medium text-gray-800">预览模式</span>
      </div>
      <button
        class="flex items-center gap-1 px-4 py-1.5 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        @click="handleExitPreview"
      >
        <ea-icon name="close" size="16"></ea-icon>
        <span>退出预览</span>
      </button>
    </div>

    <!-- 预览画布 -->
    <div class="flex-1 bg-gray-100 p-6 overflow-auto flex items-center justify-center">
      <div
        class="preview-canvas bg-white shadow-lg rounded-lg overflow-hidden"
        :style="canvasStyle"
      >
        <PreviewComponent
          v-for="component in components"
          :key="component.id"
          :component="component"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSchemaStore } from '@/stores/designer/schema'
import PreviewComponent from './PreviewComponent.vue'

const schemaStore = useSchemaStore()

const components = computed(() => schemaStore.components)

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

// 退出预览
function handleExitPreview() {
  schemaStore.setPreviewMode(false)
}
</script>

<style scoped>
.preview-mode {
  background-color: #f5f7fa;
}

.preview-canvas {
  position: relative;
}
</style>
