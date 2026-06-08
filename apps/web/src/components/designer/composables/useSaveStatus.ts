import { ref, computed } from 'vue'

const lastSavedTime = ref<Date | null>(null)
const isSaving = ref(false)

export function useSaveStatus() {
  const saveStatusText = computed(() => {
    if (!lastSavedTime.value) return ''
    const time = formatTime(lastSavedTime.value)
    return `已保存 ${time}`
  })

  function formatTime(date: Date): string {
    if (!(date instanceof Date)) return ''
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  function markSaved(): void {
    lastSavedTime.value = new Date()
  }

  function setSaving(value: boolean): void {
    isSaving.value = value
  }

  return {
    lastSavedTime,
    isSaving,
    saveStatusText,
    markSaved,
    setSaving,
  }
}
