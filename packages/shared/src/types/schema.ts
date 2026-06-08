/**
 * Schema 类型定义
 * 统一前后端 Schema 相关类型
 *
 * v2.0 变更说明：
 * - 新增 SlotProps 类型，明确插槽属性传递语义
 * - ComponentSchema.slots 类型从 Record<string, unknown> 改为 Record<string, SlotProps>
 * - 新增 ComponentSchema.slotProps 字段，用于存储插槽作用域绑定的默认值
 * - PageSchema.version 默认值从 '1.0' 升级为 '2.0'
 */

// ==================== Schema 版本 ====================

/** 当前 Schema 版本号 */
export const SCHEMA_VERSION = '2.0' as const

/** 旧版 Schema 版本号（用于迁移） */
export const LEGACY_SCHEMA_VERSION = '1.0' as const

// ==================== 变量类型 ====================

/** 变量类型枚举 */
export type VariableType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'function'

/** 变量项 */
export interface VariableItem {
  id: string
  name: string
  type: VariableType
  defaultValue: unknown
  remark: string
}

/** 变量绑定对象 */
export interface VariableBinding {
  type: 'variable'
  value: string
}

// ==================== 插槽类型 ====================

/**
 * 插槽属性配置
 * 用于定义组件插槽的属性传递
 *
 * v1 中 slots 字段为 Record<string, unknown>，语义不清
 * v2 明确为 Record<string, SlotProps>，每个插槽对应一组属性
 */
export interface SlotProps {
  /** 插槽名称（如 default、header、footer） */
  name: string
  /** 传递给插槽的属性 */
  props?: Record<string, unknown>
  /** 插槽标签（设计时显示） */
  label?: string
}

// ==================== 组件 Schema ====================

/** 远程组件配置 */
export interface RemoteConfig {
  id: string
  url: string
  styleUrl?: string
  exportName: string
}

/**
 * 组件 Schema 接口（v2）
 *
 * v2 变更：
 * - slots 类型从 Record<string, unknown> 改为 Record<string, SlotProps>
 * - 新增 slotProps 字段
 */
export interface ComponentSchema {
  id: string
  type: string
  props: Record<string, unknown>
  style: Record<string, string>
  events: EventConfig[]
  children: ComponentSchema[]
  /** 插槽配置，v2 中每个插槽对应 SlotProps 对象 */
  slots: Record<string, SlotProps>
  /** 插槽作用域属性默认值（用于 scopeBindings 的初始值） */
  slotProps?: Record<string, unknown>
  positionStyle?: Record<string, string>
  cssVariables?: Record<string, string>
  customCSS?: string
  isRemote?: boolean
  remoteConfig?: RemoteConfig
  childrenText?: string
  alias?: string
  scopeBindings?: Record<string, unknown>
}

// ==================== 事件配置 ====================

/** 参数项（用于 API 请求参数） */
export interface ParamItem {
  key: string
  value: string
}

/** 动作配置接口 */
export interface ActionConfig {
  code?: string
  message?: string
  title?: string
  targetComponentId?: string
  methodName?: string
  methodArgs?: unknown[]
  propName?: string
  propValue?: unknown
  url?: string
  method?: string
  params?: ParamItem[]
  body?: ParamItem[]
  enableDataBinding?: boolean
  targetVariable?: string
  [key: string]: unknown
}

/** 事件配置接口 */
export interface EventConfig {
  action?: string
  actionConfig?: ActionConfig
  targetComponentAlias?: string
  targetComponentId?: string
  [key: string]: unknown
}

// ==================== 页面 Schema ====================

/** 页面布局配置 */
export interface PageLayout {
  type: string
  config: Record<string, unknown>
}

/** 页面元信息 */
export interface PageMeta {
  title: string
  description: string
  viewport: Record<string, unknown>
}

/** 页面 Schema 接口（v2） */
export interface PageSchema {
  version: typeof SCHEMA_VERSION | string
  components: ComponentSchema[]
  layout: PageLayout
  meta: PageMeta
}

/** 页面 Schema 扩展版本（Store 使用，含变量） */
export interface StorePageSchema extends PageSchema {
  settings: Record<string, unknown>
  variables: VariableItem[]
}

// ==================== 验证结果 ====================

/** 验证结果 */
export interface ValidationResult {
  valid: boolean
  errors: string[]
}

// ==================== 函数执行上下文 ====================

/** 函数执行上下文 */
export interface FunctionExecutionContext {
  $component?: Record<string, unknown>
  $vars?: Record<string, unknown>
  $alias?: Record<string, unknown>
  $utils?: Record<string, unknown>
}
