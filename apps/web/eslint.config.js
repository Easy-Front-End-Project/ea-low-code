import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'
import rootConfig from '../../eslint.config.js'

export default defineConfig([
  ...rootConfig,

  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx,ts,tsx}'],
  },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  ...pluginVue.configs['flat/essential'],

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  {
    name: 'app/web-components-slot',
    files: ['**/*.vue'],
    rules: {
      'vue/no-deprecated-slot-attribute': 'off',
    },
  },
])
