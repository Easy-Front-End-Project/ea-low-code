<template>
  <div class="preview-mode h-full flex flex-col">
    <!-- 预览工具栏 -->
    <div class="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div class="flex items-center gap-2">
        <ea-icon name="eye" variant="solid"></ea-icon>
        <span class="font-medium text-gray-800">预览模式</span>
      </div>
      <ea-button icon="xmark" @click="handleExitPreview"> 退出预览 </ea-button>
    </div>

    <!-- 页面自定义 CSS -->
    <component :is="'style'" v-if="pageCustomCSS"> {{ pageCustomCSS }} </component>

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
  import { computed, onMounted, onUnmounted } from 'vue'
  import { useSchemaStore } from '@/stores/designer/schema'
  import PreviewComponent from '../../designer/PreviewComponent.vue'
  import { executeEvent } from '@/utils/eventExecutor'

  const schemaStore = useSchemaStore()

  const components = computed(() => schemaStore.components)

  // 页面设置
  const pageSettings = computed(() => schemaStore.pageSchema.settings || {})
  const pageStyle = computed(() => pageSettings.value.style || {})
  const pageCustomCSS = computed(() => pageSettings.value.customCSS || '')
  const pageEvents = computed(() => pageSettings.value.events || [])

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
      overflow: viewport.overflow,
      ...pageStyle.value,
    }
  })

  // 退出预览
  function handleExitPreview() {
    schemaStore.setPreviewMode(false)
  }

  // 页面事件处理函数映射
  const eventHandlers = new Map()

  // 创建事件处理函数
  function createEventHandler(eventConfig) {
    return (event) => {
      executeEvent(eventConfig, event)
    }
  }

  // 绑定页面事件
  function bindPageEvents() {
    // 先解绑已有的事件
    unbindPageEvents()

    pageEvents.value.forEach(eventConfig => {
      const eventType = eventConfig.eventType
      if (!eventType) return

      const handler = createEventHandler(eventConfig)
      eventHandlers.set(eventType, handler)

      // 绑定到 window
      window.addEventListener(eventType, handler)
    })
  }

  // 解绑页面事件
  function unbindPageEvents() {
    eventHandlers.forEach((handler, eventType) => {
      window.removeEventListener(eventType, handler)
    })
    eventHandlers.clear()
  }

  // 组件挂载时绑定事件
  onMounted(() => {
    bindPageEvents()

    // 执行 load 事件
    const loadEvent = pageEvents.value.find(e => e.eventType === 'load')
    if (loadEvent) {
      executeEvent(loadEvent, null)
    }
  })

  // 组件卸载时解绑事件
  onUnmounted(() => {
    // 执行 unload 事件
    const unloadEvent = pageEvents.value.find(e => e.eventType === 'unload')
    if (unloadEvent) {
      executeEvent(unloadEvent, null)
    }

    unbindPageEvents()
  })
</script>

<style scoped>
  .preview-mode {
    background-color: #f5f7fa;
  }

  .preview-canvas {
    position: relative;
  }
</style>
