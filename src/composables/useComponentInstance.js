import { onMounted, onBeforeUnmount } from 'vue'
import { useComponentInstanceStore } from '@/stores/designer/componentInstance'

/**
 * 组件实例管理 Composable
 * @param {Object} options - 配置选项
 * @param {string} options.componentId - 组件ID
 * @param {string} options.componentType - 组件类型
 * @param {Ref} options.componentRef - 组件引用
 */
export function useComponentInstance({ componentId, componentType, componentRef }) {
  const instanceStore = useComponentInstanceStore()

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
        if (element) instanceStore.registerInstance(componentId, element)
      })
    } else {
      instanceStore.registerInstance(componentId, componentRef.value)
    }
  })

  // 组件卸载时注销实例
  onBeforeUnmount(() => {
    instanceStore.unregisterInstance(componentId)
  })
}
