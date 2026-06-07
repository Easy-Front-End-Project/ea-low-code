import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as loginApi, getProfile, sendVerificationCode as sendCodeApi, resetPassword as resetPasswordApi } from '@/api/auth'
import { createUser } from '@/api/user'
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<any>(null)
  const token = ref<string | null>(getToken())
  const isLoggedIn = computed(() => !!token.value)

  // Actions

  /**
   * 用户登录
   * @param credentials - 登录凭证
   * @param credentials.username - 用户名/邮箱
   * @param credentials.password - 密码
   */
  async function login(credentials: { username: string; password: string }) {
    const response = await loginApi(credentials)
    if (response.access_token) {
      token.value = response.access_token
      user.value = response.user || null
      setToken(response.access_token)
      if (response.user) {
        setUser(response.user)
      }
    }
    return response
  }

  /**
   * 用户注册
   * @param data - 注册信息
   * @param data.username - 用户名
   * @param data.email - 邮箱
   * @param data.password - 密码
   * @param data.nickname - 昵称（可选）
   */
  async function register(data: { username: string; email: string; password: string; nickname?: string }) {
    return await createUser(data)
  }

  /**
   * 获取当前用户信息
   */
  async function fetchProfile() {
    const response = await getProfile()
    user.value = response
    return response
  }

  /**
   * 发送验证码
   * @param email - 邮箱地址
   * @param purpose - 用途（register/resetPassword）
   */
  async function sendVerificationCode(email: string, purpose: string = 'register') {
    return await sendCodeApi({ email, purpose })
  }

  /**
   * 重置密码
   * @param data - 重置密码数据
   * @param data.email - 邮箱
   * @param data.newPassword - 新密码
   * @param data.code - 验证码
   */
  async function resetPassword(data: { email: string; newPassword: string; code: string }) {
    return await resetPasswordApi(data)
  }

  /**
   * 用户登出
   */
  function logout() {
    user.value = null
    token.value = ''
    removeToken()
    removeUser()
  }

  /**
   * 初始化用户状态（页面刷新时调用）
   */
  function initUser() {
    const savedToken = getToken()
    const savedUser = getUser()
    console.log('initUser - token:', savedToken ? 'exists' : 'null')
    console.log('initUser - user:', savedUser)
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = savedUser
      console.log('initUser - restored user:', savedUser.username)
    } else {
      console.log('initUser - failed to restore, token:', !!savedToken, 'user:', !!savedUser)
    }
  }

  return {
    // State
    user,
    token,
    isLoggedIn,

    // Actions
    login,
    register,
    fetchProfile,
    sendVerificationCode,
    resetPassword,
    logout,
    initUser,
  }
})
