<template>
  <div
    class="canvas-component"
    :class="{
    'is-selected': selected && !isNonSelectable,
    'is-container': isContainer && !isNonSelectable,
    'is-non-container': isNonContainer && !isNonSelectable,
    'is-inline-block': isInlineBlock && !isNonSelectable,
    'is-drop-target': isDropTarget && !isNonSelectable,
    'is-non-selectable': isNonSelectable,
  }"
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
    <div
      v-if="showLabel && !isNonSelectable"
      class="component-label"
      part="low-code-component-label"
    >
      {{ componentMeta?.name || (isRemoteComponent ? '远程组件' : component.type) }}
    </div>

    <!-- slot 标签 -->
    <div
      v-if="props.component.props?.slot && props.component.props.slot !== 'default' && showLabel && !isNonSelectable"
      class="slot-label"
      part="low-code-slot-label"
    >
      slot: {{ props.component.props.slot }}
    </div>

    <!-- 操作按钮 -->
    <div
      v-if="selected && !isNonSelectable"
      class="component-actions"
      part="low-code-component-actions"
    >
      <ea-button
        icon="trash-can"
        type="danger"
        size="small"
        @click.stop="handleDelete"
        title="删除"
      >
      </ea-button>
      <ea-button icon="copy" size="small" @click.stop="handleCopy" title="复制"> </ea-button>
    </div>

    <!-- 组件 -->
    <div class="component-wrapper">
      <component
        :is="componentTag"
        ref="componentRef"
        v-bind="componentProps"
        :style="componentInnerStyle"
        v-on="componentEventListeners"
      >
        <!-- 文本内容 -->
        <template v-if="hasChildrenText"> {{ resolvedChildrenText }} </template>

        <!-- 子组件 -->
        <template v-else>
          <template v-for="child in allChildren" :key="child.id">
            <!-- 非可选择组件 -->
            <component
              v-if="isNonSelectableType(child.type, props.component.type)"
              :is="child.type"
              v-bind="getChildComponentProps(child)"
              style="display: block"
            >
              {{ child.childrenText }}
              <component
                v-for="grandChild in child.children || []"
                :key="grandChild.id"
                :is="grandChild.type"
                v-bind="getChildComponentProps(grandChild)"
                style="display: block"
              >
                {{ grandChild.childrenText }}
              </component>
            </component>

            <!-- 可选择组件 -->
            <div
              v-else
              :slot="child.props?.slot !== 'default' ? child.props.slot : undefined"
              style="display: contents"
            >
              <CanvasComponent
                :component="child"
                :selected="selectedComponentId === child.id"
                :parent-component="props.component"
                @select="$emit('select', $event)"
                @delete="$emit('delete', $event)"
                @drop-to-parent="$emit('drop-to-parent', $event)"
              />
            </div>
          </template>
        </template>
      </component>
    </div>

    <!-- 选中边框 -->
    <div v-if="selected && !isNonSelectable" class="selection-border"></div>
  </div>
</template>

<script setup>
  import { computed, ref, onMounted, onBeforeUnmount, shallowRef, defineOptions } from 'vue'

  defineOptions({
    name: 'CanvasComponent',
  })
  import { useSchemaStore } from '@/stores/designer/schema'
  import { useComponentInstanceStore } from '@/stores/designer/componentInstance'
  import { useVariableStore } from '@/stores/designer/variable'
  import { getComponentMeta, getRemoteComponentMetaList } from '@/constants/componentMeta'
  import { loadRemoteComponent } from '@/utils/loadRemoteComponent'
  import { executeEvent } from '@/utils/eventExecutor'

  const props = defineProps({
    component: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    parentComponent: {
      type: Object,
      default: null,
    },
  })

  const emit = defineEmits(['select', 'delete', 'drop-to-parent'])

  const schemaStore = useSchemaStore()
  const instanceStore = useComponentInstanceStore()
  const variableStore = useVariableStore()
  const isHovered = ref(false)
  const isDropTarget = ref(false)
  const dragCounter = ref(0)
  const componentRef = ref(null)
  const remoteComponentLoader = shallowRef(null)

  const selectedComponentId = computed(() => schemaStore.selectedComponentId)
  const componentMeta = computed(() => getComponentMeta(props.component.type))

  // 预定义的容器类型
  const containerTypes = [
    'ea-container',
    'ea-card',
    'ea-header',
    'ea-aside',
    'ea-main',
    'ea-dialog',
    'ea-space',
    'ea-row',
    'ea-col',
    'form',
    'ea-button-group',
  ]

  // 不可选中的组件类型（任何情况下都不可选中）
  const nonSelectableTypes = ['ea-option', 'ea-option-group', 'ea-radio']

  // 在特定父组件下不可选中的组件配置
  const nonSelectableInParent = [
    { childType: 'ea-checkbox', parentType: 'ea-checkbox-group' },
    {
      childType: 'ea-radio',
      parentType: 'ea-radio-group',
    },
    {
      childType: 'ea-option',
      parentType: 'ea-option-group',
    },
    {
      childType: 'ea-option-group',
      parentType: 'ea-select',
    },
    {
      childType: 'ea-option',
      parentType: 'ea-select',
    },
  ]

  // 非容器组件类型
  const nonContainerTypes = ['ea-checkbox-group', 'ea-radio-group', 'ea-tree']

  // 行内块级组件类型（如按钮、链接等）
  const inlineBlockTypes = [
    'ea-button',
    'ea-text',
    'ea-link',
    'ea-tag',
    'ea-check-tag',
    'ea-badge',
    'ea-avatar',
    'ea-dropdown',
    'ea-popconfirm',
    'ea-popover',
    'ea-tooltip',
  ]

  // 是否为不可选中的组件
  const isNonSelectable = computed(() => {
    // 基础不可选中类型
    if (nonSelectableTypes.includes(props.component.type)) {
      return true
    }

    // 检查是否在特定父组件下不可选中
    if (
      nonSelectableInParent.some(
        config =>
          config.childType === props.component.type &&
          config.parentType === props.parentComponent?.type
      )
    ) {
      return true
    }

    return false
  })

  // 检查组件类型是否为不可选中类型（用于渲染子组件时）
  function isNonSelectableType(type, parentType) {
    // 基础不可选中类型
    if (nonSelectableTypes.includes(type)) {
      return true
    }

    // 检查是否在特定父组件下不可选中
    if (
      nonSelectableInParent.some(
        config => config.childType === type && config.parentType === parentType
      )
    ) {
      return true
    }

    return false
  }

  // 解析组件 props（解析变量绑定）
  function resolveComponentProps(props, options = {}) {
    const { skipSlot = false } = options
    const resolvedProps = {}

    for (const [key, value] of Object.entries(props)) {
      if (skipSlot && key === 'slot') continue
      if (key === 'children') continue

      if (key === 'scope' && value) {
        resolvedProps[`data-${value}`] = ''
      } else {
        resolvedProps[key] = resolveValue(value)
      }
    }

    return resolvedProps
  }

  // 获取子组件的 props
  function getChildComponentProps(child) {
    return resolveComponentProps(child.props || {}, { skipSlot: true })
  }

  // 是否为远程组件
  const isRemoteComponent = computed(
    () => props.component.type?.startsWith('remote-') || props.component.remoteConfig
  )

  // 获取远程组件配置
  const remoteConfig = computed(() => {
    if (props.component.remoteConfig) {
      return props.component.remoteConfig
    }
    // 从本地存储查找
    const remoteMetaList = getRemoteComponentMetaList()
    const remoteMeta = remoteMetaList.find(m => m.type === props.component.type)
    return remoteMeta?.remoteConfig
  })

  // 组件标签名（Web Components 或远程组件）
  const componentTag = computed(() =>
    isRemoteComponent.value && remoteComponentLoader.value
      ? remoteComponentLoader.value
      : props.component.type
  )

  // 加载远程组件样式
  function loadRemoteComponentStyle(styleUrl) {
    if (!styleUrl) return
    // 检查样式是否已加载
    const existingLink = document.querySelector(`link[data-remote-style="${styleUrl}"]`)
    if (existingLink) return

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = styleUrl
    link.setAttribute('data-remote-style', styleUrl)
    document.head.appendChild(link)
  }

  // 加载远程组件
  async function loadRemoteComponentAsync() {
    if (!isRemoteComponent.value || !remoteConfig.value) return

    try {
      const { url, exportName, styleUrl } = remoteConfig.value

      if (styleUrl) {
        loadRemoteComponentStyle(styleUrl)
      }
      const loadedComponent = await loadRemoteComponent(url, exportName)
      remoteComponentLoader.value = loadedComponent
    } catch (error) {
      console.error('加载远程组件失败:', error)
    }
  }

  // 如果是远程组件，加载它
  onMounted(() => {
    if (isRemoteComponent.value) {
      loadRemoteComponentAsync()
    }
  })

  // 是否为容器组件（可放置其他组件）
  const isContainer = computed(() => {
    // 非容器组件类型，不能放置其他组件
    if (nonContainerTypes.includes(props.component.type)) {
      return false
    }

    // 如果组件有 children 且有子组件，则为容器
    if (Array.isArray(props.component.children) && props.component.children.length > 0) {
      return true
    }

    // 如果组件类型在预定义容器列表中，直接返回 true
    if (containerTypes.includes(props.component.type)) {
      return true
    }

    // 如果组件有 slots 定义（除了空的 slots 数组），也视为容器
    const metaSlots = componentMeta.value?.slots
    if (metaSlots && metaSlots.length > 0) {
      return true
    }

    return false
  })

  // 是否为非容器组件（需要特殊样式处理）
  const isNonContainer = computed(() => {
    return nonContainerTypes.includes(props.component.type)
  })

  // 是否为行内块级组件
  const isInlineBlock = computed(() => {
    return inlineBlockTypes.includes(props.component.type)
  })

  // 解析值（处理变量绑定）
  function resolveValue(value) {
    // 如果是变量绑定格式 { type: 'variable', value: 'varName' }
    if (value && typeof value === 'object' && value.type === 'variable') {
      const varValue = variableStore.getVariableDefaultValue(value.value)
      return varValue !== undefined ? varValue : ''
    }
    return value
  }

  // 传递给组件的 props
  const componentProps = computed(() => resolveComponentProps(props.component.props || {}))

  // 是否显示标签
  const showLabel = computed(() => isHovered.value || props.selected)

  // 获取所有子组件
  const allChildren = computed(() => props.component.children || [])

  // 组件事件监听器（动态绑定）
  const componentEventListeners = computed(() => {
    const listeners = {}
    const events = props.component.events || []

    events.forEach(eventConfig => {
      const eventType = eventConfig.eventType || eventConfig.type
      if (!listeners[eventType]) {
        listeners[eventType] = event => {
          executeEventHandler(eventConfig, event)
        }
      } else {
        // 如果已经有同类型事件，创建组合处理器
        const existingHandler = listeners[eventType]
        listeners[eventType] = event => {
          existingHandler(event)
          executeEventHandler(eventConfig, event)
        }
      }
    })

    return listeners
  })

  // 外层容器样式
  const componentStyle = computed(() => ({
    position: props.component.style?.position === 'absolute' ? 'absolute' : 'relative',
  }))

  // 内部 EA-UI 组件样式（所有样式 + CSS 变量）
  const componentInnerStyle = computed(() => ({
    ...props.component.style,
    ...props.component.cssVariables,
  }))

  // 解析后的 children 文本
  const resolvedChildrenText = computed(() => resolveValue(props.component.props?.children) || '')

  // 是否有 children 文本属性
  const hasChildrenText = computed(() => resolvedChildrenText.value.length > 0)

  // 点击组件（选中）
  function handleClick() {
    if (isNonSelectable.value) {
      return
    }
    emit('select', props.component.id)
  }

  // 执行事件
  function executeEventHandler(eventConfig, originalEvent) {
    executeEvent(eventConfig, originalEvent)
  }

  // 注册组件实例
  onMounted(() => {
    if (componentRef.value) {
      // 等待 Web Components 定义完成
      const tagName = props.component.type
      if (tagName && tagName.startsWith('ea-')) {
        customElements.whenDefined(tagName).then(() => {
          // 获取实际的 DOM 元素
          const ref = componentRef.value
          if (!ref) return
          const element = ref.$el || ref
          if (element) {
            instanceStore.registerInstance(props.component.id, element)
          }
        })
      } else {
        instanceStore.registerInstance(props.component.id, componentRef.value)
      }
    }
  })

  // 注销组件实例
  onBeforeUnmount(() => {
    instanceStore.unregisterInstance(props.component.id)
  })

  // 删除组件
  function handleDelete() {
    emit('delete', props.component.id)
  }

  // 复制组件
  function handleCopy() {
    // TODO: 实现复制功能
    console.log('复制组件:', props.component.id)
  }

  // 拖拽悬停（仅容器组件处理）
  function handleDragOver(event) {
    if (!isContainer.value || isNonSelectable.value) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }

  // 拖拽进入
  function handleDragEnter(event) {
    if (!isContainer.value || isNonSelectable.value) return
    event.preventDefault()
    dragCounter.value++
    if (dragCounter.value === 1) {
      isDropTarget.value = true
    }
  }

  // 拖拽离开
  function handleDragLeave() {
    if (!isContainer.value || isNonSelectable.value) return
    dragCounter.value--
    if (dragCounter.value === 0) {
      isDropTarget.value = false
    }
  }

  // 放置组件到容器
  function handleDrop(event) {
    if (!isContainer.value || isNonSelectable.value) return
    event.preventDefault()

    dragCounter.value = 0
    isDropTarget.value = false

    const data = event.dataTransfer.getData('application/json')
    if (!data) return

    try {
      const droppedComponentMeta = JSON.parse(data)

      // 1. 检查拖放的组件是否是当前组件的专用子组件
      const allowedChildTypes = componentMeta.value?.childComponents || []
      const isDedicatedChild = allowedChildTypes.includes(droppedComponentMeta.type)

      // 2. 获取组件定义的 defaultSlot
      const defaultSlot = componentMeta.value?.defaultSlot || 'default'

      // 3. 如果定义了 childComponents 列表，且不是专用子组件，但组件有 defaultSlot 配置，则允许拖入到 defaultSlot
      if (allowedChildTypes.length > 0 && !isDedicatedChild && defaultSlot === 'default') {
        console.warn(
          `组件 ${droppedComponentMeta.type} 不允许拖入到 ${props.component.type}，只允许: ${allowedChildTypes.join(', ')}`
        )
        return
      }

      // 向上冒泡，让父组件处理放置逻辑
      emit('drop-to-parent', {
        componentMeta: droppedComponentMeta,
        parentId: props.component.id,
        slotName: defaultSlot,
      })
    } catch (error) {
      console.error('拖拽放置到容器失败:', error)
    }
  }
</script>

<style lang="scss" scoped>
  .canvas-component {
    position: relative;
    display: inline-flex;
    margin: 4px;
    transition: all 0.2s ease;

    min-width: 15px;
    min-height: 15px;

    // 基础容器样式
    &.is-container,
    &.is-non-container,
    &.is-inline-block {
      border: 1px dashed #d1d5db;
      border-radius: 4px;

      &:hover {
        border-color: #3b82f6;
        background-color: rgba(59, 130, 246, 0.05);
      }
    }

    &.is-container {
      display: block;
      padding: 8px;
    }

    &.is-non-container {
      display: block;
      padding: 8px;
      min-width: 120px;
      min-height: 40px;
    }

    &.is-inline-block {
      display: inline-flex;
      padding: 4px;
    }

    &.is-drop-target {
      border-color: #10b981;
      background-color: rgba(16, 185, 129, 0.1);
      border-style: solid;
    }
  }

  .component-label {
    position: absolute;
    top: 0;
    left: 0;
    padding: 2px 6px;
    background-color: #3b82f6;
    color: white;
    font-size: 11px;
    line-height: 16px;
    border-radius: 3px;
    white-space: nowrap;
    transform: translate(-25%, -100%);
    z-index: 100;
  }

  .slot-label {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 2px 6px;
    background-color: #10b981;
    color: white;
    font-size: 10px;
    line-height: 14px;
    border-radius: 3px;
    white-space: nowrap;
    transform: translate(25%, 100%);
    z-index: 100;
  }

  .component-actions {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    gap: 4px;
    z-index: 100;
    transform: translate(25%, -75%);
  }

  .component-wrapper {
    position: relative;
    cursor: pointer;

    ea-time-picker,
    ea-date-picker,
    ea-slider,
    ea-select,
    ea-rate,
    ea-switch,
    ea-transfer,
    ea-image {
      pointer-events: none;
    }

    ea-carousel {
      display: block;

      & > .canvas-component {
        width: 100%;
        height: 100%;
        flex: 0 0 100%;
      }
    }

    ea-descriptions,
    ea-table {
      &::part(default-slot) {
        display: block;
      }

      &::part(low-code-component-label),
      &::part(low-code-component-actions),
      &::part(low-code-slot-label) {
        display: none;
      }
    }

    ea-tag {
      &::part(close-icon) {
        pointer-events: none;
      }
    }

    ea-alert {
      &::part(close-btn) {
        pointer-events: none;
      }
    }

    ea-tab-panel {
      display: block;
    }
  }

  /* 插槽内容包装器 */
  :deep(.slot-content-wrapper) {
    display: contents;
  }

  /* 插槽占位符样式 */
  :deep(.slot-placeholder) {
    color: #9ca3af;
    font-size: 12px;
    padding: 4px 8px;
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 3px;
    display: inline-block;
  }

  .selection-border {
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

  /* 不可选中的组件样式 */
  .canvas-component {
    &.is-non-selectable {
      pointer-events: none;
      display: contents;

      .component-wrapper {
        pointer-events: auto;
        display: contents;
      }
    }
  }
</style>
