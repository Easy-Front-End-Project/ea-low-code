<template>
  <div class="component-panel">
    <!-- 搜索框 -->
    <div class="component-panel__search">
      <EaInput v-model="searchQuery" placeholder="搜索组件..." prefix-icon="magnifying-glass" />
    </div>

    <!-- 组件分类列表 -->
    <div class="component-panel__content">
      <ea-collapse :active="expandedCategories" @change="handleCollapseChange">
        <!-- 普通组件分类 -->
        <ea-collapse-item
          v-for="category in filteredCategories"
          :key="category.key"
          :name="category.key"
          :title="`${category.label} (${category.componentCount})`"
        >
          <div class="component-groups">
            <template v-for="group in category.groups" :key="group.parentType">
              <!-- 有子组件的：显示分割线标题 + 组件网格 + 底部分割线 -->
              <template v-if="group.components.length > 1">
                <div class="group-divider">
                  <span class="group-divider__line"></span>
                  <span class="group-divider__name">{{ group.parentName }}</span>
                  <span class="group-divider__line"></span>
                </div>
                <div class="component-grid">
                  <div
                    v-for="component in group.components"
                    :key="component.type"
                    class="component-item"
                    :class="{ 'component-item--child': component.isChildComponent }"
                    draggable="true"
                    @dragstart="handleDragStart($event, component)"
                  >
                    <span class="component-item__name">{{ component.name }}</span>
                    <ea-tag
                      v-if="component.isChildComponent"
                      size="small"
                      type="success"
                      class="component-item__tag"
                    >
                      子
                    </ea-tag>
                  </div>
                </div>
                <div class="group-divider group-divider--bottom">
                  <span class="group-divider__line"></span>
                </div>
              </template>

              <!-- 没有子组件的：直接显示组件（平铺） -->
              <template v-else>
                <div
                  v-for="component in group.components"
                  :key="component.type"
                  class="component-item component-item--flat"
                  :class="{ 'component-item--child': component.isChildComponent }"
                  draggable="true"
                  @dragstart="handleDragStart($event, component)"
                >
                  <span class="component-item__name">{{ component.name }}</span>
                  <ea-tag
                    v-if="component.isChildComponent"
                    size="small"
                    type="success"
                    class="component-item__tag"
                  >
                    子
                  </ea-tag>
                </div>
              </template>
            </template>
          </div>
        </ea-collapse-item>
      </ea-collapse>
    </div>

    <!-- 底部提示 -->
    <div class="component-panel__footer">拖拽组件到画布</div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { getCategories, getComponentsByParentGroup } from '@/components/designer/constants/componentMeta'
  import { ComponentCategories } from '@ea-low-code/shared'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

  interface ComponentGroup {
    parentType: string
    parentName: string
    components: ComponentItem[]
  }

  interface ComponentItem {
    type: string
    name: string
    isChildComponent?: boolean
    isService?: boolean
    [key: string]: unknown
  }

  interface CategoryWithGroups {
    key: string
    value: string
    label: string
    groups: ComponentGroup[]
    componentCount: number
  }

  const searchQuery = ref('')
  const expandedCategories = ref<string[]>([])

  const hiddenChildComponentsInPanel: string[] = [
    'ea-option',
    'ea-option-group',
    'ea-dropdown-item',
    'ea-dropdown-menu',
  ]

  const categories = computed<CategoryWithGroups[]>(() => {
    const cats = (getCategories() as Array<{ key: string; value: string; label: string }>).filter(cat => cat.value !== ComponentCategories.REMOTE)

    return cats.map(cat => {
      const groups = getComponentsByParentGroup(cat.value)
        .map((group: any) => ({
          ...group,
          components: (group.components as ComponentItem[]).filter(
            comp =>
              (!comp.isChildComponent || !hiddenChildComponentsInPanel.includes(comp.type)) &&
              !comp.isService
          ),
        }))
        .filter((group: any) => group.components.length > 0)

      const componentCount = groups.reduce((sum: number, group: ComponentGroup) => sum + group.components.length, 0)

      return {
        ...cat,
        groups,
        componentCount,
      }
    })
  })

  const filteredCategories = computed<CategoryWithGroups[]>(() => {
    if (!searchQuery.value.trim()) {
      return categories.value
    }

    const query = searchQuery.value.toLowerCase()
    return categories.value
      .map(cat => ({
        ...cat,
        groups: cat.groups
          .map(group => ({
            ...group,
            components: group.components.filter(
              comp =>
                comp.name.toLowerCase().includes(query) || comp.type.toLowerCase().includes(query)
            ),
          }))
          .filter(group => group.components.length > 0),
      }))
      .filter(cat => cat.groups.length > 0)
      .map(cat => ({
        ...cat,
        componentCount: cat.groups.reduce((sum: number, group: ComponentGroup) => sum + group.components.length, 0),
      }))
  })

  // 监听分类变化，自动展开
  watch(
    () => filteredCategories.value,
    (cats: CategoryWithGroups[]) => {
      expandedCategories.value = cats.map(cat => cat.key)
    },
    { immediate: true }
  )

  function handleCollapseChange(e: CustomEvent<{ active: string[] }>) {
    expandedCategories.value = e.detail.active
  }

  function handleDragStart(event: DragEvent, component: ComponentItem) {
    event.dataTransfer!.setData('application/json', JSON.stringify(component))
    event.dataTransfer!.effectAllowed = 'copy'
  }
</script>

<style lang="scss" scoped>
  @include b(component-panel) {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #fff;

    @include e(search) {
      padding: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }

    @include e(content) {
      flex: 1;
      overflow-y: auto;
    }

    @include e(footer) {
      padding: 0.75rem;
      border-top: 1px solid #e5e7eb;
      font-size: 0.75rem;
      color: #6b7280;
      text-align: center;
    }
  }

  @include b(component-groups) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    padding: 0.75rem;
  }

  @include b(group-divider) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    grid-column: span 2;
    padding: 0.25rem 0;
    margin-top: 0.25rem;

    &:first-of-type {
      margin-top: 0;
    }

    @include e(line) {
      flex: 1;
      height: 1px;
      background-color: #e5e7eb;
    }

    @include e(name) {
      font-size: 0.75rem;
      color: #6b7280;
      white-space: nowrap;
      padding: 0 0.25rem;
    }

    @include m(bottom) {
      margin-bottom: 0.25rem;
    }
  }

  @include b(component-grid) {
    display: contents;
  }

  @include b(component-item) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.75rem;
    background-color: #fff;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    cursor: move;
    transition: all 0.2s;
    position: relative;

    &:hover {
      border-color: #3b82f6;
      background-color: #eff6ff;
    }

    @include m(child) {
      border-color: #10b981;
      background-color: #ecfdf5;

      &:hover {
        border-color: #059669;
        background-color: #d1fae5;
      }
    }

    @include m(remote) {
      border-color: #8b5cf6;
      background-color: #f5f3ff;

      &:hover {
        border-color: #7c3aed;
        background-color: #ede9fe;
      }
    }

    @include e(name) {
      font-size: 0.75rem;
      color: #4b5563;
      text-align: center;
    }

    @include e(badge) {
      font-size: 0.625rem;
      color: #8b5cf6;
      background-color: #ede9fe;
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
    }

    @include e(tag) {
      --ea-tag-padding: 0 4px;
      --ea-tag-font-size: 10px;
    }
  }

  ea-collapse {
    display: block;
  }

  ea-collapse-item {
    display: block;
  }
</style>
