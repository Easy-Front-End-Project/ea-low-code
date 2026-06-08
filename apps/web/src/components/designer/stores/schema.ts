import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  generateComponentId,
  findComponentById,
  findParentComponent as findParentInTree,
  migrateStoreSchemaToV2,
  isV1Schema,
} from '@ea-low-code/shared'
import type { ComponentSchema, StorePageSchema, EventConfig, SlotProps } from '@ea-low-code/shared'
import { SCHEMA_VERSION } from '@ea-low-code/shared'
import { STYLE_TYPE_MAP } from '@ea-low-code/shared'
import type { StyleTypeKey } from '@ea-low-code/shared'
import { useVariableStore, type VariableItem } from './variable'

// ==================== Constants ====================
const DEFAULT_SCHEMA: StorePageSchema = {
  version: SCHEMA_VERSION,
  meta: {
    title: '未命名页面',
    description: '',
    viewport: {},
  },
  layout: { type: 'default', config: {} },
  settings: {},
  variables: [],
  components: [],
}

// ==================== Mutable Helper Functions ====================
// 这些操作需要直接修改 Vue 响应式数据，不能使用 shared 的不可变版本

/**
 * 根据 ID 删除组件（可变操作，直接修改原数组）
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
 */
function isValidId(componentId: unknown): componentId is string {
  return typeof componentId === 'string' && componentId.length > 0
}

/**
 * 验证组件类型
 */
function isValidType(type: unknown): type is string {
  return typeof type === 'string' && type.length > 0
}

// ==================== Store Definition ====================

/**
 * Schema 管理 Store（v2）
 * 管理页面 Schema 的状态和操作，使用 shared 包的类型和工具函数
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
  const MAX_HISTORY_SIZE = 50
  let isUndoRedo = false

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

  function saveHistory(): void {
    if (isUndoRedo) return

    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }

    const snapshot = JSON.parse(JSON.stringify(pageSchema.value)) as StorePageSchema
    history.value.push(snapshot)
    historyIndex.value = history.value.length - 1

    if (history.value.length > MAX_HISTORY_SIZE) {
      history.value.shift()
      historyIndex.value--
    }
  }

  function undo(): boolean {
    if (!canUndo.value) return false

    isUndoRedo = true
    historyIndex.value--
    const snapshot = history.value[historyIndex.value]
    pageSchema.value = JSON.parse(JSON.stringify(snapshot)) as StorePageSchema

    componentAliasMap.value.clear()
    rebuildAliasMap(pageSchema.value.components || [], componentAliasMap.value)

    setTimeout(() => {
      isUndoRedo = false
    }, 0)

    return true
  }

  function redo(): boolean {
    if (!canRedo.value) return false

    isUndoRedo = true
    historyIndex.value++
    const snapshot = history.value[historyIndex.value]
    pageSchema.value = JSON.parse(JSON.stringify(snapshot)) as StorePageSchema

    componentAliasMap.value.clear()
    rebuildAliasMap(pageSchema.value.components || [], componentAliasMap.value)

    selectedComponentId.value = null

    setTimeout(() => {
      isUndoRedo = false
    }, 0)

    return true
  }

  function findParentComponent(componentId: string): ComponentSchema | null {
    if (!isValidId(componentId)) {
      console.warn('[SchemaStore] findParentComponent: invalid componentId')
      return null
    }
    return findParentInTree(pageSchema.value.components, componentId)
  }

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

  function removeComponent(componentId: string): boolean {
    if (!isValidId(componentId)) {
      console.warn('[SchemaStore] removeComponent: invalid componentId')
      return false
    }

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
   * 更新组件插槽配置
   * @param componentId - 组件ID
   * @param slots - 新插槽配置（v2 格式）
   * @returns 是否更新成功
   */
  function updateComponentSlots(
    componentId: string,
    slots: Record<string, SlotProps>
  ): boolean {
    if (!isValidId(componentId)) {
      console.warn('[SchemaStore] updateComponentSlots: invalid componentId')
      return false
    }

    const component = findComponentById(pageSchema.value.components, componentId)
    if (!component) {
      console.warn(`[SchemaStore] updateComponentSlots: component not found: ${componentId}`)
      return false
    }

    component.slots = slots
    saveHistory()
    return true
  }

  /**
   * 更新组件插槽作用域属性
   * @param componentId - 组件ID
   * @param slotProps - 插槽作用域属性默认值
   * @returns 是否更新成功
   */
  function updateComponentSlotProps(
    componentId: string,
    slotProps: Record<string, unknown>
  ): boolean {
    if (!isValidId(componentId)) {
      console.warn('[SchemaStore] updateComponentSlotProps: invalid componentId')
      return false
    }

    const component = findComponentById(pageSchema.value.components, componentId)
    if (!component) {
      console.warn(`[SchemaStore] updateComponentSlotProps: component not found: ${componentId}`)
      return false
    }

    component.slotProps = slotProps
    saveHistory()
    return true
  }

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

    const removed = removeComponentById(pageSchema.value.components, componentId)
    if (!removed) {
      console.warn(`[SchemaStore] moveComponent: failed to remove component: ${componentId}`)
      return false
    }

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

  function selectComponent(componentId: string): void {
    if (!isValidId(componentId)) {
      console.warn('[SchemaStore] selectComponent: invalid componentId')
      return
    }
    selectedComponentId.value = componentId
  }

  function clearSelection(): void {
    selectedComponentId.value = null
  }

  function setPreviewMode(value: boolean): void {
    isPreviewMode.value = Boolean(value)
  }

  function updatePageMeta(meta: Partial<StorePageSchema['meta']>): void {
    if (meta && typeof meta === 'object') {
      pageSchema.value.meta = { ...pageSchema.value.meta, ...meta }
      saveHistory()
    }
  }

  function updatePageSettings(settings: Record<string, unknown>): void {
    if (settings && typeof settings === 'object') {
      pageSchema.value.settings = { ...pageSchema.value.settings, ...settings }
      saveHistory()
    }
  }

  /**
   * 导入 Schema（自动检测版本并迁移到 v2）
   */
  function importSchema(schema: unknown): boolean {
    if (!schema || typeof schema !== 'object') {
      console.warn('[SchemaStore] importSchema: invalid schema')
      return false
    }

    // 自动迁移 v1 Schema 到 v2
    const migratedSchema = isV1Schema(schema)
      ? migrateStoreSchemaToV2(schema)
      : schema as StorePageSchema

    pageSchema.value = migratedSchema
    selectedComponentId.value = null

    // 重建别名映射
    componentAliasMap.value.clear()
    rebuildAliasMap(migratedSchema.components || [], componentAliasMap.value)

    // 恢复变量配置到 variableStore
    const variableStore = useVariableStore()
    variableStore.setVariables(migratedSchema.variables || [])

    // 导入后保存到历史记录
    saveHistory()

    return true
  }

  function exportSchema(): StorePageSchema {
    const variableStore = useVariableStore()
    pageSchema.value.variables = variableStore.variables || []

    return JSON.parse(JSON.stringify(pageSchema.value)) as StorePageSchema
  }

  function clearCanvas(): void {
    pageSchema.value.components = []
    selectedComponentId.value = null
    componentAliasMap.value.clear()
    saveHistory()
  }

  // ==================== Alias Actions ====================

  function updatePageVariables(variables: VariableItem[]): void {
    pageSchema.value.variables = variables || []
    saveHistory()
  }

  function setComponentAlias(componentId: string, alias: string): boolean {
    if (!isValidId(componentId)) {
      console.warn('[SchemaStore] setComponentAlias: invalid componentId')
      return false
    }

    for (const [key, value] of componentAliasMap.value) {
      if (value === componentId) {
        componentAliasMap.value.delete(key)
        break
      }
    }

    if (alias && typeof alias === 'string') {
      componentAliasMap.value.set(alias, componentId)
    }

    const component = findComponentById(pageSchema.value.components, componentId)
    if (component) {
      component.alias = alias || undefined
    }

    saveHistory()
    return true
  }

  function getComponentIdByAlias(alias: string): string | null {
    if (!alias || typeof alias !== 'string') return null
    return componentAliasMap.value.get(alias) || null
  }

  function findComponentByAlias(alias: string): ComponentSchema | null {
    const componentId = getComponentIdByAlias(alias)
    return componentId ? findComponentById(pageSchema.value.components, componentId) : null
  }

  function getComponentAlias(componentId: string): string | null {
    if (!isValidId(componentId)) return null

    const component = findComponentById(pageSchema.value.components, componentId)
    return component?.alias || null
  }

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
    updateComponentSlots,
    updateComponentSlotProps,
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

// 重新导出类型，方便其他模块引用
export type { ComponentSchema, StorePageSchema, EventConfig, SlotProps, StyleTypeKey }
