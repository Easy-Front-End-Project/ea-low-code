import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import DesignerView from '@/views/DesignerView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'designer',
      component: DesignerView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
  ],
})

// 路由守卫
router.beforeEach((to, from) => {
  const userStore = useUserStore()

  // 初始化用户状态
  if (!userStore.isLoggedIn) {
    userStore.initUser()
  }

  // 需要登录的页面
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return '/login'
  }

  // 已登录用户访问登录页，重定向到首页
  if (to.path === '/login' && userStore.isLoggedIn) {
    return '/'
  }

  // 返回 true 或 undefined 表示继续导航
  return true
})

export default router
