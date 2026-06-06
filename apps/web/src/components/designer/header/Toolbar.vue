<template>
  <div class="designer-toolbar">
    <ea-page-header icon="" @back="handleBack">
      <EaLogo slot="content" />

      <div class="designer-toolbar__extra" slot="extra">
        <ea-button text @click="handleShowVariables" title="变量" icon="database"> 变量 </ea-button>
        <ea-button text @click="handleShowTree" title="大纲" icon="sitemap"> 大纲 </ea-button>
        <!-- 保存状态提示 -->
        <span v-if="saveStatus.lastSavedTime" class="designer-toolbar__save-hint">
          {{ saveStatus.saveStatusText }}
        </span>
        <div class="designer-toolbar__divider"></div>
        <ea-button type="primary" @click="handlePreview" title="预览" icon="eye"> 预览 </ea-button>
      </div>

      <!-- 组件大纲弹框 -->
      <ComponentTree :visible="treeVisible" @close="treeVisible = false" />

      <!-- 变量管理弹框 -->
      <VariableManager :visible="variableVisible" @close="variableVisible = false" />
    </ea-page-header>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSchemaStore } from '@/components/designer/stores/schema'
  import ComponentTree from '../ComponentTree.vue'
  import VariableManager from '../VariableManager.vue'
  import EaLogo from '@/components/common/EaLogo.vue'
  import { useSaveStatus } from '@/components/designer/composables/useSaveStatus.js'

  const router = useRouter()
  const schemaStore = useSchemaStore()
  const saveStatus = useSaveStatus()

  const treeVisible = ref(false)
  const variableVisible = ref(false)

  defineOptions({
    name: 'DesignerToolbar',
  })

  function handleBack() {
    router.back()
  }

  function handleShowTree() {
    treeVisible.value = true
  }

  function handleShowVariables() {
    variableVisible.value = true
  }

  function handlePreview() {
    schemaStore.setPreviewMode(true)
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(designer-toolbar) {
    &__extra {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    &__divider {
      width: 1px;
      height: 1.5rem;
      background-color: var(--ea-border-light);
      margin: 0 0.5rem;
    }

    &__save-hint {
      font-size: 0.75rem;
      color: #67c23a;
      white-space: nowrap;
      margin-left: 0.25rem;
    }
  }
</style>
