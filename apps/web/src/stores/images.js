import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getImageGroups,
  createImageGroup as createImageGroupApi,
  deleteImageGroup as deleteImageGroupApi,
  getImages,
  deleteImage as deleteImageApi,
  updateImage as updateImageApi,
} from '@/api/images.js'

export const useImagesStore = defineStore('images', () => {
  const images = ref([])
  const groups = ref([])
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const keyword = ref('')
  const selectedGroupId = ref(null)
  const loading = ref(false)
  const groupLoading = ref(false)

  const hasImages = computed(() => images.value.length > 0)
  const hasGroups = computed(() => groups.value.length > 0)
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  const groupOptions = computed(() => {
    return [
      { label: '全部图片', value: null },
      ...groups.value.map(group => ({
        label: `${group.name} (${group.imageCount})`,
        value: group.id,
      })),
    ]
  })

  async function fetchGroups() {
    groupLoading.value = true
    try {
      const response = await getImageGroups()
      groups.value = response || []
      return response
    } catch (error) {
      console.error('获取分组列表失败:', error)
      throw error
    } finally {
      groupLoading.value = false
    }
  }

  async function fetchImages(params = {}) {
    loading.value = true
    try {
      const queryParams = {
        page: params.page || currentPage.value,
        pageSize: params.pageSize || pageSize.value,
        groupId: params.groupId ?? selectedGroupId.value,
        keyword: keyword.value,
        ...params,
      }

      const response = await getImages(queryParams)
      images.value = response.list || []
      total.value = response.total || 0
      currentPage.value = response.page || 1
      pageSize.value = response.pageSize || 20

      return response
    } catch (error) {
      console.error('获取图片列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createGroup(data) {
    const result = await createImageGroupApi(data)
    await fetchGroups()
    return result
  }

  async function removeGroup(id) {
    const result = await deleteImageGroupApi(id)
    await fetchGroups()
    if (selectedGroupId.value === id) {
      selectedGroupId.value = null
    }
    return result
  }

  async function removeImage(id) {
    const result = await deleteImageApi(id)
    window.$message?.success('删除成功')
    await fetchImages()
    await fetchGroups()
    return result
  }

  async function updateImageData(id, data) {
    const result = await updateImageApi({ id, ...data })
    await fetchImages()
    await fetchGroups()
    return result
  }

  function setKeyword(value) {
    keyword.value = value
    currentPage.value = 1
  }

  function setGroupId(id) {
    selectedGroupId.value = id
    currentPage.value = 1
  }

  function setPage(page) {
    currentPage.value = page
  }

  function setPageSize(size) {
    pageSize.value = size
    currentPage.value = 1
  }

  function reset() {
    images.value = []
    groups.value = []
    total.value = 0
    currentPage.value = 1
    keyword.value = ''
    selectedGroupId.value = null
  }

  return {
    images,
    groups,
    total,
    currentPage,
    pageSize,
    keyword,
    selectedGroupId,
    loading,
    groupLoading,

    hasImages,
    hasGroups,
    totalPages,
    groupOptions,

    fetchGroups,
    fetchImages,
    createGroup,
    removeGroup,
    removeImage,
    updateImageData,

    setKeyword,
    setGroupId,
    setPage,
    setPageSize,
    reset,
  }
})
