/**
 * 项目类型定义
 * 统一项目、页面、数据源、模型等业务类型
 */

import type { PageSchema, VariableItem } from './schema'

// ==================== 项目 ====================

/** 项目配置 */
export interface ProjectConfig {
  theme?: string
  locale?: string
  [key: string]: unknown
}

/** 项目接口 */
export interface Project {
  id: number
  name: string
  description?: string
  userId: number
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
  pages?: Page[]
}

// ==================== 页面 ====================

/** 页面接口 */
export interface Page {
  id: number
  name: string
  description?: string
  schema?: PageSchema
  variables?: VariableItem[]
  sortOrder: number
  projectId: number
  createdAt: Date
  updatedAt: Date
}

// ==================== 数据源 ====================

/** 数据源类型枚举 */
export type DatasourceType = 'mysql' | 'postgresql' | 'rest_api' | 'graphql' | 'feishu'

/** 数据源配置 */
export interface DatasourceConfig {
  host?: string
  port?: number
  username?: string
  password?: string
  database?: string
  url?: string
  headers?: Record<string, string>
  [key: string]: unknown
}

/** 数据源接口 */
export interface Datasource {
  id: number
  name: string
  type: DatasourceType
  config: DatasourceConfig
  description?: string
  projectId: number
  createdAt: Date
  updatedAt: Date
}

// ==================== 模型 ====================

/** 字段类型枚举 */
export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'text' | 'json' | 'enum'

/** 模型字段接口 */
export interface ModelField {
  id: number
  name: string
  label: string
  type: FieldType
  required: boolean
  defaultValue?: unknown
  options?: string[]
  sortOrder: number
  modelId: number
}

/** 数据模型接口 */
export interface DataModel {
  id: number
  name: string
  description?: string
  tableName: string
  fields: ModelField[]
  projectId: number
  createdAt: Date
  updatedAt: Date
}
