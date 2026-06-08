export const SCHEMA_VERSION = '1.0.0';
export const SCHEMA_VERSIONS = ['1.0.0'];
export const DEFAULT_PAGE_CONFIG = {
    width: '100%',
    height: '100vh',
    backgroundColor: '#ffffff',
};
export const CATEGORIES = {
    BASIC: 'basic',
    LAYOUT: 'layout',
    FORM: 'form',
    DATA: 'data',
    NAVIGATION: 'navigation',
    FEEDBACK: 'feedback',
    REMOTE: 'remote',
};
export const CATEGORY_LABELS = {
    [CATEGORIES.BASIC]: '基础组件',
    [CATEGORIES.FORM]: '表单组件',
    [CATEGORIES.DATA]: '数据展示',
    [CATEGORIES.NAVIGATION]: '导航组件',
    [CATEGORIES.FEEDBACK]: '反馈组件',
    [CATEGORIES.LAYOUT]: '布局组件',
    [CATEGORIES.REMOTE]: '远程组件',
};
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
};
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
];
export const NON_CONTAINER_TYPES = ['ea-checkbox-group', 'ea-radio-group', 'ea-tree'];
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
];
export const NON_SELECTABLE_TYPES = ['ea-option', 'ea-option-group', 'ea-radio'];
export const NON_SELECTABLE_IN_PARENT = [
    { childType: 'ea-checkbox', parentType: 'ea-checkbox-group' },
    { childType: 'ea-radio', parentType: 'ea-radio-group' },
    { childType: 'ea-option', parentType: 'ea-option-group' },
    { childType: 'ea-option-group', parentType: 'ea-select' },
    { childType: 'ea-option', parentType: 'ea-select' },
];
//# sourceMappingURL=index.js.map