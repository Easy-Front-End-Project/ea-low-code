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

        <!-- 属性配置 -->
        <PropConfig
          :props="componentMeta?.props"
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
  import { getComponentMeta } from '@/constants/componentMeta'
  import PropConfig from './PropConfig.vue'
  import StyleConfig from './StyleConfig.vue'
  import EventConfig from './EventConfig.vue'

  const schemaStore = useSchemaStore()

  const selectedComponent = computed(() => schemaStore.selectedComponent)
  const componentMeta = computed(() => {
    if (!selectedComponent.value) return null
    return getComponentMeta(selectedComponent.value.type)
  })

  // 获取组件图标
  function getComponentIcon(type) {
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
