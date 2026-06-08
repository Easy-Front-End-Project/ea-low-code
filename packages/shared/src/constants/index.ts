/**
 * 共享常量定义
 * 统一前后端使用的常量
 */

// ==================== Schema 版本 ====================

/** 当前 Schema 版本（与 types/schema.ts 中的 SCHEMA_VERSION 保持一致） */
export const SCHEMA_VERSIONS = ['1.0', '2.0'] as const

// ==================== 默认页面配置 ====================

/** 默认页面配置 */
export const DEFAULT_PAGE_CONFIG = {
  width: '100%',
  height: '100vh',
  backgroundColor: '#ffffff',
} as const

// ==================== 组件分类 ====================

/** 组件分类常量（与 types/meta.ts 中的 ComponentCategories 保持一致） */
export const CATEGORIES = {
  BASIC: 'basic',
  LAYOUT: 'layout',
  FORM: 'form',
  DATA: 'data',
  NAVIGATION: 'navigation',
  FEEDBACK: 'feedback',
  REMOTE: 'remote',
} as const

/** 分类标签映射 */
export const CATEGORY_LABELS: Record<string, string> = {
  [CATEGORIES.BASIC]: '基础组件',
  [CATEGORIES.FORM]: '表单组件',
  [CATEGORIES.DATA]: '数据展示',
  [CATEGORIES.NAVIGATION]: '导航组件',
  [CATEGORIES.FEEDBACK]: '反馈组件',
  [CATEGORIES.LAYOUT]: '布局组件',
  [CATEGORIES.REMOTE]: '远程组件',
}

// ==================== 属性类型 ====================

/** 属性类型常量（与 types/meta.ts 中的 PropTypes 保持一致） */
export const PROP_TYPES = {
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

// ==================== 组件类型常量 ====================

/** 容器类型组件 */
export const CONTAINER_TYPES: string[] = [
  'ea-container',
  'ea-card',
  'ea-header',
  'ea-aside',
  'ea-main',
  'ea-dialog',
  'ea-space',
  'ea-row',
  'ea-col',
  'form',
  'ea-button-group',
]

/** 非容器类型组件 */
export const NON_CONTAINER_TYPES: string[] = ['ea-checkbox-group', 'ea-radio-group', 'ea-tree']

/** 行内块级组件 */
export const INLINE_BLOCK_TYPES: string[] = [
  'ea-button',
  'ea-text',
  'ea-link',
  'ea-tag',
  'ea-check-tag',
  'ea-badge',
  'ea-avatar',
  'ea-dropdown',
  'ea-popconfirm',
  'ea-popover',
  'ea-tooltip',
]

/** 不可选择组件类型 */
export const NON_SELECTABLE_TYPES: string[] = ['ea-option', 'ea-option-group', 'ea-radio']

/** 在父组件中不可选择的配置 */
export interface NonSelectableInParent {
  childType: string
  parentType: string
}

export const NON_SELECTABLE_IN_PARENT: NonSelectableInParent[] = [
  { childType: 'ea-checkbox', parentType: 'ea-checkbox-group' },
  { childType: 'ea-radio', parentType: 'ea-radio-group' },
  { childType: 'ea-option', parentType: 'ea-option-group' },
  { childType: 'ea-option-group', parentType: 'ea-select' },
  { childType: 'ea-option', parentType: 'ea-select' },
]
