import { defineConfig } from 'eslint/config'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import tseslint from 'typescript-eslint'
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
        EventListener: 'readonly',
      },
    },
  },

  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    name: 'app/vue-typescript-parser',
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  {
    name: 'app/web-components-slot',
    files: ['**/*.vue'],
    rules: {
      'vue/no-deprecated-slot-attribute': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-mutating-props': 'warn',
    },
  },

  {
    name: 'app/web-typescript-rules',
    files: ['**/*.{ts,tsx,vue}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
])
