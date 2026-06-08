/**
 * 事件类型定义
 * 统一事件执行上下文与动作类型
 */

// ==================== 动作类型枚举 ====================

/** 事件动作类型 */
export type ActionType = 'message' | 'notification' | 'custom' | 'callMethod' | 'setProp' | 'apiRequest'

/** 事件动作类型常量 */
export const ActionTypes: Record<string, ActionType> = {
  MESSAGE: 'message',
  NOTIFICATION: 'notification',
  CUSTOM: 'custom',
  CALL_METHOD: 'callMethod',
  SET_PROP: 'setProp',
  API_REQUEST: 'apiRequest',
} as const

// ==================== 执行上下文 ====================

/** 组件操作上下文 */
export interface ComponentContext {
  get: (id: string) => HTMLElement | null
  setProp: (id: string, prop: string, value: unknown) => boolean
  getProp: (id: string, prop: string) => unknown
  call: (id: string, method: string, ...args: unknown[]) => unknown
}

/** 变量操作上下文 */
export interface VarsContext {
  get: (name: string) => unknown
  set: (name: string, value: unknown) => void
  call: (name: string, ...args: unknown[]) => unknown
}

/** 别名操作上下文 */
export interface AliasContext {
  get: (alias: string) => string | null
  find: (alias: string) => unknown
  getElement: (alias: string) => HTMLElement | null
  setProp: (alias: string, prop: string, value: unknown) => void
  getProp: (alias: string, prop: string) => unknown
  call: (alias: string, method: string, ...args: unknown[]) => void
}

/** 事件执行上下文 */
export interface ExecutionContext {
  $component: ComponentContext
  $vars: VarsContext
  $alias: AliasContext
}
