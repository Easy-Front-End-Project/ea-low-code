import axios from 'axios'
import { getToken, clearAuth } from './storage'

// API 基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// 创建 axios 实例
const request = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 storage 获取 token
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 直接返回响应数据
    return response.data
  },
  (error) => {
    // 统一错误处理
    const message = error.response?.data?.message || '请求失败，请稍后重试'

    // 根据状态码处理不同错误
    const status = error.response?.status
    switch (status) {
      case 401:
        if (getToken()) {
          clearAuth()
          window.location.href = '/ea-low-code/login'
        }
        break
      case 403:
        console.error('没有权限访问该资源')
        break
      case 404:
        console.error('请求的资源不存在')
        break
      case 500:
        console.error('服务器内部错误')
        break
      default:
        console.error('请求错误:', message)
    }

    return Promise.reject(new Error(message))
  }
)

interface HttpRequestOptions {
  method?: string
  data?: Record<string, any>
  params?: Record<string, any>
  headers?: Record<string, string>
  timeout?: number
}

/**
 * 封装请求方法
 * @param url - 请求地址
 * @param options - 请求配置
 * @returns 请求结果
 */
export function httpRequest(url: string, options: HttpRequestOptions = {}): Promise<any> {
  const { method = 'get', data, params, headers, timeout } = options

  return request({
    url,
    method: method.toLowerCase(),
    data,
    params,
    headers,
    timeout,
  })
}

export default request
