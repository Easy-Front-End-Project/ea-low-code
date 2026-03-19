import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Easy-Front-End-Project/',
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('ea-'),
        },
      },
    }),
    vueDevTools(),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ['sortablejs', 'lodash-es'],
  },
})
