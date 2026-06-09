import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    extensionAlias: {
      '.js': ['.ts', '.js'],
    },
    alias: {
      // 解决 Node.js 内置 constants 模块与项目 constants 目录的冲突
      '../constants/index.js': path.resolve(__dirname, 'src/constants/index.ts'),
    },
  },
})
