/**
 * 样式类型定义
 * 统一样式配置、CSS 变量、样式部件等类型
 */

// ==================== 样式部件 ====================

/** 样式配置部件 */
export interface StyleConfigPart {
  name: string
  label: string
  styles?: string[]
  description?: string
}

// ==================== CSS 变量 ====================

/** CSS 变量定义 */
export interface CssVariableDefinition {
  name: string
  label: string
  type: string
  default?: string
  options?: string[]
}

// ==================== 样式配置 ====================

/** 样式类型键 */
export type StyleTypeKey = 'cssVariable' | 'position' | 'customCSS' | 'inline'

/** 样式类型映射键名 */
export const STYLE_TYPE_MAP: Record<StyleTypeKey, string> = {
  cssVariable: 'cssVariables',
  position: 'positionStyle',
  customCSS: 'customCSS',
  inline: 'style',
} as const

/** 组件样式配置 */
export interface StyleConfig {
  parts: StyleConfigPart[]
  cssVariables?: CssVariableDefinition[]
  dynamicCssVariables?: Record<string, unknown>
}
