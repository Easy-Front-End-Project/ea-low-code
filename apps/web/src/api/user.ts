import request from '@/utils/request'
import { apiList } from './config'

/**
 * 创建用户（注册）
 * @param data - 用户数据
 * @param data.username - 用户名
 * @param data.email - 邮箱
 * @param data.password - 密码
 * @param data.nickname - 昵称
 * @returns {Promise<Object>}
 */
export const createUser = (data: Record<string, any>): Promise<any> => {
  return request.post(apiList.user.create, data)
}

/**
 * 获取用户列表
 * @returns {Promise<Array>}
 */
export const getUserList = (): Promise<any> => {
  return request.get(apiList.user.list)
}

/**
 * 获取用户详情
 * @param id - 用户ID
 * @returns {Promise<Object>}
 */
export const getUserDetail = (id: number): Promise<any> => {
  return request.get(apiList.user.detail, { params: { id } })
}

/**
 * 更新用户信息
 * @param data - 更新数据
 * @param data.id - 用户ID
 * @param data.data - 用户数据
 * @param data.data.nickname - 昵称
 * @param data.data.email - 邮箱
 * @param data.data.isActive - 是否激活
 * @returns {Promise<Object>}
 */
export const updateUser = (data: Record<string, any>): Promise<any> => {
  return request.post(apiList.user.update, data)
}

/**
 * 删除用户
 * @param id - 用户ID
 * @returns {Promise<{message: string}>}
 */
export const deleteUser = (id: number): Promise<any> => {
  return request.post(apiList.user.delete, { id })
}
