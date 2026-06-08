// 基础属性类型定义
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

// 组件分类
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

// ========== 组件元数据类型定义 ==========

export interface PropOption {
  label: string
  value: string | number
}

export interface PropDescription {
  type: string
  content: string
  props?: Record<string, unknown>
}

export interface PropDefinition {
  name: string
  label: string
  type: PropType | string
  default?: unknown
  options?: PropOption[] | string[]
  description?: string | PropDescription
  slotScope?: Array<{ name: string; label: string }>
}

export interface SlotDefinition {
  name: string
  label: string
  isContentSlot?: boolean
  description?: string
  child?: string
  slotScope?: Array<{ name: string; label: string }>
}

export interface EventDefinition {
  name: string
  label: string
  params?: string
  detail?: string
}

export interface StyleConfigPart {
  name: string
  label: string
  styles?: string[]
  description?: string
}

export interface CssVariableDefinition {
  name: string
  label: string
  type: string
  default?: string
  options?: string[]
}

export interface StyleConfig {
  parts: StyleConfigPart[]
  cssVariables?: CssVariableDefinition[]
  dynamicCssVariables?: Record<string, unknown>
}

export interface RemoteConfig {
  id: string
  url: string
  styleUrl: string
  exportName: string
}

export interface SpecialConfig {
  type: string
  propName: string
}

export interface MethodDefinition {
  name: string
  label: string
  description?: string
}

export interface ComponentMeta {
  type: string
  name: string
  category: ComponentCategory | string
  icon: string
  isChildComponent?: boolean
  parentComponents?: string[]
  isRemote?: boolean
  remoteConfig?: RemoteConfig
  props: PropDefinition[]
  events: EventDefinition[]
  slots: SlotDefinition[]
  styleConfig?: StyleConfig
  childComponents?: string[]
  defaultSlot?: string
  isService?: boolean
  isPageLevel?: boolean
  configSource?: string[]
  pageLevelConfig?: Record<string, unknown>
  specialConfig?: SpecialConfig
  methods?: MethodDefinition[]
}

export interface CategoryItem {
  key: string
  value: string
  label: string
}

export interface CategoryGrouped {
  regular: ComponentMeta[]
  child: ComponentMeta[]
}

export interface ParentGroup {
  parentType: string
  parentName: string
  components: ComponentMeta[]
}

export interface RemoteConfigStorage {
  globalUrl: string
  components: Array<Record<string, unknown>>
}
