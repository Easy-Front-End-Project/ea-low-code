<template>
  <ea-container class="components-view" direction="vertical">
    <ea-header height="auto" class="components-view__header">
      <ComponentsSearchBar
        :component-count="remoteStore.componentCount"
        :enabled-count="remoteStore.enabledCount"
        :url-preset-count="remoteStore.urlPresetCount"
        :default-url-preset="remoteStore.defaultUrlPreset"
        @search="handleSearch"
        @create="showAddDialog = true"
        @refresh="handleRefresh"
        @manage-presets="showPresetManager = true"
      />
    </ea-header>

    <ea-main class="components-view__main">
      <Loading :loading="loading" text="加载中...">
        <ea-empty v-if="!loading && !remoteStore.hasComponents" description="暂无远程组件">
          <ea-button type="primary" @click="showAddDialog = true"> 添加组件 </ea-button>
        </ea-empty>

        <div v-if="remoteStore.hasComponents" class="components-view__grid">
          <RemoteComponentCard
            v-for="comp in remoteStore.paginatedComponents"
            :key="comp.id"
            :component="comp"
            @edit="handleEdit"
            @delete="handleDelete"
            @toggle-enabled="handleToggleEnabled"
          />
        </div>
      </Loading>
    </ea-main>

    <ea-footer
      v-if="!loading && remoteStore.hasComponents"
      height="64px"
      class="components-view__footer"
    >
      <div class="components-view__pagination flex items-center justify-between w-full">
        <div class="text-sm text-gray-500 whitespace-nowrap">
          {{ remoteStore.enabledCount }} 个已启用
        </div>

        <ea-pagination
          :total="remoteStore.total"
          :page-size="remoteStore.pageSize"
          :current-page="remoteStore.currentPage"
          :layout="['total', 'prev', 'pager', 'next']"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </ea-footer>

    <!-- 快速添加组件弹窗 -->
    <ea-dialog
      :visible="showAddDialog"
      title="添加远程组件"
      width="400px"
      @close="showAddDialog = false"
    >
      <div class="add-form">
        <EaInput
          v-model="componentForm.name"
          label="组件名称 *"
          placeholder="例如：我的远程组件"
          size="default"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <ea-button @click="showAddDialog = false">取消</ea-button>
        <ea-button type="primary" @click="handleQuickAdd">保存</ea-button>
      </div>
    </ea-dialog>

    <!-- URL 预设管理弹窗 -->
    <UrlPresetManager :visible="showPresetManager" @close="showPresetManager = false" />
  </ea-container>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useRemoteComponentStore } from '@/stores/designer/remoteComponent'
  import RemoteComponentCard from '@/components/remote-components/RemoteComponentCard.vue'
  import ComponentsSearchBar from '@/components/remote-components/ComponentsSearchBar.vue'
  import UrlPresetManager from '@/components/remote-components/UrlPresetManager.vue'
  import Loading from '@/components/common/Loading.vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

  const router = useRouter()
  const remoteStore = useRemoteComponentStore()

  const loading = ref(false)
  const showAddDialog = ref(false)
  const showPresetManager = ref(false)
  const componentForm = ref({ name: '' })

  async function loadData(searchKeyword?: string) {
    loading.value = true
    try {
      await remoteStore.loadConfig(searchKeyword)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => loadData())

  async function handleSearch(keyword: string) {
    remoteStore.setKeyword(keyword)
    await loadData(keyword)
  }

  function handleRefresh() {
    remoteStore.setKeyword('')
    loadData()
  }

  function handlePageChange(page: number) {
    remoteStore.setPage(page)
  }

  function handleSizeChange(size: number) {
    remoteStore.setPageSize(size)
  }

  async function handleQuickAdd() {
    const name = componentForm.value.name.trim()
    if (!name) {
      window.$message?.error('请输入组件名称')
      return
    }

    await remoteStore.addComponent({ name, url: '' })
    showAddDialog.value = false
    componentForm.value.name = ''
    window.$message?.success('组件创建成功，请完善配置信息')
  }

  function handleEdit(component: any) {
    router.push({ name: 'component-settings', params: { id: component.id } })
  }

  async function handleDelete(id: string | number) {
    if (!confirm('确定要删除这个远程组件吗？')) return
    await remoteStore.removeComponent(Number(id))
    window.$message?.success('删除成功')
  }

  async function handleToggleEnabled(id: string | number, enabled: boolean) {
    await remoteStore.toggleComponentEnabled(Number(id), enabled)
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(components-view) {
    height: 100%;

    @include e(header) {
      padding: 0;
    }

    @include e(main) {
      padding: 12px 0;
      overflow-y: auto;
    }

    @include e(grid) {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      max-width: 1440px;
      margin: 0 auto;
    }

    @include e(footer) {
      border-top: 1px solid var(--ea-border-light);
    }
  }

  .add-form {
    padding: 1rem 0;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
  }
</style>
