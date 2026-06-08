/**
 * API 类型定义
 * 统一通用 API 请求/响应类型
 */

// ==================== 通用 API 响应 ====================

/** 通用 API 响应结构 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/** 分页请求参数 */
export interface PaginationParams {
  page?: number
  pageSize?: number
}

/** 分页响应数据 */
export interface PaginatedData<T = unknown> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/** 分页 API 响应 */
export type PaginatedResponse<T = unknown> = ApiResponse<PaginatedData<T>>

// ==================== 认证相关 ====================

/** 登录请求 */
export interface LoginRequest {
  email: string
  password: string
}

/** 登录响应数据 */
export interface LoginResponseData {
  accessToken: string
  user: {
    id: number
    email: string
    username: string
  }
}

/** 注册请求 */
export interface RegisterRequest {
  username: string
  email: string
  password: string
}

// ==================== 用户相关 ====================

/** 用户信息 */
export interface UserInfo {
  id: number
  username: string
  email: string
  avatar?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
