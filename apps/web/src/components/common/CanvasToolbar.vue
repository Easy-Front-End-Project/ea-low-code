<template>
  <div class="canvas-toolbar">
    <ea-button
      text
      :disabled="!schemaStore.canUndo"
      @click="handleUndo"
      title="撤销"
      icon="rotate-left"
    >
    </ea-button>
    <ea-button
      text
      :disabled="!schemaStore.canRedo"
      @click="handleRedo"
      title="重做"
      icon="rotate-right"
    >
    </ea-button>
    <div class="toolbar-divider"></div>
    <ea-button text @click="handleClear" title="清空" icon="trash-can"> </ea-button>
  </div>
</template>

<script setup>
  import { useSchemaStore } from '@/stores/designer/schema'

  const schemaStore = useSchemaStore()

  function handleUndo() {
    schemaStore.undo()
  }

  function handleRedo() {
    schemaStore.redo()
  }

  async function handleClear() {
    try {
      await window.$confirm('确定要清空画布吗？此操作不可恢复。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      schemaStore.clearCanvas()
    } catch {
      // 用户取消，不做处理
    }
  }
</script>

<style lang="scss" scoped>
  .canvas-toolbar {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: #fff;
    border-bottom: 1px solid #e5e7eb;
    justify-content: center;
    flex-shrink: 0;
  }

  .toolbar-divider {
    width: 1px;
    height: 1.5rem;
    background-color: #e5e7eb;
    margin: 0 0.25rem;
  }
</style>
