<template>
  <div class="config-group">
    <h5 class="group-title">自定义样式</h5>
    <div class="space-y-3">
      <!-- CSS 编辑器 -->
      <div class="prop-item">
        <div class="editor-header">
          <label class="prop-label">CSS 代码</label>
          <ea-button size="small" type="text" @click="showHelp = !showHelp">
            <ea-icon name="circle-question" variant="regular"></ea-icon>
            帮助
          </ea-button>
        </div>

        <!-- 帮助提示 -->
        <div v-if="showHelp" class="help-panel">
          <p class="help-text">
            使用 <code>&</code> 或 <code>:host</code> 表示当前组件，支持 <code>::part()</code> 修改
            Web Components 内部样式。
          </p>
          <pre class="help-example">
& {
  padding: 1rem;
}

&::part(container) {
  background: black;
}

&:hover {
  opacity: 0.8;
}</pre
          >
        </div>

        <!-- 代码预览和编辑按钮 -->
        <div class="code-preview-wrapper">
          <div class="code-preview" @click="handleOpenEditor">
            <pre v-if="customCSS">
{{ customCSS.slice(0, 100) }}{{ customCSS.length > 100 ? '...' : '' }}</pre
            >
            <span v-else class="placeholder">点击编辑 CSS 代码</span>
          </div>
          <ea-button type="primary" size="small" icon="pen" @click="handleOpenEditor">
            编辑
          </ea-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useGlobalDialogs } from '@/composables/useGlobalDialogs.js'

  const props = defineProps({
    customCSS: {
      type: String,
      default: '',
    },
  })

  const emit = defineEmits(['style-change'])

  const { openEditor } = useGlobalDialogs()

  const showHelp = ref(false)

  async function handleOpenEditor() {
    try {
      const result = await openEditor({
        title: '编辑 CSS 代码',
        value: props.customCSS || '',
        language: 'css',
      })
      emit('style-change', 'customCSS', result, 'customCSS')
    } catch {
      // 用户取消，不做处理
    }
  }
</script>

<style scoped>
  @import './styles/config-styles.css';

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .help-panel {
    background-color: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 0.375rem;
    padding: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .help-text {
    font-size: 0.75rem;
    color: #0369a1;
    margin: 0 0 0.5rem 0;
  }

  .help-text code {
    background-color: #e0f2fe;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: monospace;
  }

  .help-example {
    font-size: 0.75rem;
    color: #0c4a6e;
    background-color: #e0f2fe;
    padding: 0.5rem;
    border-radius: 0.25rem;
    margin: 0;
    font-family: monospace;
    white-space: pre-wrap;
    overflow-x: auto;
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
  }

  .code-preview:hover {
    border-color: #409eff;
  }

  .code-preview pre {
    margin: 0;
    font-family: monospace;
    font-size: 0.875rem;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .placeholder {
    color: #909399;
    font-size: 0.875rem;
  }
</style>
