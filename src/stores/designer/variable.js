import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { generateUniqueId } from '@/utils/schemaHelper'
import { useSchemaStore } from './schema'

/**
 * 变量管理 Store
 * 用于管理页面中的变量定义
 */
export const useVariableStore = defineStore('variable', () => {
  // 变量列表
  const variables = ref([])

  // 监听变量变化，同步到 schema
  let schemaStore = null
  watch(
    variables,
    newVariables => {
      if (!schemaStore) {
        schemaStore = useSchemaStore()
      }
      schemaStore.updatePageVariables(newVariables)
    },
    { deep: true }
  )

  // Getters
  const getVariableById = computed(() => id => variables.value.find(v => v.id === id))
  const getVariableByName = computed(() => name => variables.value.find(v => v.name === name))
  const variableNames = computed(() => variables.value.map(v => v.name))

  /**
   * 添加变量
   * @param {Object} variable - 变量配置
   * @returns {string} 变量ID
   */
  function addVariable(variable) {
    const id = generateUniqueId('var')
    const newVariable = {
      id,
      name: variable.name || `var${variables.value.length + 1}`,
      type: variable.type || 'string',
      defaultValue: variable.defaultValue ?? '',
      remark: variable.remark || '',
    }
    variables.value.push(newVariable)
    return id
  }

  /**
   * 更新变量
   * @param {string} id - 变量ID
   * @param {Object} updates - 更新内容
   */
  function updateVariable(id, updates) {
    const index = variables.value.findIndex(v => v.id === id)
    if (index > -1) {
      variables.value[index] = { ...variables.value[index], ...updates }
    }
  }

  /**
   * 根据名称更新变量
   * @param {string} name - 变量名称
   * @param {Object} updates - 更新内容
   */
  function updateVariableByName(name, updates) {
    const index = variables.value.findIndex(v => v.name === name)
    if (index > -1) {
      variables.value[index] = { ...variables.value[index], ...updates }
    }
  }

  /**
   * 删除变量
   * @param {string} id - 变量ID
   */
  function removeVariable(id) {
    const index = variables.value.findIndex(v => v.id === id)
    if (index > -1) {
      variables.value.splice(index, 1)
    }
  }

  /**
   * 设置变量列表
   * @param {Array} newVariables - 新变量列表
   */
  function setVariables(newVariables) {
    variables.value = newVariables || []
  }

  /**
   * 清空变量
   */
  function clearVariables() {
    variables.value = []
  }

  /**
   * 获取变量默认值
   * @param {string} name - 变量名称
   * @returns {any} 默认值
   */
  function getVariableDefaultValue(name) {
    const variable = variables.value.find(v => v.name === name)
    return variable?.defaultValue
  }

  /**
   * 检查变量名是否已存在
   * @param {string} name - 变量名称
   * @param {string} excludeId - 排除的变量ID
   * @returns {boolean} 是否存在
   */
  function isVariableNameExists(name, excludeId) {
    return variables.value.some(v => v.name === name && v.id !== excludeId)
  }

  return {
    variables,
    getVariableById,
    getVariableByName,
    variableNames,
    addVariable,
    updateVariable,
    updateVariableByName,
    removeVariable,
    setVariables,
    clearVariables,
    getVariableDefaultValue,
    isVariableNameExists,
  }
})
