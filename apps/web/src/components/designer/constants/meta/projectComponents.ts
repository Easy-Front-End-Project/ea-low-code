import { ComponentCategories, PropTypes } from '@ea-low-code/shared'
import type { ComponentMeta } from '@ea-low-code/shared'

/**
 * 项目级组件
 */
export const projectComponents: ComponentMeta[] = [
  {
    type: 'ea-backtop',
    name: '回到顶部',
    category: ComponentCategories.NAVIGATION,
    icon: 'Backtop',
    isPageLevel: true,
    configSource: ['project', 'page'],
    props: [
      {
        name: 'target',
        label: '触发滚动的对象',
        type: PropTypes.STRING,
        default: '',
      },
      {
        name: 'visibility-height',
        label: '滚动高度达到此参数值才出现',
        type: PropTypes.NUMBER,
        default: 200,
      },
      {
        name: 'right',
        label: '按钮距右侧距离',
        type: PropTypes.NUMBER,
        default: 40,
      },
      {
        name: 'bottom',
        label: '按钮距底部距离',
        type: PropTypes.NUMBER,
        default: 40,
      },
    ],
    events: [
      { name: 'backtop', label: '点击按钮时触发' },
      { name: 'reachedTop', label: '滚动到顶部时触发' },
    ],
    slots: [{ name: 'default', label: '默认插槽' }],
    styleConfig: {
      parts: [
        {
          name: 'container',
          label: 'backtop 外层容器',
          styles: ['background-color', 'color', 'border-radius'],
        },
      ],
    },
    pageLevelConfig: {
      enabled: {
        type: PropTypes.BOOLEAN,
        default: true,
        label: '启用回到顶部',
      },
      visibilityHeight: {
        type: PropTypes.NUMBER,
        default: 200,
        label: '显示阈值(px)',
      },
      right: {
        type: PropTypes.NUMBER,
        default: 40,
        label: '距右侧距离(px)',
      },
      bottom: {
        type: PropTypes.NUMBER,
        default: 40,
        label: '距底部距离(px)',
      },
      icon: {
        type: PropTypes.STRING,
        default: 'icon-angle-up',
        label: '图标类名',
      },
      smooth: {
        type: PropTypes.BOOLEAN,
        default: true,
        label: '平滑滚动',
      },
    },
  },
]
