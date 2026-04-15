import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getProjectPages } from '@/api/projects.js'

export const usePagesStore = defineStore('pages', () => {
  const pages = ref([])
  const loading = ref(false)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(12)
  const keyword = ref('')
  const currentProjectId = ref(null)

  const hasPages = computed(() => pages.value.length > 0)
  const pageCount = computed(() => Math.ceil(total.value / pageSize.value))

  async function fetchPages(projectId) {
    loading.value = true
    currentProjectId.value = projectId

    try {
      const res = await getProjectPages(projectId)
      pages.value = res.list || []
      total.value = res.total || 0
    } catch (error) {
      console.error('获取页面列表失败:', error)
      pages.value = []
      total.value = 0
      throw error
    } finally {
      loading.value = false
    }
  }

  function setPage(page) {
    currentPage.value = page
  }

  function setPageSize(size) {
    pageSize.value = size
    currentPage.value = 1
  }

  function setKeyword(value) {
    keyword.value = value
    currentPage.value = 1
  }

  function reset() {
    pages.value = []
    loading.value = false
    total.value = 0
    currentPage.value = 1
    keyword.value = ''
    currentProjectId.value = null
  }

  return {
    pages,
    loading,
    total,
    currentPage,
    pageSize,
    keyword,
    currentProjectId,
    hasPages,
    pageCount,
    fetchPages,
    setPage,
    setPageSize,
    setKeyword,
    reset,
  }
})
