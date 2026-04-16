<template>
  <div class="page-preview-view">
    <Loading :loading="loading" text="加载预览数据中...">
      <div v-if="loadError" class="page-preview-view__error">
        <ea-result type="warning" title="加载失败" :sub-title="loadError"></ea-result>
      </div>

      <div v-else class="page-preview-view__content">
        <component :is="'style'" v-if="pageCustomCSS">{{ pageCustomCSS }}</component>
        <template v-if="isReady">
          <PreviewComponent v-for="comp in components" :key="comp.id" :component="comp" />
        </template>
        <div v-else class="page-preview-view__loading-hint">
          <div class="page-preview-view__spinner"></div>
          <span>渲染预览中...</span>
        </div>
      </div>
    </Loading>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import { useSchemaStore } from '@/stores/designer/schema'
  import { getPageDetail } from '@/api/projects.js'
  import PreviewComponent from '@/components/designer/PreviewComponent.vue'
  import Loading from '@/components/common/Loading.vue'

  const route = useRoute()
  const schemaStore = useSchemaStore()

  const loading = ref(true)
  const loadError = ref('')
  const isReady = ref(false)

  const components = computed(() => schemaStore.components)
  const pageCustomCSS = computed(() => {
    const settings = schemaStore.pageSchema?.settings || {}
    return settings.customCSS || ''
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
        return
      }

      schemaStore.importSchema(data.schema)

      await nextTick()
      scheduleReady()
    } catch (error) {
      console.error('加载预览数据失败:', error)
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

  function scheduleReady() {
    const minDelay = 500
    const startTime = Date.now()

    const setReady = () => {
      const elapsed = Date.now() - startTime
      setTimeout(
        () => {
          isReady.value = true
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
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(page-preview-view) {
    height: 100vh;
    background-color: #f5f5f5;

    &__error {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    &__content {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 24px;
      height: 100vh;
      overflow: auto;
    }

    &__loading-hint {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: calc(100vh - 48px);
      gap: 12px;
      color: var(--ea-text-secondary);
      font-size: 14px;
    }

    &__spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--ea-border-light);
      border-top-color: var(--ea-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
