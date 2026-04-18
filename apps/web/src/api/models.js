import request from '@/utils/request'
import { apiList } from './config'

const API = apiList.models

/**
 * 获取所有模型列表
 * @param {string} [keyword] - 搜索关键词（模型名称或描述）
 * @returns {Promise<Array>} 模型列表
 */
export function getModels(keyword) {
  return request.get(API.list, { params: { keyword } })
}

/**
 * 获取模型详情（含字段列表）
 * @param {number} id - 模型 ID
 * @returns {Promise<{model: Object, fields: Array}>} 模型信息和字段列表
 */
export function getModelDetail(id) {
  return request.get(API.detail, { params: { id } })
}

/**
 * 创建数据模型（同时创建物理表）
 * @param {Object} data - 模型数据
 * @param {string} data.name - 模型名称（2-50字符）
 * @param {string} [data.description] - 模型描述
 * @returns {Promise<Object>} 创建的模型信息
 */
export function createModel(data) {
  return request.post(API.create, data)
}

/**
 * 更新模型信息
 * @param {Object} data - 更新数据
 * @param {number} data.id - 模型 ID
 * @param {string} [data.name] - 模型名称
 * @param {string} [data.description] - 模型描述
 * @returns {Promise<Object>} 更新后的模型信息
 */
export function updateModel(data) {
  return request.post(API.update, data)
}

/**
 * 删除模型（同时删除物理表和字段记录）
 * @param {number} id - 模型 ID
 * @returns {Promise<Object>} 操作结果
 */
export function deleteModel(id) {
  return request.post(API.delete, { id })
}

/**
 * 获取模型的字段列表（分页）
 * @param {number} modelId - 模型 ID
 * @param {number} [page=1] - 页码
 * @param {number} [pageSize=50] - 每页条数
 * @returns {Promise<{list: Array, total: number, page: number, pageSize: number}>} 字段分页数据
 */
export function getModelFields(modelId, page = 1, pageSize = 50) {
  return request.get(API.fieldsList, { params: { modelId, page, pageSize } })
}

/**
 * 新增模型字段（同步添加物理列到动态表）
 * @param {Object} data - 字段数据
 * @param {number} data.modelId - 所属模型 ID
 * @param {string} data.fieldLabel - 字段中文描述
 * @param {string} data.fieldName - 字段名（英文标识符）
 * @param {string} data.fieldType - 字段类型（text/number/date/datetime/boolean/json）
 * @param {number} [data.fieldLength] - 字段长度
 * @param {boolean} [data.isNullable] - 是否可为空
 * @param {boolean} [data.isUnique] - 是否唯一
 * @param {string} [data.defaultValue] - 默认值
 * @param {number} [data.sortOrder] - 排序序号
 * @returns {Promise<Object>} 创建的字段信息
 */
export function createField(data) {
  return request.post(API.fieldsCreate, data)
}

/**
 * 更新模型字段定义（同步修改物理列）
 * @param {Object} data - 更新数据
 * @param {number} data.id - 字段 ID
 * @param {string} [data.fieldLabel] - 字段中文描述
 * @param {string} [data.fieldType] - 字段类型
 * @param {number} [data.fieldLength] - 字段长度
 * @param {boolean} [data.isNullable] - 是否可为空
 * @param {boolean} [data.isUnique] - 是否唯一
 * @param {string} [data.defaultValue] - 默认值
 * @param {number} [data.sortOrder] - 排序序号
 * @returns {Promise<Object>} 更新后的字段信息
 */
export function updateField(data) {
  return request.post(API.fieldsUpdate, data)
}

/**
 * 删除模型字段（同步从物理表删除列，系统字段不可删）
 * @param {number} id - 字段 ID
 * @returns {Promise<Object>} 操作结果
 */
export function deleteField(id) {
  return request.post(API.fieldsDelete, { id })
}

/**
 * 批量更新字段排序序号
 * @param {number} modelId - 模型 ID
 * @param {Array<number>} fieldIds - 按排序顺序排列的字段 ID 数组
 * @returns {Promise<Object>} 操作结果
 */
export function sortFields(modelId, fieldIds) {
  return request.post(API.fieldsSort, { modelId, fieldIds })
}
