import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'virtual:uno.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

import 'easy-component-ui/icon-assets'

import 'easy-component-ui'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)

app.mount('#app')
