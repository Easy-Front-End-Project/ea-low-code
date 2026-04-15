import request from '@/utils/request.js'
import { apiList } from './config.js'

/**
 * 获取组件列表
 * @returns {Promise<{list: Array, total: number}>}
 */
export const getComponentList = (keyword) => {
  const params = keyword ? { keyword } : {}
  return request.get(apiList.components.list, { params })
}

/**
 * 获取组件详情
 * @param {number} id - 组件 ID
 * @returns {Promise<Object>}
 */
export const getComponentDetail = id => {
  return request.get(apiList.components.detail, { params: { id } })
}

/**
 * 创建组件
 * @param {Object} data - 组件数据
 * @returns {Promise<Object>}
 */
export const createComponent = data => {
  return request.post(apiList.components.create, data)
}

/**
 * 更新组件
 * @param {Object} data - 组件数据（包含 id）
 * @returns {Promise<Object>}
 */
export const updateComponent = data => {
  return request.post(apiList.components.update, data)
}

/**
 * 删除组件
 * @param {number} id - 组件 ID
 * @returns {Promise<Object>}
 */
export const deleteComponent = id => {
  return request.post(apiList.components.delete, { id })
}

/**
 * 切换组件启用状态
 * @param {number} id - 组件 ID
 * @param {boolean} enabled - 是否启用
 * @returns {Promise<{success: boolean}>}
 */
export const toggleComponentEnabled = (id, enabled) => {
  return request.post(apiList.components.toggleEnabled, { id, enabled })
}

/**
 * 获取 URL 预设列表
 * @returns {Promise<Array>}
 */
export const getUrlPresetList = () => {
  return request.get(apiList.components.presetsList)
}

/**
 * 创建 URL 预设
 * @param {Object} data - 预设数据
 * @returns {Promise<Object>}
 */
export const createUrlPreset = data => {
  return request.post(apiList.components.presetsCreate, data)
}

/**
 * 更新 URL 预设
 * @param {Object} data - 预设数据（包含 id）
 * @returns {Promise<Object>}
 */
export const updateUrlPreset = data => {
  return request.post(apiList.components.presetsUpdate, data)
}

/**
 * 删除 URL 预设
 * @param {number} id - 预设 ID
 * @returns {Promise<Object>}
 */
export const deleteUrlPreset = id => {
  return request.post(apiList.components.presetsDelete, { id })
}

/**
 * 设置默认 URL 预设
 * @param {number} id - 预设 ID
 * @returns {Promise<Object>}
 */
export const setDefaultUrlPreset = id => {
  return request.post(apiList.components.presetsSetDefault, { id })
}
