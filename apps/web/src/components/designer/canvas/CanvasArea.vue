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
        @mousedown="handleCanvasMouseDown"
      >
        <!-- 网格背景 -->
        <div class="canvas-area__grid"></div>

        <!-- 加载动画 -->
        <Loading v-if="isLoading" :loading="true" text="加载组件中..." />

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

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useSchemaStore } from '@/components/designer/stores/schema'
  import type { ComponentSchema } from '@/utils/schemaHelper'
  import CanvasComponent from './CanvasComponent.vue'
  import CanvasToolbar from '@/components/designer/common/CanvasToolbar.vue'
  import Loading from '@/components/common/Loading.vue'

  interface DragComponentData {
    type: string
    props?: Array<{ name: string; default?: unknown }>
    isRemote?: boolean
    remoteConfig?: { id: string; url: string; styleUrl?: string; exportName: string }
  }

  const schemaStore = useSchemaStore()
  const canvasRef = ref<HTMLDivElement | null>(null)
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
  const pageStyle = computed(() => (pageSettings.value.style || {}) as Record<string, any>)
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

  function handleDragOver(event: DragEvent) {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy'
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault()
    const data = event.dataTransfer?.getData('application/json')
    if (!data) return

    try {
      addComponentWithMeta(JSON.parse(data))
    } catch (error) {
      console.error('拖拽放置失败:', error)
    }
  }

  function handleDropToParent({ componentMeta, parentId, slotName = 'default' }: { componentMeta: DragComponentData; parentId: string | null; slotName?: string }) {
    addComponentWithMeta(componentMeta, parentId, slotName)
  }

  function addComponentWithMeta(componentMeta: DragComponentData, parentId: string | null = null, slotName: string = 'default') {
    const defaultProps: Record<string, unknown> = {}

    if (componentMeta.props) {
      componentMeta.props.forEach(prop => {
        defaultProps[prop.name] = prop.default
      })
    }

    if (slotName !== 'default') {
      defaultProps.slot = slotName
    }

    const newComponent = schemaStore.addComponent(componentMeta.type, defaultProps, parentId) as ComponentSchema

    if (componentMeta.isRemote && componentMeta.remoteConfig) {
      newComponent.isRemote = true
      newComponent.remoteConfig = componentMeta.remoteConfig
    }

    schemaStore.selectComponent(newComponent.id)
  }

  // 记录最后一次鼠标按下的事件信息，用于区分真实点击和焦点转移
  let lastMouseDownTarget: EventTarget | null = null
  let lastMouseDownTime = 0

  function handleCanvasMouseDown(event: MouseEvent) {
    // 只记录在画布容器或内容区域的真实点击
    if (
      event.target === canvasRef.value ||
      (event.target instanceof HTMLElement && event.target.classList.contains('canvas-area__content'))
    ) {
      lastMouseDownTarget = event.target
      lastMouseDownTime = Date.now()
    }
  }

  function handleCanvasClick(event: MouseEvent) {
    if (
      event.target === canvasRef.value ||
      (event.target instanceof HTMLElement && event.target.classList.contains('canvas-area__content'))
    ) {
      // 检查这次 click 是否有对应的 mousedown 事件
      // 如果没有，说明是程序触发的（如焦点转移），不应该清除选中
      const timeDiff = Date.now() - lastMouseDownTime
      const hasCorrespondingMouseDown = lastMouseDownTarget === event.target && timeDiff < 500

      if (!hasCorrespondingMouseDown) return

      // 重置记录
      lastMouseDownTarget = null
      lastMouseDownTime = 0

      schemaStore.clearSelection()
    }
  }

  function handleComponentSelect(componentId: string) {
    schemaStore.selectComponent(componentId)
  }

  function handleComponentDelete(componentId: string) {
    schemaStore.removeComponent(componentId)
  }

  function handleComponentCopy(copiedComponent: ComponentSchema) {
    schemaStore.addComponentBySchema(copiedComponent)
    schemaStore.selectComponent(copiedComponent.id)
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(canvas-area) {
    flex: 1;
    background-color: #f5f7fa;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    @include e(scroll-wrapper) {
      flex: 1;
      overflow: auto;
      padding: 1.5rem;
      padding-bottom: 6rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }

    @include e(container) {
      background-color: #fff;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      border-radius: 0.5rem;
      overflow: hidden;
      position: relative;
      flex-shrink: 0;
    }

    @include e(grid) {
      position: absolute;
      inset: 0;
      pointer-events: none;
      height: 100%;
      background-image:
        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
      background-size: 20px 20px;
    }

    @include e(content) {
      position: relative;
      width: 100%;
      min-height: 100%;
      padding: 1rem;
    }

    @include e(empty) {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #9ca3af;
      margin-top: 2rem;
    }

    @include e(empty-icon) {
      margin: 2rem 0;
    }

    @include e(empty-text) {
      font-size: 0.875rem;
    }
  }
</style>
