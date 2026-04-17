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
import DataSourceView from '@/views/DataSourceView.vue'
import PagePreviewView from '@/views/PagePreviewView.vue'

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
          meta: { title: '工作台' },
        },
        {
          path: 'projects',
          name: 'projects',
          component: ProjectView,
          meta: { title: '我的项目' },
        },
        {
          path: 'components',
          name: 'components',
          component: ComponentsView,
          meta: { title: '组件库' },
        },
        {
          path: 'components/create',
          name: 'component-settings',
          component: ComponentSettingsView,
          meta: { title: '新建组件' },
        },
        {
          path: 'components/:id',
          name: 'component-settings',
          component: ComponentSettingsView,
          meta: { title: '组件设置' },
        },
        {
          path: 'datasources',
          name: 'datasources',
          component: DataSourceView,
          meta: { title: '数据源管理' },
        },
        {
          path: 'templates',
          name: 'templates',
          component: PlaceholderView,
          meta: { title: '模板市场' },
        },
        {
          path: 'cloud',
          name: 'cloud',
          component: CloudView,
          meta: { title: '图片云' },
        },
        {
          path: 'projects/:id/settings',
          name: 'project-settings',
          component: ProjectSettingsView,
          meta: { title: '项目设置' },
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
          meta: { title: '个人中心' },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false, title: '登录' },
    },
    {
      path: '/designer/:id?',
      name: 'designer',
      component: DesignerView,
      meta: { requiresAuth: true, title: '设计器' },
    },
    {
      path: '/preview/:pageId',
      name: 'preview',
      component: PagePreviewView,
      meta: { requiresAuth: true, title: '页面预览' },
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

const DEFAULT_TITLE = 'Easy Weave'

router.afterEach(to => {
  const title = to.meta?.title
  document.title = title ? `${DEFAULT_TITLE} | ${title}` : DEFAULT_TITLE
})

export default router
