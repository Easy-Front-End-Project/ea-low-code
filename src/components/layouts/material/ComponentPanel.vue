<template>
  <div class="component-panel flex flex-col h-full">
    <!-- 搜索框 -->
    <div class="p-3 border-b border-gray-200">
      <div class="relative">
        <EaInput v-model="searchQuery" placeholder="搜索组件..." prefix-icon="icon-search" />
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
        <!-- 普通组件分类 -->
        <ea-collapse-item
          v-for="category in filteredCategories"
          :key="category.key"
          :name="category.key"
          :title="category.label + ' (' + category.allComponents.length + ')'"
        >
          <!-- 组件列表（平铺显示，包含子组件） -->
          <div class="component-grid">
            <div
              v-for="component in category.allComponents"
              :key="component.type"
              class="component-item"
              :class="{ 'is-child': component.isChildComponent }"
              draggable="true"
              @dragstart="handleDragStart($event, component)"
            >
              <span class="component-name">{{ component.name }}</span>
              <ea-tag
                v-if="component.isChildComponent"
                size="small"
                type="success"
                class="child-tag"
              >
                子
              </ea-tag>
            </div>
          </div>
        </ea-collapse-item>

        <!-- 远程组件单独渲染 -->
        <ea-collapse-item
          v-if="remoteStore.enabledCount > 0"
          name="remote"
          :title="'远程组件 (' + remoteStore.enabledCount + ')'"
        >
          <div class="component-grid">
            <div
              v-for="component in remoteStore.enabledComponentMetaList"
              :key="component.type"
              class="component-item is-remote"
              draggable="true"
              @dragstart="handleDragStart($event, component)"
            >
              <span class="component-name">{{ component.name }}</span>
              <span class="remote-badge">远程</span>
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
  import { ComponentCategories } from '@/constants/types'
  import { useRemoteComponentStore } from '@/stores/designer/remoteComponent'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

  const searchQuery = ref('')
  const expandedCategories = ref([])
  const remoteStore = useRemoteComponentStore()

  // 在物料区隐藏的子组件
  const hiddenChildComponentsInPanel = [
    'ea-option',
    'ea-option-group',
    'ea-dropdown-item',
    'ea-dropdown-menu',
  ]

  // 获取普通分类（排除远程组件），包含所有组件（平铺显示）
  const categories = computed(() => {
    const cats = getCategories().filter(cat => cat.value !== ComponentCategories.REMOTE)
    return cats.map(cat => {
      const allComponents = getComponentsByCategory(cat.value)
      // 过滤掉隐藏的子组件，但保留其他子组件用于平铺显示
      const visibleComponents = allComponents.filter(
        comp =>
          (!comp.isChildComponent || !hiddenChildComponentsInPanel.includes(comp.type)) &&
          !comp.isService
      )
      return {
        ...cat,
        components: allComponents.filter(comp => !comp.isChildComponent),
        allComponents: visibleComponents,
      }
    })
  })

  // 过滤后的分类和组件
  const filteredCategories = computed(() => {
    if (!searchQuery.value.trim()) {
      const allKeys = categories.value.map(cat => cat.key)
      if (remoteStore.enabledCount > 0) {
        allKeys.push('remote')
      }
      expandedCategories.value = allKeys
      return categories.value
    }

    const query = searchQuery.value.toLowerCase()
    const filtered = categories.value
      .map(cat => ({
        ...cat,
        allComponents: cat.allComponents.filter(
          comp => comp.name.toLowerCase().includes(query) || comp.type.toLowerCase().includes(query)
        ),
      }))
      .filter(cat => cat.allComponents.length > 0)

    // 搜索时自动展开包含结果的分组
    expandedCategories.value = filtered.map(cat => cat.key)

    return filtered
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

  onMounted(() => {
    // 初始化加载远程组件配置
    if (!remoteStore.isLoaded) {
      remoteStore.loadConfig()
    }

    // 设置默认展开的类别
    const allKeys = categories.value.map(cat => cat.key)
    if (remoteStore.enabledCount > 0) {
      allKeys.push('remote')
    }
    expandedCategories.value = allKeys
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
    position: relative;
  }

  .component-item:hover {
    border-color: #3b82f6;
    background-color: #eff6ff;
  }

  .component-item.is-remote {
    border-color: #8b5cf6;
    background-color: #f5f3ff;
  }

  .component-item.is-remote:hover {
    border-color: #7c3aed;
    background-color: #ede9fe;
  }

  .component-name {
    font-size: 0.75rem;
    color: #4b5563;
    text-align: center;
  }

  .remote-badge {
    font-size: 0.625rem;
    color: #8b5cf6;
    background-color: #ede9fe;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
  }

  .child-tag {
    /* position: absolute; */
    --ea-tag-padding: 0 4px;
    --ea-tag-font-size: 10px;
  }

  .component-item.is-child {
    border-color: #10b981;
    background-color: #ecfdf5;
  }

  .component-item.is-child:hover {
    border-color: #059669;
    background-color: #d1fae5;
  }
</style>
