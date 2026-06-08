<template>
  <div class="login-page">
    <!-- 左侧装饰区域 -->
    <div class="login-page__left">
      <div class="login-page__illustration">
        <div class="login-page__cube login-page__cube--1"></div>
        <div class="login-page__cube login-page__cube--2"></div>
        <div class="login-page__cube login-page__cube--3"></div>
        <div class="login-page__platform"></div>
      </div>
    </div>

    <!-- 右侧表单区域 -->
    <div class="login-page__right">
      <div class="login-page__form-container">
        <!-- Logo/标题 -->
        <h1 class="login-page__title">EA-LowCode</h1>
        <p class="login-page__subtitle">低代码开发平台</p>

        <!-- 登录表单 -->
        <form v-if="currentMode === 'login'" class="login-page__form" @submit.prevent="handleLogin">
          <div class="login-page__form-item">
            <EaInput
              v-model="loginForm.email"
              name="email"
              type="email"
              placeholder="请输入邮箱"
              required
            >
              <template #prefix>
                <ea-icon name="envelope" size="18" color="#909399"></ea-icon>
              </template>
            </EaInput>
          </div>

          <div class="login-page__form-item">
            <EaInput
              v-model="loginForm.password"
              name="password"
              type="password"
              placeholder="请输入密码"
              required
              show-password
              :minlength="6"
            >
              <template #prefix>
                <ea-icon name="lock" size="18" color="#909399"></ea-icon>
              </template>
            </EaInput>
          </div>

          <ea-button
            button-type="submit"
            type="primary"
            size="large"
            class="login-page__submit"
            :disabled="loading"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </ea-button>
        </form>

        <!-- 注册表单 -->
        <form
          v-if="currentMode === 'register'"
          class="login-page__form"
          @submit.prevent="handleRegister"
        >
          <div class="login-page__form-item">
            <EaInput
              v-model="registerForm.email"
              name="email"
              type="email"
              placeholder="请输入邮箱"
              required
            >
              <template #prefix>
                <ea-icon name="envelope" size="18" color="#909399"></ea-icon>
              </template>
            </EaInput>
          </div>

          <div class="login-page__form-item">
            <EaInput
              v-model="registerForm.username"
              name="username"
              type="text"
              placeholder="请输入用户名"
              required
            >
              <template #prefix>
                <ea-icon name="user" size="18" color="#909399"></ea-icon>
              </template>
            </EaInput>
          </div>

          <div class="login-page__form-item">
            <EaInput
              v-model="registerForm.password"
              name="password"
              type="password"
              placeholder="请输入密码"
              required
              show-password
              :minlength="6"
            >
              <template #prefix>
                <ea-icon name="lock" size="18" color="#909399"></ea-icon>
              </template>
            </EaInput>
          </div>

          <div class="login-page__form-item">
            <EaInput
              ref="confirmPasswordRef"
              v-model="registerForm.confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="请确认密码"
              required
              show-password
              :minlength="6"
              @blur="validateConfirmPassword"
            >
              <template #prefix>
                <ea-icon name="lock" size="18" color="#909399"></ea-icon>
              </template>
            </EaInput>
          </div>

          <div class="login-page__form-item">
            <div class="login-page__code-wrapper">
              <EaInput
                v-model="registerForm.code"
                name="code"
                type="text"
                placeholder="请输入验证码"
                required
                :maxlength="6"
                class="login-page__code-input"
              >
                <template #prefix>
                  <ea-icon name="comment-dots" size="18" color="#909399"></ea-icon>
                </template>
              </EaInput>
              <ea-button
                type="primary"
                :disabled="codeCountdown > 0 || sendingCode"
                @click="handleSendCode(registerForm.email, 'register')"
              >
                {{ codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码' }}
              </ea-button>
            </div>
          </div>

          <ea-button
            button-type="submit"
            type="primary"
            size="large"
            class="login-page__submit"
            :disabled="loading"
          >
            {{ loading ? '注册中...' : '注 册' }}
          </ea-button>
        </form>

        <!-- 忘记密码表单 -->
        <form
          v-if="currentMode === 'forgot'"
          class="login-page__form"
          @submit.prevent="handleForgotPassword"
        >
          <div class="login-page__form-item">
            <EaInput
              v-model="forgotForm.email"
              name="email"
              type="email"
              placeholder="请输入邮箱"
              required
            >
              <template #prefix>
                <ea-icon name="envelope" size="18" color="#909399"></ea-icon>
              </template>
            </EaInput>
          </div>

          <div class="login-page__form-item">
            <EaInput
              v-model="forgotForm.newPassword"
              name="newPassword"
              type="password"
              placeholder="请输入新密码"
              required
              show-password
              :minlength="6"
            >
              <template #prefix>
                <ea-icon name="lock" size="18" color="#909399"></ea-icon>
              </template>
            </EaInput>
          </div>

          <div class="login-page__form-item">
            <EaInput
              ref="forgotConfirmPasswordRef"
              v-model="forgotForm.confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="请确认新密码"
              required
              show-password
              :minlength="6"
              @blur="validateForgotConfirmPassword"
            >
              <template #prefix>
                <ea-icon name="lock" size="18" color="#909399"></ea-icon>
              </template>
            </EaInput>
          </div>

          <div class="login-page__form-item">
            <div class="login-page__code-wrapper">
              <EaInput
                v-model="forgotForm.code"
                name="code"
                type="text"
                placeholder="请输入验证码"
                required
                :maxlength="6"
                class="login-page__code-input"
              >
                <template #prefix>
                  <ea-icon name="comment-dots" size="18" color="#909399"></ea-icon>
                </template>
              </EaInput>
              <ea-button
                type="primary"
                :disabled="codeCountdown > 0 || sendingCode"
                @click="handleSendCode(forgotForm.email, 'resetPassword')"
              >
                {{ codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码' }}
              </ea-button>
            </div>
          </div>

          <ea-button
            button-type="submit"
            type="primary"
            size="large"
            class="login-page__submit"
            :disabled="loading"
          >
            {{ loading ? '重置中...' : '重置密码' }}
          </ea-button>
        </form>

        <!-- 底部链接 -->
        <div class="login-page__footer">
          <template v-if="currentMode === 'login'">
            <span class="login-page__footer-text">还没有账号？</span>
            <ea-button class="mr-a" type="primary" @click="switchMode('register')" text>
              去注册
            </ea-button>
            <ea-button
              type="primary"
              class="login-page__link--right"
              @click="switchMode('forgot')"
              text
            >
              忘记密码
            </ea-button>
          </template>
          <template v-else-if="currentMode === 'register'">
            <span class="login-page__footer-text">已有账号？</span>
            <ea-button type="primary" @click="switchMode('login')" text> 去登录 </ea-button>
          </template>
          <template v-else>
            <span class="login-page__footer-text">想起密码了？</span>
            <ea-button type="primary" @click="switchMode('login')" text> 去登录 </ea-button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import { useUserStore } from '@/stores/user'

  const router = useRouter()
  const userStore = useUserStore()

  // 当前模式：login | register | forgot
  const currentMode = ref('login')

  // 登录表单
  const loginForm = reactive({
    email: '',
    password: '',
  })

  // 注册表单
  const registerForm = reactive({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    code: '',
  })

  // 忘记密码表单
  const forgotForm = reactive({
    email: '',
    newPassword: '',
    confirmPassword: '',
    code: '',
  })

  // 状态
  const loading = ref(false)
  const sendingCode = ref(false)
  const codeCountdown = ref(0)
  const confirmPasswordRef = ref<any>(null)
  const forgotConfirmPasswordRef = ref<any>(null)

  // 显示提示消息
  function showMessage(message: string, type: string = 'info') {
    if (window.$message) {
      (window.$message as any)[type](message)
    } else {
      alert(message)
    }
  }

  // 显示警告对话框
  function showAlert(message: string, title: string = '提示') {
    if (window.$alert) {
      return window.$alert(message, title, {
        confirmButtonText: '确定',
      })
    } else {
      alert(message)
      return Promise.resolve()
    }
  }

  // 切换模式
  function switchMode(mode: string) {
    currentMode.value = mode
    // 重置所有表单
    resetForms()
  }

  // 重置所有表单
  function resetForms() {
    // 重置登录表单
    loginForm.email = ''
    loginForm.password = ''

    // 重置注册表单
    registerForm.email = ''
    registerForm.username = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
    registerForm.code = ''

    // 重置忘记密码表单
    forgotForm.email = ''
    forgotForm.newPassword = ''
    forgotForm.confirmPassword = ''
    forgotForm.code = ''

    // 重置倒计时
    codeCountdown.value = 0

    // 清除自定义验证状态
    if (confirmPasswordRef.value) {
      confirmPasswordRef.value.setCustomValidity('')
    }
    if (forgotConfirmPasswordRef.value) {
      forgotConfirmPasswordRef.value.setCustomValidity('')
    }
  }

  // 验证注册确认密码
  function validateConfirmPassword() {
    if (!confirmPasswordRef.value) return true

    if (registerForm.password !== registerForm.confirmPassword) {
      confirmPasswordRef.value.setCustomValidity('密码不一致')
      confirmPasswordRef.value.reportValidity()
      return false
    } else {
      confirmPasswordRef.value.setCustomValidity('')
      return true
    }
  }

  // 验证忘记密码确认密码
  function validateForgotConfirmPassword(): boolean {
    if (!forgotConfirmPasswordRef.value) return true

    if (forgotForm.newPassword !== forgotForm.confirmPassword) {
      forgotConfirmPasswordRef.value.setCustomValidity('密码不一致')
      forgotConfirmPasswordRef.value.reportValidity()
      return false
    } else {
      forgotConfirmPasswordRef.value.setCustomValidity('')
      return true
    }
  }

  // 发送验证码
  async function handleSendCode(email: string, purpose: string = 'register') {
    if (!email) {
      showMessage('请先输入邮箱', 'warning')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showMessage('请输入有效的邮箱地址', 'warning')
      return
    }

    sendingCode.value = true
    try {
      const response = await userStore.sendVerificationCode(email, purpose)
      showMessage(response.message || '验证码已发送，请查看邮箱', 'success')
      // 开始倒计时
      codeCountdown.value = 60
      const timer = setInterval(() => {
        codeCountdown.value--
        if (codeCountdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    } catch (error: any) {
      showMessage(error.message || '发送验证码失败', 'error')
    } finally {
      sendingCode.value = false
    }
  }

  // 处理登录
  async function handleLogin() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(loginForm.email)) {
      showMessage('请输入有效的邮箱地址', 'warning')
      return
    }

    loading.value = true
    try {
      await userStore.login({
        username: loginForm.email,
        password: loginForm.password,
      })
      showMessage('登录成功', 'success')
      await router.push({ name: 'dashboard' })
    } catch (error: any) {
      showAlert(error.message || '登录失败')
    } finally {
      loading.value = false
    }
  }

  // 处理注册
  async function handleRegister() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(registerForm.email)) {
      showMessage('请输入有效的邮箱地址', 'warning')
      return
    }

    // 验证确认密码
    validateConfirmPassword()
    if (registerForm.password !== registerForm.confirmPassword) {
      showMessage('两次输入的密码不一致', 'warning')
      return
    }

    loading.value = true
    try {
      await userStore.register({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
        nickname: registerForm.username,
      })
      await showAlert('注册成功，请登录')
      switchMode('login')
    } catch (error: any) {
      showAlert(error.message || '注册失败')
    } finally {
      loading.value = false
    }
  }

  // 处理忘记密码
  async function handleForgotPassword() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(forgotForm.email)) {
      showMessage('请输入有效的邮箱地址', 'warning')
      return
    }

    // 验证确认密码
    validateForgotConfirmPassword()
    if (forgotForm.newPassword !== forgotForm.confirmPassword) {
      showMessage('两次输入的密码不一致', 'warning')
      return
    }

    loading.value = true
    try {
      await userStore.resetPassword({
        email: forgotForm.email,
        newPassword: forgotForm.newPassword,
        code: forgotForm.code,
      })
      await showAlert('密码重置成功，请登录')
      switchMode('login')
    } catch (error: any) {
      showAlert(error.message || '密码重置失败')
    } finally {
      loading.value = false
    }
  }
</script>

<style lang="scss" scoped>
  .login-page {
    display: flex;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);

    &__left {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;

      @media (max-width: 768px) {
        display: none;
      }
    }

    &__illustration {
      position: relative;
      width: 400px;
      height: 300px;
    }

    &__cube {
      position: absolute;
      border-radius: 8px;
      background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
      box-shadow: 0 8px 32px rgba(64, 158, 255, 0.3);

      &--1 {
        width: 80px;
        height: 80px;
        top: 50px;
        left: 100px;
        transform: rotate(15deg);
        opacity: 0.9;
      }

      &--2 {
        width: 60px;
        height: 60px;
        top: 100px;
        right: 80px;
        transform: rotate(-10deg);
        opacity: 0.7;
        background: linear-gradient(135deg, #67c23a 0%, #529b2e 100%);
      }

      &--3 {
        width: 40px;
        height: 40px;
        bottom: 80px;
        left: 150px;
        transform: rotate(25deg);
        opacity: 0.6;
        background: linear-gradient(135deg, #e6a23c 0%, #b8822e 100%);
      }
    }

    &__platform {
      position: absolute;
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 20px;
      background: linear-gradient(90deg, transparent 0%, #409eff 50%, transparent 100%);
      border-radius: 10px;
      opacity: 0.3;
    }

    &__right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }

    &__form-container {
      width: 100%;
      max-width: 400px;
      background: #fff;
      border-radius: 16px;
      padding: 48px 40px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    }

    &__title {
      font-size: 28px;
      font-weight: 600;
      color: #303133;
      text-align: center;
      margin-bottom: 8px;
    }

    &__subtitle {
      font-size: 14px;
      color: #909399;
      text-align: center;
      margin-bottom: 32px;
    }

    &__form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    &__form-item {
      width: 100%;
    }

    &__code-wrapper {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    &__code-input {
      flex: 1;
    }

    &__submit {
      width: 100%;
      margin-top: 8px;
    }

    &__footer {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 24px;
      gap: 4px;
      position: relative;
    }

    &__footer-text {
      font-size: 14px;
      color: #606266;
    }

    &__link--right {
      position: absolute;
      right: 0;
      color: #909399 !important;

      &:hover {
        color: #606266 !important;
      }
    }

    ea-input::part(region) {
      align-items: stretch;
    }
  }
</style>
