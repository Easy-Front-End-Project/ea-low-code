import axios from 'axios'

// API 基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

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
    // 从 localStorage 获取 token
    const token = localStorage.getItem('access_token')
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
        // 未授权，清除 token 并跳转登录页
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
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

/**
 * 封装请求方法
 * @param {string} url - 请求地址
 * @param {Object} options - 请求配置
 * @param {string} options.method - 请求方法 (get/post/put/delete)
 * @param {Object} options.data - 请求体数据
 * @param {Object} options.params - URL 参数
 * @param {Object} options.headers - 自定义请求头
 * @returns {Promise} 请求结果
 */
export function httpRequest(url, options = {}) {
  const { method = 'get', data, params, headers } = options
  
  return request({
    url,
    method: method.toLowerCase(),
    data,
    params,
    headers,
  })
}

export default request
