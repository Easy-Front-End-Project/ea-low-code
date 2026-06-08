<template>
  <div class="custom-code-action-config">
    <div class="config-item">
      <label class="config-label">自定义代码</label>
      <!-- 代码预览和编辑按钮 -->
      <div class="code-preview-wrapper">
        <div class="code-preview" @click="handleOpenEditor">
          <pre v-if="modelValue.code">
{{ modelValue.code.slice(0, 100) }}{{ modelValue.code.length > 100 ? '...' : '' }}</pre
          >
          <span v-else class="placeholder">点击编辑代码</span>
        </div>
        <ea-button type="primary" size="small" icon="pen" @click="handleOpenEditor">
          编辑
        </ea-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useGlobalDialogs } from '@/components/designer/composables/useGlobalDialogs'

  interface CustomCodeModel {
    code: string
  }

  const props = defineProps<{
    modelValue: CustomCodeModel
    visible?: boolean
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: CustomCodeModel]
  }>()

  const { openEditor } = useGlobalDialogs()

  const modelValue = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val),
  })

  // 编辑器 extraLibs 配置 - 提供代码提示
  const editorExtraLibs = [
    {
      filePath: 'ts:global/event-api.d.ts',
      content: `
        /** 事件对象 */
        declare const $event: Event;

        /** 组件操作辅助对象 */
        declare const $component: {
          get(id: string): Element | null;
          setProp(id: string, prop: string, value: any): void;
          getProp(id: string, prop: string): any;
          call(id: string, method: string, ...args: any[]): void;
        };

        /** 变量操作辅助对象 */
        declare const $vars: {
          get(name: string): any;
          set(name: string, value: any): void;
          call(name: string, ...args: any[]): any;
        };

        /** 别名操作辅助对象 */
        declare const $alias: {
          get(alias: string): string | null;
          find(alias: string): any | null;
          getElement(alias: string): Element | null;
          setProp(alias: string, prop: string, value: any): void;
          getProp(alias: string, prop: string): any;
          call(alias: string, method: string, ...args: any[]): void;
        };
      `,
    },
  ]

  // 打开编辑器
  async function handleOpenEditor() {
    try {
      const result = await openEditor({
        title: '编辑自定义代码',
        value: modelValue.value.code || '',
        language: 'javascript',
        extraLibs: editorExtraLibs,
        showApiHelp: true,
      })
      modelValue.value = { ...modelValue.value, code: result }
    } catch {
      // 用户取消，不做处理
    }
  }
</script>

<style lang="scss" scoped>
@use './styles/action-config.scss' as *;
@import '@/styles/mixins/bem.scss';

@include b(custom-code-action-config) {
  @include action-config-base;

  @include e(code-preview-wrapper) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  @include e(code-preview) {
    min-height: 80px;
    max-height: 150px;
    overflow: auto;
    padding: 8px 12px;
    background-color: #f5f7fa;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    cursor: pointer;
    font-family: monospace;
    font-size: 12px;

    &:hover {
      border-color: #409eff;
    }

    pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .placeholder {
      color: #909399;
    }
  }
}
</style>
