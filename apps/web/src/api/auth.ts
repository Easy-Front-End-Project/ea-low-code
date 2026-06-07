import request from '@/utils/request'
import { apiList } from './config'

/**
 * 用户登录
 * @param data - 登录凭证
 * @param data.username - 用户名/邮箱
 * @param data.password - 密码
 * @returns {Promise<{access_token: string, user: Object}>}
 */
export const login = (data: Record<string, any>): Promise<any> => {
  return request.post(apiList.auth.login, data)
}

/**
 * 获取当前用户信息
 * @returns {Promise<Object>}
 */
export const getProfile = (): Promise<any> => {
  return request.get(apiList.auth.profile)
}

/**
 * 发送验证码
 * @param data - 请求数据
 * @param data.email - 邮箱地址
 * @param data.purpose - 用途（register/resetPassword）
 * @returns {Promise<{message: string}>}
 */
export const sendVerificationCode = (data: Record<string, any>): Promise<any> => {
  return request.post(apiList.auth.sendVerificationCode, data)
}

/**
 * 验证验证码
 * @param data - 请求数据
 * @param data.email - 邮箱地址
 * @param data.code - 验证码
 * @param data.purpose - 用途
 * @returns {Promise<{valid: boolean}>}
 */
export const verifyCode = (data: Record<string, any>): Promise<any> => {
  return request.post(apiList.auth.verifyCode, data)
}

/**
 * 重置密码
 * @param data - 请求数据
 * @param data.email - 邮箱地址
 * @param data.newPassword - 新密码
 * @param data.code - 验证码
 * @returns {Promise<{message: string}>}
 */
export const resetPassword = (data: Record<string, any>): Promise<any> => {
  return request.post(apiList.auth.resetPassword, data)
}

/**
 * 修改密码（需要旧密码）
 * @param data - 请求数据
 * @param data.oldPassword - 旧密码
 * @param data.newPassword - 新密码
 * @returns {Promise<{message: string}>}
 */
export const changePassword = (data: Record<string, any>): Promise<any> => {
  return request.post(apiList.auth.changePassword, data)
}
