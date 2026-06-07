import request from '@/utils/request'
import { apiList } from './config'

const API = apiList.models

/**
 * 获取所有模型列表
 * @param keyword - 搜索关键词（模型名称或描述）
 * @returns 模型列表
 */
export function getModels(keyword?: string): Promise<any> {
  return request.get(API.list, { params: { keyword } })
}

/**
 * 获取模型详情（含字段列表）
 * @param id - 模型 ID
 * @returns 模型信息和字段列表
 */
export function getModelDetail(id: number): Promise<any> {
  return request.get(API.detail, { params: { id } })
}

/**
 * 创建数据模型（同时创建物理表）
 * @param data - 模型数据
 * @param data.name - 模型名称（2-50字符）
 * @param data.description - 模型描述
 * @returns 创建的模型信息
 */
export function createModel(data: Record<string, any>): Promise<any> {
  return request.post(API.create, data)
}

/**
 * 更新模型信息
 * @param data - 更新数据
 * @param data.id - 模型 ID
 * @param data.name - 模型名称
 * @param data.description - 模型描述
 * @returns 更新后的模型信息
 */
export function updateModel(data: Record<string, any>): Promise<any> {
  return request.post(API.update, data)
}

/**
 * 删除模型（同时删除物理表和字段记录）
 * @param id - 模型 ID
 * @returns 操作结果
 */
export function deleteModel(id: number): Promise<any> {
  return request.post(API.delete, { id })
}

/**
 * 获取模型的字段列表（分页）
 * @param modelId - 模型 ID
 * @param page - 页码
 * @param pageSize - 每页条数
 * @returns 字段分页数据
 */
export function getModelFields(modelId: number, page: number = 1, pageSize: number = 50): Promise<any> {
  return request.get(API.fieldsList, { params: { modelId, page, pageSize } })
}

/**
 * 新增模型字段（同步添加物理列到动态表）
 * @param data - 字段数据
 * @param data.modelId - 所属模型 ID
 * @param data.fieldLabel - 字段中文描述
 * @param data.fieldName - 字段名（英文标识符）
 * @param data.fieldType - 字段类型（text/number/date/datetime/boolean/json）
 * @param data.fieldLength - 字段长度
 * @param data.isNullable - 是否可为空
 * @param data.isUnique - 是否唯一
 * @param data.defaultValue - 默认值
 * @param data.sortOrder - 排序序号
 * @returns 创建的字段信息
 */
export function createField(data: Record<string, any>): Promise<any> {
  return request.post(API.fieldsCreate, data)
}

/**
 * 更新模型字段定义（同步修改物理列）
 * @param data - 更新数据
 * @param data.id - 字段 ID
 * @param data.fieldLabel - 字段中文描述
 * @param data.fieldType - 字段类型
 * @param data.fieldLength - 字段长度
 * @param data.isNullable - 是否可为空
 * @param data.isUnique - 是否唯一
 * @param data.defaultValue - 默认值
 * @param data.sortOrder - 排序序号
 * @returns 更新后的字段信息
 */
export function updateField(data: Record<string, any>): Promise<any> {
  return request.post(API.fieldsUpdate, data)
}

/**
 * 删除模型字段（同步从物理表删除列，系统字段不可删）
 * @param id - 字段 ID
 * @returns 操作结果
 */
export function deleteField(id: number): Promise<any> {
  return request.post(API.fieldsDelete, { id })
}

/**
 * 批量更新字段排序序号
 * @param modelId - 模型 ID
 * @param fieldIds - 按排序顺序排列的字段 ID 数组
 * @returns 操作结果
 */
export function sortFields(modelId: number, fieldIds: number[]): Promise<any> {
  return request.post(API.fieldsSort, { modelId, fieldIds })
}
