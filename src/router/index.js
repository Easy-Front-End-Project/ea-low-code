import { createRouter, createWebHistory } from 'vue-router'
import DesignerView from '@/views/DesignerView.vue'
import PreviewView from '@/views/PreviewView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'designer',
      component: DesignerView,
    },
    {
      path: '/preview',
      name: 'preview',
      component: PreviewView,
    },
  ],
})

export default router
