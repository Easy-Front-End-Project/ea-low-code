import { ref, computed } from 'vue'
import type { NavigationGuardNext } from 'vue-router'
import { useSchemaStore } from '@/components/designer/stores/schema'
import { getPageDetail } from '@/api/projects'
import { useAutoSave } from '@/components/designer/composables/useAutoSave'

export function useDesignerInit(pageId: number | string) {
  const schemaStore = useSchemaStore()
  const isLoading = ref(true)

  const currentPageId = computed(() => pageId)

  const { isDirty, isSaving, triggerAutoSave, resetDirty } = useAutoSave({
    interval: 30000,
    minInterval: 60000,
    maxChanges: 10,
    enabled: !!pageId,
  })

  async function loadPageSchema(): Promise<void> {
    if (!pageId) {
      isLoading.value = false
      return
    }

    try {
      const res = await getPageDetail(pageId)
      if (res?.schema && typeof res.schema === 'object') {
        schemaStore.importSchema(res.schema)
      }
    } catch (error: any) {
      console.error('[DesignerView] 加载页面失败:', error)
      ;(window as any).$message?.error('加载页面数据失败: ' + (error.message || '未知错误'))
    } finally {
      isLoading.value = false
    }
  }

  function getLeaveGuard() {
    return (_to: any, _from: any, next: NavigationGuardNext) => {
      if (isDirty.value && !confirm('您有未保存的更改，确定要离开吗？')) {
        next(false)
        return
      }

      if (isDirty.value && currentPageId.value) {
        triggerAutoSave(currentPageId.value).finally(() => next())
      } else {
        next()
      }
    }
  }

  return {
    isLoading,
    isDirty,
    isSaving,
    triggerAutoSave,
    resetDirty,
    loadPageSchema,
    getLeaveGuard,
  }
}
