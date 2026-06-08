/**
 * Schema 类型定义
 * 统一前后端 Schema 相关类型
 */

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

// ==================== 组件 Schema ====================

/** 远程组件配置 */
export interface RemoteConfig {
  id: string
  url: string
  styleUrl?: string
  exportName: string
}

/** 组件 Schema 接口 */
export interface ComponentSchema {
  id: string
  type: string
  props: Record<string, unknown>
  style: Record<string, string>
  events: EventConfig[]
  children: ComponentSchema[]
  slots: Record<string, unknown>
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

/** 页面 Schema 接口 */
export interface PageSchema {
  version: string
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
