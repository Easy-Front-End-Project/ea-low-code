import { computed } from 'vue'
import { useVariableStore } from '@/stores/designer/variable'
import { executeEvent, createExecutionContext } from '@/utils/eventExecutor'
import { resolveValue as resolveValueUtil } from '@/utils/schemaHelper'

/**
 * 组件渲染 Composable
 * 提取 PreviewComponent 和 CanvasComponent 的公共渲染逻辑
 */
export function useComponentRender(component, options = {}) {
  const variableStore = useVariableStore()
  const { skipSlot = false } = options

  /**
   * 解析值（处理变量绑定）
   * @param {*} value - 原始值
   * @returns {*} 解析后的值
   */
  function resolveValue(value) {
    const context = createExecutionContext()

    return resolveValueUtil(
      value,
      variableStore.getVariableDefaultValue,
      name => variableStore.getVariableByName(name)?.type,
      context,
      ''
    )
  }

  /**
   * 解析组件属性
   * @param {Object} props - 组件属性
   * @returns {Object} 解析后的属性
   */
  function resolveComponentProps(props) {
    const resolvedProps = {}

    for (const [key, value] of Object.entries(props || {})) {
      if (skipSlot && key === 'slot') continue
      if (key === 'children') continue

      // 处理 scope 属性，转换为 data-{scope} 形式
      if (key === 'scope' && value) {
        resolvedProps[`data-${value}`] = ''
      } else {
        resolvedProps[key] = resolveValue(value)
      }
    }

    return resolvedProps
  }

  /**
   * 创建组件事件监听器
   * @param {Array} events - 事件配置列表
   * @returns {Object} 事件监听器对象
   */
  function createEventListeners(events) {
    const listeners = {}

    if (!Array.isArray(events)) return listeners

    events.forEach(eventConfig => {
      const eventType = eventConfig.eventType || eventConfig.type
      if (!eventType) return

      const handler = async event => {
        await executeEvent(eventConfig, event)
      }

      if (listeners[eventType]) {
        const existingHandler = listeners[eventType]
        listeners[eventType] = async event => {
          await existingHandler(event)
          await handler(event)
        }
      } else {
        listeners[eventType] = handler
      }
    })

    return listeners
  }

  // 计算属性
  const resolvedChildrenText = computed(() => {
    return resolveValue(component.value?.props?.children) || ''
  })

  const hasChildrenText = computed(() => {
    return typeof resolvedChildrenText.value === 'string' && resolvedChildrenText.value.length > 0
  })

  const componentProps = computed(() => {
    return resolveComponentProps(component.value?.props)
  })

  const componentEventListeners = computed(() => {
    return createEventListeners(component.value?.events)
  })

  return {
    // 方法
    resolveValue,
    resolveComponentProps,
    createEventListeners,
    // 计算属性
    resolvedChildrenText,
    hasChildrenText,
    componentProps,
    componentEventListeners,
  }
}
