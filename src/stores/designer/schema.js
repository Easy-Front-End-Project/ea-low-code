import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { uniqueId } from 'lodash-es'

/**
 * Schema 管理 Store
 * 管理页面 Schema 的状态和操作
 */
export const useSchemaStore = defineStore('schema', () => {
  // State
  const pageSchema = ref({
    version: '1.0',
    components: [],
    layout: {
      type: 'absolute', // absolute | flex | grid
      config: {},
    },
    meta: {
      title: '未命名页面',
      description: '',
      viewport: {
        width: 1920,
        height: 1080,
        overflow: 'auto',
      },
    },
  })

  const selectedComponentId = ref(null)
  const isPreviewMode = ref(false)

  // Getters
  const components = computed(() => pageSchema.value.components)
  const selectedComponent = computed(() => {
    return findComponentById(pageSchema.value.components, selectedComponentId.value)
  })
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
        if (component.id === targetId) {
          return parent
        }
        if (component.children && component.children.length > 0) {
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
    const componentProps = slot === 'default' ? { ...otherProps } : { slot, ...otherProps }

    const newComponent = {
      id: uniqueId('comp_'),
      type,
      props: componentProps,
      style: {},
      events: [],
      children: [],
    }

    if (parentId) {
      const parent = findComponentById(pageSchema.value.components, parentId)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
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
    const result = removeComponentById(pageSchema.value.components, componentId)
    if (result && selectedComponentId.value === componentId) {
      selectedComponentId.value = null
    }
  }

  /**
   * 更新组件属性
   * @param {string} componentId - 组件ID
   * @param {Object} props - 新属性
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
   * @param {string} styleType - 样式类型：'inline' | 'cssVariable'
   */
  function updateComponentStyle(componentId, style, styleType = 'inline') {
    const component = findComponentById(pageSchema.value.components, componentId)
    if (component) {
      if (styleType === 'cssVariable') {
        // CSS 变量样式存储在单独的字段中
        if (!component.cssVariables) {
          component.cssVariables = {}
        }
        Object.assign(component.cssVariables, style)
      } else {
        // 普通内联样式
        if (!component.style) {
          component.style = {}
        }
        Object.assign(component.style, style)
      }
    }
  }

  /**
   * 更新组件事件
   * @param {string} componentId - 组件ID
   * @param {Array} events - 新事件配置
   */
  function updateComponentEvents(componentId, events) {
    const component = findComponentById(pageSchema.value.components, componentId)
    if (component) {
      component.events = events
    }
  }

  /**
   * 更新组件子组件
   * @param {string} componentId - 组件ID
   * @param {Array} children - 新子组件列表
   */
  function updateComponentChildren(componentId, children) {
    const component = findComponentById(pageSchema.value.components, componentId)
    if (component) {
      component.children = children
    }
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
        if (!newParent.children) {
          newParent.children = []
        }
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
   * 导入 Schema
   * @param {Object} schema - Schema 对象
   */
  function importSchema(schema) {
    pageSchema.value = schema
    selectedComponentId.value = null
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
  function findComponentById(components, id) {
    for (const comp of components) {
      if (comp.id === id) {
        return comp
      }
      // 在 children 中查找
      if (comp.children && comp.children.length > 0) {
        const found = findComponentById(comp.children, id)
        if (found) return found
      }
    }
    return null
  }

  function removeComponentById(components, id) {
    for (let i = 0; i < components.length; i++) {
      if (components[i].id === id) {
        components.splice(i, 1)
        return true
      }
      // 从 children 中删除
      if (components[i].children && components[i].children.length > 0) {
        const result = removeComponentById(components[i].children, id)
        if (result) return true
      }
    }
    return false
  }

  function countComponents(components) {
    let count = components.length
    for (const comp of components) {
      // 统计 children 中的组件
      if (comp.children && comp.children.length > 0) {
        count += countComponents(comp.children)
      }
    }
    return count
  }

  return {
    // State
    pageSchema,
    selectedComponentId,
    isPreviewMode,
    // Getters
    components,
    selectedComponent,
    componentCount,
    // Actions
    addComponent,
    removeComponent,
    updateComponentProps,
    updateComponentStyle,
    updateComponentEvents,
    updateComponentChildren,
    moveComponent,
    selectComponent,
    clearSelection,
    setPreviewMode,
    updatePageMeta,
    importSchema,
    exportSchema,
    clearCanvas,
    findParentComponent,
  }
})
