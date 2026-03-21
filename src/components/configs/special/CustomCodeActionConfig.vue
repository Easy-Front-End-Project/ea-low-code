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
      <!-- 代码预览和编辑按钮 -->
      <div class="code-preview-wrapper">
        <div class="code-preview" @click="handleOpenEditor">
          <pre v-if="modelValue.code">{{ modelValue.code.slice(0, 100) }}{{ modelValue.code.length > 100 ? '...' : '' }}</pre>
          <span v-else class="placeholder">点击编辑代码</span>
        </div>
        <ea-button type="primary" size="small" icon="pen" @click="handleOpenEditor">
          编辑
        </ea-button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useGlobalDialogs } from '@/composables/useGlobalDialogs.js'

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

  const { openEditor } = useGlobalDialogs()

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

  // 打开编辑器
  async function handleOpenEditor() {
    try {
      const result = await openEditor({
        title: '编辑自定义代码',
        value: modelValue.value.code || '',
        language: 'javascript',
      })
      modelValue.value = { ...modelValue.value, code: result }
    } catch {
      // 用户取消，不做处理
    }
  }
</script>

<style lang="scss" scoped>
  @use './styles/action-config.scss' as *;

  .custom-code-action-config {
    @include action-config-base;
    @include code-help;
  }

  .code-preview-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .code-preview {
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
</style>
