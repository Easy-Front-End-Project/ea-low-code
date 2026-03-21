<template>
  <div class="props-panel flex flex-col h-full">
    <!-- 内容区域 -->
    <div class="flex-1 overflow-y-auto pb-32">
      <div class="p-4 space-y-6">
        <!-- 信息卡片：页面或组件 -->
        <ea-card :class="selectedComponent ? 'component-info-card' : 'page-info-card'">
          <div slot="header" class="flex items-center justify-between">
            <span class="font-medium text-gray-800">
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
          <div class="text-xs text-gray-500 space-y-1">
            <template v-if="selectedComponent">
              <p>类型: {{ selectedComponent.type }}</p>
              <p>ID: {{ selectedComponent.id }}</p>
              <!-- 别名编辑 -->
              <div class="flex items-center gap-2 mt-2">
                <span>别名:</span>
                <div v-if="!isEditingAlias" class="flex items-center gap-2">
                  <span class="text-blue-600 w-full"
                    >{{ selectedComponent.alias || '未设置' }}</span
                  >
                  <ea-button type="primary" size="small" icon="pen" @click="startEditAlias">
                    {{ selectedComponent.alias ? '修改' : '设置' }}
                  </ea-button>
                </div>
                <div v-else class="flex items-center gap-2">
                  <ea-input
                    v-model="aliasInput"
                    size="small"
                    placeholder="输入别名"
                    class="w-full"
                  ></ea-input>
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

        <!-- 配置面板：页面级或组件级 -->
        <ea-tabs :active="selectedComponent ? 'props' : 'pageStyle'">
          <!-- 页面级：样式面板 -->
          <template v-if="!selectedComponent">
            <ea-tab panel="pageStyle">页面样式</ea-tab>
            <ea-tab-panel name="pageStyle">
              <div class="pt-2">
                <BaseStyleConfig
                  :style="pageStyle"
                  :custom-c-s-s="pageCustomCSS"
                  @style-change="handlePageStyleChange"
                />
              </div>
            </ea-tab-panel>

            <ea-tab panel="pageEvents">页面事件</ea-tab>
            <ea-tab-panel name="pageEvents">
              <div class="pt-2">
                <EventConfig
                  :events="pageEventMeta"
                  :component-events="pageEvents"
                  @event-change="handlePageEventChange"
                />
              </div>
            </ea-tab-panel>
          </template>

          <!-- 组件级：属性面板 -->
          <template v-else>
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
                <SpecialConfigRenderer
                  v-if="hasSpecialConfig"
                  :component="selectedComponent"
                  :special-config="componentMeta?.specialConfig"
                />
                <PropConfig
                  :props="componentPropsWithoutSlot"
                  :component-props="selectedComponent.props"
                  @prop-change="handlePropChange"
                />
              </div>
            </ea-tab-panel>

            <!-- 基础样式面板 -->
            <ea-tab panel="baseStyle">基础样式</ea-tab>
            <ea-tab-panel name="baseStyle">
              <div class="pt-2">
                <BaseStyleConfig
                  :style="selectedComponent.style"
                  :position-style="selectedComponent.positionStyle"
                  :custom-c-s-s="selectedComponent.customCSS"
                  @style-change="handleStyleChange"
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

            <!-- 事件面板 -->
            <ea-tab panel="events">事件</ea-tab>
            <ea-tab-panel name="events">
              <div class="pt-2">
                <EventConfig
                  :events="componentMeta?.events"
                  :component-events="selectedComponent.events"
                  @event-change="handleEventChange"
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
  import { computed, ref } from 'vue'
  import { useSchemaStore } from '@/stores/designer/schema'
  import { getComponentMeta, getRemoteComponentMetaList } from '@/constants/componentMeta'
  import PropConfig from '@/components/configs/PropConfig.vue'
  import BaseStyleConfig from '@/components/configs/BaseStyleConfig.vue'
  import ComponentStyleConfig from '@/components/configs/ComponentStyleConfig.vue'
  import EventConfig from '@/components/configs/EventConfig.vue'
  import SlotConfig from '@/components/configs/SlotConfig.vue'
  import SlotScopeConfig from '@/components/configs/SlotScopeConfig.vue'
  import SpecialConfigRenderer from '@/components/configs/SpecialConfig.vue'

  const schemaStore = useSchemaStore()

  const selectedComponent = computed(() => schemaStore.selectedComponent)
  const pageSchema = computed(() => schemaStore.pageSchema)
  const componentCount = computed(() => schemaStore.componentCount)

  // 页面样式 - 从 pageSchema.settings.style 获取
  const pageStyle = computed(() => {
    return schemaStore.pageSchema.settings?.style || {}
  })

  // 页面自定义 CSS
  const pageCustomCSS = computed(() => {
    return schemaStore.pageSchema.settings?.customCSS || ''
  })

  // 页面事件
  const pageEvents = computed(() => {
    return schemaStore.pageSchema.settings?.events || []
  })

  // 页面事件元数据（定义页面支持的事件类型）
  const pageEventMeta = computed(() => {
    return [
      { name: 'load', label: '页面加载', description: '页面加载完成时触发' },
      { name: 'unload', label: '页面卸载', description: '页面卸载时触发' },
      { name: 'scroll', label: '页面滚动', description: '页面滚动时触发' },
      { name: 'resize', label: '窗口调整', description: '窗口大小调整时触发' },
    ]
  })

  // 别名编辑状态
  const isEditingAlias = ref(false)
  const aliasInput = ref('')

  // 开始编辑别名
  function startEditAlias() {
    aliasInput.value = selectedComponent.value?.alias || ''
    isEditingAlias.value = true
  }

  // 保存别名
  function saveAlias() {
    if (!selectedComponent.value) return
    const alias = aliasInput.value.trim()
    // 验证别名格式：只能包含字母、数字、下划线，且不能以数字开头
    if (alias && !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(alias)) {
      alert('别名格式不正确，只能包含字母、数字、下划线，且不能以数字开头')
      return
    }
    // 检查别名是否已被其他组件使用
    if (alias && typeof schemaStore.getComponentIdByAlias === 'function') {
      const existingId = schemaStore.getComponentIdByAlias(alias)
      if (existingId && existingId !== selectedComponent.value.id) {
        alert('该别名已被其他组件使用')
        return
      }
    }
    if (typeof schemaStore.setComponentAlias === 'function') {
      schemaStore.setComponentAlias(selectedComponent.value.id, alias)
    } else {
      // 如果方法不存在，直接设置到组件上
      selectedComponent.value.alias = alias
    }
    isEditingAlias.value = false
  }

  // 取消编辑别名
  function cancelEditAlias() {
    isEditingAlias.value = false
    aliasInput.value = ''
  }
  const componentMeta = computed(() => {
    if (!selectedComponent.value) return null

    // 检查是否是远程组件
    const isRemote =
      selectedComponent.value.type?.startsWith('remote-') || selectedComponent.value.isRemote
    if (isRemote) {
      // 从远程组件列表中查找
      const remoteMetaList = getRemoteComponentMetaList()
      const remoteMeta = remoteMetaList.find(m => m.type === selectedComponent.value.type)
      if (remoteMeta) return remoteMeta
    }

    return getComponentMeta(selectedComponent.value.type)
  })

  // 过滤掉 slot 属性的 props 列表
  const componentPropsWithoutSlot = computed(() => {
    const props = componentMeta.value?.props || []
    return props.filter(prop => prop.name !== 'slot')
  })

  // 是否有特殊配置
  const hasSpecialConfig = computed(() => {
    return !!selectedComponent.value && !!componentMeta.value?.specialConfig?.type
  })

  // 获取父组件的 meta 信息（用于显示目标插槽配置）
  const parentComponentMeta = computed(() => {
    if (!selectedComponent.value) return null

    // 查找父组件
    const parent = schemaStore.findParentComponent(selectedComponent.value.id)
    if (!parent) return null

    // 检查是否是远程组件
    const isRemote = parent.type?.startsWith('remote-') || parent.isRemote
    if (isRemote) {
      const remoteMetaList = getRemoteComponentMetaList()
      const remoteMeta = remoteMetaList.find(m => m.type === parent.type)
      if (remoteMeta) return remoteMeta
    }

    return getComponentMeta(parent.type)
  })

  // 属性变更
  function handlePropChange(propName, value) {
    if (!selectedComponent.value) return

    // 处理变量绑定格式的值
    if (value && typeof value === 'object' && value.type === 'variable') {
      // 变量绑定格式: { type: 'variable', value: 'varName' }
      schemaStore.updateComponentProps(selectedComponent.value.id, {
        [propName]: value,
      })
    } else {
      // 普通值
      schemaStore.updateComponentProps(selectedComponent.value.id, {
        [propName]: value,
      })
    }
  }

  // 样式变更
  function handleStyleChange(styleName, value, styleType = 'inline') {
    if (!selectedComponent.value) return
    // 处理自定义 CSS（直接传递字符串值）
    if (styleType === 'customCSS') {
      schemaStore.updateComponentStyle(selectedComponent.value.id, value, 'customCSS')
    } else {
      schemaStore.updateComponentStyle(
        selectedComponent.value.id,
        { [styleName]: value },
        styleType
      )
    }
  }

  // CSS 变量样式变更
  function handleCssVariableChange(variableName, value) {
    if (!selectedComponent.value) return
    schemaStore.updateComponentStyle(
      selectedComponent.value.id,
      { [variableName]: value },
      'cssVariable'
    )
  }

  // 事件变更
  function handleEventChange(events) {
    if (!selectedComponent.value) return
    schemaStore.updateComponentEvents(selectedComponent.value.id, events)
  }

  // 插槽变更
  function handleSlotChange(slotValue) {
    if (!selectedComponent.value) return
    schemaStore.updateComponentProps(selectedComponent.value.id, { slot: slotValue })
  }

  // Scope 变更
  function handleScopeChange(scope) {
    if (!selectedComponent.value) return
    schemaStore.updateComponentProps(selectedComponent.value.id, { scope })
  }

  // 删除组件
  function handleDeleteComponent() {
    if (!selectedComponent.value) return
    if (confirm('确定要删除这个组件吗？')) {
      schemaStore.removeComponent(selectedComponent.value.id)
    }
  }

  // 页面样式变更
  function handlePageStyleChange(styleName, value, styleType = 'inline') {
    const currentSettings = schemaStore.pageSchema.settings || {}
    if (styleType === 'customCSS') {
      // 自定义 CSS
      schemaStore.updatePageSettings({
        ...currentSettings,
        customCSS: value,
      })
    } else {
      // 普通内联样式
      const currentStyle = currentSettings.style || {}
      schemaStore.updatePageSettings({
        ...currentSettings,
        style: { ...currentStyle, [styleName]: value },
      })
    }
  }

  // 页面事件变更
  function handlePageEventChange(events) {
    const currentSettings = schemaStore.pageSchema.settings || {}
    schemaStore.updatePageSettings({
      ...currentSettings,
      events,
    })
  }
</script>

<style scoped>
  .props-panel {
    background-color: #fff;
  }

  .component-info {
    background-color: #f9fafb;
    padding: 12px;
    border-radius: 8px;
  }
</style>
