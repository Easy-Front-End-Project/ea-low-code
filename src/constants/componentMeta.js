import { ComponentCategories } from './types'
import { basicComponents } from './meta/basicComponents'
import { dataComponents } from './meta/dataComponents'
import { feedbackComponents } from './meta/feedbackComponents'
import { formComponents } from './meta/formComponents'
import { layoutComponents } from './meta/layoutComponents'
import { navigationComponents } from './meta/navigationComponents'
import { projectComponents } from './meta/projectComponents'

// 远程组件配置存储（本地存储）
const REMOTE_CONFIG_KEY = 'ea_lowcode_remote_config'

// 组件元数据配置
export const componentMetaList = [
  ...basicComponents,
  ...formComponents,
  ...dataComponents,
  ...navigationComponents,
  ...feedbackComponents,
  ...layoutComponents,
]

// 所有组件元数据（包含项目级组件）
export const allComponentMetaList = [...componentMetaList, ...projectComponents]

// 根据分类获取组件
export function getComponentsByCategory(category) {
  return componentMetaList.filter(comp => comp.category === category)
}

// 根据类型获取组件元数据（包含项目级组件）
export function getComponentMeta(type) {
  const meta = allComponentMetaList.find(comp => comp.type === type)

  if (!meta) return null

  const slots = meta.slots || [{ name: 'default', label: '默认插槽' }]

  return {
    ...meta,
    slots,
  }
}

// 获取所有分类
export function getCategories() {
  return Object.entries(ComponentCategories).map(([key, value]) => ({
    key,
    value,
    label: getCategoryLabel(value),
  }))
}

// 获取分类标签
function getCategoryLabel(category) {
  const labels = {
    [ComponentCategories.BASIC]: '基础组件',
    [ComponentCategories.FORM]: '表单组件',
    [ComponentCategories.DATA]: '数据展示',
    [ComponentCategories.NAVIGATION]: '导航组件',
    [ComponentCategories.FEEDBACK]: '反馈组件',
    [ComponentCategories.LAYOUT]: '布局组件',
    [ComponentCategories.REMOTE]: '远程组件',
  }
  return labels[category] || category
}

/**
 * 获取完整 URL（拼接 globalUrl 和相对路径）
 * @param {string} url - 组件 URL
 * @param {string} globalUrl - 基础 URL
 * @returns {string} 完整 URL
 */
function getFullUrl(url, globalUrl) {
  if (!url) return ''
  // 如果已经是完整 URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // 拼接 globalUrl 和相对路径
  const base = globalUrl || ''
  if (!base) return url
  // 确保 base 以 / 结尾，url 不以 / 开头
  const normalizedBase = base.endsWith('/') ? base : base + '/'
  const normalizedUrl = url.startsWith('/') ? url.slice(1) : url
  return normalizedBase + normalizedUrl
}

/**
 * 获取存储的远程组件配置
 * @returns {Object} 远程组件配置对象 { globalUrl, components }
 */
export function getRemoteConfig() {
  try {
    const stored = localStorage.getItem(REMOTE_CONFIG_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    /* empty */
  }
  return { globalUrl: '', components: [] }
}

/**
 * 获取存储的远程组件列表
 * @returns {Array} 远程组件配置列表
 */
export function getRemoteComponents() {
  return getRemoteConfig().components || []
}

/**
 * 保存远程组件配置
 * @param {Array} components 远程组件配置列表
 */
export function saveRemoteComponents(components) {
  const config = getRemoteConfig()
  config.components = components
  localStorage.setItem(REMOTE_CONFIG_KEY, JSON.stringify(config))
}

/**
 * 添加远程组件
 * @param {Object} component 远程组件配置
 */
export function addRemoteComponent(component) {
  const config = getRemoteConfig()
  config.components.push({
    id: Date.now().toString(),
    ...component,
    category: ComponentCategories.REMOTE,
  })
  localStorage.setItem(REMOTE_CONFIG_KEY, JSON.stringify(config))
}

/**
 * 删除远程组件
 * @param {string} id 组件ID
 */
export function removeRemoteComponent(id) {
  const config = getRemoteConfig()
  config.components = config.components.filter(c => c.id !== id)
  localStorage.setItem(REMOTE_CONFIG_KEY, JSON.stringify(config))
}

/**
 * 获取所有远程组件的元数据（包含本地存储的）
 * @returns {Array} 远程组件元数据列表
 */
export function getRemoteComponentMetaList() {
  const config = getRemoteConfig()
  const remoteComponents = config.components || []
  return remoteComponents.map(comp => ({
    type: `remote-${comp.id}`,
    name: comp.name || '远程组件',
    category: ComponentCategories.REMOTE,
    icon: comp.icon || 'Link',
    isRemote: true,
    remoteConfig: {
      id: comp.id,
      url: getFullUrl(comp.url, config.globalUrl),
      styleUrl: comp.styleUrl || '',
      exportName: comp.exportName,
    },
    props: comp.props || [],
    events: comp.events || [],
    slots: comp.slots || [{ name: 'default', label: '默认插槽' }],
  }))
}
