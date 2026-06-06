import { ref, computed } from 'vue'

const lastSavedTime = ref(null)
const isSaving = ref(false)

export function useSaveStatus() {
  const saveStatusText = computed(() => {
    if (!lastSavedTime.value) return ''
    const time = formatTime(lastSavedTime.value)
    return `已保存 ${time}`
  })

  function formatTime(date) {
    if (!(date instanceof Date)) return ''
    const now = new Date()
    const diff = now - date

    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  function markSaved() {
    lastSavedTime.value = new Date()
  }

  function setSaving(value) {
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
