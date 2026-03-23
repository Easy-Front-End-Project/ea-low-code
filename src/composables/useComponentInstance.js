import { onMounted, onBeforeUnmount } from 'vue'
import { useComponentInstanceStore } from '@/stores/designer/componentInstance'
import { executeEvent } from '@/utils/eventExecutor'

/**
 * 组件实例管理 Composable
 * @param {Object} options - 配置选项
 * @param {string} options.componentId - 组件ID
 * @param {string} options.componentType - 组件类型
 * @param {Ref} options.componentRef - 组件引用
 * @param {Array} options.events - 组件事件配置列表
 */
export function useComponentInstance({ componentId, componentType, componentRef, events = [] }) {
  const instanceStore = useComponentInstanceStore()

  /**
   * 触发组件的 load 事件
   * 用于在组件加载完成后自动执行配置的动作（如接口请求）
   */
  function triggerLoadEvent() {
    const loadEvent = events?.find(e => e.eventType === 'load')
    if (loadEvent) {
      executeEvent(loadEvent, null)
    }
  }

  // 组件挂载时注册实例
  onMounted(() => {
    if (!componentRef.value) return

    const tagName = componentType

    // Web Components 需要等待自定义元素定义完成
    if (tagName?.startsWith('ea-')) {
      customElements.whenDefined(tagName).then(() => {
        const ref = componentRef.value
        if (!ref) return
        const element = ref.$el || ref
        if (element) {
          instanceStore.registerInstance(componentId, element)
          // 触发组件的 load 事件
          triggerLoadEvent()
        }
      })
    } else {
      instanceStore.registerInstance(componentId, componentRef.value)
      // 触发组件的 load 事件
      triggerLoadEvent()
    }
  })

  // 组件卸载时注销实例
  onBeforeUnmount(() => {
    instanceStore.unregisterInstance(componentId)
  })
}
