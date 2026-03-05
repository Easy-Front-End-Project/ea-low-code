import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

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
  const enabledComponents = computed(() => {
    return components.value.filter((comp) => comp.enabled !== false)
  })

  // 获取完整 URL（拼接 globalUrl 和相对路径）
  function getFullUrl(url) {
    if (!url) return ''
    // 如果已经是完整 URL，直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    // 拼接 globalUrl 和相对路径
    const base = globalUrl.value || ''
    if (!base) return url
    // 确保 base 以 / 结尾，url 不以 / 开头
    const normalizedBase = base.endsWith('/') ? base : base + '/'
    const normalizedUrl = url.startsWith('/') ? url.slice(1) : url
    return normalizedBase + normalizedUrl
  }

  const enabledComponentMetaList = computed(() => {
    return enabledComponents.value.map((comp) => ({
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
  })

  const componentCount = computed(() => components.value.length)
  const enabledCount = computed(() => enabledComponents.value.length)

  // Actions

  /**
   * 从 localStorage 加载配置
   */
  function loadConfig() {
    try {
      const stored = localStorage.getItem(REMOTE_CONFIG_KEY)
      if (stored) {
        const config = JSON.parse(stored)
        globalUrl.value = config.globalUrl || ''
        components.value = config.components || []
      } else {
        globalUrl.value = ''
        components.value = []
      }
      isLoaded.value = true
    } catch (error) {
      console.error('加载远程组件配置失败:', error)
      globalUrl.value = ''
      components.value = []
      isLoaded.value = true
    }
  }

  /**
   * 保存配置到 localStorage
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
   * @param {string} url
   */
  function setGlobalUrl(url) {
    globalUrl.value = url
  }

  /**
   * 添加组件
   * @param {Object} component
   */
  function addComponent(component) {
    const newComponent = {
      ...component,
      id: Date.now().toString() + Math.random(),
      enabled: true,
    }
    components.value.push(newComponent)
    return newComponent
  }

  /**
   * 更新组件
   * @param {string} id
   * @param {Object} data
   */
  function updateComponent(id, data) {
    const index = components.value.findIndex((c) => c.id === id)
    if (index > -1) {
      components.value[index] = { ...components.value[index], ...data }
      return true
    }
    return false
  }

  /**
   * 删除组件
   * @param {string} id
   */
  function removeComponent(id) {
    const index = components.value.findIndex((c) => c.id === id)
    if (index > -1) {
      components.value.splice(index, 1)
      return true
    }
    return false
  }

  /**
   * 切换组件启用状态
   * @param {string} id
   * @param {boolean} enabled
   */
  function toggleComponentEnabled(id, enabled) {
    const component = components.value.find((c) => c.id === id)
    if (component) {
      component.enabled = enabled
      return true
    }
    return false
  }

  /**
   * 获取组件 by id
   * @param {string} id
   */
  function getComponentById(id) {
    return components.value.find((c) => c.id === id) || null
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
    // State
    globalUrl,
    components,
    isLoaded,

    // Getters
    enabledComponents,
    enabledComponentMetaList,
    componentCount,
    enabledCount,

    // Actions
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
