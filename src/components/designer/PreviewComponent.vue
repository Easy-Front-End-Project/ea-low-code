<template>
  <component
    :is="componentTag"
    ref="componentRef"
    v-bind="componentProps"
    :style="component.style"
    v-on="componentEventListeners"
  >
    <!-- 使用原生 slot 属性方式渲染子组件 -->
    <template v-if="hasNestedChildren">
      <template v-for="child in component.children" :key="child.id">
        <!-- 如果子组件有非默认 slot 属性，使用 div 包装并设置 slot 属性 -->
        <div
          v-if="child.props?.slot && child.props.slot !== 'default'"
          :slot="child.props.slot"
          style="display: contents"
        >
          <PreviewComponent :component="child" />
        </div>
        <!-- 默认插槽的子组件，不设置 slot 属性 -->
        <PreviewComponent v-else :component="child" />
      </template>
    </template>
    <template v-else-if="hasChildrenText">
      <ea-text type="normal" size="medium">{{ resolvedChildrenText }}</ea-text>
    </template>
    <template v-else-if="hasDefaultSlot">
      <ea-text type="normal" size="medium"
        >{{ componentProps.label || componentProps.title || '' }}</ea-text
      >
    </template>
  </component>
</template>

<script setup>
  import { computed, ref, onMounted, onBeforeUnmount, shallowRef } from 'vue'
  import { getComponentMeta, getRemoteComponentMetaList } from '@/constants/componentMeta'
  import { useVariableStore } from '@/stores/designer/variable'
  import { useComponentInstanceStore } from '@/stores/designer/componentInstance'
  import { loadRemoteComponent } from '@/utils/loadRemoteComponent'

  const props = defineProps({
    component: {
      type: Object,
      required: true,
    },
  })

  const variableStore = useVariableStore()
  const instanceStore = useComponentInstanceStore()
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
    const remoteMeta = remoteMetaList.find((m) => m.type === props.component.type)
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

  // 获取组件元数据（支持远程组件）
  const componentMeta = computed(() => {
    if (isRemoteComponent.value) {
      const remoteMetaList = getRemoteComponentMetaList()
      const remoteMeta = remoteMetaList.find((m) => m.type === props.component.type)
      if (remoteMeta) return remoteMeta
    }
    return getComponentMeta(props.component.type)
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

  // 传递给组件的 props（解析变量绑定，过滤掉 slot 属性）
  const componentProps = computed(() => {
    const rawProps = props.component.props || {}
    const resolvedProps = {}

    // 遍历所有属性，解析变量绑定，过滤掉 slot 属性
    for (const [key, value] of Object.entries(rawProps)) {
      if (key !== 'slot') {
        resolvedProps[key] = resolveValue(value)
      }
    }

    return resolvedProps
  })

  // 是否有默认插槽
  const hasDefaultSlot = computed(() => {
    return componentMeta.value?.slots?.some((slot) => slot.name === 'default')
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
          // 注入 $component 和 $vars 辅助函数到代码中
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
</script>

<style scoped>
  /* 预览模式下组件样式 */
  :deep(*) {
    /* display: contents; */
    pointer-events: auto;
  }
</style>
