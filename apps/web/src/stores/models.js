import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getModels,
  getModelDetail,
  createModel as createModelApi,
  updateModel as updateModelApi,
  deleteModel as deleteModelApi,
  getModelFields,
  createField as createFieldApi,
  updateField as updateFieldApi,
  deleteField as deleteFieldApi,
  sortFields as sortFieldsApi,
} from '@/api/models.js'

export const useModelsStore = defineStore('models', () => {
  const models = ref([])
  const fields = ref([])
  const currentModel = ref(null)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(50)
  const keyword = ref('')
  const selectedModelId = ref(null)
  const loading = ref(false)
  const fieldsLoading = ref(false)

  const hasModels = computed(() => models.value.length > 0)
  const hasFields = computed(() => fields.value.length > 0)
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  async function fetchModels() {
    loading.value = true
    try {
      const response = await getModels(keyword.value || undefined)
      models.value = response || []
      return response
    } catch (error) {
      console.error('获取模型列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchModelDetail(id) {
    try {
      const { model, fields: fieldList } = await getModelDetail(id)
      currentModel.value = model
      fields.value = fieldList || []
      total.value = (fieldList || []).length
      return { model, fields: fieldList }
    } catch (error) {
      console.error('获取模型详情失败:', error)
      throw error
    }
  }

  async function fetchFields(modelId, params = {}) {
    fieldsLoading.value = true
    try {
      const queryParams = {
        modelId,
        page: params.page || currentPage.value,
        pageSize: params.pageSize || pageSize.value,
        ...params,
      }
      const response = await getModelFields(
        queryParams.modelId,
        queryParams.page,
        queryParams.pageSize
      )
      fields.value = response.list || []
      total.value = response.total || 0
      currentPage.value = response.page || 1
      pageSize.value = response.pageSize || 50
      return response
    } catch (error) {
      console.error('获取字段列表失败:', error)
      throw error
    } finally {
      fieldsLoading.value = false
    }
  }

  async function addModel(data) {
    const result = await createModelApi(data)
    await fetchModels()
    return result
  }

  async function editModel(data) {
    const result = await updateModelApi(data)
    if (selectedModelId.value === data.id) {
      await fetchModelDetail(data.id)
    }
    await fetchModels()
    return result
  }

  async function removeModel(id) {
    const result = await deleteModelApi(id)
    window.$message?.success('模型删除成功')
    if (selectedModelId.value === id) {
      selectedModelId.value = null
      currentModel.value = null
      fields.value = []
    }
    await fetchModels()
    return result
  }

  async function addField(data) {
    const result = await createFieldApi(data)
    if (selectedModelId.value === data.modelId) {
      await fetchFields(selectedModelId.value)
    }
    return result
  }

  async function editField(data) {
    const result = await updateFieldApi(data)
    if (selectedModelId.value && currentModel.value) {
      await fetchFields(selectedModelId.value)
    }
    return result
  }

  async function removeField(id) {
    const result = await deleteFieldApi(id)
    window.$message?.success('字段删除成功')
    if (selectedModelId.value) {
      await fetchFields(selectedModelId.value)
    }
    return result
  }

  async function reorderFields(modelId, fieldIds) {
    const result = await sortFieldsApi(modelId, fieldIds)
    if (selectedModelId.value === modelId) {
      await fetchFields(modelId)
    }
    return result
  }

  function selectModel(id) {
    selectedModelId.value = id
    if (id) {
      fetchModelDetail(id)
    } else {
      currentModel.value = null
      fields.value = []
    }
  }

  function setKeyword(value) {
    keyword.value = value
  }

  function setPage(page) {
    currentPage.value = page
  }

  function setPageSize(size) {
    pageSize.value = size
    currentPage.value = 1
  }

  function reset() {
    models.value = []
    fields.value = []
    currentModel.value = null
    total.value = 0
    currentPage.value = 1
    keyword.value = ''
    selectedModelId.value = null
  }

  return {
    models,
    fields,
    currentModel,
    total,
    currentPage,
    pageSize,
    keyword,
    selectedModelId,
    loading,
    fieldsLoading,

    hasModels,
    hasFields,
    totalPages,

    fetchModels,
    fetchModelDetail,
    fetchFields,
    addModel,
    editModel,
    removeModel,
    addField,
    editField,
    removeField,
    reorderFields,
    selectModel,
    setKeyword,
    setPage,
    setPageSize,
    reset,
  }
})
