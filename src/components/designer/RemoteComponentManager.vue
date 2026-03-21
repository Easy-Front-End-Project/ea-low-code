<template>
  <ea-dialog :visible="visible" title="远程组件配置" width="700px" @close="handleClose">
    <div class="remote-component-manager">
      <!-- 全局远程URL配置 -->
      <div class="config-section">
        <h4 class="section-title">
          基础URL
          <span class="text-xs text-gray-400 font-normal ml-2">
            ( 配置后，组件列表中的相对路径将基于此URL )
          </span>
        </h4>
        <EaInput
          :model-value="remoteStore.globalUrl"
          placeholder="https://cdn.example.com/remote-components/"
          size="small"
          class="w-full"
          @input="handleGlobalUrlChange"
        />
      </div>

      <!-- 组件列表管理 -->
      <div class="config-section">
        <div class="section-header flex items-center justify-between mb-3">
          <h4 class="section-title">
            远程组件列表
            <span class="text-xs text-gray-400 font-normal ml-2">
              （{{ remoteStore.componentCount }}）
            </span>
          </h4>
          <ea-button type="primary" size="small" icon="plus" @click="handleAddComponent">
            添加组件
          </ea-button>
        </div>

        <!-- 组件列表 -->
        <div class="components-list">
          <div v-if="remoteStore.componentCount === 0" class="empty-state text-center py-8">
            <ea-empty size="32" description="暂无远程组件配置，点击上方按钮添加组件。"></ea-empty>
          </div>
          <div v-else class="components-grid">
            <ea-card
              v-for="comp in remoteStore.components"
              :key="comp.id"
              :class="{ 'is-active': comp.enabled !== false }"
            >
              <div class="card-header flex items-center justify-between" slot="header">
                <div class="flex items-center gap-2">
                  <ea-icon :name="comp.icon || 'crown'" variant="solid" size="14"></ea-icon>
                  <span class="component-name">{{ comp.name }}</span>
                </div>
                <div class="card-actions">
                  <EaSwitch
                    :model-value="comp.enabled !== false"
                    size="small"
                    @update:model-value="(val) => handleToggleEnabled(comp.id, val)"
                  />
                </div>
              </div>
              <div class="card-body">
                <div class="info-row">
                  <ea-text class="info-label">类型:</ea-text>
                  <ea-text class="info-value">{{ comp.type || 'remote-' + comp.id }}</ea-text>
                </div>
                <div class="info-row">
                  <ea-text class="info-label">URL:</ea-text>
                  <ea-text class="info-value url-text" :title="comp.url">{{ comp.url }}</ea-text>
                </div>
                <div v-if="comp.styleUrl" class="info-row">
                  <ea-text class="info-label">样式:</ea-text>
                  <ea-text class="info-value url-text" :title="comp.styleUrl"
                    >{{ comp.styleUrl }}</ea-text
                  >
                </div>
              </div>
              <div class="card-footer flex justify-end gap-2" slot="footer">
                <ea-button text size="small" icon="gear" @click.stop="handleConfigComponent(comp)">
                  配置
                </ea-button>
                <ea-button text size="small" icon="pen" @click.stop="handleEditComponent(comp)"
                  >编辑</ea-button
                >
                <ea-button
                  type="danger"
                  icon="trash-can"
                  text
                  size="small"
                  @click.stop="handleDeleteComponent(comp.id)"
                >
                  删除
                </ea-button>
              </div>
            </ea-card>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <ea-button @click="handleClose">关闭</ea-button>
    </div>

    <!-- 添加/编辑组件弹窗 -->
    <ea-dialog
      :visible="showEditDialog"
      :title="editingComponent ? '编辑远程组件' : '添加远程组件'"
      width="500px"
      @close="handleEditDialogClose"
    >
      <div class="component-form space-y-4">
        <EaInput
          v-model="componentForm.name"
          label="组件名称 *"
          placeholder="例如：我的远程组件"
          size="small"
        />
        <EaInput
          v-model="componentForm.url"
          label="组件URL *"
          placeholder="https://cdn.example.com/component.umd.js"
          size="small"
        />
        <EaInput
          v-model="componentForm.exportName"
          label="导出名称（可选）"
          placeholder="例如：MyComponent"
          size="small"
        />
        <EaInput
          v-model="componentForm.type"
          label="组件类型（可选）"
          placeholder="例如：remote-button"
          size="small"
        />
        <EaInput
          v-model="componentForm.styleUrl"
          label="样式文件URL（可选）"
          placeholder="index.css 或 https://cdn.example.com/component.css"
          size="small"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <ea-button @click="handleEditDialogClose">取消</ea-button>
        <ea-button type="primary" @click="handleSaveComponent">保存</ea-button>
      </div>
    </ea-dialog>

    <!-- 组件配置弹窗 -->
    <RemoteComponentConfigDialog
      :visible="showConfigDialog"
      :component="configComponent"
      @close="handleConfigDialogClose"
      @save="handleConfigSave"
    />
  </ea-dialog>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaSwitch from '../ea-ui-wrap/EaSwitch.vue'
  import RemoteComponentConfigDialog from './RemoteComponentConfigDialog.vue'
  import { useRemoteComponentStore } from '@/stores/designer/remoteComponent'

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['close'])

  const remoteStore = useRemoteComponentStore()
  const showEditDialog = ref(false)
  const showConfigDialog = ref(false)
  const editingComponent = ref(null)
  const configComponent = ref(null)

  const componentForm = ref({
    name: '',
    url: '',
    exportName: '',
    type: '',
    icon: '',
    styleUrl: '',
  })

  // 初始化加载配置
  onMounted(() => {
    if (!remoteStore.isLoaded) {
      remoteStore.loadConfig()
    }
  })

  function handleClose() {
    emit('close')
  }

  function handleAddComponent() {
    editingComponent.value = null
    resetComponentForm()
    showEditDialog.value = true
  }

  function handleEditComponent(component) {
    editingComponent.value = component
    componentForm.value = {
      name: component.name,
      url: component.url,
      exportName: component.exportName || '',
      type: component.type || '',
      icon: component.icon || '',
      styleUrl: component.styleUrl || '',
    }
    showEditDialog.value = true
  }

  function handleConfigComponent(component) {
    configComponent.value = component
    showConfigDialog.value = true
  }

  function handleConfigDialogClose() {
    showConfigDialog.value = false
    configComponent.value = null
  }

  function handleConfigSave(configData) {
    if (!configComponent.value) return

    remoteStore.updateComponent(configComponent.value.id, configData)
    remoteStore.saveConfig()
    window.$message.success('配置已保存')
    handleConfigDialogClose()
  }

  function handleDeleteComponent(id) {
    if (confirm('确定要删除这个远程组件吗？')) {
      remoteStore.removeComponent(id)
      remoteStore.saveConfig()
    }
  }

  function handleGlobalUrlChange(value) {
    remoteStore.setGlobalUrl(value)
    remoteStore.saveConfig()
  }

  function handleToggleEnabled(id, enabled) {
    remoteStore.toggleComponentEnabled(id, enabled)
    remoteStore.saveConfig()
  }

  function handleEditDialogClose() {
    showEditDialog.value = false
    editingComponent.value = null
    resetComponentForm()
  }

  function handleSaveComponent() {
    if (!componentForm.value.name.trim()) {
      window.$message.error('请输入组件名称')
      return
    }
    if (!componentForm.value.url.trim()) {
      window.$message.error('请输入组件URL')
      return
    }

    const componentData = {
      name: componentForm.value.name.trim(),
      url: componentForm.value.url.trim(),
      exportName: componentForm.value.exportName.trim() || undefined,
      type: componentForm.value.type.trim() || undefined,
      icon: componentForm.value.icon.trim() || 'icon-crown',
      styleUrl: componentForm.value.styleUrl.trim() || undefined,
    }

    if (editingComponent.value) {
      remoteStore.updateComponent(editingComponent.value.id, componentData)
    } else {
      remoteStore.addComponent(componentData)
    }

    remoteStore.saveConfig()
    showEditDialog.value = false
    editingComponent.value = null
    resetComponentForm()
  }

  function resetComponentForm() {
    componentForm.value = {
      name: '',
      url: '',
      exportName: '',
      type: '',
      icon: '',
      styleUrl: '',
    }
  }
</script>

<style scoped>
  .remote-component-manager {
    min-height: 300px;
    max-height: 500px;
    overflow-y: auto;
  }

  .config-section {
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
  }

  .section-header {
    margin-bottom: 0.75rem;
  }

  .components-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  .is-active {
    border-color: #8b5cf6;
    background-color: #f5f3ff;
  }

  .card-header {
    margin-bottom: 0.75rem;
  }

  .component-name {
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
  }

  .card-body {
    margin-bottom: 0.75rem;
  }

  .info-row {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
  }

  .info-label {
    color: #6b7280;
    min-width: 40px;
    margin-right: 0.5rem;
  }

  .info-value {
    color: #374151;
    font-weight: 500;
  }

  .url-text {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card-footer {
    border-top: 1px solid #f3f4f6;
    padding-top: 0.75rem;
  }

  .empty-state {
    background-color: #f9fafb;
    border: 2px dashed #e5e7eb;
    border-radius: 0.5rem;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .component-form {
    padding: 1rem 0;
  }
</style>
