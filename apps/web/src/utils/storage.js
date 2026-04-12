// Storage keys - 使用企业级命名规范
const STORAGE_KEYS = {
  TOKEN: 'ea_platform_session_token',
  USER: 'ea_platform_user_profile',
}

/**
 * 获取 Token
 * @returns {string|null}
 */
export function getToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

/**
 * 设置 Token
 * @param {string} token
 */
export function setToken(token) {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token)
}

/**
 * 清除 Token
 */
export function removeToken() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
}

/**
 * 获取用户信息
 * @returns {Object|null}
 */
export function getUser() {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER)
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

/**
 * 设置用户信息
 * @param {Object} user
 */
export function setUser(user) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

/**
 * 清除用户信息
 */
export function removeUser() {
  localStorage.removeItem(STORAGE_KEYS.USER)
}

/**
 * 清除所有认证信息
 */
export function clearAuth() {
  removeToken()
  removeUser()
}
