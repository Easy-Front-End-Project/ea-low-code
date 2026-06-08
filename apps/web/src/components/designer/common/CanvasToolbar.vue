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

    <!-- 保存按钮 -->
    <ea-button
      text
      type="primary"
      :loading="saveStatus.isSaving"
      :disabled="!currentPageId || saveStatus.isSaving"
      @click="handleSave"
      title="保存 (Ctrl+S)"
      icon="floppy-disk"
    >
      保存
    </ea-button>

    <div class="toolbar-divider"></div>
    <ea-button text @click="handleClear" title="清空" icon="trash-can"> </ea-button>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onBeforeUnmount } from 'vue'
  import { useSchemaStore } from '@/components/designer/stores/schema'
  import { usePagesStore } from '@/stores/pages'
  import { useRoute } from 'vue-router'
  import { useSaveStatus } from '@/components/designer/composables/useSaveStatus'

  const schemaStore = useSchemaStore()
  const pagesStore = usePagesStore()
  const route = useRoute()
  const saveStatus = useSaveStatus()

  const currentPageId = computed(() => route.params.id as string)

  async function handleSave() {
    if (!currentPageId.value || saveStatus.isSaving.value) return

    saveStatus.setSaving(true)
    try {
      const schema = schemaStore.exportSchema()
      await pagesStore.updatePage({
        id: Number(currentPageId.value),
        schema,
      })
      saveStatus.markSaved()
      window.$message?.success('保存成功')
    } catch (error: any) {
      window.$message?.error('保存失败: ' + (error.message || '未知错误'))
    } finally {
      saveStatus.setSaving(false)
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  function handleUndo() {
    schemaStore.undo()
  }

  function handleRedo() {
    schemaStore.redo()
  }

  async function handleClear() {
    try {
      await window.$confirm!('确定要清空画布吗？此操作不可恢复。', '提示', {
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
