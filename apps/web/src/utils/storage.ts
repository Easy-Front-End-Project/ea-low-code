// Storage keys - 使用企业级命名规范
const STORAGE_KEYS = {
  TOKEN: 'ea_platform_session_token',
  USER: 'ea_platform_user_profile',
} as const

/**
 * 获取 Token
 * @returns Token 字符串或 null
 */
export function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

/**
 * 设置 Token
 * @param token - Token 字符串
 */
export function setToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token)
}

/**
 * 清除 Token
 */
export function removeToken(): void {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
}

/**
 * 获取用户信息
 * @returns 用户信息对象或 null
 */
export function getUser(): Record<string, any> | null {
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
 * @param user - 用户信息对象
 */
export function setUser(user: Record<string, any>): void {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

/**
 * 清除用户信息
 */
export function removeUser(): void {
  localStorage.removeItem(STORAGE_KEYS.USER)
}

/**
 * 清除所有认证信息
 */
export function clearAuth(): void {
  removeToken()
  removeUser()
}
