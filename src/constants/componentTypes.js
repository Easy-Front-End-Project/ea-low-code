/**
 * 组件类型常量定义
 */

// 容器类型组件
export const CONTAINER_TYPES = [
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

// 非容器类型组件
export const NON_CONTAINER_TYPES = ['ea-checkbox-group', 'ea-radio-group', 'ea-tree']

// 行内块级组件
export const INLINE_BLOCK_TYPES = [
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

// 不可选择组件类型
export const NON_SELECTABLE_TYPES = ['ea-option', 'ea-option-group', 'ea-radio']

// 在父组件中不可选择的配置
export const NON_SELECTABLE_IN_PARENT = [
  { childType: 'ea-checkbox', parentType: 'ea-checkbox-group' },
  { childType: 'ea-radio', parentType: 'ea-radio-group' },
  { childType: 'ea-option', parentType: 'ea-option-group' },
  { childType: 'ea-option-group', parentType: 'ea-select' },
  { childType: 'ea-option', parentType: 'ea-select' },
]
