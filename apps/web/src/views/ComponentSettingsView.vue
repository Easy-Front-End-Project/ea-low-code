<template>
  <div class="component-settings-view">
    <ea-page-header @back="goBack">
      <span slot="content" class="text-large font-600"
        >{{ isNewMode ? '新建组件' : (componentName || '组件设置') }}</span
      >
      <div slot="extra">
        <ea-button type="primary" @click="handleSave">保存设置</ea-button>
      </div>
    </ea-page-header>

    <div class="component-settings-view__container">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <ea-icon name="spinner" variant="solid" size="32" class="text-blue-500 spin"></ea-icon>
        <p class="text-gray-400 text-sm mt-2">加载组件数据中...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="loadError" class="error-state">
        <ea-icon
          name="triangle-exclamation"
          variant="solid"
          size="32"
          class="text-red-500"
        ></ea-icon>
        <p class="text-gray-600 mt-2">{{ loadError }}</p>
        <div class="error-actions mt-4 flex gap-3 justify-center">
          <ea-button type="primary" @click="loadComponentData(route.params.id)"> 重试 </ea-button>
          <ea-button @click="goBack"> 返回列表 </ea-button>
        </div>
      </div>

      <!-- 正常内容 -->
      <ea-tabs
        v-else
        :active="activeMenu"
        class="component-settings-view__tabs"
        tab-position="left"
      >
        <ea-tab panel="basic">基础信息</ea-tab>
        <ea-tab-panel name="basic">
          <div class="settings-form">
            <div class="form-item">
              <label class="form-label"> 组件名称<span class="required">*</span> </label>
              <EaInput v-model="form.name" placeholder="请输入组件名称" size="default" />
            </div>

            <div class="form-item">
              <label class="form-label"> 组件 URL <span class="required">*</span> </label>
              <div v-if="computedFullUrl" class="url-preview">
                <code class="url-preview__value">{{ computedFullUrl }}</code>
              </div>
              <div class="flex">
                <ea-button size="small" text icon="link" @click="showPresetSelector = true">
                </ea-button>
                <EaInput
                  class="w-full"
                  v-model="form.url"
                  placeholder="如: components/my-component.umd.js"
                  size="default"
                />
              </div>
            </div>

            <div class="form-item">
              <label class="form-label">导出名称</label>
              <EaInput v-model="form.exportName" placeholder="UMD 导出名 (可选)" size="default" />
            </div>

            <div class="form-item">
              <label class="form-label">组件类型</label>
              <EaInput v-model="form.type" placeholder="如: remote-button (可选)" size="default" />
            </div>

            <div class="form-item">
              <label class="form-label">图标名称</label>
              <EaInput v-model="form.icon" placeholder="如: crown (可选)" size="default" />
            </div>

            <div class="form-item">
              <label class="form-label">样式文件 URL</label>
              <EaInput v-model="form.styleUrl" placeholder="CSS 文件路径 (可选)" size="default" />
            </div>

            <div class="form-item">
              <label class="form-label">启用状态</label>
              <EaSwitch v-model="form.enabled" />
            </div>

            <div class="form-item">
              <label class="form-label">描述说明</label>
              <EaInput
                v-model="form.description"
                type="textarea"
                :rows="3"
                placeholder="组件用途说明 (可选)"
                size="default"
              />
            </div>
          </div>
        </ea-tab-panel>

        <ea-tab panel="props">属性配置</ea-tab>
        <ea-tab-panel name="props">
          <div class="config-section">
            <div class="config-header">
              <span class="text-sm text-gray-600"
                >配置组件的属性参数 ({{ configForm.props.length }})</span
              >
              <ea-button type="primary" size="small" icon="plus" @click="handleAddProp">
                添加属性
              </ea-button>
            </div>

            <div v-if="configForm.props.length === 0" class="empty-config">
              <ea-empty size="48" description="暂无属性配置，点击上方按钮添加"></ea-empty>
            </div>

            <div v-else class="config-list">
              <div v-for="(prop, index) in configForm.props" :key="index" class="config-item">
                <div class="config-item-row">
                  <EaInput v-model="prop.name" placeholder="属性名 (如: size)" size="small" />
                  <EaInput v-model="prop.label" placeholder="显示名称 (如: 尺寸)" size="small" />
                  <EaSelect v-model="prop.type" size="small" placeholder="类型">
                    <ea-option value="string">字符串</ea-option>
                    <ea-option value="number">数字</ea-option>
                    <ea-option value="boolean">布尔值</ea-option>
                    <ea-option value="array">数组</ea-option>
                    <ea-option value="object">对象</ea-option>
                    <ea-option value="function">函数</ea-option>
                  </EaSelect>
                </div>
                <div class="config-item-row">
                  <EaInput
                    v-model="prop.defaultValue"
                    placeholder="默认值"
                    size="small"
                    class="flex-2"
                  />
                  <EaSwitch v-model="prop.required" size="small" active-text="必填" />
                  <ea-button
                    type="danger"
                    text
                    size="small"
                    icon="trash-can"
                    @click="handleRemoveProp(index)"
                  />
                </div>
              </div>
            </div>
          </div>
        </ea-tab-panel>

        <ea-tab panel="events">事件配置</ea-tab>
        <ea-tab-panel name="events">
          <div class="config-section">
            <div class="config-header">
              <span class="text-sm text-gray-600"
                >配置组件的事件 ({{ configForm.events.length }})</span
              >
              <ea-button type="primary" size="small" icon="plus" @click="handleAddEvent">
                添加事件
              </ea-button>
            </div>

            <div v-if="configForm.events.length === 0" class="empty-config">
              <ea-empty size="48" description="暂无事件配置，点击上方按钮添加"></ea-empty>
            </div>

            <div v-else class="config-list">
              <div v-for="(event, index) in configForm.events" :key="index" class="config-item">
                <div class="config-item-row">
                  <EaInput v-model="event.name" placeholder="事件名 (如: click)" size="small" />
                  <EaInput
                    v-model="event.label"
                    placeholder="显示名称 (如: 点击事件)"
                    size="small"
                  />
                  <ea-button
                    type="danger"
                    text
                    size="small"
                    icon="trash-can"
                    @click="handleRemoveEvent(index)"
                  />
                </div>
                <EaInput
                  v-model="event.description"
                  placeholder="事件描述 (如: 点击时触发)"
                  size="small"
                />
              </div>
            </div>
          </div>
        </ea-tab-panel>

        <ea-tab panel="slots">插槽配置</ea-tab>
        <ea-tab-panel name="slots">
          <div class="config-section">
            <div class="config-header">
              <span class="text-sm text-gray-600"
                >配置组件的插槽 ({{ configForm.slots.length }})</span
              >
              <ea-button type="primary" size="small" icon="plus" @click="handleAddSlot">
                添加插槽
              </ea-button>
            </div>

            <div v-if="configForm.slots.length === 0" class="empty-config">
              <ea-empty size="48" description="暂无插槽配置，点击上方按钮添加"></ea-empty>
            </div>

            <div v-else class="config-list">
              <div v-for="(slot, index) in configForm.slots" :key="index" class="config-item">
                <div class="config-item-row">
                  <EaInput v-model="slot.name" placeholder="插槽名 (如: default)" size="small" />
                  <EaInput
                    v-model="slot.label"
                    placeholder="显示名称 (如: 默认插槽)"
                    size="small"
                  />
                  <ea-button
                    type="danger"
                    text
                    size="small"
                    icon="trash-can"
                    @click="handleRemoveSlot(index)"
                  />
                </div>
                <EaInput v-model="slot.description" placeholder="插槽描述" size="small" />
              </div>
            </div>
          </div>
        </ea-tab-panel>
      </ea-tabs>
    </div>

    <!-- URL 预设选择器弹窗 -->
    <Teleport to="body">
      <UrlPresetSelector
        :visible="showPresetSelector"
        :model-value="form.urlPresetId"
        :close-on-click-modal="false"
        @update:model-value="form.urlPresetId = $event"
        @close="showPresetSelector = false"
        @manage="handleOpenPresetManager"
      />
    </Teleport>

    <!-- URL 预设管理弹窗 -->
    <Teleport to="body">
      <UrlPresetManager :visible="showPresetManager" @close="showPresetManager = false" />
    </Teleport>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, Teleport } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useRemoteComponentStore } from '@/stores/designer/remoteComponent'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'
  import EaSwitch from '@/components/ea-ui-wrap/EaSwitch.vue'
  import UrlPresetSelector from '@/components/remote-components/UrlPresetSelector.vue'
  import UrlPresetManager from '@/components/remote-components/UrlPresetManager.vue'

  const route = useRoute()
  const router = useRouter()
  const remoteStore = useRemoteComponentStore()

  const activeMenu = ref('basic')
  const showPresetSelector = ref(false)
  const showPresetManager = ref(false)
  const loading = ref(false)
  const loadError = ref('')

  const form = ref({
    name: '',
    url: '',
    urlPresetId: '',
    exportName: '',
    type: '',
    icon: 'crown',
    styleUrl: '',
    enabled: true,
    description: '',
  })

  const configForm = ref({
    props: [],
    events: [],
    slots: [],
  })

  const componentName = computed(() => form.value.name || '')

  const isNewMode = computed(() => !route.params.id)

  const computedFullUrl = computed(() => {
    if (!form.value.url) return ''
    return remoteStore.getFullUrl({ url: form.value.url, urlPresetId: form.value.urlPresetId })
  })

  onMounted(async () => {
    if (route.params.id) {
      loading.value = true
      await loadComponentData(route.params.id)
      loading.value = false
    } else {
      resetForm()
    }
  })

  function goBack() {
    router.push({ name: 'components' })
  }

  function handleOpenPresetManager() {
    showPresetSelector.value = false
    showPresetManager.value = true
  }

  async function loadComponentData(id) {
    loading.value = true
    loadError.value = ''
    let component = null

    try {
      if (!remoteStore.isLoaded) {
        await remoteStore.loadConfig()
      }
      component = remoteStore.getComponentById(id)

      if (!component) {
        component = await remoteStore.fetchComponentDetail(id)
      }

      if (component) {
        form.value = {
          name: component.name || '',
          url: component.url || '',
          urlPresetId: component.urlPresetId || '',
          exportName: component.exportName || '',
          type: component.type || '',
          icon: component.icon || 'crown',
          styleUrl: component.styleUrl || '',
          enabled: component.enabled !== false,
          description: component.description || '',
        }

        configForm.value = {
          props: component.props ? JSON.parse(JSON.stringify(component.props)) : [],
          events: component.events ? JSON.parse(JSON.stringify(component.events)) : [],
          slots: component.slots
            ? JSON.parse(JSON.stringify(component.slots))
            : [{ name: 'default', label: '默认插槽', description: '' }],
        }
      } else {
        loadError.value = '组件不存在'
      }
    } catch (error) {
      console.error('加载组件数据失败:', error)
      const status = error?.response?.status
      if (status === 401) {
        loadError.value = '登录已过期，请重新登录'
      } else if (status === 404) {
        loadError.value = '组件不存在'
      } else {
        loadError.value = '加载数据失败，请检查网络连接或刷新页面重试'
      }
    } finally {
      loading.value = false
    }
  }

  function resetForm() {
    form.value = {
      name: '',
      url: '',
      urlPresetId: '',
      exportName: '',
      type: '',
      icon: 'crown',
      styleUrl: '',
      enabled: true,
      description: '',
    }
    configForm.value = {
      props: [],
      events: [],
      slots: [],
    }
    activeMenu.value = 'basic'
  }

  function handleSave() {
    if (!form.value.name.trim()) {
      window.$message?.error('请输入组件名称')
      return
    }
    if (!form.value.url.trim()) {
      window.$message?.error('请输入组件 URL')
      return
    }

    const componentData = {
      name: form.value.name.trim(),
      url: form.value.url.trim(),
      urlPresetId: form.value.urlPresetId || undefined,
      exportName: form.value.exportName.trim() || undefined,
      type: form.value.type.trim() || undefined,
      icon: form.value.icon.trim() || 'crown',
      styleUrl: form.value.styleUrl.trim() || undefined,
      enabled: form.value.enabled,
      description: form.value.description.trim() || undefined,
      props: configForm.value.props,
      events: configForm.value.events,
      slots: configForm.value.slots,
    }

    if (isNewMode.value) {
      const newComponent = remoteStore.addComponent(componentData)
      window.$message?.success(`组件 "${newComponent.name}" 创建成功`)
    } else {
      remoteStore.updateComponent(route.params.id, componentData)
      window.$message?.success('组件更新成功')
    }

    remoteStore.saveConfig()
    router.push({ name: 'components' })
  }

  function handleAddProp() {
    configForm.value.props.push({
      name: '',
      label: '',
      type: 'string',
      defaultValue: '',
      required: false,
    })
  }

  function handleRemoveProp(index) {
    configForm.value.props.splice(index, 1)
  }

  function handleAddEvent() {
    configForm.value.events.push({
      name: '',
      label: '',
      description: '',
    })
  }

  function handleRemoveEvent(index) {
    configForm.value.events.splice(index, 1)
  }

  function handleAddSlot() {
    configForm.value.slots.push({
      name: 'default',
      label: '默认插槽',
      description: '',
    })
  }

  function handleRemoveSlot(index) {
    configForm.value.slots.splice(index, 1)
  }
</script>

<style lang="scss" scoped>
  .component-settings-view {
    height: 100%;
    padding: 1rem;

    &__container {
      display: flex;
      gap: 1.5rem;
      margin-top: 1rem;
      height: calc(100% - 80px);
    }

    &__tabs {
      width: 100%;

      &::part(content) {
        overflow-y: auto;
      }
    }
  }

  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
    gap: 12px;
  }

  .error-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .settings-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 640px;
  }

  .form-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .url-input-group,
  .preset-select-group {
    display: flex;
    gap: 8px;
    align-items: center;

    :deep(.ea-input),
    :deep(ea-select) {
      flex: 1;
    }
  }

  .form-label {
    font-size: 14px;
    font-weight: 500;
    color: var(--ea-text-primary);

    .required {
      color: #ef4444;
      margin-left: 0.25rem;
    }
  }

  .url-preview {
    background: #f0f9ff;
    border: 1px solid #bae0ff;
    border-radius: 4px;
    padding: 0.75rem;
    margin-top: 0.5rem;

    &__label {
      font-size: 13px;
      color: #0369a1;
      margin-right: 0.5rem;
    }

    &__value {
      font-family: monospace;
      word-break: break-all;
      color: #0c4a6e;
      font-size: 13px;
    }
  }

  .config-section {
    max-width: 800px;
  }

  .config-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .config-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .config-item {
    padding: 0.75rem;
    background-color: #f9fafb;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
  }

  .config-item-row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    align-items: center;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .config-item-row :deep(.ea-input) {
    flex: 1;
  }

  .config-item-row .flex-2 {
    flex: 2;
  }

  .empty-config {
    padding: 2rem 0;
  }
</style>
