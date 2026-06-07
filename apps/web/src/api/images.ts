import { httpRequest } from '../utils/request'
import { apiList } from './config'

// ==================== 分组管理接口 ====================

/**
 * 获取所有图片分组列表
 * @returns 分组列表
 */
export function getImageGroups(): Promise<any> {
  return httpRequest(apiList.images.groupsList, {
    method: 'get',
  })
}

/**
 * 创建新的图片分组
 * @param data - 分组数据
 * @param data.name - 分组名称（2-50字符，必填）
 * @param data.description - 分组描述（可选，最多200字符）
 * @returns 创建成功后的分组信息
 */
export function createImageGroup(data: Record<string, any>): Promise<any> {
  return httpRequest(apiList.images.groupsCreate, {
    method: 'post',
    data,
  })
}

/**
 * 删除图片分组
 * 注意：如果分组下还有图片，将无法删除
 * @param id - 分组 ID
 * @returns 删除结果消息
 */
export function deleteImageGroup(id: number | string): Promise<any> {
  return httpRequest(apiList.images.groupsDelete, {
    method: 'post',
    data: { id },
  })
}

// ==================== 图片管理接口 ====================

/**
 * 获取图片列表（支持分页、分组筛选、关键词搜索）
 * @param params - 查询参数
 * @param params.page - 页码
 * @param params.pageSize - 每页条数（最大50）
 * @param params.groupId - 分组 ID（null表示全部）
 * @param params.keyword - 搜索关键词（匹配文件名和描述）
 * @returns 图片列表和分页信息
 */
export function getImages(params: Record<string, any>): Promise<any> {
  return httpRequest(apiList.images.list, {
    method: 'get',
    params,
  })
}

/**
 * 获取图片详细信息
 * @param id - 图片 ID
 * @returns 图片详细信息（含关联的分组信息）
 */
export function getImageDetail(id: number | string): Promise<any> {
  return httpRequest(apiList.images.detail, {
    method: 'get',
    params: { id },
  })
}

/**
 * 上传图片到服务器
 * 支持多张图片批量上传，可指定目标分组和自定义名称
 * @param formData - 表单数据，包含以下字段：
 *   - file: File (必填) - 图片文件（支持 jpg/png/gif/webp/svg，单文件最大10MB）
 *   - groupId: string (可选) - 目标分组 ID
 *   - alt: string (可选) - 图片描述文字
 *   - customName: string (可选) - 自定义文件名（不包含扩展名时自动保留原扩展名）
 * @returns 上传成功后的图片信息（含 URL、文件名等）
 */
export function uploadImage(formData: FormData): Promise<any> {
  return httpRequest(apiList.images.upload, {
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000,
  })
}

/**
 * 删除图片（同时删除服务器上的物理文件）
 * 并自动更新所属分组的图片计数
 * @param id - 图片 ID
 * @returns 删除结果消息
 */
export function deleteImage(id: number | string): Promise<any> {
  return httpRequest(apiList.images.delete, {
    method: 'post',
    data: { id },
  })
}

/**
 * 更新图片信息（名称、分组、描述）
 * 可用于重命名、移动分组、修改描述等操作
 * @param data - 更新数据
 * @param data.id - 图片 ID（必填）
 * @param data.filename - 新文件名（自动保留扩展名）
 * @param data.groupId - 新分组 ID（null表示移出分组）
 * @param data.alt - 新描述文字
 * @returns 更新后的图片信息
 */
export function updateImage(data: Record<string, any>): Promise<any> {
  return httpRequest(apiList.images.update, {
    method: 'post',
    data,
  })
}
