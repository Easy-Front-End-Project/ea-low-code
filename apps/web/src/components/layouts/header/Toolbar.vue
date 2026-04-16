<template>
  <div
    class="designer-toolbar h-14 bg-white border-b border-gray-200 flex items-center justify-between"
  >
    <EaLogo />

    <!-- 中间：操作按钮 -->
    <div class="flex items-center gap-2">
      <!-- <ea-button text @click="handleLoadExample" title="加载示例">
        <span>示例</span>
      </ea-button> -->
    </div>

    <!-- 右侧：变量、大纲和远程组件 -->
    <div class="flex items-center gap-2">
      <ea-button text @click="handleShowVariables" title="变量" icon="database"> 变量 </ea-button>
      <ea-button text @click="handleShowTree" title="大纲" icon="sitemap">
        <span>大纲</span>
      </ea-button>
      <ea-button text @click="handleShowRemoteConfig" title="远程组件" icon="cloud">
        远程组件
      </ea-button>
      <div class="w-px h-6 bg-gray-300 mx-2"></div>
      <ea-button type="primary" @click="handlePreview" title="预览" icon="eye"> 预览 </ea-button>
    </div>

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
  import ComponentTree from '@/components/designer/ComponentTree.vue'
  import VariableManager from '@/components/designer/VariableManager.vue'
  import RemoteComponentManager from '@/components/designer/RemoteComponentManager.vue'
  import EaLogo from '@/components/common/EaLogo.vue'

  const schemaStore = useSchemaStore()

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

  // 预览
  function handlePreview() {
    schemaStore.setPreviewMode(true)
  }
</script>

<style scoped>
  .designer-toolbar {
    height: 100%;
  }
</style>
