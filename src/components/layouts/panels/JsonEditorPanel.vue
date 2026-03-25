<template>
  <div class="json-editor-panel h-full flex flex-col">
    <!-- JSON 编辑器工具栏 -->
    <div class="json-editor-toolbar">
      <ea-button size="small" icon="file-export" @click="handleExport">导出</ea-button>
      <ea-button size="small" icon="file-import" @click="handleImport">导入</ea-button>
      <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleFileChange" />
    </div>
    <div class="json-editor-content flex-1">
      <Suspense>
        <template #default>
          <MonacoEditor v-model="jsonContent" language="json" height="100%" />
        </template>
        <template #fallback>
          <div class="h-full flex flex-col items-center justify-center">
            <div class="loading-spinner loading-spinner--small"></div>
            <span class="mt-2 text-sm text-gray-400">加载编辑器...</span>
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useSchemaStore } from '@/stores/designer/schema'
  import { exportSchemaToJson, importSchemaFromJson } from '@/utils/schemaHelper'
  import MonacoEditor from '@/components/common/MonacoEditor.vue'

  const schemaStore = useSchemaStore()
  const fileInput = ref(null)

  const jsonContent = computed({
    get: () => JSON.stringify(schemaStore.pageSchema, null, 2),
    set: val => {
      try {
        schemaStore.importSchema(JSON.parse(val))
      } catch {
        // JSON 解析错误，忽略
      }
    },
  })

  function handleExport() {
    const schema = schemaStore.exportSchema()
    const json = exportSchemaToJson(schema)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `schema-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  function handleImport() {
    fileInput.value?.click()
  }

  function handleFileChange(event) {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = e => {
      try {
        const json = e.target.result
        const schema = importSchemaFromJson(json)
        if (schema) {
          schemaStore.importSchema(schema)
          alert('Schema 导入成功！')
        } else {
          alert('Schema 解析失败，请检查文件格式。')
        }
      } catch (error) {
        alert('文件读取失败：' + error.message)
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }
</script>

<style lang="scss" scoped>
  .json-editor-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .json-editor-toolbar {
    display: flex;
    gap: 8px;
    padding: 8px 0;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 8px;
  }

  .json-editor-content {
    flex: 1;
    overflow: hidden;
  }

  .loading-spinner {
    width: 24px;
    height: 24px;
    border: 2px solid #e4e7ed;
    border-top-color: #409eff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
