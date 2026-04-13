import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as loginApi, getProfile, sendVerificationCode as sendCodeApi, resetPassword as resetPasswordApi } from '@/api/auth.js'
import { createUser } from '@/api/user.js'
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '@/utils/storage.js'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref(null)
  const token = ref(getToken())
  const isLoggedIn = computed(() => !!token.value)

  // Actions

  /**
   * 用户登录
   * @param {Object} credentials - 登录凭证
   * @param {string} credentials.username - 用户名/邮箱
   * @param {string} credentials.password - 密码
   */
  async function login(credentials) {
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
   * @param {Object} data - 注册信息
   * @param {string} data.username - 用户名
   * @param {string} data.email - 邮箱
   * @param {string} data.password - 密码
   * @param {string} data.nickname - 昵称（可选）
   */
  async function register(data) {
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
   * @param {string} email - 邮箱地址
   * @param {string} [purpose] - 用途（register/resetPassword）
   */
  async function sendVerificationCode(email, purpose = 'register') {
    return await sendCodeApi({ email, purpose })
  }

  /**
   * 重置密码
   * @param {Object} data - 重置密码数据
   * @param {string} data.email - 邮箱
   * @param {string} data.newPassword - 新密码
   * @param {string} data.code - 验证码
   */
  async function resetPassword(data) {
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
