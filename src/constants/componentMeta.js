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
  UNIT: 'unit',
}

// 组件分类
export const ComponentCategories = {
  BASIC: 'basic',
  FORM: 'form',
  DATA: 'data',
  NAVIGATION: 'navigation',
  FEEDBACK: 'feedback',
  LAYOUT: 'layout',
  REMOTE: 'remote',
}

// Basic 基础组件
const basicComponents = [
  {
    type: 'ea-button',
    name: '按钮',
    category: ComponentCategories.BASIC,
    icon: 'Button',
    props: [
      {
        name: 'children',
        label: '按钮文本',
        type: PropTypes.STRING,
        default: '按钮',
      },
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
        default: 'medium',
        options: [
          { label: '大', value: 'large' },
          { label: '中', value: 'medium' },
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
      {
        name: 'round',
        label: '圆角按钮',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'circle',
        label: '圆形按钮',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'text',
        label: '文字按钮',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'link',
        label: '链接按钮',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'href',
        label: '链接地址',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'icon',
        label: '图标类名',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'button-type',
        label: '原生按钮类型',
        type: PropTypes.SELECT,
        default: 'button',
        options: [
          { label: '普通按钮', value: 'button' },
          { label: '提交按钮', value: 'submit' },
          { label: '重置按钮', value: 'reset' },
        ],
      },
    ],
    events: [{ name: 'click', label: '点击事件' }],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      cssVariables: [
        {
          name: '--ea-button-border-radius',
          label: '圆角大小',
          type: 'string',
          default: '4px',
        },
        {
          name: '--ea-button-normal-text',
          label: '默认按钮文字颜色',
          type: 'color',
          default: '#606266',
        },
        {
          name: '--ea-button-normal-background',
          label: '默认按钮背景颜色',
          type: 'color',
          default: '#ffffff',
        },
        {
          name: '--ea-button-normal-border',
          label: '默认按钮边框颜色',
          type: 'color',
          default: '#dcdfe6',
        },
        {
          name: '--ea-button-primary-500',
          label: '主要按钮背景色',
          type: 'color',
          default: '#409eff',
        },
        {
          name: '--ea-button-primary-text',
          label: '主要按钮文字颜色',
          type: 'color',
          default: '#ffffff',
        },
        {
          name: '--ea-button-success-500',
          label: '成功按钮背景色',
          type: 'color',
          default: '#67c23a',
        },
        {
          name: '--ea-button-success-text',
          label: '成功按钮文字颜色',
          type: 'color',
          default: '#ffffff',
        },
        {
          name: '--ea-button-warning-500',
          label: '警告按钮背景色',
          type: 'color',
          default: '#e6a23c',
        },
        {
          name: '--ea-button-warning-text',
          label: '警告按钮文字颜色',
          type: 'color',
          default: '#ffffff',
        },
        {
          name: '--ea-button-danger-500',
          label: '危险按钮背景色',
          type: 'color',
          default: '#f56c6c',
        },
        {
          name: '--ea-button-danger-text',
          label: '危险按钮文字颜色',
          type: 'color',
          default: '#ffffff',
        },
        {
          name: '--ea-button-info-500',
          label: '信息按钮背景色',
          type: 'color',
          default: '#909399',
        },
        {
          name: '--ea-button-info-text',
          label: '信息按钮文字颜色',
          type: 'color',
          default: '#ffffff',
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
        label: '图标类名',
        type: PropTypes.STRING,
        default: 'icon-',
      },
      {
        name: 'color',
        label: '颜色',
        type: PropTypes.COLOR,
        default: '',
      },
    ],
    events: [],
    slots: [],
    styleConfig: {
      cssVariables: [
        {
          name: '--ea-icon-size',
          label: '图标大小',
          type: 'string',
          default: '14px',
        },
      ],
      parts: [
        {
          name: 'container',
          label: '图标容器',
          styles: ['color', 'font-size'],
        },
      ],
    },
  },
  {
    type: 'ea-text',
    name: '文本',
    category: ComponentCategories.BASIC,
    icon: 'Text',
    props: [
      {
        name: 'children',
        label: '文本内容',
        type: PropTypes.STRING,
        default: '文本',
      },
      {
        name: 'type',
        label: '类型',
        type: PropTypes.SELECT,
        default: 'normal',
        options: [
          { label: '默认', value: 'normal' },
          { label: '主要', value: 'primary' },
          { label: '成功', value: 'success' },
          { label: '信息', value: 'info' },
          { label: '警告', value: 'warning' },
          { label: '危险', value: 'danger' },
        ],
      },
      {
        name: 'size',
        label: '尺寸',
        type: PropTypes.SELECT,
        default: 'medium',
        options: [
          { label: '大', value: 'large' },
          { label: '中', value: 'medium' },
          { label: '小', value: 'small' },
        ],
      },
      {
        name: 'truncated',
        label: '省略显示',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'line-clamp',
        label: '多行省略',
        type: PropTypes.NUMBER,
        default: 0,
      },
      {
        name: 'tag',
        label: '标签类型',
        type: PropTypes.STRING,
        default: 'span',
      },
      {
        name: 'title',
        label: '标题提示',
        type: PropTypes.STRING,
        default: '',
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '文本容器',
          styles: ['color', 'font-size', 'font-weight'],
        },
      ],
    },
  },
  {
    type: 'ea-link',
    name: '链接',
    category: ComponentCategories.BASIC,
    icon: 'Link',
    props: [
      {
        name: 'children',
        label: '链接文本',
        type: PropTypes.STRING,
        default: '链接',
      },
      {
        name: 'type',
        label: '类型',
        type: PropTypes.SELECT,
        default: 'normal',
        options: [
          { label: '默认', value: 'normal' },
          { label: '主要', value: 'primary' },
          { label: '成功', value: 'success' },
          { label: '信息', value: 'info' },
          { label: '警告', value: 'warning' },
          { label: '危险', value: 'danger' },
        ],
      },
      {
        name: 'disabled',
        label: '禁用',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'underline',
        label: '下划线',
        type: PropTypes.SELECT,
        default: '',
        options: [
          { label: '无', value: '' },
          { label: '总是显示', value: 'always' },
          { label: '悬停显示', value: 'hover' },
          { label: '从不显示', value: 'never' },
        ],
      },
      {
        name: 'href',
        label: '链接地址',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'icon',
        label: '图标类名',
        type: PropTypes.STRING,
        default: '',
      },
    ],
    events: [{ name: 'click', label: '点击事件' }],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '链接容器',
          styles: ['color', 'text-decoration'],
        },
        {
          name: 'icon',
          label: '图标',
          styles: ['color', 'font-size'],
        },
      ],
    },
  },
  {
    type: 'ea-space',
    name: '间距',
    category: ComponentCategories.BASIC,
    icon: 'Space',
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
      {
        name: 'size',
        label: '间距大小',
        type: PropTypes.SELECT,
        default: 'default',
        options: [
          { label: '小间距', value: 'small' },
          { label: '中间距', value: 'default' },
          { label: '大间距', value: 'large' },
        ],
      },
      {
        name: 'wrap',
        label: '自动换行',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'spacer',
        label: '分隔符',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'alignment',
        label: '对齐方式',
        type: PropTypes.SELECT,
        default: '',
        options: [
          { label: '默认', value: '' },
          { label: '居中对齐', value: 'center' },
          { label: '起始对齐', value: 'flex-start' },
          { label: '结束对齐', value: 'flex-end' },
          { label: '基线对齐', value: 'baseline' },
          { label: '拉伸填充', value: 'stretch' },
        ],
      },
      {
        name: 'fill',
        label: '填充容器',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'fill-ratio',
        label: '填充比例',
        type: PropTypes.NUMBER,
        default: 100,
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      cssVariables: [
        {
          name: '--ea-space-gap-small',
          label: '间距【小间距】',
          type: 'string',
          default: '0.5rem',
        },
        {
          name: '--ea-space-gap-default',
          label: '间距【中间距】',
          type: 'string',
          default: '0.75rem',
        },
        {
          name: '--ea-space-gap-large',
          label: '间距【大间距】',
          type: 'string',
          default: '1rem',
        },
      ],
      parts: [
        {
          name: 'container',
          label: '间距容器',
          styles: ['gap', 'align-items'],
        },
        {
          name: 'spacer',
          label: '分隔符',
          styles: ['color', 'font-size'],
        },
      ],
    },
  },
]

// Form 表单组件
const formComponents = [
  {
    type: 'form',
    name: '表单',
    category: ComponentCategories.FORM,
    icon: 'Form',
    props: [
      {
        name: 'action',
        label: '提交地址',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'method',
        label: '提交方法',
        type: PropTypes.SELECT,
        default: 'get',
        options: [
          { label: 'GET', value: 'get' },
          { label: 'POST', value: 'post' },
        ],
      },
      {
        name: 'enctype',
        label: '编码类型',
        type: PropTypes.SELECT,
        default: 'application/x-www-form-urlencoded',
        options: [
          { label: 'URL编码', value: 'application/x-www-form-urlencoded' },
          { label: '表单数据', value: 'multipart/form-data' },
          { label: '纯文本', value: 'text/plain' },
        ],
      },
      {
        name: 'target',
        label: '提交目标',
        type: PropTypes.SELECT,
        default: '_self',
        options: [
          { label: '当前窗口', value: '_self' },
          { label: '新窗口', value: '_blank' },
          { label: '父窗口', value: '_parent' },
          { label: '顶层窗口', value: '_top' },
        ],
      },
      {
        name: 'novalidate',
        label: '禁用验证',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [
      { name: 'submit', label: '提交事件' },
      { name: 'reset', label: '重置事件' },
      { name: 'change', label: '改变事件' },
      { name: 'input', label: '输入事件' },
    ],
    slots: [{ name: 'default', label: '表单内容' }],
  },
  {
    type: 'ea-input',
    name: '输入框',
    category: ComponentCategories.FORM,
    icon: 'Input',
    props: [
      {
        name: 'type',
        label: '输入框类型',
        type: PropTypes.SELECT,
        default: 'text',
        options: [
          { label: '文本', value: 'text' },
          { label: '密码', value: 'password' },
          { label: '多行文本', value: 'textarea' },
          { label: '数字', value: 'number' },
          { label: '日期', value: 'date' },
          { label: '时间', value: 'time' },
          { label: '邮箱', value: 'email' },
          { label: '电话', value: 'tel' },
          { label: '链接', value: 'url' },
        ],
      },
      {
        name: 'value',
        label: '输入框值',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'placeholder',
        label: '占位符',
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
        name: 'clearable',
        label: '可清空',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'clear-icon',
        label: '清除图标',
        type: PropTypes.STRING,
        default: 'icon-cancel',
      },
      {
        name: 'show-password',
        label: '显示密码切换',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'prefix-icon',
        label: '前缀图标',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'suffix-icon',
        label: '后缀图标',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'rows',
        label: '文本域行数',
        type: PropTypes.NUMBER,
        default: 2,
      },
      {
        name: 'autosize',
        label: '自适应高度',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'min-rows',
        label: '最小行数',
        type: PropTypes.NUMBER,
        default: 0,
      },
      {
        name: 'max-rows',
        label: '最大行数',
        type: PropTypes.NUMBER,
        default: 0,
      },
      {
        name: 'maxlength',
        label: '最大长度',
        type: PropTypes.NUMBER,
        default: 0,
      },
      {
        name: 'minlength',
        label: '最小长度',
        type: PropTypes.NUMBER,
        default: 0,
      },
      {
        name: 'show-word-limit',
        label: '显示字数统计',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'autocomplete',
        label: '自动完成',
        type: PropTypes.SELECT,
        default: 'off',
        options: [
          { label: '开启', value: 'on' },
          { label: '关闭', value: 'off' },
        ],
      },
      {
        name: 'name',
        label: 'name属性',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'readonly',
        label: '只读',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'max',
        label: '最大值',
        type: PropTypes.NUMBER,
        default: 9007199254740991,
      },
      {
        name: 'min',
        label: '最小值',
        type: PropTypes.NUMBER,
        default: -9007199254740991,
      },
      {
        name: 'step',
        label: '步长',
        type: PropTypes.NUMBER,
        default: 1,
      },
      {
        name: 'resize',
        label: '调整大小',
        type: PropTypes.SELECT,
        default: 'vertical',
        options: [
          { label: '无', value: 'none' },
          { label: '双向', value: 'both' },
          { label: '水平', value: 'horizontal' },
          { label: '垂直', value: 'vertical' },
        ],
      },
      {
        name: 'autofocus',
        label: '自动聚焦',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'aria-label',
        label: 'ARIA标签',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'tabindex',
        label: 'Tab键顺序',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'validate-event',
        label: '触发校验事件',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'inputmode',
        label: '输入模式',
        type: PropTypes.STRING,
        default: '',
      },
    ],
    events: [
      { name: 'input', label: '输入事件' },
      { name: 'change', label: '改变事件' },
      { name: 'focus', label: '聚焦事件' },
      { name: 'blur', label: '失焦事件' },
      { name: 'keydown', label: '键盘按下' },
      { name: 'mouseenter', label: '鼠标进入' },
      { name: 'mouseleave', label: '鼠标离开' },
      { name: 'compositionstart', label: '输入法开始' },
      { name: 'compositionupdate', label: '输入法更新' },
      { name: 'compositionend', label: '输入法结束' },
    ],
    slots: [
      { name: 'prepend', label: '前置插槽' },
      { name: 'prefix', label: '前缀插槽' },
      { name: 'suffix', label: '后缀插槽' },
      { name: 'append', label: '后置插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '根容器',
          styles: ['display', 'width'],
        },
        {
          name: 'prepend',
          label: '前置插槽',
          styles: ['background-color', 'border-color'],
        },
        {
          name: 'inner',
          label: '内部容器',
          styles: ['background-color', 'border-color'],
        },
        {
          name: 'prefix',
          label: '前缀插槽',
          styles: ['color'],
        },
        {
          name: 'original-wrapper',
          label: '输入框包裹',
          styles: ['background-color'],
        },
        {
          name: 'original',
          label: '原生输入框',
          styles: ['color', 'background-color'],
        },
        {
          name: 'suffix',
          label: '后缀插槽',
          styles: ['color'],
        },
        {
          name: 'clear-icon',
          label: '清除图标',
          styles: ['color'],
        },
        {
          name: 'show-password-icon',
          label: '密码图标',
          styles: ['color'],
        },
        {
          name: 'count',
          label: '字数统计',
          styles: ['color'],
        },
        {
          name: 'append',
          label: '后置插槽',
          styles: ['background-color', 'border-color'],
        },
      ],
    },
  },
  {
    type: 'ea-checkbox',
    name: '复选框',
    category: ComponentCategories.FORM,
    icon: 'Checkbox',
    props: [
      {
        name: 'label',
        label: '标签文本',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'value',
        label: '绑定值',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'name',
        label: 'name属性',
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
        name: 'checked',
        label: '是否选中',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'indeterminate',
        label: '半选状态',
        type: PropTypes.BOOLEAN,
        default: false,
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
        name: 'border',
        label: '边框样式',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'required',
        label: '必填',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [{ name: 'change', label: '改变事件' }],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['display', 'align-items'],
        },
        {
          name: 'input',
          label: '复选框按钮',
          styles: ['width', 'height', 'background-color', 'border-color'],
        },
        {
          name: 'label',
          label: '标签容器',
          styles: ['color', 'font-size'],
        },
      ],
    },
  },
  {
    type: 'ea-checkbox-group',
    name: '复选框组',
    category: ComponentCategories.FORM,
    icon: 'CheckboxGroup',
    props: [
      {
        name: 'name',
        label: 'name属性',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'value',
        label: '当前选中值',
        type: PropTypes.ARRAY,
        default: [],
      },
      {
        name: 'label',
        label: '标签文本',
        type: PropTypes.STRING,
        default: '',
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
        name: 'min',
        label: '最少可选数量',
        type: PropTypes.NUMBER,
        default: 0,
      },
      {
        name: 'max',
        label: '最多可选数量',
        type: PropTypes.NUMBER,
        default: Infinity,
      },
      {
        name: 'required',
        label: '必填',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [{ name: 'change', label: '改变事件' }],
    slots: [{ name: 'default', label: '复选框插槽', isContentSlot: false }],
    childComponents: ['ea-checkbox'],
    specialConfig: {
      type: 'checkboxGroupOptions',
      propName: 'optionsConfig',
    },
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['display', 'gap'],
        },
      ],
    },
  },
  {
    type: 'ea-color-picker',
    name: '颜色选择器',
    category: ComponentCategories.FORM,
    icon: 'ColorPicker',
    props: [
      {
        name: 'value',
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
        name: 'clearable',
        label: '可清空',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'size',
        label: '尺寸',
        type: PropTypes.SELECT,
        default: '',
        options: [
          { label: '大', value: 'large' },
          { label: '中', value: 'medium' },
          { label: '小', value: 'small' },
        ],
      },
      {
        name: 'color-format',
        label: '颜色格式',
        type: PropTypes.SELECT,
        default: 'hex',
        options: [
          { label: 'HEX', value: 'hex' },
          { label: 'RGB', value: 'rgb' },
          { label: 'HSL', value: 'hsl' },
          { label: 'HSV', value: 'hsv' },
        ],
      },
      {
        name: 'show-alpha',
        label: '支持透明度',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'tabindex',
        label: 'Tab键顺序',
        type: PropTypes.NUMBER,
        default: 0,
      },
      {
        name: 'placement',
        label: '弹出位置',
        type: PropTypes.SELECT,
        default: 'bottom',
        options: [
          { label: '顶部', value: 'top' },
          { label: '顶部开始', value: 'top-start' },
          { label: '顶部结束', value: 'top-end' },
          { label: '底部', value: 'bottom' },
          { label: '底部开始', value: 'bottom-start' },
          { label: '底部结束', value: 'bottom-end' },
          { label: '左侧', value: 'left' },
          { label: '左侧开始', value: 'left-start' },
          { label: '左侧结束', value: 'left-end' },
          { label: '右侧', value: 'right' },
          { label: '右侧开始', value: 'right-start' },
          { label: '右侧结束', value: 'right-end' },
        ],
      },
      {
        name: 'predefine',
        label: '预定义颜色',
        type: PropTypes.ARRAY,
        default: [],
      },
      {
        name: 'required',
        label: '必填',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [
      { name: 'change', label: '颜色值改变' },
      { name: 'ea-active-change', label: '颜色激活值改变' },
      { name: 'ea-invalid-color', label: '无效颜色值' },
    ],
    slots: [],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '根容器',
          styles: ['display'],
        },
        {
          name: 'trigger',
          label: '触发器',
          styles: ['width', 'height', 'border-color'],
        },
        {
          name: 'outer',
          label: '外层容器',
          styles: ['border-color'],
        },
        {
          name: 'inner',
          label: '内层容器',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-color-picker-panel',
    name: '颜色选择器面板',
    category: ComponentCategories.FORM,
    icon: 'ColorPickerPanel',
    props: [
      {
        name: 'value',
        label: '绑定值',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'color-format',
        label: '颜色格式',
        type: PropTypes.SELECT,
        default: 'hex',
        options: [
          { label: 'HEX', value: 'hex' },
          { label: 'RGB', value: 'rgb' },
          { label: 'HSL', value: 'hsl' },
          { label: 'HSV', value: 'hsv' },
        ],
      },
      {
        name: 'show-alpha',
        label: '支持透明度',
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
        name: 'border',
        label: '显示边框',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'clearable',
        label: '可编辑',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'predefine',
        label: '预定义颜色',
        type: PropTypes.ARRAY,
        default: [],
      },
    ],
    events: [
      { name: 'change', label: '颜色值改变' },
      { name: 'ea-active-change', label: '颜色激活值改变' },
      { name: 'ea-invalid-color', label: '无效颜色值' },
    ],
    slots: [{ name: 'append', label: '附加插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '容器',
          styles: ['background-color', 'border-color'],
        },
        {
          name: 'svpanel',
          label: '饱和度/亮度面板',
          styles: ['background-color'],
        },
        {
          name: 'hue-slider',
          label: '色调滑块',
          styles: ['background-color'],
        },
        {
          name: 'alpha-slider',
          label: '透明度滑块',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-radio',
    name: '单选框',
    category: ComponentCategories.FORM,
    icon: 'Radio',
    props: [
      {
        name: 'name',
        label: '组名',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'value',
        label: '选项值',
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
        name: 'label',
        label: '标签文本',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'border',
        label: '边框样式',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'size',
        label: '尺寸',
        type: PropTypes.SELECT,
        default: 'default',
        options: [
          { label: '大', value: 'large' },
          { label: '中', value: 'default' },
          { label: '小', value: 'small' },
        ],
      },
    ],
    events: [{ name: 'change', label: '选中值改变' }],
    slots: [{ name: 'default', label: '选项内容' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['display', 'align-items'],
        },
        {
          name: 'input-wrap',
          label: '输入框容器',
          styles: ['width', 'height'],
        },
        {
          name: 'input',
          label: '输入框',
          styles: ['border-color', 'background-color'],
        },
        {
          name: 'label-wrap',
          label: '标签容器',
          styles: ['color'],
        },
      ],
    },
  },
  {
    type: 'ea-radio-group',
    name: '单选框组',
    category: ComponentCategories.FORM,
    icon: 'RadioGroup',
    props: [
      {
        name: 'name',
        label: '组名',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'value',
        label: '当前选中值',
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
        label: '整体禁用',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'size',
        label: '尺寸',
        type: PropTypes.SELECT,
        default: 'default',
        options: [
          { label: '大', value: 'large' },
          { label: '中', value: 'default' },
          { label: '小', value: 'small' },
        ],
      },
      {
        name: 'border',
        label: '边框样式',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'required',
        label: '必填',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [{ name: 'change', label: '选中值改变' }],
    slots: [{ name: 'default', label: '单选框插槽', isContentSlot: false }],
    childComponents: ['ea-radio'],
    specialConfig: {
      type: 'radioGroupOptions',
      propName: 'optionsConfig',
    },
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['display', 'gap'],
        },
      ],
    },
  },
  {
    type: 'ea-input-number',
    name: '数字输入框',
    category: ComponentCategories.FORM,
    icon: 'InputNumber',
    props: [
      {
        name: 'value',
        label: '当前值',
        type: PropTypes.NUMBER,
        default: 0,
      },
      {
        name: 'label',
        label: '标签文本',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'value-on-clear',
        label: '清空时值',
        type: PropTypes.NUMBER,
        default: null,
      },
      {
        name: 'min',
        label: '最小值',
        type: PropTypes.NUMBER,
        default: -9007199254740991,
      },
      {
        name: 'max',
        label: '最大值',
        type: PropTypes.NUMBER,
        default: 9007199254740991,
      },
      {
        name: 'step',
        label: '步长',
        type: PropTypes.NUMBER,
        default: 1,
      },
      {
        name: 'step-strictly',
        label: '严格步长',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'precision',
        label: '小数精度',
        type: PropTypes.NUMBER,
        default: null,
      },
      {
        name: 'size',
        label: '尺寸',
        type: PropTypes.SELECT,
        default: 'default',
        options: [
          { label: '大', value: 'large' },
          { label: '中', value: 'default' },
          { label: '小', value: 'small' },
        ],
      },
      {
        name: 'readonly',
        label: '只读',
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
        name: 'controls',
        label: '控制按钮',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'align',
        label: '对齐方式',
        type: PropTypes.SELECT,
        default: 'center',
        options: [
          { label: '左对齐', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'right' },
        ],
      },
      {
        name: 'name',
        label: 'name属性',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'placeholder',
        label: '占位符',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'inputmode',
        label: '输入模式',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'required',
        label: '必填',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [
      { name: 'ea-change', label: '值改变' },
      { name: 'blur', label: '失焦' },
      { name: 'focus', label: '聚焦' },
    ],
    slots: [
      { name: 'prefix', label: '前缀插槽' },
      { name: 'suffix', label: '后缀插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '根容器',
          styles: ['display', 'width'],
        },
        {
          name: 'decrease',
          label: '减号按钮',
          styles: ['background-color', 'color'],
        },
        {
          name: 'prefix',
          label: '前缀插槽',
          styles: ['color'],
        },
        {
          name: 'input',
          label: '输入框',
          styles: ['color', 'background-color'],
        },
        {
          name: 'suffix',
          label: '后缀插槽',
          styles: ['color'],
        },
        {
          name: 'increase',
          label: '加号按钮',
          styles: ['background-color', 'color'],
        },
      ],
    },
  },
  {
    type: 'ea-select',
    name: '选择器',
    category: ComponentCategories.FORM,
    icon: 'Select',
    props: [
      {
        name: 'name',
        label: 'name属性',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'value',
        label: '选中值',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'placeholder',
        label: '占位符',
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
        name: 'clearable',
        label: '可清空',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'size',
        label: '尺寸',
        type: PropTypes.SELECT,
        default: '',
        options: [
          { label: '大', value: 'large' },
          { label: '中', value: 'default' },
          { label: '小', value: 'small' },
        ],
      },
      {
        name: 'multiple',
        label: '多选',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'collapse-tags',
        label: '折叠标签',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'max-collapse-tags',
        label: '最大折叠标签数',
        type: PropTypes.NUMBER,
        default: 1,
      },
      {
        name: 'filterable',
        label: '可搜索',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [
      { name: 'change', label: '选中值改变' },
      { name: 'ea-clear', label: '清空' },
      { name: 'ea-visible-change', label: '下拉显示改变' },
      { name: 'ea-remove-tag', label: '移除标签' },
    ],
    slots: [{ name: 'default', label: '选项插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['display', 'width'],
        },
        {
          name: 'input',
          label: '输入框',
          styles: ['background-color', 'border-color'],
        },
        {
          name: 'tag-wrap',
          label: '标签容器',
          styles: ['background-color'],
        },
        {
          name: 'clear-icon',
          label: '清除图标',
          styles: ['color'],
        },
        {
          name: 'dropdown-icon',
          label: '下拉图标',
          styles: ['color'],
        },
        {
          name: 'dropdown',
          label: '下拉框',
          styles: ['background-color', 'border-color'],
        },
      ],
    },
    childComponents: ['ea-option', 'ea-option-group'],
    specialConfig: {
      type: 'selectOptions',
      propName: 'optionsConfig',
    },
  },

  {
    type: 'ea-switch',
    name: '开关',
    category: ComponentCategories.FORM,
    icon: 'Switch',
    props: [
      {
        name: 'name',
        label: 'name属性',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'value',
        label: '当前值',
        type: PropTypes.STRING,
        default: 'false',
      },
      {
        name: 'label',
        label: '标签文本',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'active-value',
        label: '开启值',
        type: PropTypes.STRING,
        default: 'true',
      },
      {
        name: 'inactive-value',
        label: '关闭值',
        type: PropTypes.STRING,
        default: 'false',
      },
      {
        name: 'size',
        label: '尺寸',
        type: PropTypes.SELECT,
        default: 'default',
        options: [
          { label: '大', value: 'large' },
          { label: '中', value: 'default' },
          { label: '小', value: 'small' },
        ],
      },
      {
        name: 'inactive-text',
        label: '关闭文本',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'inactive-color',
        label: '关闭颜色',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'active-text',
        label: '开启文本',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'active-color',
        label: '开启颜色',
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
        name: 'required',
        label: '必填',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [{ name: 'change', label: '状态改变' }],
    slots: [
      { name: 'active', label: '开启插槽' },
      { name: 'inactive', label: '关闭插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['display', 'align-items'],
        },
        {
          name: 'original',
          label: '原生控件',
          styles: ['display'],
        },
        {
          name: 'label-left',
          label: '左侧文字',
          styles: ['color'],
        },
        {
          name: 'switch',
          label: '开关控件',
          styles: ['background-color', 'border-color'],
        },
        {
          name: 'label-right',
          label: '右侧文字',
          styles: ['color'],
        },
      ],
    },
  },
  {
    type: 'ea-slider',
    name: '滑块',
    category: ComponentCategories.FORM,
    icon: 'Slider',
    props: [
      {
        name: 'value',
        label: '绑定值',
        type: PropTypes.NUMBER,
        default: 0,
      },
      {
        name: 'label',
        label: '标签文本',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'min',
        label: '最小值',
        type: PropTypes.NUMBER,
        default: 0,
      },
      {
        name: 'max',
        label: '最大值',
        type: PropTypes.NUMBER,
        default: 100,
      },
      {
        name: 'step',
        label: '步长',
        type: PropTypes.NUMBER,
        default: 1,
      },
      {
        name: 'disabled',
        label: '禁用',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'vertical',
        label: '垂直模式',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'show-input',
        label: '显示输入框',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'show-tooltip',
        label: '显示提示',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'show-stops',
        label: '显示步长节点',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'placement',
        label: '提示位置',
        type: PropTypes.SELECT,
        default: 'top',
        options: [
          { label: '顶部', value: 'top' },
          { label: '顶部开始', value: 'top-start' },
          { label: '顶部结束', value: 'top-end' },
          { label: '底部', value: 'bottom' },
          { label: '底部开始', value: 'bottom-start' },
          { label: '底部结束', value: 'bottom-end' },
          { label: '左侧', value: 'left' },
          { label: '左侧开始', value: 'left-start' },
          { label: '左侧结束', value: 'left-end' },
          { label: '右侧', value: 'right' },
          { label: '右侧开始', value: 'right-start' },
          { label: '右侧结束', value: 'right-end' },
        ],
      },
      {
        name: 'size',
        label: '尺寸',
        type: PropTypes.SELECT,
        default: '',
        options: [
          { label: '大', value: 'large' },
          { label: '中', value: 'default' },
          { label: '小', value: 'small' },
        ],
      },
      {
        name: 'required',
        label: '必填',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [
      { name: 'change', label: '值改变' },
      { name: 'input', label: '拖动中' },
    ],
    slots: [],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '根容器',
          styles: ['display', 'width'],
        },
        {
          name: 'runway',
          label: '轨道容器',
          styles: ['background-color'],
        },
        {
          name: 'rail',
          label: '轨道',
          styles: ['background-color'],
        },
        {
          name: 'stop',
          label: '步长节点',
          styles: ['background-color'],
        },
        {
          name: 'trigger',
          label: '触发器',
          styles: ['display'],
        },
        {
          name: 'thumb',
          label: '滑块按钮',
          styles: ['background-color', 'border-color'],
        },
        {
          name: 'tooltip',
          label: '提示框',
          styles: ['color', 'background-color'],
        },
        {
          name: 'input',
          label: '输入框',
          styles: ['width'],
        },
      ],
    },
  },
  {
    type: 'ea-date-picker',
    name: '日期选择器',
    category: ComponentCategories.FORM,
    icon: 'DatePicker',
    props: [
      {
        name: 'value',
        label: '日期值',
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
        name: 'type',
        label: '显示类型',
        type: PropTypes.SELECT,
        default: 'date',
        options: [
          { label: '日期', value: 'date' },
          { label: '月份', value: 'month' },
          { label: '年份', value: 'year' },
        ],
      },
      {
        name: 'placeholder',
        label: '占位符',
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
        name: 'size',
        label: '尺寸',
        type: PropTypes.SELECT,
        default: 'default',
        options: [
          { label: '大', value: 'large' },
          { label: '中', value: 'default' },
          { label: '小', value: 'small' },
        ],
      },
      {
        name: 'align',
        label: '对齐方式',
        type: PropTypes.SELECT,
        default: 'left',
        options: [
          { label: '左对齐', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'right' },
        ],
      },
      {
        name: 'display-format',
        label: '显示格式',
        type: PropTypes.STRING,
        default: 'YYYY-MM-DD',
      },
      {
        name: 'value-format',
        label: '值格式',
        type: PropTypes.STRING,
        default: 'YYYY-MM-DD',
      },
      {
        name: 'width',
        label: '宽度',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'locale',
        label: '语言',
        type: PropTypes.STRING,
        default: 'en-US',
      },
      {
        name: 'required',
        label: '必填',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [
      { name: 'change', label: '日期改变' },
      { name: 'focus', label: '聚焦' },
      { name: 'blur', label: '失焦' },
      { name: 'ea-panel-change', label: '面板改变' },
      { name: 'ea-visible-change', label: '显示状态改变' },
    ],
    slots: [],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '根容器',
          styles: ['display', 'width'],
        },
        {
          name: 'input-wrap',
          label: '输入框包装器',
          styles: ['background-color', 'border-color'],
        },
        {
          name: 'input',
          label: '输入框',
          styles: ['color'],
        },
        {
          name: 'dropdown-wrap',
          label: '下拉面板包装器',
          styles: ['background-color', 'border-color'],
        },
        {
          name: 'calendar-header',
          label: '日历头部',
          styles: ['background-color'],
        },
        {
          name: 'calendar-body',
          label: '日历主体',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-time-picker',
    name: '时间选择器',
    category: ComponentCategories.FORM,
    icon: 'TimePicker',
    props: [
      {
        name: 'value',
        label: '时间值',
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
        name: 'width',
        label: '宽度',
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
        name: 'align',
        label: '对齐方式',
        type: PropTypes.SELECT,
        default: 'left',
        options: [
          { label: '左对齐', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'right' },
        ],
      },
      {
        name: 'placeholder',
        label: '占位符',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'limit-range-start',
        label: '限制开始时间',
        type: PropTypes.STRING,
        default: '00:00:00',
      },
      {
        name: 'limit-range-end',
        label: '限制结束时间',
        type: PropTypes.STRING,
        default: '23:59:59',
      },
      {
        name: 'required',
        label: '必填',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [{ name: 'change', label: '时间改变' }],
    slots: [],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '组件容器',
          styles: ['display', 'width'],
        },
        {
          name: 'input',
          label: '输入框元素',
          styles: ['background-color', 'border-color'],
        },
        {
          name: 'dropdown',
          label: '下拉面板',
          styles: ['background-color', 'border-color'],
        },
        {
          name: 'dropdown-inner-wrap',
          label: '下拉内部容器',
          styles: ['background-color'],
        },
        {
          name: 'dropdown-time',
          label: '时间列表',
          styles: ['background-color'],
        },
        {
          name: 'dropdown-item',
          label: '时间项',
          styles: ['color', 'background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-rate',
    name: '评分',
    category: ComponentCategories.FORM,
    icon: 'Rate',
    props: [
      {
        name: 'value',
        label: '当前评分',
        type: PropTypes.NUMBER,
        default: 0,
      },
      {
        name: 'label',
        label: '标签文本',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'max',
        label: '最大评分',
        type: PropTypes.NUMBER,
        default: 5,
      },
      {
        name: 'size',
        label: '尺寸',
        type: PropTypes.SELECT,
        default: '',
        options: [
          { label: '大', value: 'large' },
          { label: '中', value: 'default' },
          { label: '小', value: 'small' },
        ],
      },
      {
        name: 'readonly',
        label: '只读',
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
        name: 'required',
        label: '必填',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [
      { name: 'change', label: '评分改变' },
      { name: 'hover', label: '悬停' },
    ],
    slots: [],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['display', 'gap'],
        },
      ],
    },
  },
  {
    type: 'ea-transfer',
    name: '穿梭框',
    category: ComponentCategories.FORM,
    icon: 'Transfer',
    props: [
      {
        name: 'data',
        label: '数据源',
        type: PropTypes.ARRAY,
        default: [],
      },
      {
        name: 'value',
        label: '选中值',
        type: PropTypes.ARRAY,
        default: [],
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
        name: 'filterable',
        label: '可搜索',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'filter-placeholder',
        label: '搜索占位符',
        type: PropTypes.STRING,
        default: '请输入搜索内容',
      },
      {
        name: 'titles',
        label: '面板标题',
        type: PropTypes.ARRAY,
        default: [],
      },
      {
        name: 'button-texts',
        label: '按钮文本',
        type: PropTypes.ARRAY,
        default: [],
      },
      {
        name: 'required',
        label: '必填',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [
      { name: 'change', label: '选中项改变' },
      { name: 'ea-left-check-change', label: '左侧选中改变' },
      { name: 'ea-right-check-change', label: '右侧选中改变' },
    ],
    slots: [
      { name: 'left-empty', label: '左侧空状态' },
      { name: 'right-empty', label: '右侧空状态' },
      { name: 'left-footer', label: '左侧底部' },
      { name: 'right-footer', label: '右侧底部' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '组件容器',
          styles: ['display', 'gap'],
        },
        {
          name: 'panel',
          label: '面板容器',
          styles: ['background-color', 'border-color'],
        },
        {
          name: 'buttons',
          label: '按钮区域',
          styles: ['display', 'gap'],
        },
        {
          name: 'button',
          label: '按钮',
          styles: ['background-color', 'color'],
        },
      ],
    },
  },
  // Select 专用子组件
  {
    type: 'ea-option',
    name: '选项',
    category: ComponentCategories.FORM,
    icon: 'Option',
    isChildComponent: true,
    parentComponents: ['ea-select'],
    props: [
      {
        name: 'value',
        label: '选项值',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'label',
        label: '显示文本',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'disabled',
        label: '禁用',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '选项内容' }],
  },
  {
    type: 'ea-option-group',
    name: '选项分组',
    category: ComponentCategories.FORM,
    icon: 'OptionGroup',
    isChildComponent: true,
    parentComponents: ['ea-select'],
    props: [
      {
        name: 'label',
        label: '分组标签',
        type: PropTypes.STRING,
        default: '',
      },
    ],
    events: [],
    slots: [
      { name: 'default', label: '选项内容' },
      { name: 'header', label: '头部插槽' },
    ],
    childComponents: ['ea-option'],
  },
]

// Layout 布局组件
const layoutComponents = [
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
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '容器',
          styles: ['background-color', 'padding'],
        },
      ],
    },
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
        type: PropTypes.UNIT,
        default: '60px',
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '容器',
          styles: ['background-color', 'height', 'padding'],
        },
      ],
    },
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
        type: PropTypes.UNIT,
        default: '300px',
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '容器',
          styles: ['background-color', 'width', 'padding'],
        },
      ],
    },
  },
  {
    type: 'ea-main',
    name: '主要内容',
    category: ComponentCategories.LAYOUT,
    icon: 'Main',
    props: [],
    events: [],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '容器',
          styles: ['background-color', 'padding'],
        },
      ],
    },
  },
  {
    type: 'ea-footer',
    name: '底栏',
    category: ComponentCategories.LAYOUT,
    icon: 'Footer',
    props: [
      {
        name: 'height',
        label: '高度',
        type: PropTypes.UNIT,
        default: '60px',
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '容器',
          styles: ['background-color', 'height', 'padding'],
        },
      ],
    },
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
        name: 'footer',
        label: '页脚',
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
      { name: 'footer', label: '页脚插槽' },
    ],
  },
]

// Data 数据展示
const dataComponents = [
  {
    type: 'ea-avatar',
    name: '头像',
    category: ComponentCategories.DATA,
    icon: 'Avatar',
    props: [
      {
        name: 'icon',
        label: '图标类名',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'size',
        label: '尺寸',
        type: PropTypes.UNIT,
        default: 'default',
      },
      {
        name: 'shape',
        label: '形状',
        type: PropTypes.SELECT,
        default: 'circle',
        options: [
          { label: '圆形', value: 'circle' },
          { label: '方形', value: 'square' },
        ],
      },
      {
        name: 'src',
        label: '图片地址',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'src-set',
        label: '图片地址集',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'alt',
        label: '替代文本',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'fit',
        label: '图片适应方式',
        type: PropTypes.SELECT,
        default: 'cover',
        options: [
          { label: '填充', value: 'fill' },
          { label: '包含', value: 'contain' },
          { label: '覆盖', value: 'cover' },
          { label: '无', value: 'none' },
          { label: '缩放', value: 'scale-down' },
        ],
      },
    ],
    events: [{ name: 'error', label: '图片加载失败' }],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['width', 'height', 'border-radius'],
        },
      ],
    },
  },
  {
    type: 'ea-badge',
    name: '徽章',
    category: ComponentCategories.DATA,
    icon: 'Badge',
    props: [
      {
        name: 'value',
        label: '显示值',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'max',
        label: '最大值',
        type: PropTypes.NUMBER,
        default: null,
      },
      {
        name: 'is-dot',
        label: '小圆点',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'data-hidden',
        label: '隐藏',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'type',
        label: '类型',
        type: PropTypes.SELECT,
        default: 'danger',
        options: [
          { label: '主要', value: 'primary' },
          { label: '成功', value: 'success' },
          { label: '警告', value: 'warning' },
          { label: '危险', value: 'danger' },
          { label: '信息', value: 'info' },
        ],
      },
      {
        name: 'show-zero',
        label: '显示零值',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'color',
        label: '背景色',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'offset-x',
        label: 'X轴偏移',
        type: PropTypes.NUMBER,
        default: 0,
      },
      {
        name: 'offset-y',
        label: 'Y轴偏移',
        type: PropTypes.NUMBER,
        default: 0,
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['display'],
        },
        {
          name: 'content',
          label: '徽章内容',
          styles: ['background-color', 'color'],
        },
      ],
    },
  },
  {
    type: 'ea-calendar',
    name: '日历',
    category: ComponentCategories.DATA,
    icon: 'Calendar',
    props: [
      {
        name: 'value',
        label: '指定日期',
        type: PropTypes.STRING,
        default: Date.now(),
      },
      {
        name: 'controller-type',
        label: '控制器类型',
        type: PropTypes.SELECT,
        default: 'button',
        options: [
          { label: '按钮', value: 'button' },
          { label: '选择器', value: 'select' },
        ],
      },
    ],
    events: [{ name: 'select', label: '选择日期' }],
    slots: [{ name: 'header', label: '头部插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color', 'border-color'],
        },
        {
          name: 'header',
          label: '头部容器',
          styles: ['background-color', 'border-color'],
        },
        {
          name: 'body',
          label: '主体部分',
          styles: ['background-color'],
        },
        {
          name: 'day',
          label: '日期单元格',
          styles: ['color', 'background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-card',
    name: '卡片',
    category: ComponentCategories.DATA,
    icon: 'Card',
    props: [
      {
        name: 'header',
        label: '标题',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'footer',
        label: '页脚',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'shadow',
        label: '阴影',
        type: PropTypes.SELECT,
        default: 'always',
        options: [
          { label: '始终显示', value: 'always' },
          { label: '悬停显示', value: 'hover' },
          { label: '从不显示', value: 'never' },
        ],
      },
    ],
    events: [],
    slots: [
      { name: 'default', label: '卡片内容' },
      { name: 'header', label: '卡片标题' },
      { name: 'footer', label: '卡片页脚' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '卡片容器',
          styles: ['background-color', 'border-color', 'box-shadow'],
        },
        {
          name: 'header',
          label: '标题容器',
          styles: ['border-color', 'padding'],
        },
        {
          name: 'content',
          label: '内容容器',
          styles: ['padding'],
        },
        {
          name: 'footer',
          label: '页脚容器',
          styles: ['border-color', 'padding'],
        },
      ],
    },
  },
  {
    type: 'ea-carousel',
    name: '走马灯',
    category: ComponentCategories.DATA,
    icon: 'Carousel',
    props: [
      {
        name: 'height',
        label: '高度',
        type: PropTypes.STRING,
        default: '100%',
      },
      {
        name: 'direction',
        label: '轮播方向',
        type: PropTypes.SELECT,
        default: 'horizontal',
        options: [
          { label: '水平', value: 'horizontal' },
          { label: '垂直', value: 'vertical' },
        ],
      },
      {
        name: 'index',
        label: '当前索引',
        type: PropTypes.NUMBER,
        default: 0,
      },
      {
        name: 'trigger',
        label: '触发方式',
        type: PropTypes.SELECT,
        default: 'hover',
        options: [
          { label: '悬停', value: 'hover' },
          { label: '点击', value: 'click' },
        ],
      },
      {
        name: 'interval',
        label: '自动播放间隔',
        type: PropTypes.NUMBER,
        default: 3000,
      },
      {
        name: 'arrow',
        label: '箭头显示时机',
        type: PropTypes.SELECT,
        default: 'hover',
        options: [
          { label: '从不', value: 'never' },
          { label: '始终', value: 'always' },
          { label: '悬停', value: 'hover' },
        ],
      },
      {
        name: 'autoplay',
        label: '自动播放',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'loop',
        label: '循环播放',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'pause-on-hover',
        label: '悬停暂停',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'indicator-position',
        label: '指示器位置',
        type: PropTypes.SELECT,
        default: '',
        options: [
          { label: '默认', value: '' },
          { label: '无', value: 'none' },
          { label: '外部', value: 'outside' },
        ],
      },
    ],
    events: [{ name: 'change', label: '索引变化' }],
    slots: [{ name: 'default', label: '轮播项插槽', isContentSlot: false }],
    childComponents: ['ea-carousel-item'],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['width', 'height'],
        },
        {
          name: 'content',
          label: '内容容器',
          styles: ['background-color'],
        },
        {
          name: 'indicator-wrap',
          label: '指示器容器',
          styles: ['background-color'],
        },
        {
          name: 'indicator',
          label: '指示器项',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-carousel-item',
    name: '走马灯项',
    category: ComponentCategories.DATA,
    icon: 'CarouselItem',
    isChildComponent: true,
    parentComponents: ['ea-carousel'],
    props: [],
    events: [],
    slots: [{ name: 'default', label: '内容插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['width', 'height'],
        },
      ],
    },
  },
  {
    type: 'ea-collapse',
    name: '折叠面板',
    category: ComponentCategories.DATA,
    icon: 'Collapse',
    props: [
      {
        name: 'active',
        label: '当前激活面板',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'accordion',
        label: '手风琴模式',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'expand-icon-position',
        label: '图标位置',
        type: PropTypes.SELECT,
        default: 'left',
        options: [
          { label: '左侧', value: 'left' },
          { label: '右侧', value: 'right' },
        ],
      },
    ],
    events: [{ name: 'change', label: '面板变化' }],
    slots: [{ name: 'default', label: '折叠项插槽', isContentSlot: false }],
    childComponents: ['ea-collapse-item'],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['border-color'],
        },
      ],
    },
  },
  {
    type: 'ea-collapse-item',
    name: '折叠面板项',
    category: ComponentCategories.DATA,
    icon: 'CollapseItem',
    isChildComponent: true,
    parentComponents: ['ea-collapse'],
    props: [
      {
        name: 'title',
        label: '面板标题',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'name',
        label: '唯一标识',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'disabled',
        label: '禁用',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [],
    slots: [
      { name: 'default', label: '内容插槽' },
      { name: 'title', label: '标题插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['border-color'],
        },
      ],
    },
  },
  {
    type: 'ea-descriptions',
    name: '描述列表',
    category: ComponentCategories.DATA,
    icon: 'Descriptions',
    props: [
      {
        name: 'title',
        label: '标题',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'column',
        label: '列数',
        type: PropTypes.NUMBER,
        default: 3,
      },
      {
        name: 'border',
        label: '边框',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'size',
        label: '尺寸',
        type: PropTypes.SELECT,
        default: '',
        options: [
          { label: '大', value: 'large' },
          { label: '中', value: 'default' },
          { label: '小', value: 'small' },
        ],
      },
      {
        name: 'label-width',
        label: '标签宽度',
        type: PropTypes.UNIT,
        default: '',
      },
    ],
    events: [],
    slots: [
      { name: 'default', label: '描述项插槽' },
      { name: 'title', label: '标题插槽' },
    ],
    childComponents: ['ea-descriptions-item'],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-descriptions-item',
    name: '描述列表项',
    category: ComponentCategories.DATA,
    icon: 'DescriptionsItem',
    isChildComponent: true,
    parentComponents: ['ea-descriptions'],
    props: [
      {
        name: 'label',
        label: '标签',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'span',
        label: '跨度',
        type: PropTypes.NUMBER,
        default: 1,
      },
      {
        name: 'label-width',
        label: '标签宽度',
        type: PropTypes.UNIT,
        default: '',
      },
    ],
    events: [],
    slots: [
      { name: 'default', label: '内容插槽' },
      { name: 'label', label: '标签插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-empty',
    name: '空状态',
    category: ComponentCategories.DATA,
    icon: 'Empty',
    props: [
      {
        name: 'description',
        label: '描述',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'image',
        label: '图片',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'image-size',
        label: '图片大小',
        type: PropTypes.UNIT,
        default: '80px',
      },
    ],
    events: [],
    slots: [
      { name: 'default', label: '默认插槽' },
      { name: 'image', label: '图片插槽' },
      { name: 'description', label: '描述插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['display', 'padding'],
        },
        {
          name: 'placeholder',
          label: '图片容器',
          styles: ['width', 'height'],
        },
        {
          name: 'description',
          label: '描述容器',
          styles: ['color'],
        },
        {
          name: 'bottom',
          label: '底部容器',
          styles: ['margin-top'],
        },
      ],
    },
  },
  {
    type: 'ea-image',
    name: '图片',
    category: ComponentCategories.DATA,
    icon: 'Image',
    props: [
      {
        name: 'src',
        label: '图片地址',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'fit',
        label: '适应方式',
        type: PropTypes.SELECT,
        default: '',
        options: [
          { label: '填充', value: 'fill' },
          { label: '包含', value: 'contain' },
          { label: '覆盖', value: 'cover' },
          { label: '无', value: 'none' },
          { label: '缩放', value: 'scale-down' },
        ],
      },
      {
        name: 'alt',
        label: '替代文本',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'preview-src-list',
        label: '预览图列表',
        type: PropTypes.ARRAY,
        default: [],
      },
      {
        name: 'hide-on-click-modal',
        label: '点击遮罩关闭',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'lazy',
        label: '懒加载',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'scroll-container',
        label: '滚动容器',
        type: PropTypes.STRING,
        default: '',
      },
    ],
    events: [
      { name: 'load', label: '加载成功' },
      { name: 'error', label: '加载失败' },
    ],
    slots: [
      { name: 'placeholder', label: '占位插槽' },
      { name: 'error', label: '错误插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['width', 'height'],
        },
      ],
    },
  },
  {
    type: 'ea-progress',
    name: '进度条',
    category: ComponentCategories.DATA,
    icon: 'Progress',
    props: [
      {
        name: 'percentage',
        label: '进度百分比',
        type: PropTypes.NUMBER,
        default: 0,
      },
      {
        name: 'type',
        label: '进度条类型',
        type: PropTypes.SELECT,
        default: 'line',
        options: [
          { label: '线性', value: 'line' },
          { label: '圆环', value: 'circle' },
          { label: '仪表盘', value: 'dashboard' },
        ],
      },
      {
        name: 'stroke-width',
        label: '进度条宽度',
        type: PropTypes.UNIT,
        default: '8px',
      },
      {
        name: 'text-inside',
        label: '文字内置',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'status',
        label: '状态',
        type: PropTypes.SELECT,
        default: '',
        options: [
          { label: '成功', value: 'success' },
          { label: '警告', value: 'warning' },
          { label: '异常', value: 'exception' },
        ],
      },
      {
        name: 'indeterminate',
        label: '动画进度条',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'duration',
        label: '动画持续时间',
        type: PropTypes.NUMBER,
        default: 3,
      },
      {
        name: 'color',
        label: '进度条颜色',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'striped',
        label: '条纹样式',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'striped-flow',
        label: '条纹流动',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'show-text',
        label: '显示文字',
        type: PropTypes.BOOLEAN,
        default: true,
      },
    ],
    events: [{ name: 'change', label: '进度变化' }],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '组件根元素',
          styles: ['width'],
        },
        {
          name: 'track',
          label: '外层轨道',
          styles: ['background-color'],
        },
        {
          name: 'path',
          label: '进度路径',
          styles: ['background-color'],
        },
        {
          name: 'percentage',
          label: '文本容器',
          styles: ['color'],
        },
      ],
    },
  },
  {
    type: 'ea-tag',
    name: '标签',
    category: ComponentCategories.DATA,
    icon: 'Tag',
    props: [
      {
        name: 'type',
        label: '主题类型',
        type: PropTypes.SELECT,
        default: 'primary',
        options: [
          { label: '默认', value: 'default' },
          { label: '主要', value: 'primary' },
          { label: '成功', value: 'success' },
          { label: '信息', value: 'info' },
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
          { label: '中', value: 'default' },
          { label: '小', value: 'small' },
        ],
      },
      {
        name: 'effect',
        label: '主题效果',
        type: PropTypes.SELECT,
        default: 'light',
        options: [
          { label: '深色', value: 'dark' },
          { label: '浅色', value: 'light' },
          { label: '朴素', value: 'plain' },
        ],
      },
      {
        name: 'closable',
        label: '可关闭',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'color',
        label: '自定义颜色',
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
        name: 'round',
        label: '圆角',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'disable-transitions',
        label: '禁用过渡',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [{ name: 'ea-remove', label: '标签移除' }],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: 'Tag根容器',
          styles: ['background-color', 'color', 'border-color'],
        },
        {
          name: 'close-icon',
          label: '关闭图标',
          styles: ['color'],
        },
      ],
    },
  },
  {
    type: 'ea-check-tag',
    name: '可选标签',
    category: ComponentCategories.DATA,
    icon: 'CheckTag',
    props: [
      {
        name: 'checked',
        label: '选中状态',
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
        name: 'type',
        label: '主题类型',
        type: PropTypes.SELECT,
        default: 'default',
        options: [
          { label: '默认', value: 'default' },
          { label: '主要', value: 'primary' },
          { label: '成功', value: 'success' },
          { label: '信息', value: 'info' },
          { label: '警告', value: 'warning' },
          { label: '危险', value: 'danger' },
        ],
      },
    ],
    events: [{ name: 'change', label: '状态改变' }],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color', 'color', 'border-color'],
        },
      ],
    },
  },
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
        name: 'highlight-current-row',
        label: '高亮当前行',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'height',
        label: '高度',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'max-height',
        label: '最大高度',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'size',
        label: '尺寸',
        type: PropTypes.SELECT,
        default: '',
        options: [
          { label: '大', value: 'large' },
          { label: '中', value: 'default' },
          { label: '小', value: 'small' },
        ],
      },
      {
        name: 'fit',
        label: '自适应宽度',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'show-header',
        label: '显示表头',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'empty-text',
        label: '空数据文本',
        type: PropTypes.STRING,
        default: '暂无数据',
      },
    ],
    events: [
      { name: 'row-click', label: '行点击' },
      { name: 'row-dblclick', label: '行双击' },
      { name: 'cell-click', label: '单元格点击' },
      { name: 'header-click', label: '表头点击' },
      { name: 'selection-change', label: '选择改变' },
      { name: 'select', label: '选择' },
      { name: 'select-all', label: '全选' },
      { name: 'sort-change', label: '排序改变' },
    ],
    slots: [
      { name: 'default', label: '列定义插槽' },
      { name: 'empty', label: '空数据插槽' },
    ],
    childComponents: ['ea-table-column'],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['width'],
        },
        {
          name: 'header',
          label: '表头',
          styles: ['background-color', 'color'],
        },
        {
          name: 'body',
          label: '表体',
          styles: ['background-color'],
        },
        {
          name: 'row',
          label: '行',
          styles: ['background-color'],
        },
        {
          name: 'cell',
          label: '单元格',
          styles: ['border-color', 'padding'],
        },
      ],
    },
  },
  {
    type: 'ea-table-column',
    name: '表格列',
    category: ComponentCategories.DATA,
    icon: 'TableColumn',
    isChildComponent: true,
    parentComponents: ['ea-table'],
    props: [
      {
        name: 'prop',
        label: '字段名',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'label',
        label: '列标题',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'width',
        label: '宽度',
        type: PropTypes.UNIT,
        default: '',
      },
      {
        name: 'min-width',
        label: '最小宽度',
        type: PropTypes.UNIT,
        default: '',
      },
      {
        name: 'fixed',
        label: '固定列',
        type: PropTypes.SELECT,
        default: '',
        options: [
          { label: '左', value: 'left' },
          { label: '右', value: 'right' },
        ],
      },
      {
        name: 'sortable',
        label: '可排序',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'type',
        label: '列类型',
        type: PropTypes.SELECT,
        default: '',
        options: [
          { label: '选择', value: 'selection' },
          { label: '索引', value: 'index' },
          { label: '展开', value: 'expand' },
        ],
      },
      {
        name: 'align',
        label: '对齐方式',
        type: PropTypes.SELECT,
        default: 'left',
        options: [
          { label: '左对齐', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'right' },
        ],
      },
    ],
    events: [],
    slots: [
      { name: 'default', label: '内容插槽' },
      { name: 'header', label: '表头插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
      ],
    },
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
  {
    type: 'ea-tree',
    name: '树形控件',
    category: ComponentCategories.DATA,
    icon: 'Tree',
    props: [
      {
        name: 'data',
        label: '数据',
        type: PropTypes.ARRAY,
        default: [],
      },
      {
        name: 'node-key',
        label: '节点键名',
        type: PropTypes.STRING,
        default: 'id',
      },
      {
        name: 'props',
        label: '配置项',
        type: PropTypes.OBJECT,
        default: {},
      },
      {
        name: 'default-expand-all',
        label: '默认展开所有',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'show-checkbox',
        label: '显示复选框',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'check-strictly',
        label: '严格选择',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'accordion',
        label: '手风琴模式',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'draggable',
        label: '可拖拽',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [
      { name: 'node-click', label: '节点点击' },
      { name: 'node-expand', label: '节点展开' },
      { name: 'node-collapse', label: '节点收起' },
      { name: 'check-change', label: '选中改变' },
      { name: 'node-drag-start', label: '拖拽开始' },
      { name: 'node-drag-end', label: '拖拽结束' },
    ],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-timeline',
    name: '时间线',
    category: ComponentCategories.DATA,
    icon: 'Timeline',
    props: [
      {
        name: 'reverse',
        label: '倒序',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'mode',
        label: '模式',
        type: PropTypes.SELECT,
        default: 'left',
        options: [
          { label: '左', value: 'left' },
          { label: '右', value: 'right' },
          { label: '交替', value: 'alternate' },
        ],
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '时间线项插槽', isContentSlot: false }],
    childComponents: ['ea-timeline-item'],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-timeline-item',
    name: '时间线项',
    category: ComponentCategories.DATA,
    icon: 'TimelineItem',
    isChildComponent: true,
    parentComponents: ['ea-timeline'],
    props: [
      {
        name: 'timestamp',
        label: '时间戳',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'hide-timestamp',
        label: '隐藏时间戳',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'placement',
        label: '位置',
        type: PropTypes.SELECT,
        default: 'top',
        options: [
          { label: '上', value: 'top' },
          { label: '下', value: 'bottom' },
        ],
      },
      {
        name: 'type',
        label: '类型',
        type: PropTypes.SELECT,
        default: '',
        options: [
          { label: '主要', value: 'primary' },
          { label: '成功', value: 'success' },
          { label: '警告', value: 'warning' },
          { label: '危险', value: 'danger' },
          { label: '信息', value: 'info' },
        ],
      },
      {
        name: 'color',
        label: '颜色',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'icon',
        label: '图标',
        type: PropTypes.STRING,
        default: '',
      },
    ],
    events: [],
    slots: [
      { name: 'default', label: '内容插槽' },
      { name: 'dot', label: '圆点插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-statistic',
    name: '统计组件',
    category: ComponentCategories.DATA,
    icon: 'Statistic',
    props: [
      {
        name: 'title',
        label: '标题',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'value',
        label: '数值',
        type: PropTypes.NUMBER,
        default: 0,
      },
      {
        name: 'precision',
        label: '精度',
        type: PropTypes.NUMBER,
        default: 0,
      },
      {
        name: 'prefix',
        label: '前缀',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'suffix',
        label: '后缀',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'separator',
        label: '分隔符',
        type: PropTypes.STRING,
        default: ',',
      },
      {
        name: 'group-separator',
        label: '千分位分隔符',
        type: PropTypes.STRING,
        default: ',',
      },
    ],
    events: [],
    slots: [
      { name: 'default', label: '默认插槽' },
      { name: 'title', label: '标题插槽' },
      { name: 'prefix', label: '前缀插槽' },
      { name: 'suffix', label: '后缀插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-segmented',
    name: '分段控制器',
    category: ComponentCategories.DATA,
    icon: 'Segmented',
    props: [
      {
        name: 'value',
        label: '选中值',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'options',
        label: '选项',
        type: PropTypes.ARRAY,
        default: [],
      },
      {
        name: 'size',
        label: '尺寸',
        type: PropTypes.SELECT,
        default: 'default',
        options: [
          { label: '大', value: 'large' },
          { label: '中', value: 'default' },
          { label: '小', value: 'small' },
        ],
      },
      {
        name: 'disabled',
        label: '禁用',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [{ name: 'change', label: '选中改变' }],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color', 'border-color'],
        },
      ],
    },
  },
  {
    type: 'ea-skeleton',
    name: '骨架屏',
    category: ComponentCategories.DATA,
    icon: 'Skeleton',
    props: [
      {
        name: 'animated',
        label: '动画',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'count',
        label: '行数',
        type: PropTypes.NUMBER,
        default: 1,
      },
      {
        name: 'rows',
        label: '行数',
        type: PropTypes.NUMBER,
        default: 3,
      },
      {
        name: 'loading',
        label: '加载中',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'throttle',
        label: '节流',
        type: PropTypes.NUMBER,
        default: 0,
      },
    ],
    events: [],
    slots: [
      { name: 'default', label: '默认插槽' },
      { name: 'template', label: '模板插槽' },
    ],
    childComponents: ['ea-skeleton-item'],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-skeleton-item',
    name: '骨架屏项',
    category: ComponentCategories.DATA,
    icon: 'SkeletonItem',
    isChildComponent: true,
    parentComponents: ['ea-skeleton'],
    props: [
      {
        name: 'variant',
        label: '变体',
        type: PropTypes.SELECT,
        default: 'text',
        options: [
          { label: '文本', value: 'text' },
          { label: '圆形', value: 'circle' },
          { label: '矩形', value: 'rect' },
          { label: '图片', value: 'image' },
        ],
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-result',
    name: '结果',
    category: ComponentCategories.DATA,
    icon: 'Result',
    props: [
      {
        name: 'title',
        label: '标题',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'sub-title',
        label: '副标题',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'icon',
        label: '图标',
        type: PropTypes.STRING,
        default: '',
      },
    ],
    events: [],
    slots: [
      { name: 'default', label: '默认插槽' },
      { name: 'icon', label: '图标插槽' },
      { name: 'title', label: '标题插槽' },
      { name: 'sub-title', label: '副标题插槽' },
      { name: 'extra', label: '额外插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color', 'padding'],
        },
      ],
    },
  },
]

// Navigation 导航
const navigationComponents = [
  {
    type: 'ea-backtop',
    name: '回到顶部',
    category: ComponentCategories.NAVIGATION,
    icon: 'Backtop',
    props: [
      {
        name: 'visibility-height',
        label: '可见高度',
        type: PropTypes.NUMBER,
        default: 200,
      },
      {
        name: 'right',
        label: '右偏移',
        type: PropTypes.NUMBER,
        default: 40,
      },
      {
        name: 'bottom',
        label: '下偏移',
        type: PropTypes.NUMBER,
        default: 40,
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color', 'color', 'border-radius'],
        },
      ],
    },
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
    slots: [
      { name: 'default', label: '默认插槽' },
      { name: 'separator', label: '分隔符插槽' },
    ],
    childComponents: ['ea-breadcrumb-item'],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['color'],
        },
      ],
    },
  },
  {
    type: 'ea-breadcrumb-item',
    name: '面包屑项',
    category: ComponentCategories.NAVIGATION,
    icon: 'BreadcrumbItem',
    isChildComponent: true,
    parentComponents: ['ea-breadcrumb'],
    props: [
      {
        name: 'href',
        label: '链接',
        type: PropTypes.STRING,
        default: '',
      },
    ],
    events: [],
    slots: [
      { name: 'default', label: '默认插槽' },
      { name: 'separator', label: '分隔符插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['color'],
        },
      ],
    },
  },
  {
    type: 'ea-dropdown',
    name: '下拉菜单',
    category: ComponentCategories.NAVIGATION,
    icon: 'Dropdown',
    props: [
      {
        name: 'placement',
        label: '菜单位置',
        type: PropTypes.SELECT,
        default: 'bottom',
        options: [
          { label: '顶部开始', value: 'top-start' },
          { label: '顶部', value: 'top' },
          { label: '顶部结束', value: 'top-end' },
          { label: '底部开始', value: 'bottom-start' },
          { label: '底部', value: 'bottom' },
          { label: '底部结束', value: 'bottom-end' },
        ],
      },
      {
        name: 'trigger',
        label: '触发方式',
        type: PropTypes.SELECT,
        default: 'hover',
        options: [
          { label: '悬停', value: 'hover' },
          { label: '点击', value: 'click' },
          { label: '右键', value: 'contextmenu' },
        ],
      },
      {
        name: 'hide-on-click',
        label: '点击后隐藏',
        type: PropTypes.BOOLEAN,
        default: true,
      },
    ],
    events: [
      { name: 'command', label: '菜单项点击' },
      { name: 'open', label: '打开' },
      { name: 'opened', label: '打开完成' },
      { name: 'close', label: '关闭' },
      { name: 'closed', label: '关闭完成' },
    ],
    slots: [
      { name: 'default', label: '内容插槽' },
      { name: 'reference', label: '触发元素插槽' },
    ],
    childComponents: ['ea-dropdown-item', 'ea-dropdown-menu'],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-dropdown-item',
    name: '下拉菜单项',
    category: ComponentCategories.NAVIGATION,
    icon: 'DropdownItem',
    isChildComponent: true,
    parentComponents: ['ea-dropdown'],
    props: [
      {
        name: 'command',
        label: '指令',
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
        name: 'divided',
        label: '分割线',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-dropdown-menu',
    name: '下拉菜单容器',
    category: ComponentCategories.NAVIGATION,
    icon: 'DropdownMenu',
    isChildComponent: true,
    parentComponents: ['ea-dropdown'],
    props: [],
    events: [],
    slots: [{ name: 'default', label: '默认插槽' }],
    childComponents: ['ea-dropdown-item'],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-menu',
    name: '菜单',
    category: ComponentCategories.NAVIGATION,
    icon: 'Menu',
    props: [
      {
        name: 'default-active',
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
        name: 'background-color',
        label: '背景色',
        type: PropTypes.COLOR,
        default: '#ffffff',
      },
      {
        name: 'text-color',
        label: '文字颜色',
        type: PropTypes.COLOR,
        default: '#303133',
      },
      {
        name: 'active-text-color',
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
    childComponents: ['ea-submenu', 'ea-menu-item', 'ea-menu-item-group'],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-submenu',
    name: '子菜单',
    category: ComponentCategories.NAVIGATION,
    icon: 'Submenu',
    isChildComponent: true,
    parentComponents: ['ea-menu', 'ea-submenu'],
    childComponents: ['ea-submenu', 'ea-menu-item', 'ea-menu-item-group'],
    props: [
      {
        name: 'index',
        label: '索引',
        type: PropTypes.STRING,
        default: '',
      },
    ],
    events: [],
    slots: [
      { name: 'default', label: '默认插槽' },
      { name: 'title', label: '标题插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
        {
          name: 'title',
          label: '标题容器',
          styles: ['color'],
        },
      ],
    },
  },
  {
    type: 'ea-menu-item',
    name: '菜单项',
    category: ComponentCategories.NAVIGATION,
    icon: 'MenuItem',
    isChildComponent: true,
    parentComponents: ['ea-menu', 'ea-submenu', 'ea-menu-item-group'],
    props: [
      {
        name: 'index',
        label: '索引',
        type: PropTypes.STRING,
        default: '',
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color', 'color'],
        },
      ],
    },
  },
  {
    type: 'ea-menu-item-group',
    name: '菜单项分组',
    category: ComponentCategories.NAVIGATION,
    icon: 'MenuItemGroup',
    isChildComponent: true,
    parentComponents: ['ea-menu', 'ea-submenu'],
    childComponents: ['ea-menu-item'],
    props: [
      {
        name: 'title',
        label: '标题',
        type: PropTypes.STRING,
        default: '',
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-page-header',
    name: '页头',
    category: ComponentCategories.NAVIGATION,
    icon: 'PageHeader',
    props: [
      {
        name: 'icon',
        label: '返回图标',
        type: PropTypes.STRING,
        default: 'icon-angle-left',
      },
      {
        name: 'title',
        label: '标题',
        type: PropTypes.STRING,
        default: 'Back',
      },
      {
        name: 'content',
        label: '内容',
        type: PropTypes.STRING,
        default: '',
      },
    ],
    events: [{ name: 'back', label: '返回按钮点击' }],
    slots: [
      { name: 'default', label: '默认插槽' },
      { name: 'breadcrumb', label: '面包屑插槽' },
      { name: 'icon', label: '图标插槽' },
      { name: 'title', label: '标题插槽' },
      { name: 'content', label: '内容插槽' },
      { name: 'extra', label: '额外操作插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color', 'padding'],
        },
        {
          name: 'header-wrapper',
          label: '标题包装器',
          styles: ['background-color'],
        },
        {
          name: 'back',
          label: '返回按钮',
          styles: ['color'],
        },
        {
          name: 'content',
          label: '内容容器',
          styles: ['color'],
        },
      ],
    },
  },
  {
    type: 'ea-steps',
    name: '步骤条',
    category: ComponentCategories.NAVIGATION,
    icon: 'Steps',
    props: [
      {
        name: 'space',
        label: '间距',
        type: PropTypes.STRING,
        default: '50%',
      },
      {
        name: 'active',
        label: '当前步骤',
        type: PropTypes.NUMBER,
        default: 0,
      },
      {
        name: 'process-status',
        label: '进行中状态',
        type: PropTypes.SELECT,
        default: 'process',
        options: [
          { label: '等待', value: 'wait' },
          { label: '进行中', value: 'process' },
          { label: '完成', value: 'finish' },
          { label: '错误', value: 'error' },
          { label: '成功', value: 'success' },
        ],
      },
      {
        name: 'finish-status',
        label: '完成状态',
        type: PropTypes.SELECT,
        default: 'finish',
        options: [
          { label: '等待', value: 'wait' },
          { label: '进行中', value: 'process' },
          { label: '完成', value: 'finish' },
          { label: '错误', value: 'error' },
          { label: '成功', value: 'success' },
        ],
      },
      {
        name: 'align-center',
        label: '居中对齐',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'simple',
        label: '简洁模式',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '步骤项插槽' }],
    childComponents: ['ea-step'],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-step',
    name: '步骤项',
    category: ComponentCategories.NAVIGATION,
    icon: 'Step',
    isChildComponent: true,
    parentComponents: ['ea-steps'],
    props: [
      {
        name: 'title',
        label: '标题',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'description',
        label: '描述',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'icon',
        label: '图标',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'status',
        label: '状态',
        type: PropTypes.SELECT,
        default: '',
        options: [
          { label: '等待', value: 'wait' },
          { label: '进行中', value: 'process' },
          { label: '完成', value: 'finish' },
          { label: '错误', value: 'error' },
          { label: '成功', value: 'success' },
        ],
      },
    ],
    events: [],
    slots: [
      { name: 'default', label: '默认插槽' },
      { name: 'icon', label: '图标插槽' },
      { name: 'title', label: '标题插槽' },
      { name: 'description', label: '描述插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-tabs',
    name: '标签页',
    category: ComponentCategories.NAVIGATION,
    icon: 'Tabs',
    props: [
      {
        name: 'active',
        label: '当前激活标签',
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
        name: 'editable',
        label: '可编辑',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'tab-position',
        label: '标签位置',
        type: PropTypes.SELECT,
        default: 'top',
        options: [
          { label: '顶部', value: 'top' },
          { label: '右侧', value: 'right' },
          { label: '底部', value: 'bottom' },
          { label: '左侧', value: 'left' },
        ],
      },
    ],
    events: [
      { name: 'tab-click', label: '标签点击事件' },
      { name: 'tabs-change', label: '标签切换事件' },
      { name: 'tab-remove', label: '标签移除事件' },
    ],
    slots: [
      { name: 'default', label: '默认插槽', isContentSlot: false },
      { name: 'nav', label: '标签栏插槽' },
    ],
    childComponents: ['ea-tab', 'ea-tab-panel'],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
        {
          name: 'nav',
          label: '标签栏容器',
          styles: ['background-color'],
        },
        {
          name: 'content',
          label: '内容容器',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-tab',
    name: '标签',
    category: ComponentCategories.NAVIGATION,
    icon: 'Tab',
    isChildComponent: true,
    parentComponents: ['ea-tabs'],
    props: [
      {
        name: 'panel',
        label: '面板标识',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'closable',
        label: '可关闭',
        type: PropTypes.BOOLEAN,
        default: true,
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color', 'color'],
        },
      ],
    },
  },
  {
    type: 'ea-tab-panel',
    name: '标签面板',
    category: ComponentCategories.NAVIGATION,
    icon: 'TabPanel',
    isChildComponent: true,
    parentComponents: ['ea-tabs'],
    props: [
      {
        name: 'name',
        label: '名称',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'label',
        label: '标签文本',
        type: PropTypes.STRING,
        default: '',
      },
    ],
    events: [],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
      ],
    },
  },
]

// Feedback 反馈
const feedbackComponents = [
  {
    type: 'ea-alert',
    name: '警告提示',
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
          { label: '主要', value: 'primary' },
          { label: '成功', value: 'success' },
          { label: '警告', value: 'warning' },
          { label: '信息', value: 'info' },
          { label: '错误', value: 'error' },
        ],
      },
      {
        name: 'description',
        label: '辅助性文字',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'closable',
        label: '可关闭',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'center',
        label: '文字居中',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'close-text',
        label: '关闭按钮文本',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'show-icon',
        label: '显示图标',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'effect',
        label: '主题效果',
        type: PropTypes.SELECT,
        default: 'light',
        options: [
          { label: '浅色', value: 'light' },
          { label: '深色', value: 'dark' },
        ],
      },
      {
        name: 'auto-close',
        label: '自动关闭延迟(ms)',
        type: PropTypes.NUMBER,
        default: 0,
      },
    ],
    events: [
      { name: 'open', label: '开启' },
      { name: 'close', label: '关闭' },
    ],
    slots: [
      { name: 'default', label: '内容插槽' },
      { name: 'title', label: '标题插槽' },
      { name: 'icon', label: '图标插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color', 'border-color'],
        },
        {
          name: 'icon-wrap',
          label: '图标容器',
          styles: ['color'],
        },
        {
          name: 'title',
          label: '标题容器',
          styles: ['color'],
        },
        {
          name: 'description',
          label: '描述容器',
          styles: ['color'],
        },
      ],
    },
  },
  {
    type: 'ea-dialog',
    name: '对话框',
    category: ComponentCategories.FEEDBACK,
    icon: 'Dialog',
    props: [
      {
        name: 'visible',
        label: '是否可见',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'title',
        label: '标题',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'width',
        label: '宽度',
        type: PropTypes.STRING,
        default: '50%',
      },
      {
        name: 'center',
        label: '内容垂直居中',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'draggable',
        label: '可拖拽',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'fullscreen',
        label: '全屏显示',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'modal',
        label: '显示遮罩',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'append-to-body',
        label: '追加到body',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'show-close',
        label: '显示关闭图标',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'before-close',
        label: '启用关闭拦截',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [
      { name: 'open', label: '打开' },
      { name: 'opened', label: '打开完成' },
      { name: 'close', label: '关闭' },
      { name: 'closed', label: '关闭完成' },
    ],
    slots: [
      { name: 'default', label: '内容插槽' },
      { name: 'header', label: '头部插槽' },
      { name: 'footer', label: '底部插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '对话框根容器',
          styles: ['background-color'],
        },
        {
          name: 'header',
          label: '头部容器',
          styles: ['background-color', 'border-color'],
        },
        {
          name: 'title',
          label: '标题文本',
          styles: ['color'],
        },
        {
          name: 'content',
          label: '主体内容',
          styles: ['background-color'],
        },
        {
          name: 'footer',
          label: '底部容器',
          styles: ['background-color', 'border-color'],
        },
      ],
    },
  },
  {
    type: 'ea-drawer',
    name: '抽屉',
    category: ComponentCategories.FEEDBACK,
    icon: 'Drawer',
    props: [
      {
        name: 'visible',
        label: '是否可见',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'title',
        label: '标题',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'size',
        label: '尺寸',
        type: PropTypes.UNIT,
        default: '30%',
      },
      {
        name: 'direction',
        label: '方向',
        type: PropTypes.SELECT,
        default: 'rtl',
        options: [
          { label: '左到右', value: 'ltr' },
          { label: '右到左', value: 'rtl' },
          { label: '上到下', value: 'ttb' },
          { label: '下到上', value: 'btt' },
        ],
      },
      {
        name: 'modal',
        label: '显示遮罩',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'close-on-click-modal',
        label: '点击遮罩关闭',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'close-on-press-escape',
        label: 'ESC关闭',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'before-close',
        label: '启用关闭拦截',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'show-close',
        label: '显示关闭图标',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'with-header',
        label: '显示头部',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'append-to-body',
        label: '追加到body',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [
      { name: 'open', label: '打开' },
      { name: 'opened', label: '打开完成' },
      { name: 'close', label: '关闭' },
      { name: 'closed', label: '关闭完成' },
      { name: 'before-close', label: '关闭前' },
    ],
    slots: [
      { name: 'default', label: '内容插槽' },
      { name: 'title', label: '标题插槽' },
      { name: 'footer', label: '底部插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
        {
          name: 'header',
          label: '头部容器',
          styles: ['background-color', 'border-color'],
        },
        {
          name: 'title',
          label: '标题容器',
          styles: ['color'],
        },
        {
          name: 'content',
          label: '内容区域',
          styles: ['background-color'],
        },
        {
          name: 'footer',
          label: '底部区域',
          styles: ['background-color', 'border-color'],
        },
      ],
    },
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
          { label: '信息', value: 'info' },
          { label: '错误', value: 'error' },
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
        name: 'dangerouslyUseHTMLString',
        label: 'HTML渲染',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'offset',
        label: '偏移距离',
        type: PropTypes.NUMBER,
        default: 16,
      },
      {
        name: 'placement',
        label: '出现位置',
        type: PropTypes.SELECT,
        default: 'top',
        options: [
          { label: '顶部', value: 'top' },
          { label: '左上', value: 'top-left' },
          { label: '右上', value: 'top-right' },
          { label: '底部', value: 'bottom' },
          { label: '左下', value: 'bottom-left' },
          { label: '右下', value: 'bottom-right' },
        ],
      },
    ],
    events: [
      { name: 'show', label: '显示' },
      { name: 'shown', label: '显示完成' },
      { name: 'hide', label: '隐藏' },
      { name: 'hidden', label: '隐藏完成' },
      { name: 'close', label: '关闭' },
    ],
    slots: [],
    isService: true,
  },
  {
    type: 'ea-message-box',
    name: '消息弹出框',
    category: ComponentCategories.FEEDBACK,
    icon: 'MessageBox',
    props: [
      {
        name: 'title',
        label: '标题',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'message',
        label: '正文内容',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'type',
        label: '类型',
        type: PropTypes.SELECT,
        default: '',
        options: [
          { label: '主要', value: 'primary' },
          { label: '成功', value: 'success' },
          { label: '信息', value: 'info' },
          { label: '警告', value: 'warning' },
          { label: '错误', value: 'error' },
        ],
      },
      {
        name: 'dangerouslyUseHTMLString',
        label: 'HTML渲染',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'showClose',
        label: '显示关闭按钮',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'distinguishCancelAndClose',
        label: '区分取消和关闭',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'showCancelButton',
        label: '显示取消按钮',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'showConfirmButton',
        label: '显示确认按钮',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'confirmButtonText',
        label: '确认按钮文本',
        type: PropTypes.STRING,
        default: '确认',
      },
      {
        name: 'cancelButtonText',
        label: '取消按钮文本',
        type: PropTypes.STRING,
        default: '取消',
      },
      {
        name: 'closeOnClickModal',
        label: '点击遮罩关闭',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'closeOnPressEscape',
        label: 'ESC关闭',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'showInput',
        label: '显示输入框',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'center',
        label: '内容垂直居中',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'draggable',
        label: '可拖拽',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'roundButton',
        label: '圆形按钮',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'buttonSize',
        label: '按钮尺寸',
        type: PropTypes.SELECT,
        default: 'large',
        options: [
          { label: '小', value: 'small' },
          { label: '中', value: 'default' },
          { label: '大', value: 'large' },
        ],
      },
    ],
    events: [
      { name: 'confirm', label: '确认' },
      { name: 'cancel', label: '取消' },
      { name: 'message-close', label: '关闭' },
    ],
    slots: [],
    isService: true,
  },
  {
    type: 'ea-notification',
    name: '通知',
    category: ComponentCategories.FEEDBACK,
    icon: 'Notification',
    props: [
      {
        name: 'title',
        label: '标题',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'message',
        label: '正文内容',
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
          { label: '信息', value: 'info' },
          { label: '错误', value: 'error' },
          { label: '主要', value: 'primary' },
        ],
      },
      {
        name: 'icon',
        label: '自定义图标',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'duration',
        label: '显示时长(ms)',
        type: PropTypes.NUMBER,
        default: 3000,
      },
      {
        name: 'placement',
        label: '出现位置',
        type: PropTypes.SELECT,
        default: 'top-right',
        options: [
          { label: '右上', value: 'top-right' },
          { label: '左上', value: 'top-left' },
          { label: '右下', value: 'bottom-right' },
          { label: '左下', value: 'bottom-left' },
        ],
      },
      {
        name: 'showClose',
        label: '显示关闭按钮',
        type: PropTypes.BOOLEAN,
        default: true,
      },
      {
        name: 'dangerouslyUseHTMLString',
        label: 'HTML渲染',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'zIndex',
        label: 'z-index',
        type: PropTypes.NUMBER,
        default: 0,
      },
    ],
    events: [
      { name: 'show', label: '显示' },
      { name: 'shown', label: '显示完成' },
      { name: 'hide', label: '隐藏' },
      { name: 'hidden', label: '隐藏完成' },
      { name: 'close', label: '关闭' },
    ],
    slots: [],
    isService: true,
  },
  {
    type: 'ea-popconfirm',
    name: '气泡确认框',
    category: ComponentCategories.FEEDBACK,
    icon: 'Popconfirm',
    props: [
      {
        name: 'title',
        label: '标题',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'width',
        label: '宽度',
        type: PropTypes.UNIT,
        default: '150px',
      },
      {
        name: 'confirm-button-text',
        label: '确认按钮文本',
        type: PropTypes.STRING,
        default: '确认',
      },
      {
        name: 'cancel-button-text',
        label: '取消按钮文本',
        type: PropTypes.STRING,
        default: '取消',
      },
      {
        name: 'confirm-button-type',
        label: '确认按钮类型',
        type: PropTypes.SELECT,
        default: 'primary',
        options: [
          { label: '主要', value: 'primary' },
          { label: '成功', value: 'success' },
          { label: '警告', value: 'warning' },
          { label: '危险', value: 'danger' },
          { label: '信息', value: 'info' },
          { label: '默认', value: 'default' },
        ],
      },
      {
        name: 'cancel-button-type',
        label: '取消按钮类型',
        type: PropTypes.SELECT,
        default: 'default',
        options: [
          { label: '主要', value: 'primary' },
          { label: '成功', value: 'success' },
          { label: '警告', value: 'warning' },
          { label: '危险', value: 'danger' },
          { label: '信息', value: 'info' },
          { label: '默认', value: 'default' },
        ],
      },
      {
        name: 'icon',
        label: '图标',
        type: PropTypes.STRING,
        default: 'icon-question',
      },
      {
        name: 'icon-color',
        label: '图标颜色',
        type: PropTypes.COLOR,
        default: '#f90',
      },
      {
        name: 'hide-icon',
        label: '隐藏图标',
        type: PropTypes.BOOLEAN,
        default: false,
      },
    ],
    events: [
      { name: 'confirm', label: '确认' },
      { name: 'cancel', label: '取消' },
    ],
    slots: [
      { name: 'default', label: '内容插槽' },
      { name: 'reference', label: '触发元素插槽' },
      { name: 'actions', label: '操作区插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
        {
          name: 'title-content',
          label: '内容容器',
          styles: ['color'],
        },
        {
          name: 'footer',
          label: '底部容器',
          styles: ['background-color'],
        },
      ],
    },
  },
  {
    type: 'ea-popover',
    name: '弹出框',
    category: ComponentCategories.FEEDBACK,
    icon: 'Popover',
    props: [
      {
        name: 'trigger',
        label: '触发方式',
        type: PropTypes.SELECT,
        default: 'hover',
        options: [
          { label: '悬停', value: 'hover' },
          { label: '点击', value: 'click' },
          { label: '聚焦', value: 'focus' },
          { label: '右键', value: 'contextmenu' },
          { label: '自定义', value: 'customized' },
        ],
      },
      {
        name: 'title',
        label: '标题',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'content',
        label: '内容',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'width',
        label: '宽度',
        type: PropTypes.UNIT,
        default: '150px',
      },
      {
        name: 'placement',
        label: '出现位置',
        type: PropTypes.SELECT,
        default: 'top',
        options: [
          { label: '顶部', value: 'top' },
          { label: '顶部开始', value: 'top-start' },
          { label: '顶部结束', value: 'top-end' },
          { label: '底部', value: 'bottom' },
          { label: '底部开始', value: 'bottom-start' },
          { label: '底部结束', value: 'bottom-end' },
          { label: '左侧', value: 'left' },
          { label: '左侧开始', value: 'left-start' },
          { label: '左侧结束', value: 'left-end' },
          { label: '右侧', value: 'right' },
          { label: '右侧开始', value: 'right-start' },
          { label: '右侧结束', value: 'right-end' },
        ],
      },
      {
        name: 'show-arrow',
        label: '显示箭头',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'visible',
        label: '是否可见',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'offset',
        label: '偏移量',
        type: PropTypes.STRING,
        default: '0 0',
      },
      {
        name: 'flip',
        label: '视口翻转',
        type: PropTypes.BOOLEAN,
        default: true,
      },
    ],
    events: [
      { name: 'show', label: '显示' },
      { name: 'shown', label: '显示完成' },
      { name: 'hide', label: '隐藏' },
      { name: 'hidden', label: '隐藏完成' },
    ],
    slots: [
      { name: 'default', label: '内容插槽' },
      { name: 'reference', label: '触发元素插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
        {
          name: 'original',
          label: '内容容器',
          styles: ['background-color'],
        },
        {
          name: 'title',
          label: '标题容器',
          styles: ['color'],
        },
        {
          name: 'content',
          label: '内容容器',
          styles: ['color'],
        },
      ],
    },
  },
  {
    type: 'ea-tooltip',
    name: '文字提示',
    category: ComponentCategories.FEEDBACK,
    icon: 'Tooltip',
    props: [
      {
        name: 'effect',
        label: '显示效果',
        type: PropTypes.SELECT,
        default: 'dark',
        options: [
          { label: '深色', value: 'dark' },
          { label: '浅色', value: 'light' },
          { label: '自定义', value: 'customized' },
        ],
      },
      {
        name: 'trigger',
        label: '触发方式',
        type: PropTypes.SELECT,
        default: 'hover',
        options: [
          { label: '悬停', value: 'hover' },
          { label: '点击', value: 'click' },
          { label: '聚焦', value: 'focus' },
          { label: '右键', value: 'contextmenu' },
          { label: '自定义', value: 'customized' },
        ],
      },
      {
        name: 'content',
        label: '内容',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'width',
        label: '宽度(px)',
        type: PropTypes.NUMBER,
        default: 150,
      },
      {
        name: 'placement',
        label: '出现位置',
        type: PropTypes.SELECT,
        default: 'top',
        options: [
          { label: '顶部', value: 'top' },
          { label: '顶部开始', value: 'top-start' },
          { label: '顶部结束', value: 'top-end' },
          { label: '底部', value: 'bottom' },
          { label: '底部开始', value: 'bottom-start' },
          { label: '底部结束', value: 'bottom-end' },
          { label: '左侧', value: 'left' },
          { label: '左侧开始', value: 'left-start' },
          { label: '左侧结束', value: 'left-end' },
          { label: '右侧', value: 'right' },
          { label: '右侧开始', value: 'right-start' },
          { label: '右侧结束', value: 'right-end' },
        ],
      },
      {
        name: 'show-arrow',
        label: '显示箭头',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'visible',
        label: '是否可见',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'offset',
        label: '偏移量',
        type: PropTypes.STRING,
        default: '0 0',
      },
      {
        name: 'flip',
        label: '视口翻转',
        type: PropTypes.BOOLEAN,
        default: true,
      },
    ],
    events: [
      { name: 'show', label: '显示' },
      { name: 'shown', label: '显示完成' },
      { name: 'hide', label: '隐藏' },
      { name: 'hidden', label: '隐藏完成' },
    ],
    slots: [
      { name: 'default', label: '内容插槽' },
      { name: 'reference', label: '触发元素插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
        {
          name: 'original',
          label: '内容容器',
          styles: ['background-color', 'color'],
        },
        {
          name: 'content',
          label: '内容容器',
          styles: ['color'],
        },
      ],
    },
  },
]

// 导出合并后的组件列表
export const componentMetaList = [
  ...basicComponents,
  ...formComponents,
  ...dataComponents,
  ...navigationComponents,
  ...feedbackComponents,
  ...layoutComponents,
]

// 根据分类获取组件
export function getComponentsByCategory(category) {
  return componentMetaList.filter((comp) => comp.category === category)
}

// 根据类型获取组件元数据
export function getComponentMeta(type) {
  const meta = componentMetaList.find((comp) => comp.type === type)
  if (!meta) return null

  // 确保组件有 slots 定义，如果没有则添加默认插槽
  const slots = meta.slots || [{ name: 'default', label: '默认插槽' }]

  return {
    ...meta,
    slots,
  }
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
    [ComponentCategories.REMOTE]: '远程组件',
  }
  return labels[category] || category
}

// 远程组件配置存储（本地存储）
const REMOTE_CONFIG_KEY = 'ea_lowcode_remote_config'

/**
 * 获取完整 URL（拼接 globalUrl 和相对路径）
 * @param {string} url - 组件 URL
 * @param {string} globalUrl - 基础 URL
 * @returns {string} 完整 URL
 */
function getFullUrl(url, globalUrl) {
  if (!url) return ''
  // 如果已经是完整 URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // 拼接 globalUrl 和相对路径
  const base = globalUrl || ''
  if (!base) return url
  // 确保 base 以 / 结尾，url 不以 / 开头
  const normalizedBase = base.endsWith('/') ? base : base + '/'
  const normalizedUrl = url.startsWith('/') ? url.slice(1) : url
  return normalizedBase + normalizedUrl
}

/**
 * 获取存储的远程组件配置
 * @returns {Object} 远程组件配置对象 { globalUrl, components }
 */
export function getRemoteConfig() {
  try {
    const stored = localStorage.getItem(REMOTE_CONFIG_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {}
  return { globalUrl: '', components: [] }
}

/**
 * 获取存储的远程组件列表
 * @returns {Array} 远程组件配置列表
 */
export function getRemoteComponents() {
  return getRemoteConfig().components || []
}

/**
 * 保存远程组件配置
 * @param {Array} components 远程组件配置列表
 */
export function saveRemoteComponents(components) {
  const config = getRemoteConfig()
  config.components = components
  localStorage.setItem(REMOTE_CONFIG_KEY, JSON.stringify(config))
}

/**
 * 添加远程组件
 * @param {Object} component 远程组件配置
 */
export function addRemoteComponent(component) {
  const config = getRemoteConfig()
  config.components.push({
    id: Date.now().toString(),
    ...component,
    category: ComponentCategories.REMOTE,
  })
  localStorage.setItem(REMOTE_CONFIG_KEY, JSON.stringify(config))
}

/**
 * 删除远程组件
 * @param {string} id 组件ID
 */
export function removeRemoteComponent(id) {
  const config = getRemoteConfig()
  config.components = config.components.filter((c) => c.id !== id)
  localStorage.setItem(REMOTE_CONFIG_KEY, JSON.stringify(config))
}

/**
 * 获取所有远程组件的元数据（包含本地存储的）
 * @returns {Array} 远程组件元数据列表
 */
export function getRemoteComponentMetaList() {
  const config = getRemoteConfig()
  const remoteComponents = config.components || []
  return remoteComponents.map((comp) => ({
    type: `remote-${comp.id}`,
    name: comp.name || '远程组件',
    category: ComponentCategories.REMOTE,
    icon: comp.icon || 'Link',
    isRemote: true,
    remoteConfig: {
      id: comp.id,
      url: getFullUrl(comp.url, config.globalUrl),
      styleUrl: comp.styleUrl || '',
      exportName: comp.exportName,
    },
    props: comp.props || [],
    events: comp.events || [],
    slots: comp.slots || [{ name: 'default', label: '默认插槽' }],
  }))
}
