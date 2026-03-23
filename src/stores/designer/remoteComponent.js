import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { generateUniqueId } from '@/utils/schemaHelper'

const REMOTE_CONFIG_KEY = 'ea_lowcode_remote_config'

/**
 * 远程组件配置管理 Store
 * 用于管理远程组件的本地配置信息
 */
export const useRemoteComponentStore = defineStore('remoteComponent', () => {
  // State
  const globalUrl = ref('')
  const components = ref([])
  const isLoaded = ref(false)

  // Getters
  const enabledComponents = computed(() => components.value.filter(comp => comp.enabled !== false))

  /**
   * 获取完整 URL
   * @param {string} url - 相对或绝对 URL
   * @returns {string} 完整 URL
   */
  function getFullUrl(url) {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) return url

    const base = globalUrl.value
    if (!base) return url

    const normalizedBase = base.endsWith('/') ? base : base + '/'
    const normalizedUrl = url.startsWith('/') ? url.slice(1) : url
    return normalizedBase + normalizedUrl
  }

  const enabledComponentMetaList = computed(() =>
    enabledComponents.value.map(comp => ({
      type: `remote-${comp.id}`,
      name: comp.name || '远程组件',
      category: 'remote',
      icon: comp.icon || 'Link',
      isRemote: true,
      remoteConfig: {
        id: comp.id,
        url: getFullUrl(comp.url),
        styleUrl: comp.styleUrl || '',
        exportName: comp.exportName,
      },
      props: comp.props || [],
      events: comp.events || [],
      slots: comp.slots || [{ name: 'default', label: '默认插槽' }],
    }))
  )

  const componentCount = computed(() => components.value.length)
  const enabledCount = computed(() => enabledComponents.value.length)

  /**
   * 加载配置
   */
  function loadConfig() {
    try {
      const stored = localStorage.getItem(REMOTE_CONFIG_KEY)
      if (stored) {
        const config = JSON.parse(stored)
        globalUrl.value = config.globalUrl || ''
        components.value = config.components || []
      }
    } catch (error) {
      console.error('加载远程组件配置失败:', error)
      globalUrl.value = ''
      components.value = []
    }
    isLoaded.value = true
  }

  /**
   * 保存配置
   * @returns {boolean} 是否保存成功
   */
  function saveConfig() {
    try {
      const config = {
        globalUrl: globalUrl.value,
        components: components.value,
        lastUpdated: Date.now(),
      }
      localStorage.setItem(REMOTE_CONFIG_KEY, JSON.stringify(config))
      return true
    } catch (error) {
      console.error('保存远程组件配置失败:', error)
      throw error
    }
  }

  /**
   * 设置全局 URL
   * @param {string} url - 全局 URL
   */
  function setGlobalUrl(url) {
    globalUrl.value = url
  }

  /**
   * 添加组件
   * @param {Object} component - 组件配置
   * @returns {Object} 新组件
   */
  function addComponent(component) {
    const newComponent = {
      ...component,
      id: generateUniqueId('remote'),
      enabled: true,
    }
    components.value.push(newComponent)
    return newComponent
  }

  /**
   * 更新组件
   * @param {string} id - 组件ID
   * @param {Object} data - 更新数据
   * @returns {boolean} 是否更新成功
   */
  function updateComponent(id, data) {
    const index = components.value.findIndex(c => c.id === id)
    if (index > -1) {
      components.value[index] = { ...components.value[index], ...data }
      return true
    }
    return false
  }

  /**
   * 删除组件
   * @param {string} id - 组件ID
   * @returns {boolean} 是否删除成功
   */
  function removeComponent(id) {
    const index = components.value.findIndex(c => c.id === id)
    if (index > -1) {
      components.value.splice(index, 1)
      return true
    }
    return false
  }

  /**
   * 切换组件启用状态
   * @param {string} id - 组件ID
   * @param {boolean} enabled - 是否启用
   * @returns {boolean} 是否切换成功
   */
  function toggleComponentEnabled(id, enabled) {
    const component = components.value.find(c => c.id === id)
    if (component) {
      component.enabled = enabled
      return true
    }
    return false
  }

  /**
   * 根据 ID 获取组件
   * @param {string} id - 组件ID
   * @returns {Object|null} 组件对象
   */
  function getComponentById(id) {
    return components.value.find(c => c.id === id) || null
  }

  /**
   * 重置配置
   */
  function resetConfig() {
    globalUrl.value = ''
    components.value = []
    saveConfig()
  }

  return {
    globalUrl,
    components,
    isLoaded,
    enabledComponents,
    enabledComponentMetaList,
    componentCount,
    enabledCount,
    loadConfig,
    saveConfig,
    setGlobalUrl,
    addComponent,
    updateComponent,
    removeComponent,
    toggleComponentEnabled,
    getComponentById,
    resetConfig,
  }
})
