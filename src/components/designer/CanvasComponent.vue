<template>
  <div class="canvas-component" :class="{
    'is-selected': selected && !isNonSelectable,
    'is-container': isContainer && !isNonSelectable,
    'is-non-container': isNonContainer && !isNonSelectable,
    'is-inline-block': isInlineBlock && !isNonSelectable,
    'is-drop-target': isDropTarget && !isNonSelectable,
    'is-non-selectable': isNonSelectable,
  }" :style="componentStyle" @click.stop.prevent="handleClick" @mouseover.stop="handleMouseOver"
    @mouseout.stop="handleMouseOut" @dragover.stop="handleDragOver" @drop.stop="handleDrop"
    @dragenter.stop="handleDragEnter" @dragleave.stop="handleDragLeave">
    <!-- 组件标签 -->
    <div v-if="showLabel && !isNonSelectable" class="component-label" part="low-code-component-label">
      {{ componentMeta?.name || (isRemoteComponent ? '远程组件' : component.type) }}
    </div>

    <!-- 选中时的操作按钮 -->
    <div v-if="selected && !isNonSelectable" class="component-actions" part="low-code-component-actions">
      <ea-button icon="icon-trash-empty" type="danger" size="small" @click.stop="handleDelete" title="删除">
      </ea-button>
      <ea-button icon="icon-link" size="small" @click.stop="handleCopy" title="复制"> </ea-button>
    </div>

    <!-- 组件渲染 -->
    <div class="component-wrapper">
      <component :is="componentTag" ref="componentRef" v-bind="componentProps" :style="componentInnerStyle"
        v-on="componentEventListeners">
        <!-- 使用原生 slot 属性方式渲染子组件 -->
        <template v-if="allChildren.length > 0">
          <template v-for="child in allChildren" :key="child.id">
            <template v-if="isNonSelectableType(child.type, props.component.type)">
              <component :is="child.type" v-bind="getChildComponentProps(child)" style="display: block">
                <template v-if="child.childrenText"> {{ child.childrenText }} </template>

                <template v-if="child.children && child.children.length > 0">
                  <component v-for="grandChild in child.children" :key="grandChild.id" :is="grandChild.type"
                    v-bind="getChildComponentProps(grandChild)" style="display: block">
                    <template v-if="grandChild.childrenText">
                      {{ grandChild.childrenText }}
                    </template>
                  </component>
                </template>
              </component>
            </template>
            <div v-else-if="child.props?.slot && child.props.slot !== 'default'" :slot="child.props.slot"
              style="display: contents">
              <CanvasComponent :component="child" :selected="selectedComponentId === child.id"
                :parent-component="props.component" @select="$emit('select', $event)" @delete="$emit('delete', $event)"
                @drop-to-parent="$emit('drop-to-parent', $event)" />
            </div>
            <!-- 默认插槽的子组件，不设置 slot 属性 -->
            <CanvasComponent v-else :component="child" :selected="selectedComponentId === child.id"
              :parent-component="props.component" @select="$emit('select', $event)" @delete="$emit('delete', $event)"
              @drop-to-parent="$emit('drop-to-parent', $event)" />
          </template>
        </template>
        <template v-else-if="hasChildrenText">
          <ea-text type="normal" size="medium">{{ resolvedChildrenText }}</ea-text>
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
const nonContainerTypes = ['ea-checkbox-group', 'ea-radio-group']

// 行内块级组件类型（如按钮、链接等）
const inlineBlockTypes = ['ea-button', 'ea-text', 'ea-link', 'ea-tag', 'ea-badge', 'ea-avatar']

// 是否为不可选中的组件
const isNonSelectable = computed(() => {
  // 基础不可选中类型
  if (nonSelectableTypes.includes(props.component.type)) {
    return true
  }

  // 检查是否在特定父组件下不可选中
  if (
    nonSelectableInParent.some(
      (config) =>
        config.childType === props.component.type &&
        config.parentType === props.parentComponent?.type,
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
      (config) => config.childType === type && config.parentType === parentType,
    )
  ) {
    return true
  }

  return false
}

// 获取子组件的 props（解析变量绑定）
function getChildComponentProps(child) {
  const childProps = child.props || {}
  const resolvedProps = {}

  // 遍历所有属性，解析变量绑定
  for (const [key, value] of Object.entries(childProps)) {
    // 跳过 slot 属性
    if (key === 'slot') continue
    resolvedProps[key] = resolveValue(value)
  }

  return resolvedProps
}

// 是否为远程组件
const isRemoteComponent = computed(() => {
  return props.component.type?.startsWith('remote-') || props.component.remoteConfig
})

// 获取远程组件配置
const remoteConfig = computed(() => {
  if (props.component.remoteConfig) {
    return props.component.remoteConfig
  }
  // 从本地存储查找
  const remoteMetaList = getRemoteComponentMetaList()
  const remoteMeta = remoteMetaList.find((m) => m.type === props.component.type)
  return remoteMeta?.remoteConfig
})

// 组件标签名（Web Components 或远程组件）
const componentTag = computed(() => {
  if (isRemoteComponent.value && remoteComponentLoader.value) {
    return remoteComponentLoader.value
  }
  return props.component.type
})

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

  // 检查父组件的 childConfig 配置
  if (props.parentComponent) {
    const parentMeta = getComponentMeta(props.parentComponent.type)
    const childConfig = parentMeta?.childConfig?.[props.component.type]
    if (childConfig && childConfig.allowChildren === false) {
      return false
    }
  }

  // 如果组件有 children 且有子组件，则为容器
  if (Array.isArray(props.component.children) && props.component.children.length > 0) {
    return true
  }

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

// 传递给组件的 props（解析变量绑定）
const componentProps = computed(() => {
  const componentProps = props.component.props || {}
  const resolvedProps = {}

  // 遍历所有属性，解析变量绑定
  for (const [key, value] of Object.entries(componentProps)) {
    resolvedProps[key] = resolveValue(value)
  }

  return resolvedProps
})

// 是否显示标签
const showLabel = computed(() => isHovered.value || props.selected)

// 获取组件可用的所有插槽
const availableSlots = computed(() => {
  // 从组件元数据获取插槽定义
  const metaSlots = componentMeta.value?.slots || []

  // 如果没有定义插槽，默认提供 default 插槽
  if (metaSlots.length === 0) {
    return [{ name: 'default', label: '默认插槽' }]
  }

  return metaSlots
})

// 获取所有子组件
const allChildren = computed(() => {
  return props.component.children || []
})

// 组件事件监听器（动态绑定）
const componentEventListeners = computed(() => {
  const listeners = {}
  const events = props.component.events || []

  events.forEach((eventConfig) => {
    const eventType = eventConfig.type
    if (!listeners[eventType]) {
      listeners[eventType] = (event) => {
        executeEvent(eventConfig, event)
      }
    } else {
      // 如果已经有同类型事件，创建组合处理器
      const existingHandler = listeners[eventType]
      listeners[eventType] = (event) => {
        existingHandler(event)
        executeEvent(eventConfig, event)
      }
    }
  })

  return listeners
})

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

// 内部 EA-UI 组件样式
const componentInnerStyle = computed(() => {
  const cssVariables = props.component.cssVariables || {}
  const style = props.component.style || {}

  const { ...rest } = style

  return {
    ...rest,
    ...cssVariables,
  }
})

// 是否有 children 文本属性（字符串形式的 children）
const hasChildrenText = computed(() => {
  const childrenValue = resolveValue(props.component.props?.children)
  return typeof childrenValue === 'string' && childrenValue.length > 0
})

// 解析后的 children 文本
const resolvedChildrenText = computed(() => {
  return resolveValue(props.component.props?.children) || ''
})

// 点击组件（选中）
function handleClick() {
  if (isNonSelectable.value) {
    return
  }
  emit('select', props.component.id)
}

// 执行事件
function executeEvent(eventConfig, originalEvent) {
  if (eventConfig.action === 'message') {
    // 显示提示消息
    if (window.$message && eventConfig.message) {
      window.$message.success(eventConfig.message)
    } else {
      alert(eventConfig.message || '提示消息')
    }
  } else if (eventConfig.action === 'custom') {
    // 执行自定义代码
    if (eventConfig.code) {
      try {
        // 注入 $component、$vars 和 $event 辅助函数到代码中
        const wrappedCode = `
            const $component = {
              get: (id) => instanceStore.getComponentElement(id),
              setProp: (id, prop, value) => instanceStore.setComponentProp(id, prop, value),
              getProp: (id, prop) => instanceStore.getComponentProp(id, prop),
              call: (id, method, ...args) => instanceStore.callComponentMethod(id, method, ...args)
            };
            const $vars = {
              get: (name) => variableStore.getVariableDefaultValue(name),
              set: (name, value) => variableStore.updateVariableByName(name, { defaultValue: value })
            };
            const $event = event;
            ${eventConfig.code}
          `
        const fn = new Function('event', 'instanceStore', 'variableStore', wrappedCode)
        fn(originalEvent, instanceStore, variableStore)
      } catch (error) {
        console.error('执行自定义事件失败:', error)
        if (window.$message) {
          window.$message.error('事件执行失败: ' + error.message)
        }
      }
    }
  } else if (eventConfig.action === 'callMethod') {
    // 调用组件方法
    if (eventConfig.targetComponentId && eventConfig.methodName) {
      instanceStore.callComponentMethod(
        eventConfig.targetComponentId,
        eventConfig.methodName,
        ...(eventConfig.methodArgs || []),
      )
    }
  } else if (eventConfig.action === 'setProp') {
    // 设置组件属性
    if (eventConfig.targetComponentId && eventConfig.propName !== undefined) {
      // 解析变量绑定值
      const resolvedValue = resolveValue(eventConfig.propValue)
      instanceStore.setComponentProp(
        eventConfig.targetComponentId,
        eventConfig.propName,
        resolvedValue,
      )
    }
  }
}

// 注册组件实例
onMounted(() => {
  if (componentRef.value) {
    // 等待 Web Components 定义完成
    const tagName = props.component.type
    if (tagName && tagName.startsWith('ea-')) {
      customElements.whenDefined(tagName).then(() => {
        // 获取实际的 DOM 元素
        const element = componentRef.value.$el || componentRef.value
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

    // 获取容器的所有插槽
    const allSlots = availableSlots.value
    const namedSlots = allSlots.filter((slot) => slot.name !== 'default')

    // 确定目标插槽
    let targetSlot = 'default'

    // 1. 检查拖放的组件是否是当前组件的专用子组件
    const allowedChildTypes = componentMeta.value?.childComponents || []
    const isDedicatedChild = allowedChildTypes.includes(droppedComponentMeta.type)

    // 2. 如果是专用子组件，优先放入 default 插槽
    if (isDedicatedChild) {
      targetSlot = 'default'
    }
    // 3. 如果有非默认插槽且不是专用子组件，默认使用第一个非默认插槽
    else if (namedSlots.length > 0) {
      targetSlot = namedSlots[0].name
    }

    // 4. 检查 childConfig 中的 allowedChildTypes 限制
    const childConfig = componentMeta.value?.childConfig?.[droppedComponentMeta.type]
    if (childConfig?.allowedChildTypes !== undefined) {
      const isAllowed = childConfig.allowedChildTypes.includes(droppedComponentMeta.type)
      if (!isAllowed) {
        console.warn(`组件 ${droppedComponentMeta.type} 不允许拖入到 ${props.component.type}`)
        return
      }
    }

    // 向上冒泡，让父组件处理放置逻辑
    emit('drop-to-parent', {
      componentMeta: droppedComponentMeta,
      parentId: props.component.id,
      slotName: targetSlot,
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

  &.is-container {
    display: block;
    padding: 8px;
    border: 1px dashed #d1d5db;
    border-radius: 4px;

    &:hover {
      border-color: #3b82f6;
      background-color: rgba(59, 130, 246, 0.05);
    }
  }

  &.is-non-container {
    display: block;
    padding: 8px;
    min-width: 120px;
    min-height: 40px;
    border: 1px dashed #d1d5db;
    border-radius: 4px;

    &:hover {
      border-color: #3b82f6;
      background-color: rgba(59, 130, 246, 0.05);
    }
  }

  &.is-inline-block {
    display: inline-flex;
    padding: 4px;
    border: 1px dashed #d1d5db;
    border-radius: 4px;

    &:hover {
      border-color: #3b82f6;
      background-color: rgba(59, 130, 246, 0.05);
    }
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
}

.component-wrapper {

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

    &>.canvas-component {
      width: 100%;
      height: 100%;
      flex: 0 0 100%;
    }
  }

  ea-descriptions {
    &::part(default-slot) {
      display: block;
    }

    &::part(low-code-component-label),
    &::part(low-code-component-actions) {
      display: none;
    }
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
}

.selection-border::before {
  content: '';
  position: absolute;
  inset: -4px;
  border: 1px dashed rgba(59, 130, 246, 0.3);
  border-radius: 6px;
}

/* 不可选中的组件样式 */
.canvas-component.is-non-selectable {
  pointer-events: none;
  display: contents;
}

.canvas-component.is-non-selectable .component-wrapper {
  pointer-events: auto;
  display: contents;
}
</style>
