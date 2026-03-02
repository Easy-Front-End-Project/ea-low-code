/**
 * 组件元数据配置
 * 定义 ea-ui-component 组件的元数据，用于组件面板和属性面板
 */

// 基础属性类型定义
export const PropTypes = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  SELECT: 'select',
  COLOR: 'color',
  OBJECT: 'object',
  ARRAY: 'array',
  FUNCTION: 'function',
}

// 组件分类
export const ComponentCategories = {
  BASIC: 'basic',
  FORM: 'form',
  DATA: 'data',
  NAVIGATION: 'navigation',
  FEEDBACK: 'feedback',
  LAYOUT: 'layout',
}

// P0 核心组件元数据（约20个）
export const componentMetaList = [
  // Basic 基础组件
  {
    type: 'ea-button',
    name: '按钮',
    category: ComponentCategories.BASIC,
    icon: 'Button',
    props: [
      {
        name: 'type',
        label: '类型',
        type: PropTypes.SELECT,
        default: 'normal',
        options: [
          { label: '默认', value: 'normal' },
          { label: '主要', value: 'primary' },
          { label: '成功', value: 'success' },
          { label: '警告', value: 'warning' },
          { label: '危险', value: 'danger' },
        ],
      },
      {
        name: 'size',
        label: '尺寸',
        type: PropTypes.SELECT,
        default: 'default',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' },
        ],
      },
      {
        name: 'disabled',
        label: '禁用',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'loading',
        label: '加载中',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'plain',
        label: '朴素按钮',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [{ name: 'click', label: '点击事件' }],
    slots: [{ name: 'default', label: '默认插槽' }],
    // CSS 变量样式配置
    styleConfig: {
      dynamicCssVariables: {
        text: {
          label: '文字颜色',
          type: 'color',
          template: '--ea-button-{type}-text',
          defaultValue: {
            normal: '#606266',
            primary: '#ffffff',
            success: '#ffffff',
            info: '#ffffff',
            warning: '#ffffff',
            danger: '#ffffff',
          },
        },
        background: {
          label: '背景颜色',
          type: 'color',
          template: '--ea-button-{type}-500',
          defaultValue: {
            normal: '#ffffff',
            primary: '#409eff',
            success: '#67c23a',
            info: '#909399',
            warning: '#e6a23c',
            danger: '#f56c6c',
          },
        },
        border: {
          label: '边框颜色',
          type: 'color',
          template: '--ea-button-{type}-border',
          defaultValue: {
            normal: '#dcdfe6',
            primary: '#409eff',
            success: '#67c23a',
            info: '#909399',
            warning: '#e6a23c',
            danger: '#f56c6c',
          },
        },
      },
      cssVariables: [
        {
          name: '--ea-button-border-radius',
          label: '圆角大小',
          type: 'string',
          default: '4px',
        },
      ],
      parts: [
        {
          name: 'container',
          label: '按钮容器',
          styles: ['background-color', 'color', 'border-color', 'border-radius'],
        },
      ],
    },
  },
  {
    type: 'ea-icon',
    name: '图标',
    category: ComponentCategories.BASIC,
    icon: 'Icon',
    props: [
      {
        name: 'icon',
        label: '图标名称',
        type: PropTypes.STRING,
        default: 'icon-',
      },
      {
        name: 'size',
        label: '尺寸',
        type: PropTypes.NUMBER,
        default: 16,
      },
      {
        name: 'color',
        label: '颜色',
        type: PropTypes.COLOR,
        default: '#000000',
      },
    ],
    events: [],
    slots: [],
  },

  // Form 表单组件
  {
    type: 'ea-input',
    name: '输入框',
    category: ComponentCategories.FORM,
    icon: 'Input',
    props: [
      {
        name: 'modelValue',
        label: '绑定值',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'placeholder',
        label: '占位提示',
        type: PropTypes.STRING,
        default: '请输入',
      },
      {
        name: 'disabled',
        label: '禁用',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'clearable',
        label: '可清空',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'type',
        label: '类型',
        type: PropTypes.SELECT,
        default: 'text',
        options: [
          { label: '文本', value: 'text' },
          { label: '密码', value: 'password' },
          { label: '数字', value: 'number' },
        ],
      },
    ],
    events: [
      { name: 'input', label: '输入事件' },
      { name: 'change', label: '改变事件' },
      { name: 'focus', label: '聚焦事件' },
      { name: 'blur', label: '失焦事件' },
    ],
    slots: [
      { name: 'prefix', label: '前缀插槽' },
      { name: 'suffix', label: '后缀插槽' },
    ],
  },
  {
    type: 'ea-select',
    name: '选择器',
    category: ComponentCategories.FORM,
    icon: 'Select',
    props: [
      {
        name: 'modelValue',
        label: '绑定值',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'placeholder',
        label: '占位提示',
        type: PropTypes.STRING,
        default: '请选择',
      },
      {
        name: 'disabled',
        label: '禁用',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'clearable',
        label: '可清空',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'multiple',
        label: '多选',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [
      { name: 'change', label: '改变事件' },
      { name: 'visible-change', label: '下拉框出现/隐藏' },
    ],
    slots: [{ name: 'default', label: '选项插槽' }],
  },
  {
    type: 'ea-checkbox',
    name: '复选框',
    category: ComponentCategories.FORM,
    icon: 'Checkbox',
    props: [
      {
        name: 'modelValue',
        label: '绑定值',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'label',
        label: '标签文本',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'disabled',
        label: '禁用',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'border',
        label: '边框',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [{ name: 'change', label: '改变事件' }],
    slots: [{ name: 'default', label: '默认插槽' }],
  },
  {
    type: 'ea-radio',
    name: '单选框',
    category: ComponentCategories.FORM,
    icon: 'Radio',
    props: [
      {
        name: 'modelValue',
        label: '绑定值',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'label',
        label: '标签文本',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'disabled',
        label: '禁用',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'border',
        label: '边框',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [{ name: 'change', label: '改变事件' }],
    slots: [{ name: 'default', label: '默认插槽' }],
  },
  {
    type: 'ea-switch',
    name: '开关',
    category: ComponentCategories.FORM,
    icon: 'Switch',
    props: [
      {
        name: 'modelValue',
        label: '绑定值',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'disabled',
        label: '禁用',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'activeText',
        label: '开启文本',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'inactiveText',
        label: '关闭文本',
        type: PropTypes.STRING,
        default: '',
      },
    ],
    events: [{ name: 'change', label: '改变事件' }],
    slots: [],
  },

  // Layout 布局组件
  {
    type: 'ea-container',
    name: '布局容器',
    category: ComponentCategories.LAYOUT,
    icon: 'Container',
    props: [
      {
        name: 'direction',
        label: '排列方向',
        type: PropTypes.SELECT,
        default: 'horizontal',
        options: [
          { label: '水平', value: 'horizontal' },
          { label: '垂直', value: 'vertical' },
        ],
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '默认插槽' }],
  },
  {
    type: 'ea-header',
    name: '顶栏',
    category: ComponentCategories.LAYOUT,
    icon: 'Header',
    props: [
      {
        name: 'height',
        label: '高度',
        type: PropTypes.STRING,
        default: '60px',
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '默认插槽' }],
  },
  {
    type: 'ea-aside',
    name: '侧边栏',
    category: ComponentCategories.LAYOUT,
    icon: 'Aside',
    props: [
      {
        name: 'width',
        label: '宽度',
        type: PropTypes.STRING,
        default: '200px',
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '默认插槽' }],
  },
  {
    type: 'ea-main',
    name: '主要内容',
    category: ComponentCategories.LAYOUT,
    icon: 'Main',
    props: [],
    events: [],
    slots: [{ name: 'default', label: '默认插槽' }],
  },
  {
    type: 'ea-card',
    name: '卡片',
    category: ComponentCategories.LAYOUT,
    icon: 'Card',
    props: [
      {
        name: 'header',
        label: '标题',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'shadow',
        label: '阴影',
        type: PropTypes.SELECT,
        default: 'always',
        options: [
          { label: '总是显示', value: 'always' },
          { label: '悬停显示', value: 'hover' },
          { label: '从不显示', value: 'never' },
        ],
      },
    ],
    events: [],
    slots: [
      { name: 'default', label: '内容插槽' },
      { name: 'header', label: '标题插槽' },
    ],
  },

  // Data 数据展示
  {
    type: 'ea-table',
    name: '表格',
    category: ComponentCategories.DATA,
    icon: 'Table',
    props: [
      {
        name: 'data',
        label: '表格数据',
        type: PropTypes.ARRAY,
        default: [],
      },
      {
        name: 'stripe',
        label: '斑马纹',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'border',
        label: '边框',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'highlightCurrentRow',
        label: '高亮当前行',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [
      { name: 'row-click', label: '行点击事件' },
      { name: 'selection-change', label: '选择改变事件' },
    ],
    slots: [
      { name: 'default', label: '列定义插槽' },
      { name: 'empty', label: '空数据插槽' },
    ],
  },
  {
    type: 'ea-pagination',
    name: '分页',
    category: ComponentCategories.DATA,
    icon: 'Pagination',
    props: [
      {
        name: 'currentPage',
        label: '当前页',
        type: PropTypes.NUMBER,
        default: 1,
      },
      {
        name: 'pageSize',
        label: '每页条数',
        type: PropTypes.NUMBER,
        default: 10,
      },
      {
        name: 'total',
        label: '总条数',
        type: PropTypes.NUMBER,
        default: 0,
      },
      {
        name: 'layout',
        label: '布局',
        type: PropTypes.STRING,
        default: 'prev, pager, next, jumper, ->, total',
      },
    ],
    events: [
      { name: 'current-change', label: '页码改变事件' },
      { name: 'size-change', label: '每页条数改变事件' },
    ],
    slots: [],
  },

  // Navigation 导航
  {
    type: 'ea-menu',
    name: '菜单',
    category: ComponentCategories.NAVIGATION,
    icon: 'Menu',
    props: [
      {
        name: 'defaultActive',
        label: '当前激活菜单',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'mode',
        label: '模式',
        type: PropTypes.SELECT,
        default: 'vertical',
        options: [
          { label: '垂直', value: 'vertical' },
          { label: '水平', value: 'horizontal' },
        ],
      },
      {
        name: 'collapse',
        label: '折叠',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'backgroundColor',
        label: '背景色',
        type: PropTypes.COLOR,
        default: '#ffffff',
      },
      {
        name: 'textColor',
        label: '文字颜色',
        type: PropTypes.COLOR,
        default: '#303133',
      },
      {
        name: 'activeTextColor',
        label: '激活文字颜色',
        type: PropTypes.COLOR,
        default: '#409eff',
      },
    ],
    events: [
      { name: 'select', label: '菜单选择事件' },
      { name: 'open', label: '菜单展开事件' },
      { name: 'close', label: '菜单收起事件' },
    ],
    slots: [{ name: 'default', label: '菜单项插槽' }],
  },
  {
    type: 'ea-tabs',
    name: '标签页',
    category: ComponentCategories.NAVIGATION,
    icon: 'Tabs',
    props: [
      {
        name: 'modelValue',
        label: '绑定值',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'type',
        label: '类型',
        type: PropTypes.SELECT,
        default: '',
        options: [
          { label: '默认', value: '' },
          { label: '卡片', value: 'card' },
          { label: '边框卡片', value: 'border-card' },
        ],
      },
      {
        name: 'closable',
        label: '可关闭',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [
      { name: 'tab-click', label: '标签点击事件' },
      { name: 'tab-remove', label: '标签移除事件' },
    ],
    slots: [{ name: 'default', label: '标签页插槽' }],
  },
  {
    type: 'ea-breadcrumb',
    name: '面包屑',
    category: ComponentCategories.NAVIGATION,
    icon: 'Breadcrumb',
    props: [
      {
        name: 'separator',
        label: '分隔符',
        type: PropTypes.STRING,
        default: '/',
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '面包屑项插槽' }],
  },

  // Feedback 反馈
  {
    type: 'ea-dialog',
    name: '对话框',
    category: ComponentCategories.FEEDBACK,
    icon: 'Dialog',
    props: [
      {
        name: 'modelValue',
        label: '是否显示',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'title',
        label: '标题',
        type: PropTypes.STRING,
        default: '提示',
      },
      {
        name: 'width',
        label: '宽度',
        type: PropTypes.STRING,
        default: '50%',
      },
      {
        name: 'top',
        label: '顶部距离',
        type: PropTypes.STRING,
        default: '15vh',
      },
      {
        name: 'modal',
        label: '遮罩层',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'closeOnClickModal',
        label: '点击遮罩关闭',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'showClose',
        label: '显示关闭按钮',
        type: PropTypes.BOOLEAN,
        default: true,
      },
    ],
    events: [
      { name: 'open', label: '打开事件' },
      { name: 'close', label: '关闭事件' },
      { name: 'opened', label: '打开动画结束' },
      { name: 'closed', label: '关闭动画结束' },
    ],
    slots: [
      { name: 'default', label: '内容插槽' },
      { name: 'title', label: '标题插槽' },
      { name: 'footer', label: '底部插槽' },
    ],
  },
  {
    type: 'ea-alert',
    name: '警告',
    category: ComponentCategories.FEEDBACK,
    icon: 'Alert',
    props: [
      {
        name: 'title',
        label: '标题',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'type',
        label: '类型',
        type: PropTypes.SELECT,
        default: 'info',
        options: [
          { label: '成功', value: 'success' },
          { label: '警告', value: 'warning' },
          { label: '危险', value: 'danger' },
          { label: '信息', value: 'info' },
        ],
      },
      {
        name: 'closable',
        label: '可关闭',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'center',
        label: '居中',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'showIcon',
        label: '显示图标',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [{ name: 'close', label: '关闭事件' }],
    slots: [
      { name: 'default', label: '内容插槽' },
      { name: 'title', label: '标题插槽' },
    ],
  },
  {
    type: 'ea-message',
    name: '消息提示',
    category: ComponentCategories.FEEDBACK,
    icon: 'Message',
    props: [
      {
        name: 'message',
        label: '消息文字',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'type',
        label: '类型',
        type: PropTypes.SELECT,
        default: 'info',
        options: [
          { label: '成功', value: 'success' },
          { label: '警告', value: 'warning' },
          { label: '危险', value: 'danger' },
          { label: '信息', value: 'info' },
        ],
      },
      {
        name: 'duration',
        label: '显示时长(ms)',
        type: PropTypes.NUMBER,
        default: 3000,
      },
      {
        name: 'showClose',
        label: '显示关闭按钮',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'center',
        label: '居中',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [],
    slots: [],
  },
]

// 根据分类获取组件
export function getComponentsByCategory(category) {
  return componentMetaList.filter((comp) => comp.category === category)
}

// 根据类型获取组件元数据
export function getComponentMeta(type) {
  return componentMetaList.find((comp) => comp.type === type)
}

// 获取所有分类
export function getCategories() {
  return Object.entries(ComponentCategories).map(([key, value]) => ({
    key,
    value,
    label: getCategoryLabel(value),
  }))
}

// 获取分类标签
function getCategoryLabel(category) {
  const labels = {
    [ComponentCategories.BASIC]: '基础组件',
    [ComponentCategories.FORM]: '表单组件',
    [ComponentCategories.DATA]: '数据展示',
    [ComponentCategories.NAVIGATION]: '导航组件',
    [ComponentCategories.FEEDBACK]: '反馈组件',
    [ComponentCategories.LAYOUT]: '布局组件',
  }
  return labels[category] || category
}
