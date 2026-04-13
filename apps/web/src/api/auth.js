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

/**
 * 发送验证码
 * @param {Object} data - 请求数据
 * @param {string} data.email - 邮箱地址
 * @param {string} [data.purpose] - 用途（register/resetPassword）
 * @returns {Promise<{message: string}>}
 */
export const sendVerificationCode = (data) => {
  return request.post(apiList.auth.sendVerificationCode, data)
}

/**
 * 验证验证码
 * @param {Object} data - 请求数据
 * @param {string} data.email - 邮箱地址
 * @param {string} data.code - 验证码
 * @param {string} [data.purpose] - 用途
 * @returns {Promise<{valid: boolean}>}
 */
export const verifyCode = (data) => {
  return request.post(apiList.auth.verifyCode, data)
}

/**
 * 重置密码
 * @param {Object} data - 请求数据
 * @param {string} data.email - 邮箱地址
 * @param {string} data.newPassword - 新密码
 * @param {string} data.code - 验证码
 * @returns {Promise<{message: string}>}
 */
export const resetPassword = (data) => {
  return request.post(apiList.auth.resetPassword, data)
}

/**
 * 修改密码（需要旧密码）
 * @param {Object} data - 请求数据
 * @param {string} data.oldPassword - 旧密码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise<{message: string}>}
 */
export const changePassword = (data) => {
  return request.post(apiList.auth.changePassword, data)
}
