<template>
  <div class="props-panel flex flex-col h-full">
    <!-- 面板标题 -->
    <div class="h-12 flex items-center px-4 border-b border-gray-200">
      <span class="font-medium text-gray-800">属性配置</span>
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 overflow-y-auto">
      <!-- 未选中组件时显示 -->
      <div v-if="!selectedComponent" class="flex flex-col items-center justify-center h-full text-gray-400 p-6">
        <ea-icon name="setting" size="48" class="mb-2"></ea-icon>
        <p class="text-sm text-center">选中画布上的组件以编辑属性</p>
      </div>

      <!-- 选中组件后显示属性表单 -->
      <div v-else class="p-4 space-y-6">
        <!-- 组件信息 -->
        <div class="component-info pb-4 border-b border-gray-100">
          <div class="flex items-center gap-2 mb-2">
            <ea-icon :name="getComponentIcon(selectedComponent.type)" size="20" color="#3b82f6"></ea-icon>
            <span class="font-medium text-gray-800">{{ componentMeta?.name }}</span>
          </div>
          <div class="text-xs text-gray-500">
            <p>类型: {{ selectedComponent.type }}</p>
            <p>ID: {{ selectedComponent.id }}</p>
          </div>
        </div>

        <!-- 属性配置 -->
        <div v-if="componentMeta?.props?.length > 0" class="props-section">
          <h4 class="section-title">属性</h4>
          <div class="space-y-3">
            <div
              v-for="prop in componentMeta.props"
              :key="prop.name"
              class="prop-item"
            >
              <label class="prop-label">{{ prop.label }}</label>
              <PropInput
                :type="prop.type"
                :value="selectedComponent.props[prop.name]"
                :options="prop.options"
                @update:value="handlePropChange(prop.name, $event)"
              />
            </div>
          </div>
        </div>

        <!-- 样式配置 -->
        <div class="props-section">
          <h4 class="section-title">样式</h4>
          <div class="space-y-3">
            <div class="prop-item">
              <label class="prop-label">宽度</label>
              <input
                type="text"
                :value="selectedComponent.style?.width || ''"
                @input="handleStyleChange('width', $event.target.value)"
                class="prop-input"
                placeholder="auto"
              />
            </div>
            <div class="prop-item">
              <label class="prop-label">高度</label>
              <input
                type="text"
                :value="selectedComponent.style?.height || ''"
                @input="handleStyleChange('height', $event.target.value)"
                class="prop-input"
                placeholder="auto"
              />
            </div>
            <div class="prop-item">
              <label class="prop-label">外边距</label>
              <input
                type="text"
                :value="selectedComponent.style?.margin || ''"
                @input="handleStyleChange('margin', $event.target.value)"
                class="prop-input"
                placeholder="0"
              />
            </div>
            <div class="prop-item">
              <label class="prop-label">内边距</label>
              <input
                type="text"
                :value="selectedComponent.style?.padding || ''"
                @input="handleStyleChange('padding', $event.target.value)"
                class="prop-input"
                placeholder="0"
              />
            </div>
            <div class="prop-item">
              <label class="prop-label">背景色</label>
              <div class="flex gap-2">
                <input
                  type="color"
                  :value="selectedComponent.style?.backgroundColor || '#ffffff'"
                  @input="handleStyleChange('backgroundColor', $event.target.value)"
                  class="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  :value="selectedComponent.style?.backgroundColor || ''"
                  @input="handleStyleChange('backgroundColor', $event.target.value)"
                  class="prop-input flex-1"
                  placeholder="transparent"
                />
              </div>
            </div>
            <div class="prop-item">
              <label class="prop-label">文字颜色</label>
              <div class="flex gap-2">
                <input
                  type="color"
                  :value="selectedComponent.style?.color || '#000000'"
                  @input="handleStyleChange('color', $event.target.value)"
                  class="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  :value="selectedComponent.style?.color || ''"
                  @input="handleStyleChange('color', $event.target.value)"
                  class="prop-input flex-1"
                  placeholder="inherit"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 事件配置 -->
        <div v-if="componentMeta?.events?.length > 0" class="props-section">
          <h4 class="section-title">事件</h4>
          <div class="space-y-2">
            <div
              v-for="event in componentMeta.events"
              :key="event.name"
              class="event-item"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-700">{{ event.label }}</span>
                <span class="text-xs text-gray-400 font-mono">{{ event.name }}</span>
              </div>
              <input
                type="text"
                :value="getEventHandler(event.name)"
                @input="handleEventChange(event.name, $event.target.value)"
                class="prop-input mt-1"
                placeholder="输入处理函数名"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSchemaStore } from '@/stores/designer/schema'
import { getComponentMeta } from '@/constants/componentMeta'
import PropInput from './PropInput.vue'

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
  schemaStore.updateComponentProps(selectedComponent.value.id, {
    [propName]: value,
  })
}

// 样式变更
function handleStyleChange(styleName, value) {
  if (!selectedComponent.value) return
  schemaStore.updateComponentStyle(selectedComponent.value.id, {
    [styleName]: value,
  })
}

// 获取事件处理器
function getEventHandler(eventName) {
  if (!selectedComponent.value) return ''
  const event = selectedComponent.value.events?.find((e) => e.name === eventName)
  return event?.handler || ''
}

// 事件变更
function handleEventChange(eventName, handler) {
  if (!selectedComponent.value) return

  const events = [...(selectedComponent.value.events || [])]
  const index = events.findIndex((e) => e.name === eventName)

  if (handler) {
    if (index > -1) {
      events[index].handler = handler
    } else {
      events.push({ name: eventName, handler })
    }
  } else if (index > -1) {
    events.splice(index, 1)
  }

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
