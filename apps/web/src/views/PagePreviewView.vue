<template>
  <div class="page-preview-view">
    <Loading :loading="loading" text="加载预览数据中...">
      <div v-if="loadError" class="page-preview-view__error">
        <ea-result type="warning" title="加载失败" :sub-title="loadError"></ea-result>
      </div>

      <div v-else class="page-preview-view__content">
        <component :is="'style'" v-if="pageCustomCSS">{{ pageCustomCSS }}</component>
        <div class="page-preview-view__canvas" :style="canvasStyle">
          <template v-if="isReady">
            <PreviewComponent v-for="comp in components" :key="comp.id" :component="comp" />
          </template>
          <Loading v-else :loading="true" text="渲染预览中..." />
        </div>
      </div>
    </Loading>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import { useSchemaStore } from '@/components/designer/stores/schema'
  import { getPageDetail } from '@/api/projects'
  import PreviewComponent from '@/components/designer/preview/PreviewComponent.vue'
  import Loading from '@/components/common/Loading.vue'
  import { executeEvent } from '@/utils/eventExecutor'

  const route = useRoute()
  const schemaStore = useSchemaStore()

  const loading = ref(true)
  const loadError = ref('')
  const isReady = ref(false)

  const components = computed(() => schemaStore.components)

  // 页面设置 - 与 PreviewMode 保持一致
  const pageSettings = computed(() => schemaStore.pageSchema.settings || {})
  const pageStyle = computed(() => pageSettings.value.style || {})
  const pageCustomCSS = computed(() => pageSettings.value.customCSS || '')
  const pageEvents = computed(() => (pageSettings.value.events || []) as any[])

  // 画布样式 - 与 PreviewMode 保持一致
  const canvasStyle = computed(() => {
    const { viewport } = schemaStore.pageSchema.meta || {}
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

  onMounted(async () => {
    await loadPageData()
  })

  async function loadPageData() {
    const pageId = Number(route.params.pageId)
    if (!pageId || isNaN(pageId)) {
      loadError.value = '无效的页面 ID'
      loading.value = false
      return
    }

    loading.value = true
    loadError.value = ''

    try {
      const data = await getPageDetail(pageId)
      if (!data?.schema) {
        loadError.value = '该页面暂无内容，请先在设计器中进行编辑'
        loading.value = false
        return
      }

      schemaStore.importSchema(data.schema)

      await nextTick()
      scheduleReady()
    } catch (error: any) {
      const status = error?.response?.status
      if (status === 404) {
        loadError.value = '页面不存在或已被删除'
      } else if (status === 401) {
        loadError.value = '登录已过期，请重新登录后访问'
      } else {
        loadError.value = error.message || '加载数据失败，请检查网络连接'
      }
    } finally {
      loading.value = false
    }
  }

  // 延迟就绪逻辑 - 与 PreviewMode 保持一致
  function scheduleReady() {
    const minDelay = 2000
    const startTime = Date.now()

    const setReady = () => {
      const elapsed = Date.now() - startTime
      setTimeout(
        () => {
          isReady.value = true
          bindPageEvents()
        },
        Math.max(0, minDelay - elapsed)
      )
    }

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(setReady, { timeout: minDelay })
    } else {
      setReady()
    }
  }

  // 页面事件处理 - 与 PreviewMode 保持一致
  const eventHandlers = new Map<string, EventListener>()

  function createEventHandler(eventConfig: any): EventListener {
    return async event => {
      await executeEvent(eventConfig, event)
    }
  }

  function bindPageEvents() {
    unbindPageEvents()
    pageEvents.value.forEach((eventConfig: any) => {
      const eventType = eventConfig.eventType
      if (!eventType) return
      const handler = createEventHandler(eventConfig)
      eventHandlers.set(eventType, handler)
      window.addEventListener(eventType, handler)
    })
  }

  function unbindPageEvents() {
    eventHandlers.forEach((handler, eventType) => {
      window.removeEventListener(eventType, handler)
    })
    eventHandlers.clear()
  }

  onUnmounted(() => {
    unbindPageEvents()
  })
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(page-preview-view) {
    height: 100vh;
    background-color: #f5f7fa;

    @include e(error) {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    @include e(content) {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      height: 100vh;
      overflow: auto;
    }

    @include e(canvas) {
      background-color: #fff;
      box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
      border-radius: 8px;
      overflow: hidden;
      position: relative;
    }
  }
</style>
