import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as componentApi from '@/api/component'

export const useRemoteComponentStore = defineStore('remoteComponent', () => {
  const globalUrl = ref('')
  const components = ref<any[]>([])
  const urlPresets = ref<any[]>([])
  const keyword = ref('')
  const currentPage = ref(1)
  const pageSize = ref(12)

  const enabledComponents = computed(() => components.value.filter(comp => comp.enabled !== false))

  function getFullUrl(component: any): string {
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
  const total = computed(() => components.value.length)
  const pageCount = computed(() => Math.ceil(total.value / pageSize.value) || 1)

  const paginatedComponents = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return components.value.slice(start, start + pageSize.value)
  })

  const hasComponents = computed(() => total.value > 0)

  const defaultUrlPreset = computed(() => urlPresets.value.find(p => p.isDefault) || null)
  const urlPresetCount = computed(() => urlPresets.value.length)

  async function loadConfig(searchKeyword?: string) {
    try {
      const kw = searchKeyword ?? keyword.value
      const [componentsResult, presetsResult] = await Promise.all([
        componentApi.getComponentList(kw?.trim() || undefined),
        componentApi.getUrlPresetList(),
      ])

      components.value = componentsResult.list || []
      urlPresets.value = presetsResult || []
    } catch (error) {
      console.error('加载远程组件配置失败:', error)
    }
  }

  function setGlobalUrl(url: string) {
    globalUrl.value = url
  }

  async function addComponent(componentData: Record<string, any>) {
    const result = await componentApi.createComponent(componentData)
    await loadConfig()
    return result
  }

  async function updateComponent(id: number, data: Record<string, any>) {
    await componentApi.updateComponent({ id: Number(id), ...data })
    await loadConfig()
  }

  async function removeComponent(id: number) {
    await componentApi.deleteComponent(Number(id))
    await loadConfig()
  }

  async function toggleComponentEnabled(id: number, enabled: boolean) {
    await componentApi.toggleComponentEnabled(Number(id), enabled)
    await loadConfig()
  }

  function getComponentById(id: number): any {
    return components.value.find(c => c.id == id) || null
  }

  async function fetchComponentDetail(id: number) {
    const detail = await componentApi.getComponentDetail(Number(id))
    const existingIndex = components.value.findIndex(c => c.id === detail.id)
    if (existingIndex >= 0) {
      components.value[existingIndex] = detail
    } else {
      components.value.push(detail)
    }
    return detail
  }

  async function addUrlPreset(presetData: Record<string, any>) {
    const result = await componentApi.createUrlPreset(presetData)
    await loadConfig()
    return result
  }

  async function updateUrlPreset(id: number, data: Record<string, any>) {
    await componentApi.updateUrlPreset({ id: Number(id), ...data })
    await loadConfig()
  }

  async function removeUrlPreset(id: number) {
    await componentApi.deleteUrlPreset(Number(id))
    await loadConfig()
  }

  async function setDefaultUrlPreset(id: number) {
    await componentApi.setDefaultUrlPreset(Number(id))
    await loadConfig()
  }

  function getUrlPresetById(id: number): any {
    return urlPresets.value.find(p => p.id == id) || null
  }

  function setKeyword(value: string) {
    keyword.value = value
    currentPage.value = 1
  }

  function setPage(page: number) {
    currentPage.value = page
  }

  function setPageSize(size: number) {
    pageSize.value = size
    currentPage.value = 1
  }

  function reset() {
    globalUrl.value = ''
    components.value = []
    urlPresets.value = []
    keyword.value = ''
    currentPage.value = 1
  }

  return {
    globalUrl,
    components,
    urlPresets,
    keyword,
    currentPage,
    pageSize,
    enabledComponents,
    enabledComponentMetaList,
    componentCount,
    enabledCount,
    total,
    pageCount,
    paginatedComponents,
    hasComponents,
    defaultUrlPreset,
    urlPresetCount,
    loadConfig,
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
    setKeyword,
    setPage,
    setPageSize,
    reset,
    getFullUrl,
  }
})
