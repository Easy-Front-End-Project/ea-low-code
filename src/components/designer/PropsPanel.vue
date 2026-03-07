<template>
  <div class="props-panel flex flex-col h-full">
    <!-- 面板标题 -->
    <div class="h-12 flex items-center px-4 border-b border-gray-200">
      <span class="font-medium text-gray-800">属性配置</span>
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 overflow-y-auto pb-32">
      <!-- 未选中组件时显示 -->
      <div
        v-if="!selectedComponent"
        class="flex flex-col items-center justify-center h-full text-gray-400 p-6"
      >
        <p class="text-sm text-center">选中画布上的组件以编辑属性</p>
      </div>

      <!-- 选中组件后显示属性表单 -->
      <div v-else class="p-4 space-y-6">
        <!-- 组件信息 -->
        <div class="component-info pb-4 border-b border-gray-100">
          <div class="flex items-center gap-2 mb-2">
            <ea-icon
              :name="getComponentIcon(selectedComponent.type)"
              size="20"
              color="#3b82f6"
            ></ea-icon>
            <span class="font-medium text-gray-800">{{ componentMeta?.name }}</span>
          </div>
          <div class="text-xs text-gray-500">
            <p>类型: {{ selectedComponent.type }}</p>
            <p>ID: {{ selectedComponent.id }}</p>
          </div>
        </div>

        <!-- 目标插槽配置（排在最上面） -->
        <SlotConfig
          :parent-slots="parentComponentMeta?.slots"
          :slot-value="selectedComponent.props?.slot || 'default'"
          @slot-change="handleSlotChange"
        />

        <!-- 属性配置 -->
        <PropConfig
          :props="componentPropsWithoutSlot"
          :component-props="selectedComponent.props"
          @prop-change="handlePropChange"
        />

        <!-- 样式配置 -->
        <StyleConfig
          :component-type="selectedComponent.type"
          :component-props="selectedComponent.props"
          :style="selectedComponent.style"
          :css-variables="selectedComponent.cssVariables"
          @style-change="handleStyleChange"
          @css-variable-change="handleCssVariableChange"
        />

        <!-- 事件配置 -->
        <EventConfig
          :events="componentMeta?.events"
          :component-events="selectedComponent.events"
          @event-change="handleEventChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useSchemaStore } from '@/stores/designer/schema'
  import { getComponentMeta, getRemoteComponentMetaList } from '@/constants/componentMeta'
  import PropConfig from './PropConfig.vue'
  import StyleConfig from './StyleConfig.vue'
  import EventConfig from './EventConfig.vue'
  import SlotConfig from './SlotConfig.vue'

  const schemaStore = useSchemaStore()

  const selectedComponent = computed(() => schemaStore.selectedComponent)
  const componentMeta = computed(() => {
    if (!selectedComponent.value) return null

    // 检查是否是远程组件
    const isRemote =
      selectedComponent.value.type?.startsWith('remote-') || selectedComponent.value.isRemote
    if (isRemote) {
      // 从远程组件列表中查找
      const remoteMetaList = getRemoteComponentMetaList()
      const remoteMeta = remoteMetaList.find((m) => m.type === selectedComponent.value.type)
      if (remoteMeta) return remoteMeta
    }

    return getComponentMeta(selectedComponent.value.type)
  })

  // 过滤掉 slot 属性的 props 列表
  const componentPropsWithoutSlot = computed(() => {
    const props = componentMeta.value?.props || []
    return props.filter((prop) => prop.name !== 'slot')
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
      const remoteMeta = remoteMetaList.find((m) => m.type === parent.type)
      if (remoteMeta) return remoteMeta
    }

    return getComponentMeta(parent.type)
  })

  // 获取组件图标
  function getComponentIcon(type) {
    // 远程组件使用 link 图标
    if (type?.startsWith('remote-')) {
      return 'link'
    }

    const iconMap = {
      'ea-button': 'button',
      'ea-icon': 'star',
      'ea-input': 'edit',
      'ea-select': 'list',
      'ea-checkbox': 'check-square',
      'ea-radio': 'radio',
      'ea-switch': 'switch',
      'ea-container': 'container',
      'ea-header': 'header',
      'ea-aside': 'aside',
      'ea-main': 'main',
      'ea-card': 'card',
      'ea-table': 'table',
      'ea-pagination': 'page',
      'ea-menu': 'menu',
      'ea-tabs': 'tabs',
      'ea-breadcrumb': 'breadcrumb',
      'ea-dialog': 'dialog',
      'ea-alert': 'alert',
      'ea-message': 'message',
    }
    return iconMap[type] || 'cube'
  }

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
    schemaStore.updateComponentStyle(selectedComponent.value.id, { [styleName]: value }, styleType)
  }

  // CSS 变量样式变更
  function handleCssVariableChange(variableName, value) {
    if (!selectedComponent.value) return
    schemaStore.updateComponentStyle(
      selectedComponent.value.id,
      { [variableName]: value },
      'cssVariable',
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

  .section-title {
    @apply text-sm font-medium text-gray-700 mb-3;
  }

  .prop-item {
    @apply flex flex-col gap-1;
  }

  .prop-label {
    @apply text-xs text-gray-500;
  }

  .prop-input {
    @apply px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  }

  .event-item {
    @apply p-3 bg-gray-50 rounded-lg;
  }
</style>
