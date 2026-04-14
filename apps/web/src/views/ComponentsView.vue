<template>
  <ea-container class="components-view" direction="vertical">
    <ea-header height="auto" class="components-view__header">
      <div class="components-view__header-content">
        <h2 class="components-view__title">组件管理</h2>
        <div class="components-view__stats">
          <span class="text-sm text-gray-500"
            >共 {{ componentCount }} 个组件 · {{ enabledCount }} 个已启用</span
          >
        </div>
        <div class="components-view__actions">
          <ea-button circle @click="handleRefresh">
            <ea-icon name="rotate" size="14"></ea-icon>
          </ea-button>
          <ea-button type="primary" icon="plus" @click="showAddDialog = true"> 添加组件 </ea-button>
        </div>
      </div>
    </ea-header>

    <ea-main class="components-view__main">
      <Loading :loading="loading" text="加载中...">
        <div v-if="urlPresetCount > 0" class="url-presets-overview">
          <h4 class="url-presets-overview__title">
            URL 预设配置
            <span class="text-xs text-gray-400 font-normal ml-2">
              ({{ urlPresetCount }} 个预设)
            </span>
          </h4>
          <div class="url-presets-overview__content">
            <span class="text-sm text-gray-600">
              默认: {{ defaultUrlPreset?.name || '未设置' }}
            </span>
            <ea-button size="small" icon="pen-to-square" text @click="showPresetManager = true">
              管理
            </ea-button>
          </div>
        </div>

        <div v-if="componentCount === 0" class="components-view__empty">
          <div class="components-view__empty-content">
            <ea-icon name="box-open" size="64" color="#c0c4cc"></ea-icon>
            <p>暂无远程组件</p>
            <p class="text-sm text-gray-400">点击上方「添加组件」按钮开始配置您的第一个远程组件</p>
          </div>
        </div>

        <div v-else class="components-view__grid">
          <RemoteComponentCard
            v-for="comp in remoteStore.components"
            :key="comp.id"
            :component="comp"
            @edit="handleEdit"
            @delete="handleDelete"
            @toggle-enabled="handleToggleEnabled"
          />
        </div>
      </Loading>
    </ea-main>

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

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useRemoteComponentStore } from '@/stores/designer/remoteComponent'
  import RemoteComponentCard from '@/components/remote-components/RemoteComponentCard.vue'
  import UrlPresetManager from '@/components/remote-components/UrlPresetManager.vue'
  import Loading from '@/components/common/Loading.vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

  const router = useRouter()
  const remoteStore = useRemoteComponentStore()

  const loading = ref(true)
  const showAddDialog = ref(false)
  const showPresetManager = ref(false)
  const componentForm = ref({ name: '' })

  const componentCount = computed(() => remoteStore.componentCount)
  const enabledCount = computed(() => remoteStore.enabledCount)
  const urlPresetCount = computed(() => remoteStore.urlPresetCount)
  const defaultUrlPreset = computed(() => remoteStore.defaultUrlPreset)

  onMounted(() => {
    if (!remoteStore.isLoaded) {
      remoteStore.loadConfig()
    }
    loading.value = false
  })

  async function handleRefresh() {
    loading.value = true
    await remoteStore.loadConfig()
    loading.value = false
  }

  async function handleQuickAdd() {
    if (!componentForm.value.name.trim()) {
      window.$message?.error('请输入组件名称')
      return
    }

    await remoteStore.addComponent({
      name: componentForm.value.name.trim(),
      url: '',
    })

    showAddDialog.value = false
    componentForm.value.name = ''
    window.$message?.success('组件创建成功，请完善配置信息')
  }

  function handleEdit(component) {
    router.push({ name: 'component-settings', params: { id: component.id } })
  }

  async function handleDelete(id) {
    if (confirm('确定要删除这个远程组件吗？')) {
      await remoteStore.removeComponent(id)
      window.$message?.success('删除成功')
    }
  }

  async function handleToggleEnabled(id, enabled) {
    await remoteStore.toggleComponentEnabled(id, enabled)
  }
</script>

<style lang="scss" scoped>
  .components-view {
    height: 100%;

    &__header {
      padding: 0;
    }

    &__header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
    }

    &__title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--ea-text-primary);
    }

    &__actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &__main {
      padding: 12px 0;
      overflow-y: auto;
    }

    &__empty {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;

      &-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;

        p {
          margin: 0;
          font-size: 14px;
          color: var(--ea-text-secondary);
        }
      }
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
  }

  .url-presets-overview {
    background-color: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    padding: 1rem;
    margin: 0 1.5rem 1.5rem;

    &__title {
      margin: 0 0 0.5rem 0;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
    }

    &__content {
      display: flex;
      align-items: center;
      gap: 1rem;
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
