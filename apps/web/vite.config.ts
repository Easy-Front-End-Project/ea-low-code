import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/ea-low-code/',
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag: string) => tag.startsWith('ea-'),
        },
      },
    }),
    vueDevTools(),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@ea-low-code/shared': fileURLToPath(new URL('../../packages/shared/src/index.ts', import.meta.url)),
    },
    extensionAlias: {
      '.js': ['.ts', '.js'],
    },
  },
  optimizeDeps: {
    include: ['sortablejs', 'lodash-es'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // EA-UI 组件单独打包
          if (id.includes('easy-component-ui')) {
            return 'ea-ui'
          }
          // Monaco Editor 单独打包
          if (id.includes('monaco-editor')) {
            return 'monaco'
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
