/**
 * ============================================
 * EA-LowCode 组件元数据类型定义
 * ============================================
 * @fileoverview 本文件包含所有组件元数据的完整JSDoc类型定义
 */

// ============================================================================
// 基础枚举类型
// ============================================================================

/**
 * 属性类型枚举
 * @typedef {('string'|'number'|'boolean'|'select'|'multi-select'|'color'|'object'|'array'|'function'|'unit'|'time')} PropType
 */

/**
 * 组件分类枚举
 * @typedef {('basic'|'form'|'data'|'navigation'|'feedback'|'layout'|'remote')} ComponentCategory
 */

// ============================================================================
// 选项相关类型
// ============================================================================

/**
 * 选择器选项项
 * @typedef {Object} SelectOption
 * @property {string} label - 选项显示标签
 * @property {string|number|boolean} value - 选项值
 * @property {boolean} [disabled] - 是否禁用
 * @property {string} [icon] - 选项图标
 */

/**
 * 选择器选项分组
 * @typedef {Object} SelectOptionGroup
 * @property {string} label - 分组标签
 * @property {SelectOption[]} options - 分组内的选项列表
 */

// ============================================================================
// 属性配置类型
// ============================================================================

/**
 * 属性描述配置（用于复杂描述场景）
 * @typedef {Object} PropDescription
 * @property {string} type - 描述组件类型，如 'ea-text', 'ea-link'
 * @property {string} content - 描述内容文本
 * @property {Object} [props] - 描述组件的属性
 * @property {string} [props.href] - 链接地址
 * @property {string} [props.target] - 链接打开方式
 * @property {string} [props.type] - 文本类型
 * @property {string} [props.size] - 文本大小
 * @property {string} [props.style] - 自定义样式
 */

/**
 * 组件属性配置
 * @typedef {Object} ComponentProp
 * @property {string} name - 属性名（对应组件的attribute/property）
 * @property {string} label - 属性显示标签
 * @property {PropType} type - 属性类型
 * @property {any} [default] - 默认值
 * @property {string} [description] - 属性描述（简单文本）
 * @property {PropDescription} [description] - 属性描述（复杂配置）
 * @property {SelectOption[]|SelectOptionGroup[]} [options] - 选项列表（当type为select/multi-select时）
 * @property {boolean} [readonly] - 是否只读
 * @property {boolean} [required] - 是否必填
 * @property {string} [placeholder] - 占位提示文本
 * @property {number} [min] - 最小值（number类型）
 * @property {number} [max] - 最大值（number类型）
 * @property {number} [step] - 步长（number类型）
 * @property {boolean} [hidden] - 是否在属性面板中隐藏
 * @property {string} [group] - 属性分组名称
 * @property {string} [condition] - 显示条件（依赖其他属性值）
 */

// ============================================================================
// 事件配置类型
// ============================================================================

/**
 * 组件事件配置
 * @typedef {Object} ComponentEvent
 * @property {string} name - 事件名
 * @property {string} label - 事件显示标签
 * @property {string} [detail] - 事件详情描述
 * @property {string} [params] - 事件参数说明
 * @property {string} [description] - 事件详细描述
 */

// ============================================================================
// 插槽配置类型
// ============================================================================

/**
 * 插槽作用域变量
 * @typedef {Object} SlotScopeVariable
 * @property {string} name - 变量名
 * @property {string} label - 变量显示标签
 * @property {string} [type] - 变量类型
 * @property {string} [description] - 变量描述
 */

/**
 * 组件插槽配置
 * @typedef {Object} ComponentSlot
 * @property {string} name - 插槽名称（'-' 或 'default' 表示默认插槽）
 * @property {string} label - 插槽显示标签
 * @property {string} [description] - 插槽详细描述
 * @property {boolean} [isContentSlot] - 是否为内容插槽（false表示子组件插槽）
 * @property {string} [child] - 期望的子组件类型
 * @property {SlotScopeVariable[]} [slotScope] - 插槽作用域变量
 */

// ============================================================================
// 样式配置类型
// ============================================================================

/**
 * CSS变量配置
 * @typedef {Object} CssVariableConfig
 * @property {string} name - CSS变量名（如 --ea-button-primary-bg-color）
 * @property {string} label - 变量显示标签
 * @property {('string'|'color'|'length'|'select'|'number')} type - 变量类型
 * @property {string|number} [default] - 默认值
 * @property {SelectOption[]} [options] - 选项（当type为select时）
 * @property {string} [description] - 变量描述
 */

/**
 * CSS Part样式配置
 * @typedef {Object} CssPartConfig
 * @property {string} name - Part名称
 * @property {string} label - Part显示标签
 * @property {string} [description] - Part描述
 * @property {string[]} [styles] - 可配置的CSS属性列表
 */

/**
 * 样式配置
 * @typedef {Object} StyleConfig
 * @property {CssVariableConfig[]} [cssVariables] - CSS变量配置列表
 * @property {CssPartConfig[]} [parts] - CSS Part配置列表
 */

// ============================================================================
// 方法配置类型
// ============================================================================

/**
 * 组件方法配置
 * @typedef {Object} ComponentMethod
 * @property {string} name - 方法名
 * @property {string} label - 方法显示标签
 * @property {string} [description] - 方法描述
 * @property {Object[]} [params] - 方法参数
 * @property {string} [returnType] - 返回值类型
 */

// ============================================================================
// 特殊配置类型
// ============================================================================

/**
 * 特殊配置（用于复杂组件如select、radioGroup等）
 * @typedef {Object} SpecialConfig
 * @property {string} type - 特殊配置类型，如 'selectOptions', 'radioGroupOptions', 'checkboxGroupOptions', 'dropdownOptions'
 * @property {string} propName - 对应的数据属性名，如 'optionsConfig'
 */

/**
 * 远程组件配置
 * @typedef {Object} RemoteConfig
 * @property {string} id - 组件ID
 * @property {string} url - 组件脚本URL
 * @property {string} [styleUrl] - 组件样式URL
 * @property {string} [exportName] - 导出的组件名
 */

/**
 * 页面级组件配置
 * @typedef {Object} PageLevelConfig
 * @property {ComponentProp} enabled - 是否启用
 * @property {ComponentProp} visibilityHeight - 显示阈值
 * @property {ComponentProp} right - 距右侧距离
 * @property {ComponentProp} bottom - 距底部距离
 * @property {ComponentProp} icon - 图标类名
 * @property {ComponentProp} smooth - 平滑滚动
 */

// ============================================================================
// 主组件元数据类型
// ============================================================================

/**
 * 组件元数据（完整定义）
 * @typedef {Object} ComponentMeta
 * @property {string} type - 组件类型标识（唯一）
 * @property {string} name - 组件显示名称
 * @property {ComponentCategory} category - 组件分类
 * @property {string} icon - 组件图标名称
 * @property {ComponentProp[]} [props] - 属性配置列表
 * @property {ComponentEvent[]} [events] - 事件配置列表
 * @property {ComponentSlot[]} [slots] - 插槽配置列表
 * @property {StyleConfig} [styleConfig] - 样式配置
 * @property {ComponentMethod[]} [methods] - 方法配置列表（主要用于服务组件）
 * @property {string[]} [childComponents] - 子组件类型列表
 * @property {string[]} [parentComponents] - 父组件类型列表（用于子组件）
 * @property {boolean} [isChildComponent] - 是否为子组件
 * @property {boolean} [isService] - 是否为服务组件（如Message、Notification）
 * @property {boolean} [isPageLevel] - 是否为页面级组件
 * @property {boolean} [isRemote] - 是否为远程组件
 * @property {string} [defaultSlot] - 默认插槽名称（用于特殊插槽映射）
 * @property {SpecialConfig} [specialConfig] - 特殊配置
 * @property {RemoteConfig} [remoteConfig] - 远程组件配置
 * @property {PageLevelConfig} [pageLevelConfig] - 页面级组件配置
 * @property {string[]} [configSource] - 配置来源，如 ['project', 'page']
 * @property {string[]} [styles] - 样式配置（旧版，建议迁移到styleConfig）
 */

/**
 * 组件元数据（简化版，用于列表展示）
 * @typedef {Object} ComponentMetaBrief
 * @property {string} type - 组件类型标识
 * @property {string} name - 组件显示名称
 * @property {ComponentCategory} category - 组件分类
 * @property {string} icon - 组件图标名称
 */

// ============================================================================
// 分类相关类型
// ============================================================================

/**
 * 分类项
 * @typedef {Object} CategoryItem
 * @property {string} key - 分类键名
 * @property {string} value - 分类值
 * @property {string} label - 分类显示标签
 */

/**
 * 分组后的组件列表
 * @typedef {Object} GroupedComponents
 * @property {ComponentMeta[]} regular - 普通组件列表
 * @property {ComponentMeta[]} child - 子组件列表
 */

/**
 * 按父组件分组的组件项
 * @typedef {Object} ParentGroupItem
 * @property {string} parentType - 父组件类型
 * @property {string} parentName - 父组件名称（用于分组标题）
 * @property {ComponentMeta[]} components - 该分组下的所有组件（父组件+子组件）
 */

// ============================================================================
// 远程配置存储类型
// ============================================================================

/**
 * 远程组件存储配置
 * @typedef {Object} RemoteStoredConfig
 * @property {string} globalUrl - 全局基础URL
 * @property {RemoteStoredComponent[]} components - 远程组件列表
 */

/**
 * 远程组件存储项
 * @typedef {Object} RemoteStoredComponent
 * @property {string} id - 组件ID
 * @property {string} name - 组件名称
 * @property {string} [icon] - 组件图标
 * @property {string} url - 组件脚本URL（相对或绝对）
 * @property {string} [styleUrl] - 组件样式URL
 * @property {string} [exportName] - 导出的组件名
 * @property {ComponentProp[]} [props] - 属性配置
 * @property {ComponentEvent[]} [events] - 事件配置
 * @property {ComponentSlot[]} [slots] - 插槽配置
 */

/**
 * @exports {PropType} PropType
 * @exports {ComponentCategory} ComponentCategory
 * @exports {SelectOption} SelectOption
 * @exports {ComponentProp} ComponentProp
 * @exports {ComponentEvent} ComponentEvent
 * @exports {ComponentSlot} ComponentSlot
 * @exports {StyleConfig} StyleConfig
 * @exports {ComponentMeta} ComponentMeta
 * @exports {ComponentMetaBrief} ComponentMetaBrief
 * @exports {GroupedComponents} GroupedComponents
 * @exports {ParentGroupItem} ParentGroupItem
 */

export {}
