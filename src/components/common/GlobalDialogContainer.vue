<template>
  <div class="global-dialog-container">
    <!-- 全局变量选择器 -->
    <VariableSelector
      :visible="selectorState.visible"
      @select="handleSelectVariable"
      @close="closeVariableSelector"
    />

    <!-- 全局组件选择器 -->
    <ComponentSelector
      :visible="componentSelectorState.visible"
      @select="handleSelectComponent"
      @close="closeComponentSelector"
    />

    <!-- 全局 MonacoEditor 弹窗 -->
    <ea-dialog
      :visible="editorState.visible"
      :title="editorState.title"
      width="600px"
      @close="cancelEditor"
    >
      <div class="editor-content">
        <MonacoEditor
          v-if="editorState.visible"
          v-model="editorState.value"
          :language="editorState.language"
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

<script setup>
  import { useGlobalDialogs } from '@/composables/useGlobalDialogs.js'
  import VariableSelector from '@/components/designer/VariableSelector.vue'
  import ComponentSelector from '@/components/common/ComponentSelector.vue'
  import MonacoEditor from '@/components/common/MonacoEditor.vue'

  const {
    selectorState,
    editorState,
    componentSelectorState,
    confirmVariableSelection,
    closeVariableSelector,
    saveEditorContent,
    cancelEditor,
    confirmComponentSelection,
    closeComponentSelector,
  } = useGlobalDialogs()

  function handleSelectVariable(variableName) {
    confirmVariableSelection(variableName)
  }

  function handleSelectComponent(componentId) {
    confirmComponentSelection(componentId)
  }

  function handleSaveEditor() {
    saveEditorContent(editorState.value)
  }
</script>

<style scoped>
  .editor-content {
    border: 1px solid #e4e7ed;
    border-radius: 4px;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
</style>
