<template>
  <div class="component-panel flex flex-col h-full">
    <!-- 搜索框 -->
    <div class="p-3 border-b border-gray-200">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索组件..."
          class="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <ea-icon name="search" size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></ea-icon>
      </div>
    </div>

    <!-- 组件分类列表 -->
    <div class="flex-1 overflow-y-auto">
      <div v-for="category in filteredCategories" :key="category.key" class="category-section">
        <!-- 分类标题 -->
        <div class="category-header" @click="toggleCategory(category.key)">
          <ea-icon
            name="arrow-right"
            size="16"
            class="transition-transform duration-200 text-gray-500"
            :class="{ 'rotate-90': expandedCategories.includes(category.key) }"
          ></ea-icon>
          <span class="font-medium text-gray-700">{{ category.label }}</span>
          <span class="text-xs text-gray-400 ml-1">({{ category.components.length }})</span>
        </div>

        <!-- 组件列表 -->
        <div v-show="expandedCategories.includes(category.key)" class="component-grid">
          <div
            v-for="component in category.components"
            :key="component.type"
            class="component-item"
            draggable="true"
            @dragstart="handleDragStart($event, component)"
            @click="handleClick(component)"
          >
            <div class="component-icon">
              <ea-icon :name="getComponentIcon(component)" size="24" color="#6b7280"></ea-icon>
            </div>
            <span class="component-name">{{ component.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部提示 -->
    <div class="p-3 border-t border-gray-200 text-xs text-gray-500 text-center">拖拽组件到画布</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getCategories, getComponentsByCategory } from '@/constants/componentMeta'

const searchQuery = ref('')
const expandedCategories = ref(['BASIC', 'FORM', 'LAYOUT'])

// 获取分类和组件
const categories = computed(() => {
  const cats = getCategories()
  return cats.map((cat) => ({
    ...cat,
    components: getComponentsByCategory(cat.value),
  }))
})

// 过滤后的分类和组件
const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) {
    return categories.value
  }

  const query = searchQuery.value.toLowerCase()
  return categories.value
    .map((cat) => ({
      ...cat,
      components: cat.components.filter(
        (comp) =>
          comp.name.toLowerCase().includes(query) || comp.type.toLowerCase().includes(query),
      ),
    }))
    .filter((cat) => cat.components.length > 0)
})

// 切换分类展开/收起
function toggleCategory(key) {
  const index = expandedCategories.value.indexOf(key)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(key)
  }
}

// 拖拽开始
function handleDragStart(event, component) {
  event.dataTransfer.setData('application/json', JSON.stringify(component))
  event.dataTransfer.effectAllowed = 'copy'
}

// 点击组件
function handleClick(component) {
  console.log('点击组件:', component)
}

// 获取组件图标
function getComponentIcon(component) {
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
  return iconMap[component.type] || 'cube'
}
</script>

<style scoped>
.component-panel {
  background-color: #fff;
}

.category-section {
  border-bottom: 1px solid #e5e7eb;
}

.category-header {
  @apply flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors;
}

.component-grid {
  @apply grid grid-cols-2 gap-2 p-3 bg-gray-50;
}

.component-item {
  @apply flex flex-col items-center gap-1 p-3 bg-white rounded-lg border border-gray-200 cursor-move hover:border-blue-400 hover:shadow-sm transition-all;
}

.component-icon {
  @apply w-8 h-8 flex items-center justify-center;
}

.component-name {
  @apply text-xs text-gray-600 text-center;
}

.rotate-90 {
  transform: rotate(90deg);
}
</style>
