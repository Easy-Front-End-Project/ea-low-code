import type { Ref } from 'vue'
import { computed } from 'vue'
import { useVariableStore } from '@/components/designer/stores/variable'
import { executeEvent, createExecutionContext } from '@/utils/eventExecutor'
import { resolveValue as resolveValueUtil } from '@/utils/schemaHelper'
import type { ComponentSchema, EventConfig } from '@/utils/schemaHelper'

interface UseComponentRenderOptions {
  skipSlot?: boolean
}

type EventListener = (event: Event) => Promise<void>

/**
 * 组件渲染 Composable
 * 提取 PreviewComponent 和 CanvasComponent 的公共渲染逻辑
 */
export function useComponentRender(component: Ref<ComponentSchema | undefined>, options: UseComponentRenderOptions = {}) {
  const variableStore = useVariableStore()
  const { skipSlot = false } = options

  /**
   * 解析值（处理变量绑定）
   * @param value - 原始值
   * @returns 解析后的值
   */
  function resolveValue(value: unknown): unknown {
    const context = createExecutionContext()

    return resolveValueUtil(
      value,
      variableStore.getVariableDefaultValue,
      (name: string) => variableStore.getVariableByName(name)?.type as string | undefined,
      context,
      ''
    )
  }

  /**
   * 解析组件属性
   * @param props - 组件属性
   * @returns 解析后的属性
   */
  function resolveComponentProps(props: Record<string, unknown> | undefined): Record<string, unknown> {
    const resolvedProps: Record<string, unknown> = {}

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
   * @param events - 事件配置列表
   * @returns 事件监听器对象
   */
  function createEventListeners(events: EventConfig[] | undefined): Record<string, EventListener> {
    const listeners: Record<string, EventListener> = {}

    if (!Array.isArray(events)) return listeners

    events.forEach(eventConfig => {
      const eventType = (eventConfig.eventType || eventConfig.type) as string | undefined
      if (!eventType) return

      const handler: EventListener = async event => {
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
  const resolvedChildrenText = computed<string>(() => {
    return (resolveValue(component.value?.props?.children) as string) || ''
  })

  const hasChildrenText = computed<boolean>(() => {
    return typeof resolvedChildrenText.value === 'string' && resolvedChildrenText.value.length > 0
  })

  const componentProps = computed<Record<string, unknown>>(() => {
    return resolveComponentProps(component.value?.props)
  })

  const componentEventListeners = computed<Record<string, EventListener>>(() => {
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
