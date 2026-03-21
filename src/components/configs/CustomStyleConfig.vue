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

        <!-- Monaco Editor CSS 编辑器 -->
        <MonacoEditor
          :model-value="customCSS"
          @update:model-value="handleCSSChange"
          language="css"
          height="200px"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import MonacoEditor from '@/components/common/MonacoEditor.vue'

  const props = defineProps({
    customCSS: {
      type: String,
      default: '',
    },
  })

  const emit = defineEmits(['style-change'])

  const showHelp = ref(false)

  function handleCSSChange(value) {
    emit('style-change', 'customCSS', value, 'customCSS')
  }
</script>

<style scoped>
  @import './config-styles.css';

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
</style>
