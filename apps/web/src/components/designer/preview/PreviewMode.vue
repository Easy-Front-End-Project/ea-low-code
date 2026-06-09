<template>
  <div class="preview-mode h-full flex flex-col">
    <!-- 预览工具栏 -->
    <div class="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div class="flex items-center gap-2">
        <ea-icon name="eye" variant="solid"></ea-icon>
        <span class="font-medium text-gray-800">预览模式</span>
      </div>
      <ea-button
        class="exit-preview-btn"
        :class="{ 'exit-preview-btn--disabled': !isReady }"
        :disabled="!isReady"
        icon="xmark"
        @click="handleExitPreview"
      >
        退出预览
      </ea-button>
    </div>

    <!-- 页面自定义 CSS -->
    <component :is="'style'" v-if="pageCustomCSS"> {{ pageCustomCSS }} </component>

    <!-- 预览画布 -->
    <div class="flex-1 bg-gray-100 p-6 overflow-auto flex items-center justify-center">
      <div
        class="preview-canvas bg-white shadow-lg rounded-lg overflow-hidden"
        :style="canvasStyle"
      >
        <!-- 使用 v-if 延迟渲染，避免阻塞主线程 -->
        <template v-if="isReady">
          <PreviewComponent
            v-for="component in components"
            :key="component.id"
            :component="component"
          />
        </template>
        <!-- 加载占位 -->
        <Loading v-else :loading="true" text="加载中..." />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue'
  import { useSchemaStore } from '@/components/designer/stores/schema'
  import PreviewComponent from './PreviewComponent.vue'
  import { executeEvent } from '@/utils/eventExecutor'
  import Loading from '@/components/common/Loading.vue'
  import type { EventConfig } from '@/utils/schemaHelper'

  const schemaStore = useSchemaStore()
  const isReady = ref(false)

  const emit = defineEmits<{
    close: []
  }>()

  const components = computed(() => schemaStore.components)

  // 页面设置
  const pageSettings = computed(() => schemaStore.pageSchema.settings || {})
  const pageStyle = computed(() => pageSettings.value.style || {})
  const pageCustomCSS = computed(() => pageSettings.value.customCSS || '')
  const pageEvents = computed(() => (pageSettings.value.events || []) as EventConfig[])

  // 画布样式
  const canvasStyle = computed(() => {
    const { viewport } = schemaStore.pageSchema?.meta || {}
    const hasViewport = viewport?.width && viewport?.height
    return {
      width: hasViewport ? `${viewport.width}px` : '100%',
      height: hasViewport ? `${viewport.height}px` : '100%',
      minWidth: hasViewport ? '800px' : 'auto',
      minHeight: hasViewport ? '600px' : 'auto',
      maxWidth: '100%',
      maxHeight: '100%',
      overflow: (viewport?.overflow || 'auto') as string,
      ...pageStyle.value,
    } as any
  })

  // 退出预览
  function handleExitPreview(event?: Event) {
    // 如果按钮被禁用，阻止事件并返回
    if (!isReady.value) {
      event?.preventDefault()
      event?.stopPropagation()
      return false
    }
    emit('close')
  }

  // 页面事件处理函数映射
  const eventHandlers = new Map<string, EventListener>()

  // 创建事件处理函数
  function createEventHandler(eventConfig: EventConfig): EventListener {
    return async (event: Event) => {
      await executeEvent(eventConfig, event)
    }
  }

  // 绑定页面事件
  function bindPageEvents() {
    // 先解绑已有的事件
    unbindPageEvents()

    pageEvents.value.forEach(eventConfig => {
      const eventType = eventConfig.eventType as string
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
  onMounted(async () => {
    // 执行 load 事件
    const loadEvent = pageEvents.value.find(e => e.eventType === 'load')
    if (loadEvent) {
      await executeEvent(loadEvent, null)
    }

    const minDelay = 2000
    const startTime = Date.now()

    const setReady = () => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, minDelay - elapsed)
      setTimeout(() => {
        isReady.value = true
        // 组件渲染完成后再绑定页面事件
        bindPageEvents()
      }, remaining)
    }

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(setReady, { timeout: minDelay })
    } else {
      await nextTick()
      setReady()
    }
  })

  // 组件卸载时解绑事件
  onUnmounted(async () => {
    // 执行 unload 事件
    const unloadEvent = pageEvents.value.find(e => e.eventType === 'unload')
    if (unloadEvent) {
      await executeEvent(unloadEvent, null)
    }

    unbindPageEvents()
  })
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(preview-mode) {
    background-color: #f5f7fa;
  }

  @include b(preview-canvas) {
    position: relative;
  }
</style>
