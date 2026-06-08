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
      <Loading :loading="loading" text="加载组件数据中...">
        <!-- 错误状态 -->
        <div v-if="loadError" class="error-state">
          <ea-result type="warning" title="加载失败" :sub-title="loadError">
            <div slot="extra">
              <ea-button type="primary" @click="handleRetry"> 重试 </ea-button>
              <ea-button @click="goBack"> 返回列表 </ea-button>
            </div>
          </ea-result>
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
            <BasicInfoPanel
              :form="form"
              :computed-full-url="computedFullUrl"
              @select-preset="showPresetSelector = true"
            />
          </ea-tab-panel>

          <ea-tab panel="props">属性配置</ea-tab>
          <ea-tab-panel name="props">
            <PropsConfigPanel
              :props="configForm.props"
              @add="handleAddProp"
              @remove="handleRemoveProp"
            />
          </ea-tab-panel>

          <ea-tab panel="events">事件配置</ea-tab>
          <ea-tab-panel name="events">
            <EventsConfigPanel
              :events="configForm.events"
              @add="handleAddEvent"
              @remove="handleRemoveEvent"
            />
          </ea-tab-panel>

          <ea-tab panel="slots">插槽配置</ea-tab>
          <ea-tab-panel name="slots">
            <SlotsConfigPanel
              :slots="configForm.slots"
              @add="handleAddSlot"
              @remove="handleRemoveSlot"
            />
          </ea-tab-panel>
        </ea-tabs>
      </Loading>
    </div>

    <!-- URL 预设选择器弹窗 -->
    <Teleport to="body">
      <UrlPresetSelector
        :visible="showPresetSelector"
        :model-value="form.urlPresetId"
        :close-on-click-modal="false"
        @update:model-value="form.urlPresetId = String($event)"
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

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useRemoteComponentStore } from '@/stores/designer/remoteComponent'
  import Loading from '@/components/common/Loading.vue'
  import BasicInfoPanel from '@/components/remote-components/settings/BasicInfoPanel.vue'
  import PropsConfigPanel from '@/components/remote-components/settings/PropsConfigPanel.vue'
  import EventsConfigPanel from '@/components/remote-components/settings/EventsConfigPanel.vue'
  import SlotsConfigPanel from '@/components/remote-components/settings/SlotsConfigPanel.vue'
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
    props: [] as any[],
    events: [] as any[],
    slots: [] as any[],
  })

  const componentName = computed(() => form.value.name || '')
  const isNewMode = computed(() => !route.params.id)

  const computedFullUrl = computed(() => {
    if (!form.value.url) return ''
    return remoteStore.getFullUrl({ url: form.value.url, urlPresetId: form.value.urlPresetId })
  })

  onMounted(async () => {
    if (route.params.id) {
      await loadComponentData(route.params.id as string)
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

  async function handleRetry() {
    loadError.value = ''
    await loadComponentData(route.params.id as string)
  }

  async function loadComponentData(id: string) {
    loading.value = true
    loadError.value = ''

    try {
      let component = remoteStore.getComponentById(Number(id))
      if (!component) {
        component = await remoteStore.fetchComponentDetail(Number(id))
      }

      if (component) {
        form.value = {
          name: component.name || '',
          url: component.url || '',
          urlPresetId: String(component.urlPresetId || ''),
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
    } catch (error: any) {
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
    configForm.value = { props: [], events: [], slots: [] }
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
      remoteStore.addComponent(componentData)
      window.$message?.success('组件创建成功')
    } else {
      remoteStore.updateComponent(Number(route.params.id), componentData)
      window.$message?.success('组件更新成功')
    }
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

  function handleRemoveProp(index: number) {
    configForm.value.props.splice(index, 1)
  }

  function handleAddEvent() {
    configForm.value.events.push({ name: '', label: '', description: '' })
  }

  function handleRemoveEvent(index: number) {
    configForm.value.events.splice(index, 1)
  }

  function handleAddSlot() {
    configForm.value.slots.push({ name: 'default', label: '默认插槽', description: '' })
  }

  function handleRemoveSlot(index: number) {
    configForm.value.slots.splice(index, 1)
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(component-settings-view) {
    height: 100%;
    padding: 1rem;

    @include e(container) {
      margin-top: 1rem;
      height: calc(100% - 80px);
    }

    @include e(tabs) {
      width: 100%;
      height: 100%;

      &::part(content) {
        overflow-y: auto;
      }
    }
  }

  .error-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }
</style>
