import { ref, watch, onUnmounted } from 'vue'
import { useSchemaStore } from '@/components/designer/stores/schema'
import { usePagesStore } from '@/stores/pages'
import { useSaveStatus } from './useSaveStatus'

interface AutoSaveOptions {
  interval?: number
  minInterval?: number
  maxChanges?: number
  enabled?: boolean
}

export function useAutoSave(options: AutoSaveOptions = {}) {
  const { interval = 30000, minInterval = 60000, maxChanges = 10, enabled = true } = options

  const schemaStore = useSchemaStore()
  const pagesStore = usePagesStore()
  const saveStatus = useSaveStatus()

  const isDirty = ref(false)
  const changeCount = ref(0)
  let debounceTimer: ReturnType<typeof setTimeout> | undefined = undefined
  let lastSaveTimestamp = 0
  let previousSchema = JSON.stringify(schemaStore.pageSchema)

  watch(
    () => schemaStore.pageSchema,
    newSchema => {
      if (!enabled) return

      const currentSchema = JSON.stringify(newSchema)
      if (currentSchema === previousSchema) return

      previousSchema = currentSchema
      isDirty.value = true
      changeCount.value++

      if (changeCount.value >= maxChanges) {
        triggerAutoSave()
        return
      }

      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(triggerAutoSave, interval)
    },
    { deep: true }
  )

  async function triggerAutoSave(pageId?: number | string): Promise<boolean> {
    if (!pageId || saveStatus.isSaving.value) return false

    const now = Date.now()
    if (now - lastSaveTimestamp < minInterval) {
      const remaining = minInterval - (now - lastSaveTimestamp)
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => triggerAutoSave(pageId), remaining)
      return false
    }

    saveStatus.setSaving(true)
    try {
      const schema = schemaStore.exportSchema()
      await pagesStore.updatePage({
        id: Number(pageId),
        schema,
      })

      saveStatus.markSaved()
      lastSaveTimestamp = now
      isDirty.value = false
      changeCount.value = 0

      console.log('[AutoSave] 自动保存成功', saveStatus.lastSavedTime.value?.toLocaleTimeString())
      return true
    } catch (error) {
      console.error('[AutoSave] 自动保存失败:', error)
      return false
    } finally {
      saveStatus.setSaving(false)
    }
  }

  function resetDirty(): void {
    isDirty.value = false
    changeCount.value = 0
    clearTimeout(debounceTimer)
  }

  function forceMarkDirty(): void {
    isDirty.value = true
  }

  onUnmounted(() => {
    clearTimeout(debounceTimer)
  })

  return {
    isDirty,
    isSaving: saveStatus.isSaving,
    lastSavedTime: saveStatus.lastSavedTime,
    changeCount,
    triggerAutoSave,
    resetDirty,
    forceMarkDirty,
  }
}
