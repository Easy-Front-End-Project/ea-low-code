<template>
  <div class="props-panel">
    <!-- 内容区域 -->
    <div class="props-panel__content">
      <div class="p-4 space-y-6">
        <!-- 信息卡片：页面或组件 -->
        <ea-card :class="selectedComponent ? 'info-card--component' : 'info-card--page'">
          <div slot="header" class="info-card__header">
            <span class="info-card__title">
              {{ selectedComponent ? componentMeta?.name : '页面配置' }}
            </span>
            <ea-button
              v-if="selectedComponent"
              type="danger"
              size="small"
              icon="trash-can"
              @click="handleDeleteComponent"
            >
              删除
            </ea-button>
          </div>
          <div class="info-card__content space-y-1">
            <template v-if="selectedComponent">
              <p>类型: {{ selectedComponent.type }}</p>
              <p>ID: {{ selectedComponent.id }}</p>
              <!-- 别名编辑 -->
              <div class="alias-editor">
                <span class="text-nowrap">别名:</span>
                <div v-if="!isEditingAlias" class="alias-editor__input-group">
                  <span class="alias-editor__value">{{ selectedComponent.alias || '未设置' }}</span>
                  <ea-button type="primary" size="small" icon="pen" @click="startEditAlias">
                    {{ selectedComponent.alias ? '修改' : '设置' }}
                  </ea-button>
                </div>
                <div v-else class="alias-editor__input-group">
                  <EaInput
                    v-model="aliasInput"
                    size="small"
                    placeholder="输入别名"
                    class="alias-editor__input"
                  />
                  <ea-button
                    type="success"
                    size="small"
                    icon="check"
                    @click="saveAlias"
                  ></ea-button>
                  <ea-button
                    type="default"
                    size="small"
                    icon="xmark"
                    @click="cancelEditAlias"
                  ></ea-button>
                </div>
              </div>
            </template>
            <template v-else>
              <p>标题: {{ pageSchema.meta?.title || '未命名页面' }}</p>
              <p>组件数: {{ componentCount }}</p>
            </template>
          </div>
        </ea-card>

        <SpecialConfigRenderer
          v-if="selectedComponent && hasSpecialConfig"
          :component="selectedComponent"
          :special-config="componentMeta?.specialConfig"
        />

        <!-- 配置面板：页面级或组件级 -->
        <ea-tabs :active="activeTab">
          <!-- 样式面板（页面和组件共用） -->
          <ea-tab :panel="selectedComponent ? 'baseStyle' : 'pageStyle'">
            {{ selectedComponent ? '基础样式' : '页面样式' }}
          </ea-tab>
          <ea-tab-panel :name="selectedComponent ? 'baseStyle' : 'pageStyle'">
            <div class="pt-2">
              <BaseStyleConfig
                :style="currentStyleConfig.style"
                :position-style="currentStyleConfig.positionStyle"
                :custom-c-s-s="currentStyleConfig.customCSS"
                @style-change="handleStyleChange"
              />
            </div>
          </ea-tab-panel>

          <!-- 事件面板（页面和组件共用） -->
          <ea-tab :panel="selectedComponent ? 'events' : 'pageEvents'">
            {{ selectedComponent ? '事件' : '页面事件' }}
          </ea-tab>
          <ea-tab-panel :name="selectedComponent ? 'events' : 'pageEvents'">
            <div class="pt-2">
              <EventConfig
                :events="currentEventConfig.events"
                :component-events="currentEventConfig.componentEvents"
                @event-change="handleEventChange"
              />
            </div>
          </ea-tab-panel>

          <!-- 组件级：属性面板 -->
          <template v-if="selectedComponent">
            <ea-tab panel="props">属性</ea-tab>
            <ea-tab-panel name="props">
              <div class="space-y-4 pt-2">
                <SlotConfig
                  :parent-slots="parentComponentMeta?.slots"
                  :slot-value="selectedComponent.props?.slot || 'default'"
                  @slot-change="handleSlotChange"
                />
                <SlotScopeConfig
                  :parent-slots="parentComponentMeta?.slots"
                  :slot-value="selectedComponent.props?.slot || 'default'"
                  :scope="selectedComponent.props?.scope || ''"
                  @scope-change="handleScopeChange"
                />
                <PropConfig
                  :props="componentPropsWithoutSlot"
                  :component-props="selectedComponent.props"
                  @prop-change="handlePropChange"
                />
              </div>
            </ea-tab-panel>

            <!-- 组件样式面板 -->
            <ea-tab panel="componentStyle">组件样式</ea-tab>
            <ea-tab-panel name="componentStyle">
              <div class="pt-2">
                <ComponentStyleConfig
                  :component-type="selectedComponent.type"
                  :component-props="selectedComponent.props"
                  :css-variables="selectedComponent.cssVariables"
                  @css-variable-change="handleCssVariableChange"
                />
              </div>
            </ea-tab-panel>
          </template>
        </ea-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import { useSchemaStore } from '@/stores/designer/schema'
  import { useRemoteComponentStore } from '@/stores/designer/remoteComponent'
  import { getComponentMeta, getRemoteComponentMetaList } from '@/constants/componentMeta'
  import PropConfig from '@/components/configs/PropConfig.vue'
  import BaseStyleConfig from '@/components/configs/BaseStyleConfig.vue'
  import ComponentStyleConfig from '@/components/configs/ComponentStyleConfig.vue'
  import EventConfig from '@/components/configs/EventConfig.vue'
  import SlotConfig from '@/components/configs/SlotConfig.vue'
  import SlotScopeConfig from '@/components/configs/SlotScopeConfig.vue'
  import SpecialConfigRenderer from '@/components/configs/SpecialConfig.vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

  const schemaStore = useSchemaStore()
  const remoteStore = useRemoteComponentStore()

  // ==================== 基础状态 ====================
  /** 当前激活的 tab */
  const activeTab = ref('pageStyle')

  /** 当前选中的组件 */
  const selectedComponent = computed(() => schemaStore.selectedComponent)

  // 只在从页面切换到组件或从组件切换到页面时重置 tab
  watch(
    selectedComponent,
    (newVal, oldVal) => {
      const wasComponent = !!oldVal
      const isComponent = !!newVal
      if (wasComponent !== isComponent) {
        activeTab.value = isComponent ? 'props' : 'pageStyle'
      }
    },
    { immediate: true }
  )
  /** 页面 Schema */
  const pageSchema = computed(() => schemaStore.pageSchema)
  /** 组件总数 */
  const componentCount = computed(() => schemaStore.componentCount)

  // ==================== 页面级配置 ====================
  /** 页面样式 */
  const pageStyle = computed(() => schemaStore.pageSchema.settings?.style || {})
  /** 页面自定义 CSS */
  const pageCustomCSS = computed(() => schemaStore.pageSchema.settings?.customCSS || '')
  /** 页面事件 */
  const pageEvents = computed(() => schemaStore.pageSchema.settings?.events || [])

  /** 页面事件元数据 */
  const pageEventMeta = computed(() => [
    { name: 'load', label: '页面加载', description: '页面加载完成时触发' },
    { name: 'unload', label: '页面卸载', description: '页面卸载时触发' },
    { name: 'scroll', label: '页面滚动', description: '页面滚动时触发' },
    { name: 'resize', label: '窗口调整', description: '窗口大小调整时触发' },
  ])

  /** 当前样式配置（页面或组件） */
  const currentStyleConfig = computed(() => {
    if (selectedComponent.value) {
      return {
        style: selectedComponent.value.style || {},
        positionStyle: selectedComponent.value.positionStyle || {},
        customCSS: selectedComponent.value.customCSS || '',
      }
    }
    return {
      style: pageStyle.value,
      positionStyle: {},
      customCSS: pageCustomCSS.value,
    }
  })

  /** 当前事件配置（页面或组件） */
  const currentEventConfig = computed(() => {
    if (selectedComponent.value) {
      return {
        events: componentMeta.value?.events || [],
        componentEvents: selectedComponent.value.events || [],
      }
    }
    return {
      events: pageEventMeta.value,
      componentEvents: pageEvents.value,
    }
  })

  // ==================== 别名编辑 ====================
  /** 是否正在编辑别名 */
  const isEditingAlias = ref(false)
  /** 别名输入值 */
  const aliasInput = ref('')

  /** 开始编辑别名 */
  function startEditAlias() {
    aliasInput.value = selectedComponent.value?.alias || ''
    isEditingAlias.value = true
  }

  /** 保存别名 */
  function saveAlias() {
    if (!selectedComponent.value) return
    const alias = aliasInput.value.trim()

    // 验证别名格式
    if (alias && !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(alias)) {
      alert('别名格式不正确，只能包含字母、数字、下划线，且不能以数字开头')
      return
    }

    // 检查别名是否已被使用
    if (alias) {
      const existingId = schemaStore.getComponentIdByAlias?.(alias)
      if (existingId && existingId !== selectedComponent.value.id) {
        alert('该别名已被其他组件使用')
        return
      }
    }

    // 保存别名
    if (schemaStore.setComponentAlias) {
      schemaStore.setComponentAlias(selectedComponent.value.id, alias)
    } else {
      selectedComponent.value.alias = alias
    }
    isEditingAlias.value = false
  }

  /** 取消编辑别名 */
  function cancelEditAlias() {
    isEditingAlias.value = false
    aliasInput.value = ''
  }

  // ==================== 组件元数据 ====================
  /** 当前组件元数据 */
  const componentMeta = computed(() => {
    if (!selectedComponent.value) return null

    const isRemote =
      selectedComponent.value.type?.startsWith('remote-') || selectedComponent.value.isRemote

    if (isRemote) {
      const remoteMeta = remoteStore.enabledComponentMetaList.find(
        m =>
          m.type === selectedComponent.value.type ||
          m.remoteConfig?.id == selectedComponent.value.remoteConfig?.id
      )
      if (remoteMeta) return remoteMeta

      // 旧架构（localStorage）
      const legacyMetaList = getRemoteComponentMetaList()
      return legacyMetaList.find(m => m.type === selectedComponent.value.type)
    }

    return getComponentMeta(selectedComponent.value.type)
  })

  /** 排除 slot 的组件属性 */
  const componentPropsWithoutSlot = computed(() =>
    (componentMeta.value?.props || []).filter(prop => prop.name !== 'slot')
  )

  /** 是否有特殊配置 */
  const hasSpecialConfig = computed(
    () => !!(selectedComponent.value && componentMeta.value?.specialConfig?.type)
  )

  /** 父组件元数据 */
  const parentComponentMeta = computed(() => {
    if (!selectedComponent.value) return null

    const parent = schemaStore.findParentComponent(selectedComponent.value.id)
    if (!parent) return null

    const isRemote = parent.type?.startsWith('remote-') || parent.isRemote
    if (isRemote) {
      const remoteMeta = remoteStore.enabledComponentMetaList.find(
        m => m.type === parent.type || m.remoteConfig?.id == parent.remoteConfig?.id
      )
      if (remoteMeta) return remoteMeta

      // 旧架构
      const legacyMetaList = getRemoteComponentMetaList()
      return legacyMetaList.find(m => m.type === parent.type)
    }

    return getComponentMeta(parent.type)
  })

  // ==================== 事件处理 ====================
  /** 属性变更处理 */
  function handlePropChange(propName, value) {
    if (!selectedComponent.value) return
    schemaStore.updateComponentProps(selectedComponent.value.id, { [propName]: value })
  }

  /** 样式变更处理 */
  function handleStyleChange(styleName, value, styleType = 'inline') {
    if (selectedComponent.value) {
      if (styleType === 'customCSS') {
        schemaStore.updateComponentStyle(selectedComponent.value.id, value, 'customCSS')
      } else {
        schemaStore.updateComponentStyle(
          selectedComponent.value.id,
          { [styleName]: value },
          styleType
        )
      }
    } else {
      const currentSettings = schemaStore.pageSchema.settings || {}
      if (styleType === 'customCSS') {
        schemaStore.updatePageSettings({ ...currentSettings, customCSS: value })
      } else {
        const currentStyle = currentSettings.style || {}
        schemaStore.updatePageSettings({
          ...currentSettings,
          style: { ...currentStyle, [styleName]: value },
        })
      }
    }
  }

  /** CSS 变量变更处理 */
  function handleCssVariableChange(variableName, value) {
    if (!selectedComponent.value) return
    schemaStore.updateComponentStyle(
      selectedComponent.value.id,
      { [variableName]: value },
      'cssVariable'
    )
  }

  /** 事件变更处理 */
  function handleEventChange(events) {
    if (selectedComponent.value) {
      schemaStore.updateComponentEvents(selectedComponent.value.id, events)
    } else {
      const currentSettings = schemaStore.pageSchema.settings || {}
      schemaStore.updatePageSettings({ ...currentSettings, events })
    }
  }

  /** 插槽变更处理 */
  function handleSlotChange(slotValue) {
    if (!selectedComponent.value) return
    schemaStore.updateComponentProps(selectedComponent.value.id, { slot: slotValue })
  }

  /** Scope 变更处理 */
  function handleScopeChange(scope) {
    if (!selectedComponent.value) return
    schemaStore.updateComponentProps(selectedComponent.value.id, { scope })
  }

  /** 删除组件处理 */
  function handleDeleteComponent() {
    if (!selectedComponent.value) return
    if (confirm('确定要删除这个组件吗？')) {
      schemaStore.removeComponent(selectedComponent.value.id)
    }
  }
</script>

<style lang="scss" scoped>
  .props-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #fff;

    &__content {
      flex: 1;
      overflow-y: auto;
      padding-bottom: 8rem;
    }

    &__section {
      padding: 1rem;
    }
  }

  .info-card {
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__title {
      font-weight: 500;
      color: #1f2937;
    }

    &__content {
      font-size: 0.75rem;
      color: #6b7280;

      p {
        margin: 0.25rem 0;
      }
    }
  }

  .alias-editor {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;

    &__value {
      color: #2563eb;
      width: 100%;
    }

    &__input-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
    }

    &__input {
      flex: 1;
    }
  }

  .config-section {
    margin-bottom: 1.5rem;

    &__title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.75rem;
    }

    &__subsection-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  .prop-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    &--inline {
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
    }

    &__label {
      font-size: 0.75rem;
      font-weight: 500;
      color: #6b7280;
    }

    &__description {
      margin-bottom: 0.25rem;
    }
  }

  .divider {
    height: 1px;
    background-color: #e5e7eb;
    margin: 0.75rem 0;
  }

  .space-y-3 {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .space-y-4 {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .space-y-6 {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
</style>
