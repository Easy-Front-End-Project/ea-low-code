import { ComponentCategories, PropTypes } from '../types'

// Navigation 导航
export const navigationComponents = [
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
