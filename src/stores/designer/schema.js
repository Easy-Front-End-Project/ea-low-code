import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateComponentId } from '@/utils/schemaHelper'

/**
 * Schema 管理 Store
 * 管理页面 Schema 的状态和操作
 */
export const useSchemaStore = defineStore('schema', () => {
  // State
  const pageSchema = ref({
    version: '1.0',
    meta: {
      title: '未命名页面',
      description: '',
      viewport: { width: 1920, height: 1080, overflow: 'auto' },
    },
    // 页面级设置
    settings: {},
    components: [],
  })

  const selectedComponentId = ref(null)
  const isPreviewMode = ref(false)
  // 组件别名映射：alias -> componentId
  const componentAliasMap = ref(new Map())

  // Getters
  const components = computed(() => pageSchema.value.components)
  const aliases = computed(() => Object.fromEntries(componentAliasMap.value))
  const selectedComponent = computed(() =>
    findComponentById(pageSchema.value.components, selectedComponentId.value)
  )
  const componentCount = computed(() => countComponents(pageSchema.value.components))

  // Actions
  /**
   * 查找父组件
   * @param {string} componentId - 子组件ID
   * @returns {Object|null} 父组件对象，如果没有找到则返回 null
   */
  function findParentComponent(componentId) {
    function findParent(components, targetId, parent = null) {
      for (const component of components) {
        if (component.id === targetId) return parent
        if (component.children?.length) {
          const result = findParent(component.children, targetId, component)
          if (result) return result
        }
      }
      return null
    }
    return findParent(pageSchema.value.components, componentId)
  }

  /**
   * 添加组件
   * @param {string} type - 组件类型
   * @param {Object} props - 组件属性
   * @param {string} parentId - 父组件ID（可选）
   * @returns {Object} 创建的组件
   */
  function addComponent(type, props = {}, parentId = null) {
    // 从 props 中提取 slot 属性，默认为 'default'
    const { slot = 'default', ...otherProps } = props

    // 只有当 slot 不是 'default' 时才添加到 props 中
    const componentProps = slot === 'default' ? otherProps : { slot, ...otherProps }

    const newComponent = {
      id: generateComponentId(),
      type,
      props: componentProps,
      style: {},
      events: [],
      children: [],
    }

    if (parentId) {
      const parent = findComponentById(pageSchema.value.components, parentId)
      if (parent) {
        parent.children ??= []
        parent.children.push(newComponent)
      }
    } else {
      pageSchema.value.components.push(newComponent)
    }

    return newComponent
  }

  /**
   * 删除组件
   * @param {string} componentId - 组件ID
   */
  function removeComponent(componentId) {
    // 清理别名映射
    const alias = getComponentAlias(componentId)
    if (alias) {
      removeComponentAlias(alias)
    }

    if (removeComponentById(pageSchema.value.components, componentId)) {
      if (selectedComponentId.value === componentId) {
        selectedComponentId.value = null
      }
    }
  }

  /**
   * 更新组件属性
   * @param {string} componentId - 组件ID
   * @param {Object} newProps - 新属性
   */
  function updateComponentProps(componentId, newProps) {
    const component = findComponentById(pageSchema.value.components, componentId)
    if (component) {
      component.props = { ...component.props, ...newProps }
    }
  }

  /**
   * 更新组件样式
   * @param {string} componentId - 组件ID
   * @param {Object} style - 新样式
   * @param {string} styleType - 样式类型：'inline' | 'cssVariable' | 'position' | 'customCSS'
   */
  function updateComponentStyle(componentId, style, styleType = 'inline') {
    const component = findComponentById(pageSchema.value.components, componentId)
    if (!component) return

    const styleMap = {
      cssVariable: 'cssVariables',
      position: 'positionStyle',
      customCSS: 'customCSS',
      inline: 'style',
    }

    const targetKey = styleMap[styleType]

    if (styleType === 'customCSS') {
      // 自定义 CSS 直接存储为字符串
      component.customCSS = style
    } else {
      // 其他样式类型存储在对应的对象中
      component[targetKey] ??= {}
      Object.assign(component[targetKey], style)
    }
  }

  /**
   * 更新组件事件
   * @param {string} componentId - 组件ID
   * @param {Array} events - 新事件配置
   */
  function updateComponentEvents(componentId, events) {
    const component = findComponentById(pageSchema.value.components, componentId)
    if (component) component.events = events
  }

  /**
   * 更新组件插槽 Scope 绑定
   * @param {string} componentId - 组件ID
   * @param {Object} scopeBindings - Scope 绑定配置
   */
  function updateComponentScopeBindings(componentId, scopeBindings) {
    const component = findComponentById(pageSchema.value.components, componentId)
    if (component) component.scopeBindings = scopeBindings
  }

  /**
   * 更新组件子组件
   * @param {string} componentId - 组件ID
   * @param {Array} children - 新子组件列表
   */
  function updateComponentChildren(componentId, children) {
    const component = findComponentById(pageSchema.value.components, componentId)
    if (component) component.children = children
  }

  /**
   * 移动组件
   * @param {string} componentId - 组件ID
   * @param {number} newIndex - 新位置索引
   * @param {string} newParentId - 新父组件ID（可选）
   */
  function moveComponent(componentId, newIndex, newParentId = null) {
    const component = findComponentById(pageSchema.value.components, componentId)
    if (!component) return

    // 从原位置移除
    removeComponentById(pageSchema.value.components, componentId)

    // 添加到新位置
    if (newParentId) {
      const newParent = findComponentById(pageSchema.value.components, newParentId)
      if (newParent) {
        newParent.children ??= []
        newParent.children.splice(newIndex, 0, component)
      }
    } else {
      pageSchema.value.components.splice(newIndex, 0, component)
    }
  }

  /**
   * 选中组件
   * @param {string} componentId - 组件ID
   */
  function selectComponent(componentId) {
    selectedComponentId.value = componentId
  }

  /**
   * 清除选中
   */
  function clearSelection() {
    selectedComponentId.value = null
  }

  /**
   * 设置预览模式
   * @param {boolean} value - 是否预览模式
   */
  function setPreviewMode(value) {
    isPreviewMode.value = value
  }

  /**
   * 更新页面元数据
   * @param {Object} meta - 元数据
   */
  function updatePageMeta(meta) {
    pageSchema.value.meta = { ...pageSchema.value.meta, ...meta }
  }

  /**
   * 更新页面设置
   * @param {Object} settings - 设置对象
   */
  function updatePageSettings(settings) {
    pageSchema.value.settings = { ...pageSchema.value.settings, ...settings }
  }

  /**
   * 导入 Schema
   * @param {Object} schema - Schema 对象
   */
  function importSchema(schema) {
    pageSchema.value = schema
    selectedComponentId.value = null
    // 重建别名映射
    componentAliasMap.value.clear()
    function rebuildAliasMap(components) {
      for (const comp of components) {
        if (comp.alias) {
          componentAliasMap.value.set(comp.alias, comp.id)
        }
        if (comp.children?.length) {
          rebuildAliasMap(comp.children)
        }
      }
    }
    rebuildAliasMap(schema.components || [])
  }

  /**
   * 导出 Schema
   * @returns {Object} Schema 对象
   */
  function exportSchema() {
    return JSON.parse(JSON.stringify(pageSchema.value))
  }

  /**
   * 清空画布
   */
  function clearCanvas() {
    pageSchema.value.components = []
    selectedComponentId.value = null
  }

  // Helper functions
  /**
   * 根据 ID 查找组件
   * @param {Array} components - 组件列表
   * @param {string} id - 组件ID
   * @returns {Object|null} 组件对象
   */
  function findComponentById(components, id) {
    for (const comp of components) {
      if (comp.id === id) return comp
      // 在 children 中查找
      if (comp.children?.length) {
        const found = findComponentById(comp.children, id)
        if (found) return found
      }
    }
    return null
  }

  /**
   * 根据 ID 删除组件
   * @param {Array} components - 组件列表
   * @param {string} id - 组件ID
   * @returns {boolean} 是否删除成功
   */
  function removeComponentById(components, id) {
    for (let i = 0; i < components.length; i++) {
      if (components[i].id === id) {
        components.splice(i, 1)
        return true
      }
      // 从 children 中删除
      if (components[i].children?.length) {
        if (removeComponentById(components[i].children, id)) return true
      }
    }
    return false
  }

  /**
   * 统计组件数量
   * @param {Array} components - 组件列表
   * @returns {number} 组件总数
   */
  function countComponents(components) {
    return components.reduce((count, comp) => {
      const childCount = comp.children?.length ? countComponents(comp.children) : 0
      return count + 1 + childCount
    }, 0)
  }

  /**
   * 设置组件别名
   * @param {string} componentId - 组件ID
   * @param {string} alias - 别名
   */
  function setComponentAlias(componentId, alias) {
    // 如果别名已存在，先移除旧的映射
    for (const [key, value] of componentAliasMap.value) {
      if (value === componentId) {
        componentAliasMap.value.delete(key)
        break
      }
    }
    // 设置新的别名映射
    if (alias) {
      componentAliasMap.value.set(alias, componentId)
    }
    // 更新组件的 alias 字段
    const component = findComponentById(pageSchema.value.components, componentId)
    if (component) {
      component.alias = alias
    }
  }

  /**
   * 根据别名获取组件ID
   * @param {string} alias - 别名
   * @returns {string|null} 组件ID
   */
  function getComponentIdByAlias(alias) {
    return componentAliasMap.value.get(alias) || null
  }

  /**
   * 根据别名查找组件
   * @param {string} alias - 别名
   * @returns {Object|null} 组件对象
   */
  function findComponentByAlias(alias) {
    const componentId = getComponentIdByAlias(alias)
    return componentId ? findComponentById(pageSchema.value.components, componentId) : null
  }

  /**
   * 获取组件别名
   * @param {string} componentId - 组件ID
   * @returns {string|null} 别名
   */
  function getComponentAlias(componentId) {
    const component = findComponentById(pageSchema.value.components, componentId)
    return component?.alias || null
  }

  /**
   * 移除组件别名
   * @param {string} alias - 别名
   */
  function removeComponentAlias(alias) {
    componentAliasMap.value.delete(alias)
  }

  return {
    // State
    pageSchema,
    selectedComponentId,
    isPreviewMode,
    componentAliasMap,
    // Getters
    components,
    selectedComponent,
    componentCount,
    aliases,
    // Actions
    addComponent,
    removeComponent,
    updateComponentProps,
    updateComponentStyle,
    updateComponentEvents,
    updateComponentScopeBindings,
    updateComponentChildren,
    moveComponent,
    selectComponent,
    clearSelection,
    setPreviewMode,
    updatePageMeta,
    updatePageSettings,
    importSchema,
    exportSchema,
    clearCanvas,
    findParentComponent,
    setComponentAlias,
    getComponentIdByAlias,
    findComponentByAlias,
    getComponentAlias,
    removeComponentAlias,
  }
})
