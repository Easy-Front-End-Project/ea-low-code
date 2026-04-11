import request from '@/utils/request.js'
import { apiList } from './config.js'

/**
 * 用户登录
 * @param {Object} data - 登录凭证
 * @param {string} data.username - 用户名/邮箱
 * @param {string} data.password - 密码
 * @returns {Promise<{access_token: string, user: Object}>}
 */
export const login = (data) => {
  return request.post(apiList.auth.login, data)
}

/**
 * 获取当前用户信息
 * @returns {Promise<Object>}
 */
export const getProfile = () => {
  return request.get(apiList.auth.profile)
}
