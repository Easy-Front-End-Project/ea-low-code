<template>
  <!-- 自定义样式 -->
  <component :is="'style'" v-if="processedCustomCSS">{{ processedCustomCSS }}</component>
  <div
    class="canvas-component"
    :class="componentClasses"
    :style="componentStyle"
    @click.stop.prevent="handleClick"
    @mouseover.stop="isHovered = true"
    @mouseout.stop="isHovered = false"
    @dragover.stop="handleDragOver"
    @drop.stop="handleDrop"
    @dragenter.stop="handleDragEnter"
    @dragleave.stop="handleDragLeave"
  >
    <!-- 组件标签 -->
    <ComponentLabel
      v-if="showLabel && !isNonSelectable"
      :name="displayName"
      :slot-name="componentSlotName"
    />

    <!-- 操作按钮 -->
    <ComponentActions
      v-if="selected && !isNonSelectable"
      @delete="handleDelete"
      @copy="handleCopy"
    />

    <!-- 组件 -->
    <div class="canvas-component__wrapper">
      <component
        :is="componentTag"
        ref="componentRef"
        v-bind="componentProps"
        :style="componentInnerStyle"
        :class="customClassName"
        v-on="componentEventListeners"
      >
        <!-- 文本内容 -->
        <template v-if="hasChildrenText">{{ resolvedChildrenText }}</template>

        <!-- 子组件 -->
        <template v-else>
          <ChildComponents
            :children="allChildren"
            :parent-component="props.component"
            :selected-component-id="selectedComponentId"
            @select="$emit('select', $event)"
            @delete="$emit('delete', $event)"
            @copy="$emit('copy', $event)"
            @drop-to-parent="$emit('drop-to-parent', $event)"
          />
        </template>
      </component>
    </div>

    <!-- 选中边框 -->
    <div v-if="selected && !isNonSelectable" class="canvas-component__selection-border"></div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, toRef } from 'vue'
  import { useSchemaStore } from '@/components/designer/stores/schema'
  import { getComponentMeta } from '@/components/designer/constants/componentMeta'
  import { processCustomCSS } from '@/utils/cssProcessor'
  import { cloneComponentSchema } from '@/utils/schemaHelper'
  import type { ComponentSchema } from '@/utils/schemaHelper'
  import { useRemoteComponent } from '@/components/designer/composables/useRemoteComponent'
  import { useComponentInstance } from '@/components/designer/composables/useComponentInstance'
  import { useComponentRender } from '@/components/designer/composables/useComponentRender'
  import { CONTAINER_TYPES, NON_CONTAINER_TYPES, INLINE_BLOCK_TYPES, NON_SELECTABLE_TYPES, NON_SELECTABLE_IN_PARENT } from '@ea-low-code/shared'
  import ComponentLabel from './CanvasComponent/ComponentLabel.vue'
  import ComponentActions from './CanvasComponent/ComponentActions.vue'
  import ChildComponents from './CanvasComponent/ChildComponents.vue'

  defineOptions({ name: 'CanvasComponent' })

  const props = withDefaults(defineProps<{
    component: ComponentSchema
    selected?: boolean
    parentComponent?: ComponentSchema | null
  }>(), {
    selected: false,
    parentComponent: null,
  })

  const emit = defineEmits<{
    select: [componentId: string]
    delete: [componentId: string]
    copy: [component: ComponentSchema]
    'drop-to-parent': [payload: { componentMeta: any; parentId: string; slotName: string }]
  }>()

  // ==================== Stores ====================
  const schemaStore = useSchemaStore()

  // ==================== Refs ====================
  /** 是否悬停 */
  const isHovered = ref(false)
  /** 是否为拖拽目标 */
  const isDropTarget = ref(false)
  /** 拖拽计数器（处理嵌套元素拖拽） */
  const dragCounter = ref(0)
  /** 组件引用 */
  const componentRef = ref<any>(null)

  // ==================== Composables ====================
  // 使用公共的组件渲染逻辑
  const componentRefWrapper = toRef(() => props.component)
  const { resolvedChildrenText, hasChildrenText, componentProps, componentEventListeners } =
    useComponentRender(componentRefWrapper, { skipSlot: true })

  // ==================== Computed ====================
  /** 当前选中的组件ID */
  const selectedComponentId = computed(() => schemaStore.selectedComponentId)
  /** 组件元数据 */
  const componentMeta = computed(() => getComponentMeta(props.component.type))
  /** 所有子组件 */
  const allChildren = computed(() => props.component.children || [])
  /** 组件插槽名称 */
  const componentSlotName = computed(() => (props.component.props?.slot as string) || undefined)

  // 远程组件
  const { isRemoteComponent, componentTag: remoteComponentTag } = useRemoteComponent(
    props.component
  )
  const componentTag = computed(() => remoteComponentTag.value)

  /** 是否不可选择 */
  const isNonSelectable = computed(() => {
    if (NON_SELECTABLE_TYPES.includes(props.component.type)) return true
    return NON_SELECTABLE_IN_PARENT.some(
      (config: any) =>
        config.childType === props.component.type &&
        config.parentType === props.parentComponent?.type
    )
  })

  /** 是否为容器组件 */
  const isContainer = computed(() => {
    if (NON_CONTAINER_TYPES.includes(props.component.type)) return false
    if (allChildren.value.length > 0) return true
    if (CONTAINER_TYPES.includes(props.component.type)) return true
    const metaSlots = componentMeta.value?.slots
    return metaSlots && metaSlots.length > 0
  })

  const isNonContainer = computed(() => NON_CONTAINER_TYPES.includes(props.component.type))
  const isInlineBlock = computed(() => INLINE_BLOCK_TYPES.includes(props.component.type))

  /** 组件样式类名 */
  const componentClasses = computed(() => ({
    'canvas-component--selected': props.selected && !isNonSelectable.value,
    'canvas-component--container': isContainer.value && !isNonSelectable.value,
    'canvas-component--non-container': isNonContainer.value && !isNonSelectable.value,
    'canvas-component--inline-block': isInlineBlock.value && !isNonSelectable.value,
    'canvas-component--drop-target': isDropTarget.value && !isNonSelectable.value,
    'canvas-component--non-selectable': isNonSelectable.value,
  }))

  /** 显示名称 */
  const displayName = computed(
    () => componentMeta.value?.name || (isRemoteComponent.value ? '远程组件' : props.component.type)
  )

  /** 是否显示标签 */
  const showLabel = computed(() => isHovered.value || props.selected)

  // 样式
  const componentStyle = computed(() => props.component.positionStyle || {})

  /** 组件内部样式（排除定位相关属性） */
  const componentInnerStyle = computed(() => {
    // eslint-disable-next-line no-unused-vars
    const { position, top, right, bottom, left, zIndex, overflow, ...restStyle } =
      props.component.style || {}
    return { ...restStyle, ...props.component.cssVariables }
  })

  /** 自定义类名 */
  const customClassName = computed(() =>
    props.component.customCSS ? `custom-${props.component.id}` : ''
  )

  /** 处理后的自定义CSS */
  const processedCustomCSS = computed(() => {
    if (!props.component.customCSS) return ''
    return processCustomCSS(props.component.customCSS, props.component.id)
  })

  // ==================== Methods ====================
  /** 点击处理 */
  function handleClick() {
    if (isNonSelectable.value) return
    emit('select', props.component.id)
  }

  /** 删除处理 */
  function handleDelete() {
    emit('delete', props.component.id)
  }

  /** 复制处理 */
  function handleCopy() {
    const copiedComponent = cloneComponentSchema(props.component)
    emit('copy', copiedComponent)
  }

  // 拖拽处理
  /** 拖拽悬停处理 */
  function handleDragOver(event: DragEvent) {
    if (!isContainer.value || isNonSelectable.value) return
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy'
    }
  }

  /** 拖拽进入处理 */
  function handleDragEnter(event: DragEvent) {
    if (!isContainer.value || isNonSelectable.value) return
    event.preventDefault()
    dragCounter.value++
    if (dragCounter.value === 1) isDropTarget.value = true
  }

  /** 拖拽离开处理 */
  function handleDragLeave() {
    if (!isContainer.value || isNonSelectable.value) return
    dragCounter.value--
    if (dragCounter.value === 0) isDropTarget.value = false
  }

  /** 拖拽放置处理 */
  function handleDrop(event: DragEvent) {
    if (!isContainer.value || isNonSelectable.value) return
    event.preventDefault()

    dragCounter.value = 0
    isDropTarget.value = false

    const data = event.dataTransfer?.getData('application/json')
    if (!data) return

    try {
      const droppedComponentMeta = JSON.parse(data)
      const allowedChildTypes = componentMeta.value?.childComponents || []
      const isDedicatedChild = allowedChildTypes.includes(droppedComponentMeta.type)
      const defaultSlot = componentMeta.value?.defaultSlot || 'default'

      if (allowedChildTypes.length > 0 && !isDedicatedChild && defaultSlot === 'default') {
        console.warn(
          `组件 ${droppedComponentMeta.type} 不允许拖入到 ${props.component.type}，只允许: ${allowedChildTypes.join(', ')}`
        )
        return
      }

      emit('drop-to-parent', {
        componentMeta: droppedComponentMeta,
        parentId: props.component.id,
        slotName: defaultSlot,
      })
    } catch (error) {
      console.error('拖拽放置到容器失败:', error)
    }
  }

  // ==================== Lifecycle ====================
  // 注册组件实例到 store
  useComponentInstance({
    componentId: props.component.id,
    componentType: props.component.type,
    componentRef,
    events: props.component.events,
  })
</script>

<style lang="scss" scoped>
  .canvas-component {
    position: relative;
    display: inline-flex;
    margin: 4px;
    min-width: 15px;
    min-height: 15px;
    transition: all 0.2s ease;

    &--container,
    &--non-container,
    &--inline-block {
      border: 1px dashed #d1d5db;
      border-radius: 4px;

      &:hover {
        border-color: #3b82f6;
        background-color: rgba(59, 130, 246, 0.05);
      }
    }

    &--container {
      display: block;
      padding: 8px;
    }

    &--non-container {
      display: block;
      padding: 8px;
      min-width: 120px;
      min-height: 40px;
    }

    &--inline-block {
      display: inline-flex;
      padding: 4px;
    }

    &--drop-target {
      border-color: #10b981;
      background-color: rgba(16, 185, 129, 0.1);
      border-style: solid;
    }

    &--non-selectable {
      pointer-events: none;
      display: contents;

      .canvas-component__wrapper {
        pointer-events: auto;
        display: contents;
      }
    }

    &__wrapper {
      position: relative;
      cursor: pointer;

      :deep(ea-time-picker),
      :deep(ea-date-picker),
      :deep(ea-slider),
      :deep(ea-select),
      :deep(ea-rate),
      :deep(ea-switch),
      :deep(ea-transfer),
      :deep(ea-image) {
        pointer-events: none;
      }

      :deep(ea-carousel) {
        display: block;

        & > .canvas-component {
          width: 100%;
          height: 100%;
          flex: 0 0 100%;
        }
      }

      :deep(ea-descriptions),
      :deep(ea-table) {
        &::part(default-slot) {
          display: block;
        }

        &::part(low-code-component-label),
        &::part(low-code-component-actions),
        &::part(low-code-slot-label) {
          display: none;
        }
      }

      :deep(ea-tag::part(close-icon)),
      :deep(ea-alert::part(close-btn)) {
        pointer-events: none;
      }

      :deep(ea-tab-panel) {
        display: block;
      }
    }

    &__selection-border {
      position: absolute;
      inset: -2px;
      border: 2px solid #3b82f6;
      border-radius: 4px;
      pointer-events: none;
      z-index: 5;

      &::before {
        content: '';
        position: absolute;
        inset: -4px;
        border: 1px dashed rgba(59, 130, 246, 0.3);
        border-radius: 6px;
      }
    }
  }

  ea-row {
    & > div > .canvas-component--container {
      // flex: 1 0 auto;
    }
  }

  ea-calendar {
    width: 300px;
  }

  :deep(.slot-content-wrapper) {
    display: contents;
  }

  :deep(.slot-placeholder) {
    color: #9ca3af;
    font-size: 12px;
    padding: 4px 8px;
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 3px;
    display: inline-block;
  }
</style>
