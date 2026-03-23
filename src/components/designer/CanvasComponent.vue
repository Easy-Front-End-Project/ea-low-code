<template>
  <!-- 自定义样式 -->
  <component :is="'style'" v-if="processedCustomCSS">{{ processedCustomCSS }}</component>
  <div
    class="canvas-component"
    :class="{
      'canvas-component--selected': selected && !isNonSelectable,
      'canvas-component--container': isContainer && !isNonSelectable,
      'canvas-component--non-container': isNonContainer && !isNonSelectable,
      'canvas-component--inline-block': isInlineBlock && !isNonSelectable,
      'canvas-component--drop-target': isDropTarget && !isNonSelectable,
      'canvas-component--non-selectable': isNonSelectable,
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
      class="canvas-component__label"
      part="low-code-component-label"
    >
      {{ componentMeta?.name || (isRemoteComponent ? '远程组件' : component.type) }}
    </div>

    <!-- slot 标签 -->
    <div
      v-if="props.component.props?.slot && props.component.props.slot !== 'default' && showLabel && !isNonSelectable"
      class="canvas-component__slot-label"
      part="low-code-slot-label"
    >
      slot: {{ props.component.props.slot }}
    </div>

    <!-- 操作按钮 -->
    <div
      v-if="selected && !isNonSelectable"
      class="canvas-component__actions"
      part="low-code-component-actions"
    >
      <ea-button
        icon="trash-can"
        type="danger"
        size="small"
        @click.stop="handleDelete"
        title="删除"
      ></ea-button>
      <ea-button icon="copy" size="small" @click.stop="handleCopy" title="复制"></ea-button>
    </div>

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
    <div v-if="selected && !isNonSelectable" class="canvas-component__selection-border"></div>
  </div>
</template>

<script setup>
  import { computed, ref, onMounted, onBeforeUnmount, shallowRef, defineOptions } from 'vue'
  import { useSchemaStore } from '@/stores/designer/schema'
  import { useComponentInstanceStore } from '@/stores/designer/componentInstance'
  import { useVariableStore } from '@/stores/designer/variable'
  import { getComponentMeta, getRemoteComponentMetaList } from '@/constants/componentMeta'
  import { loadRemoteComponent } from '@/utils/loadRemoteComponent'
  import { executeEvent } from '@/utils/eventExecutor'
  import { processCustomCSS } from '@/utils/cssProcessor'

  defineOptions({ name: 'CanvasComponent' })

  const props = defineProps({
    component: { type: Object, required: true },
    selected: { type: Boolean, default: false },
    parentComponent: { type: Object, default: null },
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

  const nonSelectableTypes = ['ea-option', 'ea-option-group', 'ea-radio']

  const nonSelectableInParent = [
    { childType: 'ea-checkbox', parentType: 'ea-checkbox-group' },
    { childType: 'ea-radio', parentType: 'ea-radio-group' },
    { childType: 'ea-option', parentType: 'ea-option-group' },
    { childType: 'ea-option-group', parentType: 'ea-select' },
    { childType: 'ea-option', parentType: 'ea-select' },
  ]

  const nonContainerTypes = ['ea-checkbox-group', 'ea-radio-group', 'ea-tree']

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

  const isNonSelectable = computed(() => {
    if (nonSelectableTypes.includes(props.component.type)) return true
    return nonSelectableInParent.some(
      config =>
        config.childType === props.component.type &&
        config.parentType === props.parentComponent?.type
    )
  })

  function isNonSelectableType(type, parentType) {
    if (nonSelectableTypes.includes(type)) return true
    return nonSelectableInParent.some(
      config => config.childType === type && config.parentType === parentType
    )
  }

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

  function getChildComponentProps(child) {
    return resolveComponentProps(child.props || {}, { skipSlot: true })
  }

  const isRemoteComponent = computed(
    () => props.component.type?.startsWith('remote-') || props.component.remoteConfig
  )

  const remoteConfig = computed(() => {
    if (props.component.remoteConfig) return props.component.remoteConfig
    const remoteMetaList = getRemoteComponentMetaList()
    return remoteMetaList.find(m => m.type === props.component.type)?.remoteConfig
  })

  const componentTag = computed(() =>
    isRemoteComponent.value && remoteComponentLoader.value
      ? remoteComponentLoader.value
      : props.component.type
  )

  function loadRemoteComponentStyle(styleUrl) {
    if (!styleUrl) return
    const existingLink = document.querySelector(`link[data-remote-style="${styleUrl}"]`)
    if (existingLink) return

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = styleUrl
    link.setAttribute('data-remote-style', styleUrl)
    document.head.appendChild(link)
  }

  async function loadRemoteComponentAsync() {
    if (!isRemoteComponent.value || !remoteConfig.value) return

    try {
      const { url, exportName, styleUrl } = remoteConfig.value
      if (styleUrl) loadRemoteComponentStyle(styleUrl)
      remoteComponentLoader.value = await loadRemoteComponent(url, exportName)
    } catch (error) {
      console.error('加载远程组件失败:', error)
    }
  }

  onMounted(() => {
    if (isRemoteComponent.value) loadRemoteComponentAsync()
  })

  const isContainer = computed(() => {
    if (nonContainerTypes.includes(props.component.type)) return false
    if (Array.isArray(props.component.children) && props.component.children.length > 0) return true
    if (containerTypes.includes(props.component.type)) return true
    const metaSlots = componentMeta.value?.slots
    return metaSlots && metaSlots.length > 0
  })

  const isNonContainer = computed(() => nonContainerTypes.includes(props.component.type))

  const isInlineBlock = computed(() => inlineBlockTypes.includes(props.component.type))

  function resolveValue(value) {
    if (value && typeof value === 'object' && value.type === 'variable') {
      return variableStore.getVariableDefaultValue(value.value) ?? ''
    }
    return value
  }

  const componentProps = computed(() => resolveComponentProps(props.component.props || {}))

  const showLabel = computed(() => isHovered.value || props.selected)

  const allChildren = computed(() => props.component.children || [])

  const componentEventListeners = computed(() => {
    const listeners = {}
    const events = props.component.events || []

    events.forEach(eventConfig => {
      const eventType = eventConfig.eventType || eventConfig.type
      if (!listeners[eventType]) {
        listeners[eventType] = event => executeEventHandler(eventConfig, event)
      } else {
        const existingHandler = listeners[eventType]
        listeners[eventType] = event => {
          existingHandler(event)
          executeEventHandler(eventConfig, event)
        }
      }
    })

    return listeners
  })

  const componentStyle = computed(() => props.component.positionStyle || {})

  const componentInnerStyle = computed(() => {
    // eslint-disable-next-line no-unused-vars
    const { position, top, right, bottom, left, zIndex, overflow, ...restStyle } =
      props.component.style || {}
    return { ...restStyle, ...props.component.cssVariables }
  })

  const customClassName = computed(() =>
    props.component.customCSS ? `custom-${props.component.id}` : ''
  )

  const processedCustomCSS = computed(() => {
    if (!props.component.customCSS) return ''
    return processCustomCSS(props.component.customCSS, props.component.id)
  })

  const resolvedChildrenText = computed(() => resolveValue(props.component.props?.children) || '')

  const hasChildrenText = computed(() => resolvedChildrenText.value.length > 0)

  function handleClick() {
    if (isNonSelectable.value) return
    emit('select', props.component.id)
  }

  function executeEventHandler(eventConfig, originalEvent) {
    executeEvent(eventConfig, originalEvent)
  }

  onMounted(() => {
    if (!componentRef.value) return
    const tagName = props.component.type

    if (tagName?.startsWith('ea-')) {
      customElements.whenDefined(tagName).then(() => {
        const ref = componentRef.value
        if (!ref) return
        const element = ref.$el || ref
        if (element) instanceStore.registerInstance(props.component.id, element)
      })
    } else {
      instanceStore.registerInstance(props.component.id, componentRef.value)
    }
  })

  onBeforeUnmount(() => {
    instanceStore.unregisterInstance(props.component.id)
  })

  function handleDelete() {
    emit('delete', props.component.id)
  }

  function handleCopy() {
    console.log('复制组件:', props.component.id)
  }

  function handleDragOver(event) {
    if (!isContainer.value || isNonSelectable.value) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }

  function handleDragEnter(event) {
    if (!isContainer.value || isNonSelectable.value) return
    event.preventDefault()
    dragCounter.value++
    if (dragCounter.value === 1) isDropTarget.value = true
  }

  function handleDragLeave() {
    if (!isContainer.value || isNonSelectable.value) return
    dragCounter.value--
    if (dragCounter.value === 0) isDropTarget.value = false
  }

  function handleDrop(event) {
    if (!isContainer.value || isNonSelectable.value) return
    event.preventDefault()

    dragCounter.value = 0
    isDropTarget.value = false

    const data = event.dataTransfer.getData('application/json')
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

    &__label {
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

    &__slot-label {
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

    &__actions {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      align-items: center;
      gap: 4px;
      z-index: 100;
      transform: translate(25%, -75%);
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
