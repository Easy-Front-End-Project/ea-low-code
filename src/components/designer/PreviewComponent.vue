<template>
  <component
    :is="componentTag"
    ref="componentRef"
    v-bind="componentProps"
    :style="component.style"
    v-on="componentEventListeners"
  >
    <template v-if="hasNestedChildren">
      <template v-for="child in component.children" :key="child.id">
        <div
          v-if="child.props?.slot && child.props.slot !== 'default'"
          :slot="child.props.slot"
          style="display: contents"
        >
          <PreviewComponent :component="child" />
        </div>

        <PreviewComponent v-else :component="child" />
      </template>
    </template>
    <template v-else-if="component.childrenText"> {{ component.childrenText }} </template>
    <template v-else-if="hasChildrenText">
      <ea-text type="normal" size="medium">{{ resolvedChildrenText }}</ea-text>
    </template>
  </component>
</template>

<script setup>
  import { computed, ref, onMounted, shallowRef } from 'vue'
  import { getRemoteComponentMetaList } from '@/constants/componentMeta'
  import { useVariableStore } from '@/stores/designer/variable'
  import { loadRemoteComponent } from '@/utils/loadRemoteComponent'
  import { executeEvent } from '@/utils/eventExecutor'
  import { useComponentInstance } from '@/composables/useComponentInstance'

  const props = defineProps({
    component: {
      type: Object,
      required: true,
    },
  })

  const variableStore = useVariableStore()
  const componentRef = ref(null)

  // 是否为远程组件
  const isRemoteComponent = computed(() => {
    return props.component.type?.startsWith('remote-') || props.component.isRemote
  })

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

  const remoteComponentLoader = shallowRef(null)

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

  // 是否有嵌套子组件（数组形式的 children）
  const hasNestedChildren = computed(() => {
    return Array.isArray(props.component.children) && props.component.children.length > 0
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

  // 是否有 children 文本属性（字符串形式的 children）
  const hasChildrenText = computed(() => {
    const childrenValue = resolveValue(props.component.props?.children)
    return typeof childrenValue === 'string' && childrenValue.length > 0
  })

  // 解析后的 children 文本
  const resolvedChildrenText = computed(() => {
    return resolveValue(props.component.props?.children) || ''
  })

  // 传递给组件的 props（解析变量绑定，过滤掉 slot 和 children 属性）
  const componentProps = computed(() => {
    const rawProps = props.component.props || {}
    const resolvedProps = {}

    // 遍历所有属性，解析变量绑定，过滤掉 slot 和 children 属性
    for (const [key, value] of Object.entries(rawProps)) {
      if (key === 'slot' || key === 'children') continue
      // 处理 scope 属性，转换为 data-{scope} 形式
      if (key === 'scope' && value) {
        resolvedProps[`data-${value}`] = ''
      } else {
        resolvedProps[key] = resolveValue(value)
      }
    }

    return resolvedProps
  })

  // 组件事件监听器（动态绑定）
  const componentEventListeners = computed(() => {
    const listeners = {}
    const events = props.component.events || []

    events.forEach(eventConfig => {
      const eventType = eventConfig.eventType || eventConfig.type
      if (!listeners[eventType]) {
        listeners[eventType] = async event => {
          await executeEventHandler(eventConfig, event)
        }
      } else {
        // 如果已经有同类型事件，创建组合处理器
        const existingHandler = listeners[eventType]
        listeners[eventType] = async event => {
          await existingHandler(event)
          await executeEventHandler(eventConfig, event)
        }
      }
    })

    return listeners
  })

  // 执行事件
  async function executeEventHandler(eventConfig, originalEvent) {
    await executeEvent(eventConfig, originalEvent)
  }

  // 使用 composable 管理组件实例（包含 load 事件触发逻辑）
  useComponentInstance({
    componentId: props.component.id,
    componentType: props.component.type,
    componentRef,
    events: props.component.events,
  })
</script>

<style scoped>
  /* 预览模式下组件样式 */
  :deep(*) {
    /* display: contents; */
    pointer-events: auto;
  }
</style>
