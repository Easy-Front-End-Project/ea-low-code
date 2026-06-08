<template>
  <div class="global-dialog-container">
    <!-- 全局变量选择器 -->
    <VariableSelector
      :visible="selectorState.visible"
      @select="handleSelectVariable"
      @close="closeVariableSelector"
      @add-variable="handleOpenVariableManager"
    />

    <!-- 全局组件选择器 -->
    <ComponentSelector
      :visible="componentSelectorState.visible"
      @select="handleSelectComponent"
      @close="closeComponentSelector"
    />

    <!-- 全局变量管理器 -->
    <VariableManager :visible="variableManagerState.visible" @close="closeVariableManager" />

    <!-- 全局 MonacoEditor 弹窗 -->
    <ea-dialog
      :visible="editorState.visible"
      :title="editorState.title"
      width="600px"
      @close="cancelEditor"
    >
      <!-- API 帮助信息 -->
      <div v-if="editorState.showApiHelp" class="api-help-section">
        <div class="api-help-header">
          <ea-button size="small" type="text" @click="showApiHelp = !showApiHelp">
            <ea-icon name="circle-question" variant="regular"></ea-icon>
            帮助
          </ea-button>
        </div>
        <div v-if="showApiHelp" class="api-help-panel">
          <p class="api-help-text">在自定义代码中，你可以使用以下 API 来操作组件和变量：</p>
          <div class="api-help-list">
            <div class="api-help-category"><strong>$event</strong> - 原始事件对象</div>
            <div class="api-help-category">
              <strong>$component</strong> - 组件操作
              <div class="api-help-items">
                <code>.get(id)</code> - 获取组件DOM <code>.setProp(id, prop, value)</code> -
                设置属性 <code>.getProp(id, prop)</code> - 获取属性
                <code>.call(id, method, ...args)</code> - 调用方法
              </div>
            </div>
            <div class="api-help-category">
              <strong>$vars</strong> - 变量操作
              <div class="api-help-items">
                <code>.get(name)</code> - 获取变量值 <code>.set(name, value)</code> - 设置变量值
                <code>.call(name, ...args)</code> - 执行函数变量
              </div>
            </div>
            <div class="api-help-category">
              <strong>$alias</strong> - 别名操作（推荐）
              <div class="api-help-items">
                <code>.get(alias)</code> - 获取组件ID <code>.getElement(alias)</code> - 获取DOM
                <code>.setProp(alias, prop, value)</code> - 设置属性
                <code>.call(alias, method, ...args)</code> - 调用方法
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="editor-content">
        <MonacoEditor
          v-if="editorState.visible"
          v-model="editorState.value"
          :language="editorState.language"
          :extra-libs="editorState.extraLibs"
          height="300px"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <ea-button @click="cancelEditor">取消</ea-button>
        <ea-button type="primary" @click="handleSaveEditor">保存</ea-button>
      </div>
    </ea-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useGlobalDialogs } from '@/components/designer/composables/useGlobalDialogs'
  import VariableSelector from '@/components/designer/VariableSelector.vue'
  import VariableManager from '@/components/designer/VariableManager.vue'
  import ComponentSelector from '@/components/designer/common/ComponentSelector.vue'
  import MonacoEditor from '@/components/common/MonacoEditor.vue'

  const {
    selectorState,
    editorState,
    componentSelectorState,
    variableManagerState,
    confirmVariableSelection,
    closeVariableSelector,
    saveEditorContent,
    cancelEditor,
    confirmComponentSelection,
    closeComponentSelector,
    openVariableManager,
    closeVariableManager,
  } = useGlobalDialogs()

  // API 帮助显示状态
  const showApiHelp = ref(false)

  function handleSelectVariable(variableName: string) {
    confirmVariableSelection(variableName)
  }

  function handleSelectComponent(componentId: string) {
    confirmComponentSelection(componentId)
  }

  function handleSaveEditor() {
    saveEditorContent(editorState.value)
  }

  function handleOpenVariableManager() {
    openVariableManager()
  }
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/bem.scss';

@include b(global-dialog-container) {
  .editor-content {
    border: 1px solid #e4e7ed;
    border-radius: 4px;

    /* 确保 Monaco Editor 的 fixed 定位元素能正确计算位置 */
    position: relative;

    /* 修复 Monaco Editor 代码提示框位置偏移 */
    :deep(.monaco-editor) {
      position: relative;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .api-help-section {
    margin-bottom: 12px;
  }

  .api-help-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.5rem;
  }

  .api-help-panel {
    background-color: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 0.375rem;
    padding: 0.75rem;
    max-height: 200px;
    overflow-y: auto;
  }

  .api-help-text {
    font-size: 0.75rem;
    color: #0369a1;
    margin: 0 0 0.5rem;
  }

  .api-help-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .api-help-category {
    font-size: 0.75rem;
    color: #0c4a6e;

    strong {
      color: #0369a1;
      font-family: monospace;
    }
  }

  .api-help-items {
    margin-top: 4px;
    padding-left: 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;

    code {
      background-color: #e0f2fe;
      padding: 0.125rem 0.25rem;
      border-radius: 0.25rem;
      font-family: monospace;
      font-size: 0.7rem;
      color: #0369a1;
    }
  }
}
</style>
