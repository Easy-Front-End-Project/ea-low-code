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
        <ea-icon
          name="icon-search"
          size="16"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        ></ea-icon>
      </div>
    </div>

    <!-- 组件分类列表 -->
    <div class="flex-1 overflow-y-auto">
      <ea-collapse :active="expandedCategories" @change="handleCollapseChange">
        <ea-collapse-item
          v-for="category in filteredCategories"
          :key="category.key"
          :name="category.key"
          :title="category.label + ' (' + category.components.length + ')'"
        >
          <!-- 组件列表 -->
          <div class="component-grid">
            <div
              v-for="component in category.components"
              :key="component.type"
              class="component-item"
              draggable="true"
              @dragstart="handleDragStart($event, component)"
              @click="handleClick(component)"
            >
              <span class="component-name">{{ component.name }}</span>
            </div>
          </div>
        </ea-collapse-item>
      </ea-collapse>
    </div>

    <!-- 底部提示 -->
    <div class="p-3 border-t border-gray-200 text-xs text-gray-500 text-center">拖拽组件到画布</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCategories, getComponentsByCategory } from '@/constants/componentMeta'

const searchQuery = ref('')
const expandedCategories = ref([])

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
    expandedCategories.value = categories.value.map((cat) => cat.key)
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

// 处理折叠面板变化
function handleCollapseChange(e) {
  expandedCategories.value = e.detail.active
}

/**
 * 拖拽开始
 * @param event 拖拽事件
 * @param component 组件
 */
function handleDragStart(event, component) {
  event.dataTransfer.setData('application/json', JSON.stringify(component))
  event.dataTransfer.effectAllowed = 'copy'
}

// 点击组件
function handleClick(component) {
  console.log('点击组件:', component)
}

onMounted(() => {
  expandedCategories.value = categories.value.map((cat) => cat.key)
})
</script>

<style scoped>
.component-panel {
  background-color: #fff;
}

ea-collapse {
  display: block;
}

ea-collapse-item {
  display: block;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #f9fafb;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.75rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  cursor: move;
  transition: all 0.2s;
}

.component-item:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.component-name {
  font-size: 0.75rem;
  color: #4b5563;
  text-align: center;
}
</style>
