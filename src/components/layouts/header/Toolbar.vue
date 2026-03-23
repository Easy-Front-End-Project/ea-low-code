<template>
  <div
    class="designer-toolbar h-14 bg-white border-b border-gray-200 flex items-center justify-between"
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
      <ea-button text @click="handleClear" title="清空" icon="trash-can">
        <span>清空</span>
      </ea-button>
      <ea-button text @click="handleShowTree" title="大纲" icon="sitemap">
        <span>大纲</span>
      </ea-button>
      <div class="w-px h-6 bg-gray-300 mx-2"></div>
      <!-- <ea-button text @click="handleLoadExample" title="加载示例">
        <span>示例</span>
      </ea-button> -->
    </div>

    <!-- 右侧：变量、预览和导出 -->
    <div class="flex items-center gap-2">
      <ea-button text @click="handleShowVariables" title="变量" icon="variable"> 变量 </ea-button>
      <ea-button text @click="handleShowRemoteConfig" title="远程组件" icon="cloud">
        远程组件
      </ea-button>
      <div class="w-px h-6 bg-gray-300 mx-2"></div>
      <ea-button type="primary" @click="handlePreview" title="预览" icon="eye"> 预览 </ea-button>
      <ea-button @click="handleExport" title="导出" icon="file-export"> 导出 </ea-button>
      <ea-button @click="handleImport" title="导入" icon="file-import"> 导入 </ea-button>
    </div>

    <!-- 隐藏的文件输入 -->
    <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleFileChange" />

    <!-- 组件大纲弹框 -->
    <ComponentTree :visible="treeVisible" @close="treeVisible = false" />

    <!-- 变量管理弹框 -->
    <VariableManager :visible="variableVisible" @close="variableVisible = false" />

    <!-- 远程组件配置弹框 -->
    <RemoteComponentManager :visible="remoteConfigVisible" @close="remoteConfigVisible = false" />
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useSchemaStore } from '@/stores/designer/schema'
  import { exportSchemaToJson, importSchemaFromJson } from '@/utils/schemaHelper'
  import { exampleSchema } from '@/constants/exampleSchema'
  import ComponentTree from '@/components/designer/ComponentTree.vue'
  import VariableManager from '@/components/designer/VariableManager.vue'
  import RemoteComponentManager from '@/components/designer/RemoteComponentManager.vue'

  const schemaStore = useSchemaStore()
  const fileInput = ref(null)

  // 组件大纲弹框显示状态
  const treeVisible = ref(false)
  // 变量管理弹框显示状态
  const variableVisible = ref(false)
  // 远程组件配置弹框显示状态
  const remoteConfigVisible = ref(false)

  defineOptions({
    name: 'DesignerToolbar',
  })

  // 显示组件大纲
  function handleShowTree() {
    treeVisible.value = true
  }

  // 显示变量管理
  function handleShowVariables() {
    variableVisible.value = true
  }

  // 显示远程组件配置
  function handleShowRemoteConfig() {
    remoteConfigVisible.value = true
  }

  function handleClear() {
    if (confirm('确定要清空画布吗？此操作不可恢复。')) {
      schemaStore.clearCanvas()
    }
  }

  // 加载示例 Schema - 首页/落地页
  function handleLoadExample() {
    if (schemaStore.components.length > 0) {
      if (!confirm('当前画布已有内容，加载示例将清空现有内容，是否继续？')) {
        return
      }
    }

    schemaStore.importSchema(exampleSchema)
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

    // 重置 input
    event.target.value = ''
  }
</script>

<style scoped>
  .designer-toolbar {
    height: 100%;
  }
</style>
