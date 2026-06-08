import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateComponentId, type ComponentSchema, type EventConfig } from '@/utils/schemaHelper'
import { useVariableStore, type VariableItem } from './variable'

// ==================== Type Definitions ====================

/**
 * 页面 Schema 接口（Store 使用的扩展版本）
 */
interface StorePageSchema {
  version: string
  meta: {
    title: string
    description: string
    viewport: Record<string, unknown>
  }
  settings: Record<string, unknown>
  variables: VariableItem[]
  components: ComponentSchema[]
}

/**
 * 样式类型映射键
 */
type StyleTypeKey = 'cssVariable' | 'position' | 'customCSS' | 'inline'

// ==================== Constants ====================
const DEFAULT_SCHEMA: StorePageSchema = {
  version: '1.0',
  meta: {
    title: '未命名页面',
    description: '',
    viewport: {},
  },
  settings: {},
  variables: [],
  components: [],
}

const STYLE_TYPE_MAP: Record<StyleTypeKey, string> = {
  cssVariable: 'cssVariables',
  position: 'positionStyle',
  customCSS: 'customCSS',
  inline: 'style',
}

// ==================== Helper Functions ====================

/**
 * 根据 ID 查找组件
 * @param components - 组件列表
 * @param id - 组件ID
 * @returns 组件对象
 */
function findComponentById(components: ComponentSchema[], id: string | null): ComponentSchema | null {
  if (!Array.isArray(components) || !id) return null

  for (const comp of components) {
    if (comp.id === id) return comp
    if (comp.children?.length) {
      const found = findComponentById(comp.children, id)
      if (found) return found
    }
  }
  return null
}

/**
 * 查找父组件
 * @param components - 组件列表
 * @param targetId - 目标组件ID
 * @param parent - 当前父组件
 * @returns 父组件对象
 */
function findParentInTree(
  components: ComponentSchema[],
  targetId: string,
  parent: ComponentSchema | null = null
): ComponentSchema | null {
  if (!Array.isArray(components) || !targetId) return null

  for (const component of components) {
    if (component.id === targetId) return parent
    if (component.children?.length) {
      const result = findParentInTree(component.children, targetId, component)
      if (result) return result
    }
  }
  return null
}

/**
 * 根据 ID 删除组件
 * @param components - 组件列表
 * @param id - 组件ID
 * @returns 是否删除成功
 */
function removeComponentById(components: ComponentSchema[], id: string): boolean {
  if (!Array.isArray(components) || !id) return false

  for (let i = 0; i < components.length; i++) {
    if (components[i].id === id) {
      components.splice(i, 1)
      return true
    }
    if (components[i].children?.length) {
      if (removeComponentById(components[i].children, id)) return true
    }
  }
  return false
}

/**
 * 统计组件数量
 * @param components - 组件列表
 * @returns 组件总数
 */
function countComponents(components: ComponentSchema[]): number {
  if (!Array.isArray(components)) return 0

  return components.reduce((count, comp) => {
    const childCount = comp.children?.length ? countComponents(comp.children) : 0
    return count + 1 + childCount
  }, 0)
}

/**
 * 重建别名映射
 * @param components - 组件列表
 * @param aliasMap - 别名映射 Map
 */
function rebuildAliasMap(components: ComponentSchema[], aliasMap: Map<string, string>): void {
  if (!Array.isArray(components) || !(aliasMap instanceof Map)) return

  for (const comp of components) {
    if (comp.alias) {
      aliasMap.set(comp.alias, comp.id)
    }
    if (comp.children?.length) {
      rebuildAliasMap(comp.children, aliasMap)
    }
  }
}

/**
 * 验证组件ID
 * @param componentId - 组件ID
 * @returns 是否有效
 */
function isValidId(componentId: unknown): componentId is string {
  return typeof componentId === 'string' && componentId.length > 0
}

/**
 * 验证组件类型
 * @param type - 组件类型
 * @returns 是否有效
 */
function isValidType(type: unknown): type is string {
  return typeof type === 'string' && type.length > 0
}

// ==================== Store Definition ====================

/**
 * Schema 管理 Store
 * 管理页面 Schema 的状态和操作
 */
export const useSchemaStore = defineStore('schema', () => {
  // ==================== State ====================
  const pageSchema = ref<StorePageSchema>(structuredClone(DEFAULT_SCHEMA))
  const selectedComponentId = ref<string | null>(null)
  const isPreviewMode = ref(false)
  const componentAliasMap = ref<Map<string, string>>(new Map())

  // ==================== History State ====================
  const history = ref<StorePageSchema[]>([])
  const historyIndex = ref(-1)
  const MAX_HISTORY_SIZE = 50 // 最大历史记录数
  let isUndoRedo = false // 标记是否正在执行撤销/重做操作

  // ==================== Getters ====================
  const components = computed(() => pageSchema.value.components)
  const aliases = computed(() => Object.fromEntries(componentAliasMap.value))
  const selectedComponent = computed(() =>
    findComponentById(pageSchema.value.components, selectedComponentId.value)
  )
  const componentCount = computed(() => countComponents(pageSchema.value.components))
  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  // ==================== Actions ====================

  /**
   * 保存当前状态到历史记录
   */
  function saveHistory(): void {
    // 如果是撤销/重做操作触发的，不保存历史
    if (isUndoRedo) return

    // 删除当前索引之后的历史记录（当在撤销后执行新操作时）
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }

    // 保存当前状态
    const snapshot = JSON.parse(JSON.stringify(pageSchema.value)) as StorePageSchema
    history.value.push(snapshot)

    // 更新索引指向最新状态
    historyIndex.value = history.value.length - 1

    // 限制历史记录数量
    if (history.value.length > MAX_HISTORY_SIZE) {
      history.value.shift()
      historyIndex.value--
    }
  }

  /**
   * 撤销操作
   */
  function undo(): boolean {
    if (!canUndo.value) return false

    isUndoRedo = true
    historyIndex.value--
    const snapshot = history.value[historyIndex.value]
    pageSchema.value = JSON.parse(JSON.stringify(snapshot)) as StorePageSchema

    // 重建别名映射
    componentAliasMap.value.clear()
    rebuildAliasMap(pageSchema.value.components || [], componentAliasMap.value)

    // 清除选中状态
    /**
     * TODO: 不知道为什么这个会导致在 选中组件 下，点击组件的 基础样式 时
     * 若更新某个输入框的值，导致组件被取消选中
     */
    // selectedComponentId.value = null

    // 使用 nextTick 确保状态更新后再重置标记
    setTimeout(() => {
      isUndoRedo = false
    }, 0)

    return true
  }

  /**
   * 重做操作
   */
  function redo(): boolean {
    if (!canRedo.value) return false

    isUndoRedo = true
    historyIndex.value++
    const snapshot = history.value[historyIndex.value]
    pageSchema.value = JSON.parse(JSON.stringify(snapshot)) as StorePageSchema

    // 重建别名映射
    componentAliasMap.value.clear()
    rebuildAliasMap(pageSchema.value.components || [], componentAliasMap.value)

    // 清除选中状态
    selectedComponentId.value = null

    // 使用 nextTick 确保状态更新后再重置标记
    setTimeout(() => {
      isUndoRedo = false
    }, 0)

    return true
  }

  /**
   * 查找父组件
   * @param componentId - 子组件ID
   * @returns 父组件对象
   */
  function findParentComponent(componentId: string): ComponentSchema | null {
    if (!isValidId(componentId)) {
      console.warn('[SchemaStore] findParentComponent: invalid componentId')
      return null
    }
    return findParentInTree(pageSchema.value.components, componentId)
  }

  /**
   * 添加组件到指定位置
   * @param component - 组件对象
   * @param parentId - 父组件ID
   * @returns 是否添加成功
   */
  function addComponentToTree(component: ComponentSchema, parentId: string | null = null): boolean {
    if (!component || typeof component !== 'object') {
      console.warn('[SchemaStore] addComponentToTree: invalid component')
      return false
    }

    if (parentId) {
      const parent = findComponentById(pageSchema.value.components, parentId)
      if (!parent) {
        console.warn(`[SchemaStore] addComponentToTree: parent not found: ${parentId}`)
        return false
      }
      parent.children ??= []
      parent.children.push(component)
    } else {
      pageSchema.value.components.push(component)
    }
    return true
  }

  /**
   * 添加组件
   * @param type - 组件类型
   * @param props - 组件属性
   * @param parentId - 父组件ID（可选）
   * @returns 创建的组件
   */
  function addComponent(
    type: string,
    props: Record<string, unknown> = {},
    parentId: string | null = null
  ): ComponentSchema | null {
    if (!isValidType(type)) {
      console.warn('[SchemaStore] addComponent: invalid type')
      return null
    }

    // 从 props 中提取 slot 属性
    const { slot = 'default', ...otherProps } = props
    const componentProps = slot === 'default' ? otherProps : { slot, ...otherProps }

    const newComponent: ComponentSchema = {
      id: generateComponentId(),
      type,
      props: componentProps,
      style: {},
      events: [],
      children: [],
      slots: {},
    }

    const result = addComponentToTree(newComponent, parentId) ? newComponent : null
    if (result) {
      saveHistory()
    }
    return result
  }

  /**
   * 通过 Schema 添加组件（用于复制组件）
   * @param componentSchema - 组件 Schema
   * @param parentId - 父组件ID（可选）
   * @returns 是否添加成功
   */
  function addComponentBySchema(componentSchema: ComponentSchema, parentId: string | null = null): boolean {
    if (!componentSchema || typeof componentSchema !== 'object') {
      console.warn('[SchemaStore] addComponentBySchema: invalid schema')
      return false
    }

    if (!isValidId(componentSchema.id)) {
      console.warn('[SchemaStore] addComponentBySchema: schema missing valid id')
      return false
    }

    const result = addComponentToTree(componentSchema, parentId)
    if (result) {
      saveHistory()
    }
    return result
  }

  /**
   * 删除组件
   * @param componentId - 组件ID
   * @returns 是否删除成功
   */
  function removeComponent(componentId: string): boolean {
    if (!isValidId(componentId)) {
      console.warn('[SchemaStore] removeComponent: invalid componentId')
      return false
    }

    // 清理别名映射
    const alias = getComponentAlias(componentId)
    if (alias) {
      removeComponentAlias(alias)
    }

    const removed = removeComponentById(pageSchema.value.components, componentId)

    if (removed && selectedComponentId.value === componentId) {
      selectedComponentId.value = null
    }

    if (removed) {
      saveHistory()
    }

    return removed
  }

  /**
   * 更新组件属性
   * @param componentId - 组件ID
   * @param newProps - 新属性
   * @returns 是否更新成功
   */
  function updateComponentProps(componentId: string, newProps: Record<string, unknown>): boolean {
    if (!isValidId(componentId)) {
      console.warn('[SchemaStore] updateComponentProps: invalid componentId')
      return false
    }

    const component = findComponentById(pageSchema.value.components, componentId)
    if (!component) {
      console.warn(`[SchemaStore] updateComponentProps: component not found: ${componentId}`)
      return false
    }

    component.props = { ...component.props, ...newProps }
    saveHistory()
    return true
  }

  /**
   * 更新组件样式
   * @param componentId - 组件ID
   * @param style - 新样式
   * @param styleType - 样式类型
   * @returns 是否更新成功
   */
  function updateComponentStyle(
    componentId: string,
    style: Record<string, string> | string,
    styleType: StyleTypeKey = 'inline'
  ): boolean {
    if (!isValidId(componentId)) {
      console.warn('[SchemaStore] updateComponentStyle: invalid componentId')
      return false
    }

    const component = findComponentById(pageSchema.value.components, componentId)
    if (!component) {
      console.warn(`[SchemaStore] updateComponentStyle: component not found: ${componentId}`)
      return false
    }

    if (styleType === 'customCSS') {
      component.customCSS = typeof style === 'string' ? style : ''
    } else {
      const targetKey = STYLE_TYPE_MAP[styleType] || 'style'
      const compRecord = component as unknown as Record<string, unknown>
      compRecord[targetKey] ??= {}
      if (typeof style === 'object' && style !== null) {
        Object.assign(compRecord[targetKey] as Record<string, unknown>, style)
      }
    }

    saveHistory()
    return true
  }

  /**
   * 更新组件事件
   * @param componentId - 组件ID
   * @param events - 新事件配置
   * @returns 是否更新成功
   */
  function updateComponentEvents(componentId: string, events: EventConfig[]): boolean {
    if (!isValidId(componentId)) {
      console.warn('[SchemaStore] updateComponentEvents: invalid componentId')
      return false
    }

    const component = findComponentById(pageSchema.value.components, componentId)
    if (!component) {
      console.warn(`[SchemaStore] updateComponentEvents: component not found: ${componentId}`)
      return false
    }

    component.events = Array.isArray(events) ? events : []
    saveHistory()
    return true
  }

  /**
   * 更新组件插槽 Scope 绑定
   * @param componentId - 组件ID
   * @param scopeBindings - Scope 绑定配置
   * @returns 是否更新成功
   */
  function updateComponentScopeBindings(
    componentId: string,
    scopeBindings: Record<string, unknown>
  ): boolean {
    if (!isValidId(componentId)) {
      console.warn('[SchemaStore] updateComponentScopeBindings: invalid componentId')
      return false
    }

    const component = findComponentById(pageSchema.value.components, componentId)
    if (!component) {
      console.warn(
        `[SchemaStore] updateComponentScopeBindings: component not found: ${componentId}`
      )
      return false
    }

    component.scopeBindings = scopeBindings
    saveHistory()
    return true
  }

  /**
   * 更新组件子组件
   * @param componentId - 组件ID
   * @param children - 新子组件列表
   * @returns 是否更新成功
   */
  function updateComponentChildren(componentId: string, children: unknown[]): boolean {
    if (!isValidId(componentId)) {
      console.warn('[SchemaStore] updateComponentChildren: invalid componentId')
      return false
    }

    const component = findComponentById(pageSchema.value.components, componentId)
    if (!component) {
      console.warn(`[SchemaStore] updateComponentChildren: component not found: ${componentId}`)
      return false
    }

    component.children = (Array.isArray(children) ? children : []) as ComponentSchema[]
    saveHistory()
    return true
  }

  /**
   * 移动组件
   * @param componentId - 组件ID
   * @param newIndex - 新位置索引
   * @param newParentId - 新父组件ID（可选）
   * @returns 是否移动成功
   */
  function moveComponent(componentId: string, newIndex: number, newParentId: string | null = null): boolean {
    if (!isValidId(componentId)) {
      console.warn('[SchemaStore] moveComponent: invalid componentId')
      return false
    }

    if (typeof newIndex !== 'number' || newIndex < 0) {
      console.warn('[SchemaStore] moveComponent: invalid newIndex')
      return false
    }

    const component = findComponentById(pageSchema.value.components, componentId)
    if (!component) {
      console.warn(`[SchemaStore] moveComponent: component not found: ${componentId}`)
      return false
    }

    // 从原位置移除
    const removed = removeComponentById(pageSchema.value.components, componentId)
    if (!removed) {
      console.warn(`[SchemaStore] moveComponent: failed to remove component: ${componentId}`)
      return false
    }

    // 添加到新位置
    if (newParentId) {
      const newParent = findComponentById(pageSchema.value.components, newParentId)
      if (!newParent) {
        console.warn(`[SchemaStore] moveComponent: new parent not found: ${newParentId}`)
        return false
      }
      newParent.children ??= []
      const index = Math.min(newIndex, newParent.children.length)
      newParent.children.splice(index, 0, component)
    } else {
      const index = Math.min(newIndex, pageSchema.value.components.length)
      pageSchema.value.components.splice(index, 0, component)
    }

    saveHistory()
    return true
  }

  /**
   * 选中组件
   * @param componentId - 组件ID
   */
  function selectComponent(componentId: string): void {
    if (!isValidId(componentId)) {
      console.warn('[SchemaStore] selectComponent: invalid componentId')
      return
    }
    selectedComponentId.value = componentId
  }

  /**
   * 清除选中
   */
  function clearSelection(): void {
    selectedComponentId.value = null
  }

  /**
   * 设置预览模式
   * @param value - 是否预览模式
   */
  function setPreviewMode(value: boolean): void {
    isPreviewMode.value = Boolean(value)
  }

  /**
   * 更新页面元数据
   * @param meta - 元数据
   */
  function updatePageMeta(meta: Partial<StorePageSchema['meta']>): void {
    if (meta && typeof meta === 'object') {
      pageSchema.value.meta = { ...pageSchema.value.meta, ...meta }
      saveHistory()
    }
  }

  /**
   * 更新页面设置
   * @param settings - 设置对象
   */
  function updatePageSettings(settings: Record<string, unknown>): void {
    if (settings && typeof settings === 'object') {
      pageSchema.value.settings = { ...pageSchema.value.settings, ...settings }
      saveHistory()
    }
  }

  /**
   * 导入 Schema
   * @param schema - Schema 对象
   * @returns 是否导入成功
   */
  function importSchema(schema: unknown): boolean {
    if (!schema || typeof schema !== 'object') {
      console.warn('[SchemaStore] importSchema: invalid schema')
      return false
    }

    const schemaObj = schema as StorePageSchema
    pageSchema.value = schemaObj
    selectedComponentId.value = null

    // 重建别名映射
    componentAliasMap.value.clear()
    rebuildAliasMap(schemaObj.components || [], componentAliasMap.value)

    // 恢复变量配置到 variableStore
    const variableStore = useVariableStore()
    variableStore.setVariables(schemaObj.variables || [])

    // 导入后保存到历史记录
    saveHistory()

    return true
  }

  /**
   * 导出 Schema
   * @returns Schema 对象的深拷贝
   */
  function exportSchema(): StorePageSchema {
    // 从 variableStore 获取最新变量配置并同步到 schema
    const variableStore = useVariableStore()
    pageSchema.value.variables = variableStore.variables || []

    return JSON.parse(JSON.stringify(pageSchema.value)) as StorePageSchema
  }

  /**
   * 清空画布
   */
  function clearCanvas(): void {
    pageSchema.value.components = []
    selectedComponentId.value = null
    componentAliasMap.value.clear()
    saveHistory()
  }

  // ==================== Alias Actions ====================

  /**
   * 更新页面变量
   * @param variables - 变量列表
   */
  function updatePageVariables(variables: VariableItem[]): void {
    pageSchema.value.variables = variables || []
    saveHistory()
  }

  /**
   * 设置组件别名
   * @param componentId - 组件ID
   * @param alias - 别名
   * @returns 是否设置成功
   */
  function setComponentAlias(componentId: string, alias: string): boolean {
    if (!isValidId(componentId)) {
      console.warn('[SchemaStore] setComponentAlias: invalid componentId')
      return false
    }

    // 如果别名已存在，先移除旧的映射
    for (const [key, value] of componentAliasMap.value) {
      if (value === componentId) {
        componentAliasMap.value.delete(key)
        break
      }
    }

    // 设置新的别名映射
    if (alias && typeof alias === 'string') {
      componentAliasMap.value.set(alias, componentId)
    }

    // 更新组件的 alias 字段
    const component = findComponentById(pageSchema.value.components, componentId)
    if (component) {
      component.alias = alias || undefined
    }

    saveHistory()
    return true
  }

  /**
   * 根据别名获取组件ID
   * @param alias - 别名
   * @returns 组件ID
   */
  function getComponentIdByAlias(alias: string): string | null {
    if (!alias || typeof alias !== 'string') return null
    return componentAliasMap.value.get(alias) || null
  }

  /**
   * 根据别名查找组件
   * @param alias - 别名
   * @returns 组件对象
   */
  function findComponentByAlias(alias: string): ComponentSchema | null {
    const componentId = getComponentIdByAlias(alias)
    return componentId ? findComponentById(pageSchema.value.components, componentId) : null
  }

  /**
   * 获取组件别名
   * @param componentId - 组件ID
   * @returns 别名
   */
  function getComponentAlias(componentId: string): string | null {
    if (!isValidId(componentId)) return null

    const component = findComponentById(pageSchema.value.components, componentId)
    return component?.alias || null
  }

  /**
   * 移除组件别名
   * @param alias - 别名
   * @returns 是否移除成功
   */
  function removeComponentAlias(alias: string): boolean {
    if (!alias || typeof alias !== 'string') return false
    return componentAliasMap.value.delete(alias)
  }

  saveHistory()

  // ==================== Return ====================
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
    canUndo,
    canRedo,
    // Actions
    addComponent,
    addComponentBySchema,
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
    updatePageVariables,
    importSchema,
    exportSchema,
    clearCanvas,
    findParentComponent,
    setComponentAlias,
    getComponentIdByAlias,
    findComponentByAlias,
    getComponentAlias,
    removeComponentAlias,
    saveHistory,
    undo,
    redo,
  }
})
