import { ComponentCategories, PropTypes } from '../types'

// Layout 布局组件
export const layoutComponents = [
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
