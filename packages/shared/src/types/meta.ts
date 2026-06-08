/**
 * 元数据类型定义
 * 统一组件元数据、属性、事件、插槽等类型
 */

// ==================== 属性类型 ====================

/** 属性类型常量 */
export const PropTypes = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  SELECT: 'select',
  MULTI_SELECT: 'multi-select',
  COLOR: 'color',
  OBJECT: 'object',
  ARRAY: 'array',
  FUNCTION: 'function',
  UNIT: 'unit',
  TIME: 'time',
} as const

export type PropType = (typeof PropTypes)[keyof typeof PropTypes]

/** 属性选项 */
export interface PropOption {
  label: string
  value: string | number
}

/** 属性描述 */
export interface PropDescription {
  type: string
  content: string
  props?: Record<string, unknown>
}

/** 属性定义 */
export interface PropDefinition {
  name: string
  label: string
  type: PropType | string
  default?: unknown
  options?: PropOption[] | string[]
  description?: string | PropDescription
  slotScope?: Array<{ name: string; label: string }>
}

// ==================== 插槽类型 ====================

/** 插槽定义 */
export interface SlotDefinition {
  name: string
  label: string
  isContentSlot?: boolean
  description?: string
  child?: string
  slotScope?: Array<{ name: string; label: string }>
}

// ==================== 事件元数据类型 ====================

/** 事件元数据定义 */
export interface EventDefinition {
  name: string
  label: string
  params?: string
  detail?: string
}

// ==================== 方法类型 ====================

/** 方法定义 */
export interface MethodDefinition {
  name: string
  label: string
  description?: string
}

// ==================== 组件分类 ====================

/** 组件分类常量 */
export const ComponentCategories = {
  BASIC: 'basic',
  LAYOUT: 'layout',
  FORM: 'form',
  DATA: 'data',
  NAVIGATION: 'navigation',
  FEEDBACK: 'feedback',
  REMOTE: 'remote',
} as const

export type ComponentCategory = (typeof ComponentCategories)[keyof typeof ComponentCategories]

// ==================== 组件元数据 ====================

/** 特殊配置 */
export interface SpecialConfig {
  type: string
  propName: string
}

/** 组件元数据 */
export interface ComponentMeta {
  type: string
  name: string
  category: ComponentCategory | string
  icon: string
  isChildComponent?: boolean
  parentComponents?: string[]
  isRemote?: boolean
  remoteConfig?: import('./schema').RemoteConfig
  props: PropDefinition[]
  events: EventDefinition[]
  slots: SlotDefinition[]
  styleConfig?: import('./style').StyleConfig
  childComponents?: string[]
  defaultSlot?: string
  isService?: boolean
  isPageLevel?: boolean
  configSource?: string[]
  pageLevelConfig?: Record<string, unknown>
  specialConfig?: SpecialConfig
  methods?: MethodDefinition[]
}

// ==================== 分类相关类型 ====================

/** 分类项 */
export interface CategoryItem {
  key: string
  value: string
  label: string
}

/** 分类分组（普通组件 / 子组件） */
export interface CategoryGrouped {
  regular: ComponentMeta[]
  child: ComponentMeta[]
}

/** 父子分组 */
export interface ParentGroup {
  parentType: string
  parentName: string
  components: ComponentMeta[]
}

/** 远程组件配置存储 */
export interface RemoteConfigStorage {
  globalUrl: string
  components: Array<Record<string, unknown>>
}
