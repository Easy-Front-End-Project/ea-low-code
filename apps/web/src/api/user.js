import request from '@/utils/request.js'
import { apiList } from './config.js'

/**
 * 创建用户（注册）
 * @param {Object} data - 用户信息
 * @param {string} data.username - 用户名
 * @param {string} data.email - 邮箱
 * @param {string} data.password - 密码
 * @param {string} [data.nickname] - 昵称
 * @returns {Promise<Object>}
 */
export const createUser = (data) => {
  return request.post(apiList.user.create, data)
}

/**
 * 获取用户列表
 * @returns {Promise<Array>}
 */
export const getUserList = () => {
  return request.get(apiList.user.list)
}

/**
 * 获取用户详情
 * @param {number} id - 用户ID
 * @returns {Promise<Object>}
 */
export const getUserDetail = (id) => {
  return request.get(apiList.user.detail, { params: { id } })
}

/**
 * 更新用户信息
 * @param {Object} data - 更新数据
 * @param {number} data.id - 用户ID
 * @param {Object} data.data - 更新的字段
 * @returns {Promise<Object>}
 */
export const updateUser = (data) => {
  return request.post(apiList.user.update, data)
}

/**
 * 删除用户
 * @param {number} id - 用户ID
 * @returns {Promise<Object>}
 */
export const deleteUser = (id) => {
  return request.post(apiList.user.delete, { id })
}
