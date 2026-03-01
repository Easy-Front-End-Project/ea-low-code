<template>
  <div
    class="canvas-component"
    :class="{
      'is-selected': selected,
      'is-container': isContainer,
    }"
    :style="componentStyle"
    @click.stop="handleClick"
    @mouseover.stop="handleMouseOver"
    @mouseout.stop="handleMouseOut"
  >
    <!-- 组件标签 -->
    <div v-if="showLabel" class="component-label">
      {{ componentMeta?.name || component.type }}
    </div>

    <!-- 选中时的操作按钮 -->
    <div v-if="selected" class="component-actions">
      <button class="action-btn" @click.stop="handleDelete" title="删除">
        <ea-icon name="delete" size="14"></ea-icon>
      </button>
      <button class="action-btn" @click.stop="handleCopy" title="复制">
        <ea-icon name="copy" size="14"></ea-icon>
      </button>
    </div>

    <!-- 组件渲染 -->
    <div class="component-wrapper">
      <component :is="componentTag" v-bind="component.props" :style="innerStyle">
        <!-- 默认插槽内容 -->
        <template v-if="component.children && component.children.length > 0">
          <CanvasComponent
            v-for="child in component.children"
            :key="child.id"
            :component="child"
            :selected="selectedComponentId === child.id"
            @select="$emit('select', $event)"
            @delete="$emit('delete', $event)"
          />
        </template>
        <template v-else-if="hasDefaultSlot">
          {{ component.props.label || component.props.title || '组件内容' }}
        </template>
      </component>
    </div>

    <!-- 选中边框 -->
    <div v-if="selected" class="selection-border"></div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useSchemaStore } from '@/stores/designer/schema'
import { getComponentMeta } from '@/constants/componentMeta'

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select', 'delete'])

const schemaStore = useSchemaStore()
const isHovered = ref(false)

const selectedComponentId = computed(() => schemaStore.selectedComponentId)
const componentMeta = computed(() => getComponentMeta(props.component.type))

// 组件标签名（Web Components）
const componentTag = computed(() => props.component.type)

// 是否为容器组件
const isContainer = computed(() => {
  const containerTypes = [
    'ea-container',
    'ea-card',
    'ea-header',
    'ea-aside',
    'ea-main',
    'ea-dialog',
  ]
  return containerTypes.includes(props.component.type)
})

// 是否显示标签
const showLabel = computed(() => isHovered.value || props.selected)

// 是否有默认插槽
const hasDefaultSlot = computed(() => {
  return componentMeta.value?.slots?.some((slot) => slot.name === 'default')
})

// 组件样式
const componentStyle = computed(() => {
  const style = { ...props.component.style }

  // 添加定位相关样式
  if (style.position === 'absolute') {
    style.position = 'absolute'
  } else {
    style.position = 'relative'
  }

  return style
})

// 内部样式（排除定位相关）
const innerStyle = computed(() => {
  const style = props.component.style || {}
  // eslint-disable-next-line no-unused-vars
  const { position, left, right, top, bottom, ...rest } = style
  return rest
})

// 点击组件
function handleClick() {
  emit('select', props.component.id)
}

// 鼠标悬停
function handleMouseOver() {
  isHovered.value = true
}

// 鼠标离开
function handleMouseOut() {
  isHovered.value = false
}

// 删除组件
function handleDelete() {
  emit('delete', props.component.id)
}

// 复制组件
function handleCopy() {
  // TODO: 实现复制功能
  console.log('复制组件:', props.component.id)
}
</script>

<style scoped>
.canvas-component {
  position: relative;
  display: inline-block;
  margin: 4px;
  transition: all 0.2s ease;
}

.canvas-component.is-container {
  display: block;
  min-height: 60px;
  padding: 8px;
  border: 1px dashed #d1d5db;
  border-radius: 4px;
}

.canvas-component.is-container:hover {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
}

.component-label {
  position: absolute;
  top: -20px;
  left: 0;
  padding: 2px 6px;
  background-color: #3b82f6;
  color: white;
  font-size: 11px;
  border-radius: 3px;
  white-space: nowrap;
  z-index: 10;
}

.component-actions {
  position: absolute;
  top: -24px;
  right: 0;
  display: flex;
  gap: 4px;
  z-index: 10;
}

.action-btn {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  color: #6b7280;
}

.action-btn:hover {
  background-color: #fee2e2;
  border-color: #ef4444;
  color: #ef4444;
}

.component-wrapper {
  position: relative;
}

.selection-border {
  position: absolute;
  inset: -2px;
  border: 2px solid #3b82f6;
  border-radius: 4px;
  pointer-events: none;
  z-index: 5;
}

.selection-border::before {
  content: '';
  position: absolute;
  inset: -4px;
  border: 1px dashed rgba(59, 130, 246, 0.3);
  border-radius: 6px;
}
</style>
