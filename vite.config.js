import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import UnoCSS from 'unocss/vite'
import monacoEditor from 'vite-plugin-monaco-editor'

const monacoPlugin = monacoEditor.default({
  languageWorkers: ['editorWorkerService', 'css', 'html', 'json', 'typescript'],
})

// https://vite.dev/config/
export default defineConfig({
  base: '/ea-low-code/',
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
    monacoPlugin,
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ['sortablejs', 'lodash-es'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
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
