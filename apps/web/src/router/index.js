import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import ProjectLayout from '@/layouts/ProjectLayout.vue'
import ProjectView from '@/views/ProjectView.vue'
import LoginView from '@/views/LoginView.vue'
import DesignerView from '@/views/DesignerView.vue'
import PlaceholderView from '@/views/PlaceholderView.vue'
import CloudView from '@/views/CloudView.vue'
import ProjectSettingsView from '@/views/ProjectSettingsView.vue'

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
          name: 'projects',
          component: ProjectView,
        },
        {
          path: 'components',
          name: 'components',
          component: PlaceholderView,
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

router.beforeEach((to, from) => {
  const userStore = useUserStore()

  if (!userStore.isLoggedIn) {
    userStore.initUser()
  }

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return { name: 'login' }
  }

  if (to.name === 'login' && userStore.isLoggedIn) {
    return { name: 'projects' }
  }

  return true
})

export default router
