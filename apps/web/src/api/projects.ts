import { httpRequest } from '../utils/request'
import { apiList } from './config'

/**
 * 获取项目列表
 * @param params - 查询参数
 * @param params.page - 页码，默认 1
 * @param params.pageSize - 每页条数，默认 20
 * @param params.keyword - 搜索关键词（项目名称）
 * @returns 项目列表和总数
 */
export function getProjects(params: Record<string, any>): Promise<any> {
  return httpRequest(apiList.projects.list, {
    method: 'get',
    params,
  })
}

/**
 * 获取项目详情
 * @param id - 项目 ID
 * @returns 项目详细信息
 */
export function getProjectDetail(id: number | string): Promise<any> {
  return httpRequest(apiList.projects.detail, {
    method: 'get',
    params: { id },
  })
}

/**
 * 获取项目下的所有页面列表
 * @param projectId - 项目 ID
 * @returns 页面列表
 */
export function getProjectPages(projectId: number | string): Promise<any> {
  return httpRequest(apiList.projects.projectPages, {
    method: 'get',
    params: { projectId: Number(projectId) },
  })
}

/**
 * 获取页面详细信息（含完整 schema 数据）
 * @param pageId - 页面 ID
 * @returns 页面详细信息（含 components、props、events 等）
 */
export function getPageDetail(pageId: number | string): Promise<any> {
  return httpRequest(apiList.projects.pageDetail, {
    method: 'get',
    params: { id: Number(pageId) },
  })
}

/**
 * 创建新项目
 * @param data - 项目数据
 * @param data.name - 项目名称
 * @param data.description - 项目描述
 * @param data.cover - 封面图 URL
 * @returns 创建成功后的项目信息
 */
export function createProject(data: Record<string, any>): Promise<any> {
  return httpRequest(apiList.projects.create, {
    method: 'post',
    data,
  })
}

/**
 * 在项目中创建新页面
 * @param data - 页面数据
 * @param data.projectId - 所属项目 ID
 * @param data.name - 页面名称
 * @param data.description - 页面描述
 * @returns 创建成功后的页面信息
 */
export function createPage(data: Record<string, any>): Promise<any> {
  return httpRequest(apiList.projects.pageCreate, {
    method: 'post',
    data,
  })
}

/**
 * 更新项目基本信息
 * @param data - 更新数据
 * @param data.id - 项目 ID（必填）
 * @param data.name - 项目名称
 * @param data.description - 项目描述
 * @param data.cover - 封面图 URL
 * @returns 更新后的项目信息
 */
export function updateProject(data: Record<string, any>): Promise<any> {
  return httpRequest(apiList.projects.update, {
    method: 'post',
    data,
  })
}

/**
 * 更新页面内容（schema 数据）
 * @param data - 更新数据
 * @param data.id - 页面 ID（必填）
 * @param data.components - 组件实例数组
 * @param data.props - 全局属性配置
 * @param data.events - 全局事件配置
 * @param data.slots - 全局插槽配置
 * @returns 更新后的页面信息
 */
export function updatePage(data: Record<string, any>): Promise<any> {
  return httpRequest(apiList.projects.pageUpdate, {
    method: 'post',
    data,
  })
}

/**
 * 删除项目及其所有关联的页面和数据
 * @param id - 项目 ID
 * @returns 删除结果消息
 */
export function deleteProject(id: number | string): Promise<any> {
  return httpRequest(apiList.projects.delete, {
    method: 'post',
    data: { id },
  })
}

/**
 * 克隆/复制整个项目（包含所有页面）
 * @param id - 要克隆的项目 ID
 * @returns 新创建的项目信息
 */
export function cloneProject(id: number | string): Promise<any> {
  return httpRequest(apiList.projects.clone, {
    method: 'post',
    data: { id },
  })
}

/**
 * 删除单个页面
 * @param id - 页面 ID
 * @returns 删除结果消息
 */
export function deletePage(id: number | string): Promise<any> {
  return httpRequest(apiList.projects.pageDelete, {
    method: 'post',
    data: { id: Number(id) },
  })
}

/**
 * 克隆/复制单个页面
 * @param id - 要克隆的页面 ID
 * @returns 新创建的页面信息
 */
export function clonePage(id: number | string): Promise<any> {
  return httpRequest(apiList.projects.pageClone, {
    method: 'post',
    data: { id: Number(id) },
  })
}

/**
 * 导入项目（从 JSON 文件或字符串）
 * @param data - 导入数据
 * @param data.file - JSON 文件（FormData 方式）
 * @param data.jsonString - JSON 字符串
 * @returns 导入成功后的项目信息
 */
export function importProject(data: Record<string, any> | FormData): Promise<any> {
  return httpRequest(apiList.projects.import, {
    method: 'post',
    data,
  })
}

/**
 * 导出项目（获取项目的完整 JSON 数据）
 * @param id - 项目 ID
 * @returns 项目导出数据（JSON 格式）
 */
export function exportProject(id: number | string): Promise<any> {
  return httpRequest(`${apiList.projects.export}/${id}`, {
    method: 'get',
  })
}
