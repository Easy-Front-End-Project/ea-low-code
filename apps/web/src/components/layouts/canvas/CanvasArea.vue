<template>
  <div class="canvas-area">
    <!-- 页面自定义 CSS -->
    <component :is="'style'" v-if="pageCustomCSS">{{ pageCustomCSS }}</component>

    <!-- 画布工具栏 -->
    <CanvasToolbar />

    <!-- 画布滚动区域 -->
    <div class="canvas-area__scroll-wrapper">
      <!-- 画布容器 -->
      <div
        ref="canvasRef"
        class="canvas-area__container"
        :style="canvasStyle"
        @dragover="handleDragOver"
        @drop="handleDrop"
        @click="handleCanvasClick"
      >
        <!-- 网格背景 -->
        <div class="canvas-area__grid"></div>

        <!-- 加载动画 -->
        <div v-if="isLoading" class="canvas-area__loading">
          <div class="canvas-area__loading-spinner"></div>
          <p class="canvas-area__loading-text">加载组件中...</p>
        </div>

        <!-- 组件渲染区域 -->
        <div v-show="!isLoading" class="canvas-area__content">
          <CanvasComponent
            v-for="component in components"
            :key="component.id"
            :component="component"
            :selected="selectedComponentId === component.id"
            @select="handleComponentSelect"
            @delete="handleComponentDelete"
            @copy="handleComponentCopy"
            @drop-to-parent="handleDropToParent"
          />
        </div>

        <!-- 空状态提示 -->
        <div v-if="!isLoading && components.length === 0" class="canvas-area__empty">
          <ea-icon name="hand" variant="solid" size="48" class="canvas-area__empty-icon"></ea-icon>
          <p class="canvas-area__empty-text">从左侧拖拽组件到此处</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useSchemaStore } from '@/stores/designer/schema'
  import CanvasComponent from '../../designer/CanvasComponent.vue'
  import CanvasToolbar from '@/components/common/CanvasToolbar.vue'

  const schemaStore = useSchemaStore()
  const canvasRef = ref(null)
  const isLoading = ref(true)

  const components = computed(() => schemaStore.components)
  const selectedComponentId = computed(() => schemaStore.selectedComponentId)

  // 组件加载完成后隐藏 loading
  onMounted(() => {
    // 使用 requestIdleCallback 或 setTimeout 确保组件有足够时间渲染
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(
        () => {
          isLoading.value = false
        },
        { timeout: 500 }
      )
    } else {
      setTimeout(() => {
        isLoading.value = false
      }, 300)
    }
  })

  const pageSettings = computed(() => schemaStore.pageSchema.settings || {})
  const pageStyle = computed(() => pageSettings.value.style || {})
  const pageCustomCSS = computed(() => pageSettings.value.customCSS || '')

  const canvasStyle = computed(() => {
    // 从 pageStyle 中获取宽高设置
    const width = pageStyle.value?.width
    const height = pageStyle.value?.height
    const hasCustomSize = width && height

    return {
      width: hasCustomSize ? width : '100%',
      height: hasCustomSize ? height : '100%',
      minWidth: 'auto',
      minHeight: hasCustomSize ? height : '100vh',
      maxWidth: '100%',
      overflow: 'auto',
      ...pageStyle.value,
    }
  })

  function handleDragOver(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }

  function handleDrop(event) {
    event.preventDefault()
    const data = event.dataTransfer.getData('application/json')
    if (!data) return

    try {
      addComponentWithMeta(JSON.parse(data))
    } catch (error) {
      console.error('拖拽放置失败:', error)
    }
  }

  function handleDropToParent({ componentMeta, parentId, slotName = 'default' }) {
    addComponentWithMeta(componentMeta, parentId, slotName)
  }

  function addComponentWithMeta(componentMeta, parentId = null, slotName = 'default') {
    const defaultProps = {}

    if (componentMeta.props) {
      componentMeta.props.forEach(prop => {
        defaultProps[prop.name] = prop.default
      })
    }

    if (slotName !== 'default') {
      defaultProps.slot = slotName
    }

    const newComponent = schemaStore.addComponent(componentMeta.type, defaultProps, parentId)

    if (componentMeta.isRemote && componentMeta.remoteConfig) {
      newComponent.isRemote = true
      newComponent.remoteConfig = componentMeta.remoteConfig
    }

    schemaStore.selectComponent(newComponent.id)
  }

  function handleCanvasClick(event) {
    if (
      event.target === canvasRef.value ||
      event.target.classList.contains('canvas-area__content')
    ) {
      schemaStore.clearSelection()
    }
  }

  function handleComponentSelect(componentId) {
    schemaStore.selectComponent(componentId)
  }

  function handleComponentDelete(componentId) {
    schemaStore.removeComponent(componentId)
  }

  function handleComponentCopy(copiedComponent) {
    schemaStore.addComponentBySchema(copiedComponent)
    schemaStore.selectComponent(copiedComponent.id)
  }
</script>

<style lang="scss" scoped>
  .canvas-area {
    flex: 1;
    background-color: #f5f7fa;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    &__scroll-wrapper {
      flex: 1;
      overflow: auto;
      padding: 1.5rem;
      padding-bottom: 6rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }

    &__container {
      background-color: #fff;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      border-radius: 0.5rem;
      overflow: hidden;
      position: relative;
      flex-shrink: 0;
    }

    &__grid {
      position: absolute;
      inset: 0;
      pointer-events: none;
      height: 100%;
      background-image:
        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
      background-size: 20px 20px;
    }

    &__content {
      position: relative;
      width: 100%;
      min-height: 100%;
      padding: 1rem;
    }

    &__empty {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #9ca3af;
      margin-top: 2rem;

      &-icon {
        margin: 2rem 0;
      }

      &-text {
        font-size: 0.875rem;
      }
    }

    &__loading {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: rgba(255, 255, 255, 0.9);
      z-index: 10;

      &-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e5e7eb;
        border-top-color: #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      &-text {
        margin-top: 1rem;
        font-size: 0.875rem;
        color: #6b7280;
      }
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
