import { ComponentCategories, PropTypes } from '../types'

// Data 数据展示
export const dataComponents = [
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
        type: PropTypes.UNIT,
        default: '300px',
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
          { label: '默认', value: ' ' },
          { label: '无', value: 'none' },
          { label: '外部', value: 'outside' },
        ],
      },
    ],
    events: [{ name: 'change', label: '索引变化' }],
    slots: [{ name: 'default', label: '轮播项插槽', isContentSlot: false }],
    childComponents: ['ea-carousel-item'],
    childConfig: {
      'ea-carousel-item': {
        allowChildren: true,
        allowedChildTypes: undefined,
        allowDirectDrop: false,
        defaultCount: 3,
      },
    },
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
        default: 'right',
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
    childComponents: ['ea-descriptions-item'],
    props: [
      {
        name: 'title',
        label: '标题',
        type: PropTypes.STRING,
        default: '',
      },
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
        name: 'border',
        label: '边框',
        type: PropTypes.BOOLEAN,
        default: false,
      },
      {
        name: 'column',
        label: '列数',
        type: PropTypes.NUMBER,
        default: 3,
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
        name: 'label-width',
        label: '标签宽度',
        type: PropTypes.UNIT,
        default: '',
      },
    ],
    events: [],
    slots: [
      { name: 'default', label: '默认插槽' },
      { name: 'title', label: '标题插槽' },
      { name: 'extra', label: '额外操作区插槽' },
    ],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: '外层容器',
          styles: ['background-color'],
        },
        {
          name: 'caption',
          label: '标题与操作区容器',
          styles: ['background-color', 'padding'],
        },
        {
          name: 'title',
          label: '标题区域',
          styles: ['color', 'font-size'],
        },
        {
          name: 'extra',
          label: '额外操作区',
          styles: ['background-color'],
        },
        {
          name: 'body',
          label: '表格主体',
          styles: ['background-color'],
        },
        {
          name: 'row',
          label: '行',
          styles: ['background-color'],
        },
        {
          name: 'col-cell',
          label: '单元格',
          styles: ['background-color', 'padding'],
        },
        {
          name: 'label',
          label: '标签单元格',
          styles: ['background-color', 'color', 'font-weight'],
        },
        {
          name: 'content',
          label: '内容单元格',
          styles: ['background-color', 'color'],
        },
        {
          name: 'cell',
          label: '通用单元格',
          styles: ['background-color', 'padding'],
        },
      ],
    },
  },
  {
    type: 'ea-descriptions-item',
    name: '描述列表项',
    category: ComponentCategories.DATA,
    icon: 'Document',
    isChildComponent: true,
    parentComponents: ['ea-descriptions'],
    props: [
      {
        name: 'label',
        label: '标签文本',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'children',
        label: '内容',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'colspan',
        label: '跨列数',
        type: PropTypes.NUMBER,
        default: 1,
      },
      {
        name: 'rowspan',
        label: '跨行数',
        type: PropTypes.NUMBER,
        default: 1,
      },
      {
        name: 'align',
        label: '对齐方式',
        type: PropTypes.SELECT,
        default: '',
        options: [
          { label: '左对齐', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'right' },
        ],
      },
      {
        name: 'label-align',
        label: '标签对齐',
        type: PropTypes.SELECT,
        default: '',
        options: [
          { label: '左对齐', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'right' },
        ],
      },
      {
        name: 'width',
        label: '单元格宽度',
        type: PropTypes.UNIT,
        default: '',
      },
      {
        name: 'label-width',
        label: '标签宽度',
        type: PropTypes.UNIT,
        default: '',
      },
      {
        name: 'label-part',
        label: '标签 Part',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'content-part',
        label: '内容 Part',
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
        name: 'children',
        label: '标签内容',
        type: PropTypes.STRING,
        default: '',
      },
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
