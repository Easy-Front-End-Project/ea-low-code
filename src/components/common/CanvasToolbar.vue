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
</style>
