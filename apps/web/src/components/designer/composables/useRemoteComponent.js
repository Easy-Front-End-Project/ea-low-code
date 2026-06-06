import { ref, computed, shallowRef, onMounted } from 'vue'
import { loadRemoteComponent } from '@/utils/loadRemoteComponent'
import { getRemoteComponentMetaList } from '@/components/designer/constants/componentMeta'

/**
 * 远程组件加载 Composable
 * @param {Object} component - 组件配置对象
 * @returns {Object} 远程组件相关状态和方法
 */
export function useRemoteComponent(component) {
  const remoteComponentLoader = shallowRef(null)
  const isLoading = ref(false)
  const error = ref(null)

  /** 是否为远程组件 */
  const isRemoteComponent = computed(() => {
    return component.type?.startsWith('remote-') || component.remoteConfig
  })

  /** 远程组件配置 */
  const remoteConfig = computed(() => {
    if (component.remoteConfig) return component.remoteConfig
    const remoteMetaList = getRemoteComponentMetaList()
    return remoteMetaList.find(m => m.type === component.type)?.remoteConfig
  })

  /** 加载远程组件样式 */
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

  /** 异步加载远程组件 */
  async function loadRemoteComponentAsync() {
    if (!isRemoteComponent.value || !remoteConfig.value) return

    isLoading.value = true
    error.value = null

    try {
      const { url, exportName, styleUrl } = remoteConfig.value
      if (styleUrl) loadRemoteComponentStyle(styleUrl)
      remoteComponentLoader.value = await loadRemoteComponent(url, exportName)
    } catch (err) {
      console.error('加载远程组件失败:', err)
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  // 组件挂载时加载远程组件
  onMounted(() => {
    if (isRemoteComponent.value) {
      loadRemoteComponentAsync()
    }
  })

  /** 组件标签（远程组件加载完成后返回加载的组件） */
  const componentTag = computed(() => {
    if (isRemoteComponent.value && remoteComponentLoader.value) {
      return remoteComponentLoader.value
    }
    return component.type
  })

  return {
    isRemoteComponent,
    remoteConfig,
    remoteComponentLoader,
    componentTag,
    isLoading,
    error,
    loadRemoteComponentAsync,
  }
}
