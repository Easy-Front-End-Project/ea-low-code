/**
 * 示例 Schema - EA 低代码平台落地页
 */

export const exampleSchema = {
  version: '1.0',
  meta: {
    title: 'EA Low Code - 低代码开发平台',
    description: '快速构建企业级应用，无需编写复杂代码，拖拽即可完成',
    viewport: {
      width: 1920,
      height: 1080,
      overflow: 'auto',
    },
  },
  settings: {},
  components: [
    // 顶部导航栏
    {
      id: 'comp_navbar',
      type: 'ea-header',
      props: { height: '70px' },
      style: {
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 60px',
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        zIndex: '50',
        transition: 'all 0.3s ease',
      },
      events: [],
      children: [
        // Logo
        {
          id: 'comp_logo',
          type: 'ea-container',
          props: { direction: 'horizontal' },
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          },
          events: [],
          children: [
            {
              id: 'comp_logo_icon',
              type: 'ea-button',
              props: {
                type: 'primary',
                circle: true,
                children: 'E',
              },
              style: {
                width: '40px',
                height: '40px',
                fontSize: '20px',
                fontWeight: 'bold',
                padding: '0',
              },
              events: [],
              children: [],
            },
            {
              id: 'comp_logo_text',
              type: 'ea-button',
              props: {
                type: 'normal',
                text: true,
                children: 'EA Low Code',
              },
              style: {
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#1a202c',
              },
              events: [],
              children: [],
            },
          ],
        },
        // 导航菜单
        {
          id: 'comp_nav_menu',
          type: 'ea-menu',
          props: {
            mode: 'horizontal',
            defaultActive: '1',
          },
          style: {
            backgroundColor: 'transparent',
            borderBottom: 'none',
          },
          events: [],
          children: [
            {
              id: 'comp_nav_item_1',
              type: 'ea-menu-item',
              props: { index: '1' },
              style: {},
              events: [],
              children: [
                {
                  id: 'comp_nav_item_1_text',
                  type: 'ea-button',
                  props: { type: 'normal', text: true, children: '核心特性' },
                  style: {
                    color: '#4a5568',
                    fontSize: '15px',
                  },
                  events: [],
                  children: [],
                },
              ],
            },
            {
              id: 'comp_nav_item_2',
              type: 'ea-menu-item',
              props: { index: '2' },
              style: {},
              events: [],
              children: [
                {
                  id: 'comp_nav_item_2_text',
                  type: 'ea-button',
                  props: { type: 'normal', text: true, children: '产品服务' },
                  style: {
                    color: '#4a5568',
                    fontSize: '15px',
                  },
                  events: [],
                  children: [],
                },
              ],
            },
            {
              id: 'comp_nav_item_3',
              type: 'ea-menu-item',
              props: { index: '3' },
              style: {},
              events: [],
              children: [
                {
                  id: 'comp_nav_item_3_text',
                  type: 'ea-button',
                  props: { type: 'normal', text: true, children: 'GitHub' },
                  style: {
                    color: '#4a5568',
                    fontSize: '15px',
                  },
                  events: [],
                  children: [],
                },
              ],
            },
            {
              id: 'comp_nav_item_4',
              type: 'ea-menu-item',
              props: { index: '4' },
              style: {},
              events: [],
              children: [
                {
                  id: 'comp_nav_item_4_btn',
                  type: 'ea-button',
                  props: { type: 'primary', size: 'small', children: '开始使用' },
                  style: {
                    marginLeft: '16px',
                  },
                  events: [],
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    // Hero 区域
    {
      id: 'comp_hero',
      type: 'ea-container',
      props: { direction: 'vertical' },
      style: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '120px 60px 80px',
        position: 'relative',
      },
      events: [],
      children: [
        {
          id: 'comp_hero_content',
          type: 'ea-card',
          props: { shadow: 'never' },
          style: {
            backgroundColor: 'transparent',
            border: 'none',
            maxWidth: '900px',
            textAlign: 'center',
          },
          events: [],
          children: [
            {
              id: 'comp_hero_title',
              type: 'ea-button',
              props: {
                type: 'normal',
                text: true,
                children: '低代码开发平台',
              },
              style: {
                fontSize: '56px',
                fontWeight: 'bold',
                color: '#ffffff',
                lineHeight: '1.2',
                marginBottom: '24px',
                display: 'block',
              },
              events: [],
              children: [],
            },
            {
              id: 'comp_hero_subtitle',
              type: 'ea-button',
              props: {
                type: 'normal',
                text: true,
                children: '快速构建企业级应用，无需编写复杂代码，拖拽即可完成',
              },
              style: {
                fontSize: '20px',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: '1.6',
                marginBottom: '40px',
                display: 'block',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
              },
              events: [],
              children: [],
            },
            {
              id: 'comp_hero_buttons',
              type: 'ea-container',
              props: { direction: 'horizontal' },
              style: {
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              },
              events: [],
              children: [
                {
                  id: 'comp_hero_btn_primary',
                  type: 'ea-button',
                  props: { type: 'normal', size: 'large', children: '开始使用' },
                  style: {
                    padding: '14px 36px',
                    fontSize: '16px',
                    backgroundColor: '#ffffff',
                    color: '#667eea',
                    borderRadius: '8px',
                    fontWeight: '500',
                  },
                  events: [],
                  children: [],
                },
                {
                  id: 'comp_hero_btn_secondary',
                  type: 'ea-button',
                  props: { type: 'normal', size: 'large', plain: true, children: '查看文档' },
                  style: {
                    padding: '14px 36px',
                    fontSize: '16px',
                    borderColor: '#ffffff',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontWeight: '500',
                  },
                  events: [],
                  children: [],
                },
              ],
            },
          ],
        },
        // 向下滚动指示
        {
          id: 'comp_scroll_hint',
          type: 'ea-container',
          props: { direction: 'vertical' },
          style: {
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          },
          events: [],
          children: [
            {
              id: 'comp_scroll_text',
              type: 'ea-button',
              props: {
                type: 'normal',
                text: true,
                children: '↓',
              },
              style: {
                fontSize: '24px',
                color: 'rgba(255,255,255,0.8)',
                animation: 'bounce 2s infinite',
              },
              events: [],
              children: [],
            },
          ],
        },
      ],
    },
    // 核心特性区域
    {
      id: 'comp_features',
      type: 'ea-main',
      props: {},
      style: {
        padding: '100px 60px',
        backgroundColor: '#ffffff',
      },
      events: [],
      children: [
        {
          id: 'comp_features_header',
          type: 'ea-container',
          props: { direction: 'vertical' },
          style: {
            textAlign: 'center',
            marginBottom: '60px',
          },
          events: [],
          children: [
            {
              id: 'comp_features_title',
              type: 'ea-button',
              props: {
                type: 'normal',
                text: true,
                children: '核心特性',
              },
              style: {
                fontSize: '40px',
                fontWeight: 'bold',
                color: '#1a202c',
                marginBottom: '16px',
                display: 'block',
              },
              events: [],
              children: [],
            },
            {
              id: 'comp_features_desc',
              type: 'ea-button',
              props: {
                type: 'normal',
                text: true,
                children: '我们提供全方位的低代码解决方案，助力您的数字化转型',
              },
              style: {
                fontSize: '18px',
                color: '#64748b',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'block',
              },
              events: [],
              children: [],
            },
          ],
        },
        {
          id: 'comp_features_grid',
          type: 'ea-container',
          props: { direction: 'horizontal' },
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
            maxWidth: '1200px',
            margin: '0 auto',
          },
          events: [],
          children: [
            // 特性 1: 可视化设计
            {
              id: 'comp_feature_1',
              type: 'ea-card',
              props: { shadow: 'hover' },
              style: {
                padding: '40px 32px',
                textAlign: 'center',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
              },
              events: [],
              children: [
                {
                  id: 'comp_feature_1_icon',
                  type: 'ea-button',
                  props: { type: 'normal', text: true, children: '🎨' },
                  style: {
                    fontSize: '48px',
                    marginBottom: '20px',
                    display: 'block',
                  },
                  events: [],
                  children: [],
                },
                {
                  id: 'comp_feature_1_title',
                  type: 'ea-button',
                  props: { type: 'normal', text: true, children: '可视化设计' },
                  style: {
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: '#1a202c',
                    marginBottom: '12px',
                    display: 'block',
                  },
                  events: [],
                  children: [],
                },
                {
                  id: 'comp_feature_1_desc',
                  type: 'ea-button',
                  props: {
                    type: 'normal',
                    text: true,
                    children: '拖拽式界面设计，无需编写代码即可快速搭建应用界面',
                  },
                  style: {
                    fontSize: '15px',
                    color: '#64748b',
                    lineHeight: '1.6',
                    display: 'block',
                  },
                  events: [],
                  children: [],
                },
              ],
            },
            // 特性 2: 丰富组件
            {
              id: 'comp_feature_2',
              type: 'ea-card',
              props: { shadow: 'hover' },
              style: {
                padding: '40px 32px',
                textAlign: 'center',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
              },
              events: [],
              children: [
                {
                  id: 'comp_feature_2_icon',
                  type: 'ea-button',
                  props: { type: 'normal', text: true, children: '🧩' },
                  style: {
                    fontSize: '48px',
                    marginBottom: '20px',
                    display: 'block',
                  },
                  events: [],
                  children: [],
                },
                {
                  id: 'comp_feature_2_title',
                  type: 'ea-button',
                  props: { type: 'normal', text: true, children: '丰富组件' },
                  style: {
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: '#1a202c',
                    marginBottom: '12px',
                    display: 'block',
                  },
                  events: [],
                  children: [],
                },
                {
                  id: 'comp_feature_2_desc',
                  type: 'ea-button',
                  props: {
                    type: 'normal',
                    text: true,
                    children: '内置数十种常用组件，满足各类业务场景需求',
                  },
                  style: {
                    fontSize: '15px',
                    color: '#64748b',
                    lineHeight: '1.6',
                    display: 'block',
                  },
                  events: [],
                  children: [],
                },
              ],
            },
            // 特性 3: 数据驱动
            {
              id: 'comp_feature_3',
              type: 'ea-card',
              props: { shadow: 'hover' },
              style: {
                padding: '40px 32px',
                textAlign: 'center',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
              },
              events: [],
              children: [
                {
                  id: 'comp_feature_3_icon',
                  type: 'ea-button',
                  props: { type: 'normal', text: true, children: '📊' },
                  style: {
                    fontSize: '48px',
                    marginBottom: '20px',
                    display: 'block',
                  },
                  events: [],
                  children: [],
                },
                {
                  id: 'comp_feature_3_title',
                  type: 'ea-button',
                  props: { type: 'normal', text: true, children: '数据驱动' },
                  style: {
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: '#1a202c',
                    marginBottom: '12px',
                    display: 'block',
                  },
                  events: [],
                  children: [],
                },
                {
                  id: 'comp_feature_3_desc',
                  type: 'ea-button',
                  props: {
                    type: 'normal',
                    text: true,
                    children: '支持变量绑定和数据流管理，轻松实现动态交互',
                  },
                  style: {
                    fontSize: '15px',
                    color: '#64748b',
                    lineHeight: '1.6',
                    display: 'block',
                  },
                  events: [],
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    // 产品服务区域
    {
      id: 'comp_services',
      type: 'ea-container',
      props: { direction: 'vertical' },
      style: {
        padding: '100px 60px',
        backgroundColor: '#f8fafc',
      },
      events: [],
      children: [
        {
          id: 'comp_services_header',
          type: 'ea-container',
          props: { direction: 'vertical' },
          style: {
            textAlign: 'center',
            marginBottom: '60px',
          },
          events: [],
          children: [
            {
              id: 'comp_services_title',
              type: 'ea-button',
              props: {
                type: 'normal',
                text: true,
                children: '产品服务',
              },
              style: {
                fontSize: '40px',
                fontWeight: 'bold',
                color: '#1a202c',
                marginBottom: '16px',
                display: 'block',
              },
              events: [],
              children: [],
            },
            {
              id: 'comp_services_desc',
              type: 'ea-button',
              props: {
                type: 'normal',
                text: true,
                children: '我们提供完整的低代码开发解决方案',
              },
              style: {
                fontSize: '18px',
                color: '#64748b',
                display: 'block',
              },
              events: [],
              children: [],
            },
          ],
        },
        {
          id: 'comp_services_grid',
          type: 'ea-container',
          props: { direction: 'horizontal' },
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '40px',
            maxWidth: '1000px',
            margin: '0 auto',
          },
          events: [],
          children: [
            // 服务 1
            {
              id: 'comp_service_1',
              type: 'ea-container',
              props: { direction: 'horizontal' },
              style: {
                display: 'flex',
                gap: '24px',
                alignItems: 'flex-start',
              },
              events: [],
              children: [
                {
                  id: 'comp_service_1_icon',
                  type: 'ea-button',
                  props: { type: 'normal', text: true, children: '💻' },
                  style: {
                    fontSize: '40px',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#e0e7ff',
                    borderRadius: '16px',
                    flexShrink: '0',
                  },
                  events: [],
                  children: [],
                },
                {
                  id: 'comp_service_1_content',
                  type: 'ea-container',
                  props: { direction: 'vertical' },
                  style: {
                    flex: '1',
                  },
                  events: [],
                  children: [
                    {
                      id: 'comp_service_1_title',
                      type: 'ea-button',
                      props: { type: 'normal', text: true, children: '页面设计器' },
                      style: {
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#1a202c',
                        marginBottom: '8px',
                        display: 'block',
                      },
                      events: [],
                      children: [],
                    },
                    {
                      id: 'comp_service_1_desc',
                      type: 'ea-button',
                      props: {
                        type: 'normal',
                        text: true,
                        children: '可视化页面设计工具，支持拖拽布局和实时预览',
                      },
                      style: {
                        fontSize: '15px',
                        color: '#64748b',
                        lineHeight: '1.6',
                        display: 'block',
                      },
                      events: [],
                      children: [],
                    },
                  ],
                },
              ],
            },
            // 服务 2
            {
              id: 'comp_service_2',
              type: 'ea-container',
              props: { direction: 'horizontal' },
              style: {
                display: 'flex',
                gap: '24px',
                alignItems: 'flex-start',
              },
              events: [],
              children: [
                {
                  id: 'comp_service_2_icon',
                  type: 'ea-button',
                  props: { type: 'normal', text: true, children: '🔌' },
                  style: {
                    fontSize: '40px',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#dbeafe',
                    borderRadius: '16px',
                    flexShrink: '0',
                  },
                  events: [],
                  children: [],
                },
                {
                  id: 'comp_service_2_content',
                  type: 'ea-container',
                  props: { direction: 'vertical' },
                  style: {
                    flex: '1',
                  },
                  events: [],
                  children: [
                    {
                      id: 'comp_service_2_title',
                      type: 'ea-button',
                      props: { type: 'normal', text: true, children: '组件库' },
                      style: {
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#1a202c',
                        marginBottom: '8px',
                        display: 'block',
                      },
                      events: [],
                      children: [],
                    },
                    {
                      id: 'comp_service_2_desc',
                      type: 'ea-button',
                      props: {
                        type: 'normal',
                        text: true,
                        children: '丰富的预置组件，支持自定义扩展和远程组件加载',
                      },
                      style: {
                        fontSize: '15px',
                        color: '#64748b',
                        lineHeight: '1.6',
                        display: 'block',
                      },
                      events: [],
                      children: [],
                    },
                  ],
                },
              ],
            },
            // 服务 3
            {
              id: 'comp_service_3',
              type: 'ea-container',
              props: { direction: 'horizontal' },
              style: {
                display: 'flex',
                gap: '24px',
                alignItems: 'flex-start',
              },
              events: [],
              children: [
                {
                  id: 'comp_service_3_icon',
                  type: 'ea-button',
                  props: { type: 'normal', text: true, children: '⚡' },
                  style: {
                    fontSize: '40px',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fef3c7',
                    borderRadius: '16px',
                    flexShrink: '0',
                  },
                  events: [],
                  children: [],
                },
                {
                  id: 'comp_service_3_content',
                  type: 'ea-container',
                  props: { direction: 'vertical' },
                  style: {
                    flex: '1',
                  },
                  events: [],
                  children: [
                    {
                      id: 'comp_service_3_title',
                      type: 'ea-button',
                      props: { type: 'normal', text: true, children: '代码生成' },
                      style: {
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#1a202c',
                        marginBottom: '8px',
                        display: 'block',
                      },
                      events: [],
                      children: [],
                    },
                    {
                      id: 'comp_service_3_desc',
                      type: 'ea-button',
                      props: {
                        type: 'normal',
                        text: true,
                        children: '一键导出可运行的代码，支持多种前端框架',
                      },
                      style: {
                        fontSize: '15px',
                        color: '#64748b',
                        lineHeight: '1.6',
                        display: 'block',
                      },
                      events: [],
                      children: [],
                    },
                  ],
                },
              ],
            },
            // 服务 4
            {
              id: 'comp_service_4',
              type: 'ea-container',
              props: { direction: 'horizontal' },
              style: {
                display: 'flex',
                gap: '24px',
                alignItems: 'flex-start',
              },
              events: [],
              children: [
                {
                  id: 'comp_service_4_icon',
                  type: 'ea-button',
                  props: { type: 'normal', text: true, children: '🚀' },
                  style: {
                    fontSize: '40px',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fce7f3',
                    borderRadius: '16px',
                    flexShrink: '0',
                  },
                  events: [],
                  children: [],
                },
                {
                  id: 'comp_service_4_content',
                  type: 'ea-container',
                  props: { direction: 'vertical' },
                  style: {
                    flex: '1',
                  },
                  events: [],
                  children: [
                    {
                      id: 'comp_service_4_title',
                      type: 'ea-button',
                      props: { type: 'normal', text: true, children: '快速部署' },
                      style: {
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#1a202c',
                        marginBottom: '8px',
                        display: 'block',
                      },
                      events: [],
                      children: [],
                    },
                    {
                      id: 'comp_service_4_desc',
                      type: 'ea-button',
                      props: {
                        type: 'normal',
                        text: true,
                        children: '支持一键部署到云端，快速上线您的应用',
                      },
                      style: {
                        fontSize: '15px',
                        color: '#64748b',
                        lineHeight: '1.6',
                        display: 'block',
                      },
                      events: [],
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    // GitHub CTA 区域
    {
      id: 'comp_github_cta',
      type: 'ea-container',
      props: { direction: 'vertical' },
      style: {
        padding: '100px 60px',
        backgroundColor: '#1a202c',
        textAlign: 'center',
      },
      events: [],
      children: [
        {
          id: 'comp_github_title',
          type: 'ea-button',
          props: {
            type: 'normal',
            text: true,
            children: '开源项目',
          },
          style: {
            fontSize: '40px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '20px',
            display: 'block',
          },
          events: [],
          children: [],
        },
        {
          id: 'comp_github_desc',
          type: 'ea-button',
          props: {
            type: 'normal',
            text: true,
            children: 'EA Low Code 是一个开源项目，欢迎 Star 和贡献代码',
          },
          style: {
            fontSize: '18px',
            color: '#94a3b8',
            marginBottom: '32px',
            display: 'block',
          },
          events: [],
          children: [],
        },
        {
          id: 'comp_github_btn',
          type: 'ea-button',
          props: {
            type: 'normal',
            size: 'large',
            children: '⭐ Star on GitHub',
          },
          style: {
            padding: '14px 32px',
            fontSize: '16px',
            backgroundColor: '#ffffff',
            color: '#1a202c',
            borderRadius: '8px',
            fontWeight: '500',
          },
          events: [],
          children: [],
        },
        {
          id: 'comp_github_url',
          type: 'ea-button',
          props: {
            type: 'normal',
            text: true,
            children: 'https://github.com/Easy-Front-End-Project/ea-low-code',
          },
          style: {
            fontSize: '14px',
            color: '#64748b',
            marginTop: '16px',
            display: 'block',
          },
          events: [],
          children: [],
        },
      ],
    },
    // 页脚
    {
      id: 'comp_footer',
      type: 'ea-footer',
      props: { height: '80px' },
      style: {
        backgroundColor: '#0f172a',
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
      },
      events: [],
      children: [
        {
          id: 'comp_footer_text',
          type: 'ea-button',
          props: {
            type: 'normal',
            text: true,
            children: '© 2024 EA Low Code. All rights reserved.',
          },
          style: {},
          events: [],
          children: [],
        },
      ],
    },
  ],
}
