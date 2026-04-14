import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import { getToken } from '@/utils/storage.js'
import ProjectLayout from '@/layouts/ProjectLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProjectView from '@/views/ProjectView.vue'
import LoginView from '@/views/LoginView.vue'
import DesignerView from '@/views/DesignerView.vue'
import PlaceholderView from '@/views/PlaceholderView.vue'
import CloudView from '@/views/CloudView.vue'
import ProjectSettingsView from '@/views/ProjectSettingsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import ComponentsView from '@/views/ComponentsView.vue'
import ComponentSettingsView from '@/views/ComponentSettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: ProjectLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView,
        },
        {
          path: 'projects',
          name: 'projects',
          component: ProjectView,
        },
        {
          path: 'components',
          name: 'components',
          component: ComponentsView,
        },
        {
          path: 'components/create',
          name: 'component-settings',
          component: ComponentSettingsView,
        },
        {
          path: 'components/:id',
          name: 'component-settings',
          component: ComponentSettingsView,
        },
        {
          path: 'templates',
          name: 'templates',
          component: PlaceholderView,
        },
        {
          path: 'cloud',
          name: 'cloud',
          component: CloudView,
        },
        {
          path: 'projects/:id/settings',
          name: 'project-settings',
          component: ProjectSettingsView,
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/designer/:id?',
      name: 'designer',
      component: DesignerView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to, from) => {
  const userStore = useUserStore()
  const hasToken = !!getToken()

  // 初始化用户状态
  if (!userStore.isLoggedIn) {
    userStore.initUser()
  }

  // 如果有 token 但没有 user 信息，尝试获取 profile
  if (hasToken && !userStore.user) {
    try {
      await userStore.fetchProfile()
    } catch (error) {
      // fetchProfile failed silently
    }
  }

  const isLoggedIn = userStore.isLoggedIn && hasToken

  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login' }
  }

  if (to.name === 'login' && isLoggedIn) {
    return { name: 'dashboard' }
  }

  return true
})

export default router
