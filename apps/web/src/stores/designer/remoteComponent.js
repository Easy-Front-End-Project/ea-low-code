import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as componentApi from '@/api/component'

export const useRemoteComponentStore = defineStore('remoteComponent', () => {
  const globalUrl = ref('')
  const components = ref([])
  const urlPresets = ref([])
  const isLoaded = ref(false)

  const enabledComponents = computed(() => components.value.filter(comp => comp.enabled !== false))

  function getFullUrl(component) {
    const { url, urlPresetId } = component

    if (!url) return ''

    if (url.startsWith('http://') || url.startsWith('https://')) return url

    if (urlPresetId) {
      const preset = urlPresets.value.find(p => p.id === urlPresetId)
      if (preset && preset.url) {
        const base = preset.url.endsWith('/') ? preset.url : `${preset.url}/`
        const path = url.startsWith('/') ? url.slice(1) : url
        return base + path
      }
    }

    const defaultPreset = urlPresets.value.find(p => p.isDefault)
    if (defaultPreset && defaultPreset.url) {
      const base = defaultPreset.url.endsWith('/') ? defaultPreset.url : `${defaultPreset.url}/`
      const path = url.startsWith('/') ? url.slice(1) : url
      return base + path
    }

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
        url: getFullUrl(comp),
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
  const defaultUrlPreset = computed(() => urlPresets.value.find(p => p.isDefault) || null)
  const urlPresetCount = computed(() => urlPresets.value.length)

  async function loadConfig() {
    try {
      const [componentsResult, presetsResult] = await Promise.all([
        componentApi.getComponentList(),
        componentApi.getUrlPresetList(),
      ])

      components.value = componentsResult.list || []
      urlPresets.value = presetsResult || []
      isLoaded.value = true
    } catch (error) {
      console.error('加载远程组件配置失败:', error)
      isLoaded.value = true
    }
  }

  async function saveConfig() {
    // 后端自动保存，无需手动保存
  }

  function setGlobalUrl(url) {
    globalUrl.value = url
  }

  async function addComponent(componentData) {
    const result = await componentApi.createComponent(componentData)
    await loadConfig()
    return result
  }

  async function updateComponent(id, data) {
    await componentApi.updateComponent({ id: Number(id), ...data })
    await loadConfig()
  }

  async function removeComponent(id) {
    await componentApi.deleteComponent(Number(id))
    await loadConfig()
  }

  async function toggleComponentEnabled(id, enabled) {
    await componentApi.toggleComponentEnabled(Number(id), enabled)
    await loadConfig()
  }

  function getComponentById(id) {
    return components.value.find(c => c.id == id) || null
  }

  async function fetchComponentDetail(id) {
    const detail = await componentApi.getComponentDetail(Number(id))
    const existingIndex = components.value.findIndex(c => c.id === detail.id)
    if (existingIndex >= 0) {
      components.value[existingIndex] = detail
    } else {
      components.value.push(detail)
    }
    return detail
  }

  async function addUrlPreset(presetData) {
    const result = await componentApi.createUrlPreset(presetData)
    await loadConfig()
    return result
  }

  async function updateUrlPreset(id, data) {
    await componentApi.updateUrlPreset({ id: Number(id), ...data })
    await loadConfig()
  }

  async function removeUrlPreset(id) {
    await componentApi.deleteUrlPreset(Number(id))
    await loadConfig()
  }

  async function setDefaultUrlPreset(id) {
    await componentApi.setDefaultUrlPreset(Number(id))
    await loadConfig()
  }

  function getUrlPresetById(id) {
    return urlPresets.value.find(p => p.id == id) || null
  }

  function resetConfig() {
    globalUrl.value = ''
    components.value = []
    urlPresets.value = []
  }

  return {
    globalUrl,
    components,
    urlPresets,
    isLoaded,
    enabledComponents,
    enabledComponentMetaList,
    componentCount,
    enabledCount,
    defaultUrlPreset,
    urlPresetCount,
    loadConfig,
    saveConfig,
    setGlobalUrl,
    addComponent,
    updateComponent,
    removeComponent,
    toggleComponentEnabled,
    getComponentById,
    fetchComponentDetail,
    addUrlPreset,
    updateUrlPreset,
    removeUrlPreset,
    setDefaultUrlPreset,
    getUrlPresetById,
    resetConfig,
    getFullUrl,
  }
})
