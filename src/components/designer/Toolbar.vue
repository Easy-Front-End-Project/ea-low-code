<template>
  <div
    class="designer-toolbar h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4"
  >
    <!-- 左侧：项目名称和Logo -->
    <div class="flex items-center gap-3">
      <div
        class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold"
      >
        EA
      </div>
      <span class="text-lg font-semibold text-gray-800">低代码设计器</span>
    </div>

    <!-- 中间：操作按钮 -->
    <div class="flex items-center gap-2">
      <ea-button text :disabled="!canUndo" @click="handleUndo" title="撤销">
        <span>撤销</span>
      </ea-button>
      <ea-button text :disabled="!canRedo" @click="handleRedo" title="重做">
        <span>重做</span>
      </ea-button>
      <div class="w-px h-6 bg-gray-300 mx-2"></div>
      <ea-button text @click="handleClear" title="清空">
        <span>清空</span>
      </ea-button>
    </div>

    <!-- 右侧：预览和导出 -->
    <div class="flex items-center gap-2">
      <ea-button type="primary" @click="handlePreview" title="预览">
        <span>预览</span>
      </ea-button>
      <ea-button @click="handleExport" title="导出">
        <span>导出</span>
      </ea-button>
      <ea-button @click="handleImport" title="导入">
        <span>导入</span>
      </ea-button>
    </div>

    <!-- 隐藏的文件输入 -->
    <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleFileChange" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSchemaStore } from '@/stores/designer/schema'
import { exportSchemaToJson, importSchemaFromJson } from '@/utils/schemaHelper'

const schemaStore = useSchemaStore()
const fileInput = ref(null)

defineOptions({
  name: 'DesignerToolbar',
})

// 撤销/重做功能（待实现）
const canUndo = ref(false)
const canRedo = ref(false)

function handleUndo() {
  console.log('撤销')
}

function handleRedo() {
  console.log('重做')
}

function handleClear() {
  if (confirm('确定要清空画布吗？此操作不可恢复。')) {
    schemaStore.clearCanvas()
  }
}

function handlePreview() {
  schemaStore.setPreviewMode(true)
}

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
  reader.onload = (e) => {
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

  // 重置 input
  event.target.value = ''
}
</script>

<style scoped>
.designer-toolbar {
  height: 100%;
}
</style>
