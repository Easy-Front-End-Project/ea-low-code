import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getProjects,
  createProject as createProjectApi,
  updateProject as updateProjectApi,
  deleteProject as deleteProjectApi,
  cloneProject as cloneProjectApi,
} from '@/api/projects'

export const useProjectsStore = defineStore('projects', () => {
  // State
  const projects = ref<any[]>([])
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(12)
  const keyword = ref('')
  const loading = ref(false)

  // Getters
  const hasProjects = computed(() => projects.value.length > 0)
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  // Actions
  async function fetchProjects(params: Record<string, any> = {}) {
    loading.value = true
    try {
      const queryParams = {
        page: params.page || currentPage.value,
        pageSize: params.pageSize || pageSize.value,
        keyword: keyword.value,
        ...params,
      }

      const response = await getProjects(queryParams)
      projects.value = response.list || []
      total.value = response.total || 0
      currentPage.value = response.page || 1
      pageSize.value = response.pageSize || 12

      return response
    } catch (error) {
      console.error('获取项目列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function create(data: Record<string, any>) {
    return await createProjectApi(data)
  }

  async function update(id: number, data: Record<string, any>) {
    return await updateProjectApi({ id, ...data })
  }

  async function remove(id: number) {
    return await deleteProjectApi(id)
  }

  async function clone(id: number) {
    return await cloneProjectApi(id)
  }

  function setKeyword(value: string) {
    keyword.value = value
    currentPage.value = 1
  }

  function setPage(page: number) {
    currentPage.value = page
  }

  function setPageSize(size: number) {
    pageSize.value = size
    currentPage.value = 1
  }

  function reset() {
    projects.value = []
    total.value = 0
    currentPage.value = 1
    keyword.value = ''
  }

  return {
    // State
    projects,
    total,
    currentPage,
    pageSize,
    keyword,
    loading,

    // Getters
    hasProjects,
    totalPages,

    // Actions
    fetchProjects,
    create,
    update,
    remove,
    clone,
    setKeyword,
    setPage,
    setPageSize,
    reset,
  }
})
