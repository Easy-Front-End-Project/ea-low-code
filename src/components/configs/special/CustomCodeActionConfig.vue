<template>
  <div class="custom-code-action-config">
    <div class="config-item">
      <label class="config-label">自定义代码</label>
      <div class="code-help">
        <ea-icon name="circle-info" variant="solid" size="12" class="code-help-icon"></ea-icon>
        <span class="code-help-title">可用 API：</span>
        <div class="code-help-list">
          <code
            v-for="api in codeHelpApis"
            :key="api.name"
            class="code-help-item"
            :title="api.desc"
          >
            {{ api.name }}
          </code>
        </div>
      </div>
      <MonacoEditor
        v-if="visible"
        v-model="modelValue.code"
        language="javascript"
        height="200px"
        :extra-libs="editorExtraLibs"
      />
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import MonacoEditor from '../../common/MonacoEditor.vue'

  const props = defineProps({
    modelValue: {
      type: Object,
      required: true,
    },
    visible: {
      type: Boolean,
      default: true,
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const modelValue = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val),
  })

  // 代码帮助 API 配置
  const codeHelpApis = [
    { name: '$event', desc: '原始事件对象' },
    { name: '$component.get(id)', desc: '通过ID获取组件DOM元素' },
    { name: '$component.setProp(id, prop, value)', desc: '通过ID设置组件属性' },
    { name: '$component.getProp(id, prop)', desc: '通过ID获取组件属性' },
    { name: '$component.call(id, method, ...args)', desc: '通过ID调用组件方法' },
    { name: '$vars.get(name)', desc: '获取变量值' },
    { name: '$vars.set(name, value)', desc: '设置变量值' },
    { name: '$alias.get(alias)', desc: '通过别名获取组件ID' },
    { name: '$alias.find(alias)', desc: '通过别名查找组件' },
    { name: '$alias.getElement(alias)', desc: '通过别名获取DOM元素' },
    { name: '$alias.setProp(alias, prop, value)', desc: '通过别名设置组件属性（推荐）' },
    { name: '$alias.getProp(alias, prop)', desc: '通过别名获取组件属性（推荐）' },
    { name: '$alias.call(alias, method, ...args)', desc: '通过别名调用组件方法（推荐）' },
  ]

  // Monaco Editor 类型定义（用于代码提示）
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
</script>

<style lang="scss" scoped>
  @use './styles/action-config.scss' as *;

  .custom-code-action-config {
    @include action-config-base;
    @include code-help;
  }
</style>
