<template>
  <ea-container class="model-view" direction="vertical">
    <!-- 工具栏 - 固定在 header -->
    <ea-header height="auto" class="model-view__header">
      <ModelSearchBar
        v-model:keyword="modelsStore.keyword"
        @search="handleSearch"
        @create="showCreateDialog = true"
        @refresh="handleRefresh"
      />
    </ea-header>

    <!-- 主内容区域 -->
    <ea-main class="model-view__main">
      <Loading :loading="modelsStore.loading" text="加载中...">
        <ea-container direction="horizontal" class="model-view__content">
          <!-- 左侧模型列表 -->
          <ea-aside width="260px" class="model-view__aside">
            <ModelListAside
              :models="modelsStore.models"
              :selected-id="modelsStore.selectedModelId"
              @select="handleSelectModel"
              @edit="handleEditModel"
              @delete="handleDeleteModel"
            />
          </ea-aside>

          <!-- 右侧编辑区域 -->
          <ea-main class="model-view__editor">
            <template v-if="modelsStore.currentModel">
              <ModelEditorTabs
                :model="modelsStore.currentModel"
                :fields="modelsStore.fields"
                :loading="modelsStore.fieldsLoading"
                :total="modelsStore.total"
                :current-page="modelsStore.currentPage"
                :page-size="modelsStore.pageSize"
                :sort-rules="sortRules"
                @add-field="showFieldDialog = true; editingField = null"
                @edit-field="(field) => { showFieldDialog = true; editingField = field }"
                @delete-field="handleDeleteField"
                @sort-fields="handleSortFields"
                @page-change="handlePageChange"
                @size-change="handleSizeChange"
                @refresh="handleRefreshFields"
                @add-sort-rule="handleAddSortRule"
                @update-sort-rule="handleUpdateSortRule"
                @delete-sort-rule="handleDeleteSortRule"
              />
            </template>
            <div v-else class="model-view__empty-editor">
              <ea-empty description="请选择一个模型进行编辑"></ea-empty>
            </div>
          </ea-main>
        </ea-container>
      </Loading>

      <!-- 新建/编辑模型弹窗 -->
      <CreateModelDialog
        v-model:visible="showCreateDialog"
        :model="editingModel"
        @success="handleModelSuccess"
      />

      <!-- 新建/编辑字段弹窗 -->
      <CreateFieldDialog
        v-model:visible="showFieldDialog"
        :model-id="modelsStore.selectedModelId"
        :field="editingField"
        @success="handleFieldSuccess"
      />
    </ea-main>
  </ea-container>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useModelsStore } from '@/stores/models'
  import ModelSearchBar from '@/components/models/ModelSearchBar.vue'
  import ModelListAside from '@/components/models/ModelListAside.vue'
  import ModelEditorTabs from '@/components/models/ModelEditorTabs.vue'
  import CreateModelDialog from '@/components/models/CreateModelDialog.vue'
  import CreateFieldDialog from '@/components/models/CreateFieldDialog.vue'
  import Loading from '@/components/common/Loading.vue'

  const modelsStore = useModelsStore()
  const showCreateDialog = ref(false)
  const showFieldDialog = ref(false)
  const editingModel = ref<any>(null)
  const editingField = ref<any>(null)
  const sortRules = ref<any[]>([])

  onMounted(() => {
    modelsStore.fetchModels()
  })

  function handleSearch() {
    modelsStore.fetchModels()
  }

  function handleRefresh() {
    modelsStore.fetchModels()
  }

  function handleSelectModel(model: any) {
    modelsStore.selectModel(model?.id || null)
  }

  function handleEditModel(model: any) {
    editingModel.value = model
    showCreateDialog.value = true
  }

  async function handleDeleteModel(model: any) {
    try {
      await modelsStore.removeModel(model.id)
    } catch (error: any) {
      window.$message?.error(error.message || '删除失败')
    }
  }

  async function handleModelSuccess(data?: any) {
    showCreateDialog.value = false
    editingModel.value = null
    try {
      if (data?.id) {
        await modelsStore.editModel(data)
      } else if (data) {
        const newModel = await modelsStore.addModel(data)
        if (newModel?.id) {
          modelsStore.selectModel(newModel.id)
        }
      } else {
        await modelsStore.fetchModels()
      }
    } catch (error: any) {
      window.$message?.error(error.message || '操作失败')
    }
  }

  function handleRefreshFields() {
    if (modelsStore.selectedModelId) {
      modelsStore.fetchFields(modelsStore.selectedModelId)
    }
  }

  function handlePageChange(page: number) {
    modelsStore.setPage(page)
    if (modelsStore.selectedModelId) {
      modelsStore.fetchFields(modelsStore.selectedModelId)
    }
  }

  function handleSizeChange(size: number) {
    modelsStore.setPageSize(size)
    if (modelsStore.selectedModelId) {
      modelsStore.fetchFields(modelsStore.selectedModelId)
    }
  }

  async function handleDeleteField(field: any) {
    try {
      await modelsStore.removeField(field.id)
    } catch (error: any) {
      window.$message?.error(error.message || '删除失败')
    }
  }

  async function handleSortFields(fieldIds: number[]) {
    if (modelsStore.selectedModelId) {
      try {
        await modelsStore.reorderFields(modelsStore.selectedModelId, fieldIds)
      } catch (error: any) {
        window.$message?.error(error.message || '排序失败')
      }
    }
  }

  async function handleFieldSuccess(data?: any) {
    showFieldDialog.value = false
    editingField.value = null
    try {
      if (data?.id) {
        await modelsStore.editField(data)
      } else if (data) {
        await modelsStore.addField(data)
      } else {
        handleRefreshFields()
      }
    } catch (error: any) {
      window.$message?.error(error.message || '操作失败')
    }
  }

  function handleAddSortRule(rule: any) {
    sortRules.value.push({ ...rule, id: Date.now() })
  }

  function handleUpdateSortRule(rule: any) {
    const index = sortRules.value.findIndex(r => r.id === rule.id)
    if (index !== -1) {
      sortRules.value[index] = { ...sortRules.value[index], ...rule }
    }
  }

  function handleDeleteSortRule(rule: any) {
    sortRules.value = sortRules.value.filter(r => r.id !== rule.id)
  }
</script>

<style lang="scss" scoped>
  .model-view {
    height: 100%;

    &__header {
      padding: 0;
    }

    &__main {
      padding: 0;
      overflow: hidden;
    }

    &__content {
      height: 100%;
    }

    &__aside {
      border-right: 1px solid var(--ea-border-light);
      overflow-y: auto;
    }

    &__editor {
      overflow-y: auto;
      padding: 16px;
    }

    &__empty-editor {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
  }
</style>
