<template>
  <div class="h-screen w-screen overflow-hidden">
    <Loading :loading="isLoading" text="正在加载页面...">
      <DesignerLayout />
    </Loading>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import { useRoute, onBeforeRouteLeave } from 'vue-router'
  import DesignerLayout from '@/components/layouts/DesignerLayout.vue'
  import Loading from '@/components/common/Loading.vue'
  import { useAutoSave } from '@/composables/useAutoSave'
  import { useSchemaStore } from '@/stores/designer/schema'
  import { getPageDetail } from '@/api/projects.js'

  const route = useRoute()
  const schemaStore = useSchemaStore()

  const currentPageId = computed(() => route.params.id)
  const isLoading = ref(true)

  const { isDirty, isSaving, triggerAutoSave, resetDirty } = useAutoSave({
    interval: 30000,
    minInterval: 60000,
    maxChanges: 10,
    enabled: !!currentPageId.value,
  })

  async function loadPageSchema() {
    if (!currentPageId.value) {
      isLoading.value = false
      return
    }

    try {
      const res = await getPageDetail(currentPageId.value)
      if (res?.schema && typeof res.schema === 'object') {
        schemaStore.importSchema(res.schema)
      }
    } catch (error) {
      console.error('[DesignerView] 加载页面失败:', error)
      window.$message?.error('加载页面数据失败: ' + (error.message || '未知错误'))
    } finally {
      isLoading.value = false
    }
  }

  // Vue Router 导航守卫 - SPA 内部跳转保护
  onBeforeRouteLeave((to, from, next) => {
    if (isDirty.value && !confirm('您有未保存的更改，确定要离开吗？')) {
      next(false)
      return
    }

    if (isDirty.value && currentPageId.value) {
      triggerAutoSave(currentPageId.value).finally(() => next())
    } else {
      next()
    }
  })

  // beforeunload 事件监听 - 浏览器刷新/关闭保护
  function handleBeforeUnload(e) {
    if (isDirty.value) {
      e.preventDefault()
      e.returnValue = ''
      return ''
    }
  }

  onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
    loadPageSchema()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })
</script>
