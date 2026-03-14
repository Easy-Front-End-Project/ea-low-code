import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { generateUniqueId } from '@/utils/schemaHelper'

/**
 * 变量定义
 * @typedef {Object} Variable
 * @property {string} id - 变量唯一ID
 * @property {string} name - 变量名
 * @property {string} type - 变量类型
 * @property {any} defaultValue - 默认值
 * @property {string} remark - 备注
 */

/**
 * 变量管理 Store
 * 用于管理页面中的变量定义
 */
export const useVariableStore = defineStore('variable', () => {
  // 变量列表
  const variables = ref([])

  // 根据ID获取变量
  const getVariableById = computed(() => {
    return id => variables.value.find(v => v.id === id)
  })

  // 根据名称获取变量
  const getVariableByName = computed(() => {
    return name => variables.value.find(v => v.name === name)
  })

  // 获取变量名称列表（用于下拉选择）
  const variableNames = computed(() => {
    return variables.value.map(v => v.name)
  })

  /**
   * 添加变量
   * @param {Object} variable - 变量定义（不含id）
   * @returns {string} 新变量的ID
   */
  function addVariable(variable) {
    const id = generateVariableId()
    const newVariable = {
      id,
      name: variable.name || `var${variables.value.length + 1}`,
      type: variable.type || 'string',
      defaultValue: variable.defaultValue !== undefined ? variable.defaultValue : '',
      remark: variable.remark || '',
    }
    variables.value.push(newVariable)
    return id
  }

  /**
   * 更新变量
   * @param {string} id - 变量ID
   * @param {Object} updates - 更新的字段
   */
  function updateVariable(id, updates) {
    const index = variables.value.findIndex(v => v.id === id)
    if (index > -1) {
      variables.value[index] = {
        ...variables.value[index],
        ...updates,
      }
    }
  }

  /**
   * 根据变量名更新变量
   * @param {string} name - 变量名
   * @param {Object} updates - 更新的字段
   */
  function updateVariableByName(name, updates) {
    const index = variables.value.findIndex(v => v.name === name)
    if (index > -1) {
      variables.value[index] = {
        ...variables.value[index],
        ...updates,
      }
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
   * 设置整个变量列表（用于导入）
   * @param {Array} newVariables - 变量列表
   */
  function setVariables(newVariables) {
    variables.value = newVariables || []
  }

  /**
   * 清空所有变量
   */
  function clearVariables() {
    variables.value = []
  }

  /**
   * 获取变量的默认值
   * @param {string} name - 变量名
   * @returns {any} 默认值
   */
  function getVariableDefaultValue(name) {
    const variable = variables.value.find(v => v.name === name)
    return variable ? variable.defaultValue : undefined
  }

  /**
   * 检查变量名是否已存在
   * @param {string} name - 变量名
   * @param {string} excludeId - 排除的变量ID（用于编辑时检查）
   * @returns {boolean}
   */
  function isVariableNameExists(name, excludeId) {
    return variables.value.some(v => v.name === name && v.id !== excludeId)
  }

  /**
   * 生成变量ID
   * @returns {string}
   */
  function generateVariableId() {
    return generateUniqueId('var')
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
