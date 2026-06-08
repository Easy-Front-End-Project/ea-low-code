import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { generateUniqueId } from '@/utils/schemaHelper'
import { useSchemaStore } from './schema'

/**
 * 变量类型
 */
export type VariableType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'function'

/**
 * 变量项接口
 */
export interface VariableItem {
  id: string
  name: string
  type: VariableType
  defaultValue: unknown
  remark: string
}

/**
 * 添加变量参数接口
 */
interface AddVariableParams {
  name?: string
  type?: VariableType
  defaultValue?: unknown
  remark?: string
}

/**
 * 变量管理 Store
 * 用于管理页面中的变量定义
 */
export const useVariableStore = defineStore('variable', () => {
  // 变量列表
  const variables = ref<VariableItem[]>([])

  // 监听变量变化，同步到 schema
  let schemaStore: ReturnType<typeof useSchemaStore> | null = null
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
  const getVariableById = computed(() => (id: string) => variables.value.find(v => v.id === id))
  const getVariableByName = computed(() => (name: string) => variables.value.find(v => v.name === name))
  const variableNames = computed(() => variables.value.map(v => v.name))

  /**
   * 添加变量
   * @param variable - 变量配置
   * @returns 变量ID
   */
  function addVariable(variable: AddVariableParams): string {
    const id = generateUniqueId('var')
    const newVariable: VariableItem = {
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
   * @param id - 变量ID
   * @param updates - 更新内容
   */
  function updateVariable(id: string, updates: Partial<VariableItem>): void {
    const index = variables.value.findIndex(v => v.id === id)
    if (index > -1) {
      variables.value[index] = { ...variables.value[index], ...updates }
    }
  }

  /**
   * 根据名称更新变量
   * @param name - 变量名称
   * @param updates - 更新内容
   */
  function updateVariableByName(name: string, updates: Partial<VariableItem>): void {
    const index = variables.value.findIndex(v => v.name === name)
    if (index > -1) {
      variables.value[index] = { ...variables.value[index], ...updates }
    }
  }

  /**
   * 删除变量
   * @param id - 变量ID
   */
  function removeVariable(id: string): void {
    const index = variables.value.findIndex(v => v.id === id)
    if (index > -1) {
      variables.value.splice(index, 1)
    }
  }

  /**
   * 设置变量列表
   * @param newVariables - 新变量列表
   */
  function setVariables(newVariables: VariableItem[]): void {
    variables.value = newVariables || []
  }

  /**
   * 清空变量
   */
  function clearVariables(): void {
    variables.value = []
  }

  /**
   * 获取变量默认值
   * @param name - 变量名称
   * @returns 默认值
   */
  function getVariableDefaultValue(name: string): unknown {
    const variable = variables.value.find(v => v.name === name)
    return variable?.defaultValue
  }

  /**
   * 检查变量名是否已存在
   * @param name - 变量名称
   * @param excludeId - 排除的变量ID
   * @returns 是否存在
   */
  function isVariableNameExists(name: string, excludeId?: string): boolean {
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
