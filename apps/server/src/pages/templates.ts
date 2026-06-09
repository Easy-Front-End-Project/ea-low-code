
export const TEMPLATES: Record<string, { name: string; schema: any }> = {
  dashboard: {
    name: '数据看板',
    schema: {
      meta: {
        title: '数据看板',
        description: '',
      },
      layout: {
        type: 'absolute',
        config: {},
      },
      version: '2.0',
      settings: {
        style: {
          width: '',
        },
        events: [
          {
            id: 'event_1776540278357_06zg6o8s',
            name: 'initPage',
            action: 'custom',
            eventType: 'load',
            actionConfig: {
              code: '// 页面初始化：填充订单表格数据\nconst orderData = $vars.get("orderData");\n$alias.setProp("orderTable", "data", orderData);',
            },
            customEventType: 'load',
          },
        ],
      },
      variables: [
        {
          id: 'var_1776540278357_mh9yfq3y',
          name: 'orderData',
          type: 'array',
          remark: '',
          defaultValue: [
            {
              amount: '¥12,800.00',
              status: '已完成',
              orderNo: 'ORD-20240115-001',
              customer: '张三',
              createdAt: '2024-01-15 10:30',
            },
            {
              amount: '¥5,600.50',
              status: '处理中',
              orderNo: 'ORD-20240114-002',
              customer: '李四',
              createdAt: '2024-01-14 16:20',
            },
            {
              amount: '¥23,400.00',
              status: '已完成',
              orderNo: 'ORD-20240114-003',
              customer: '王五',
              createdAt: '2024-01-14 09:15',
            },
            {
              amount: '¥8,900.00',
              status: '待付款',
              orderNo: 'ORD-20240113-004',
              customer: '赵六',
              createdAt: '2024-01-13 14:45',
            },
            {
              amount: '¥15,200.00',
              status: '已完成',
              orderNo: 'ORD-20240112-005',
              customer: '王二',
              createdAt: '2024-01-12 12:00',
            },
            {
              amount: '¥3,450.80',
              status: '已取消',
              orderNo: 'ORD-20240111-006',
              customer: '孙七',
              createdAt: '2024-01-11 08:50',
            },
            {
              amount: '¥19,800.00',
              status: '已完成',
              orderNo: 'ORD-20240110-007',
              customer: '周八',
              createdAt: '2024-01-10 15:10',
            },
            {
              amount: '¥7,250.00',
              status: '处理中',
              orderNo: 'ORD-20240109-008',
              customer: '吴九',
              createdAt: '2024-01-09 11:25',
            },
            {
              amount: '¥42,000.00',
              status: '已完成',
              orderNo: 'ORD-20240108-009',
              customer: '郑十',
              createdAt: '2024-01-08 09:00',
            },
            {
              amount: '¥1,350.60',
              status: '待付款',
              orderNo: 'ORD-20240107-010',
              customer: '陈明',
              createdAt: '2024-01-07 17:40',
            },
            {
              amount: '¥28,500.00',
              status: '已完成',
              orderNo: 'ORD-20240106-011',
              customer: '林芳',
              createdAt: '2024-01-06 13:20',
            },
            {
              amount: '¥6,780.00',
              status: '已取消',
              orderNo: 'ORD-20240105-012',
              customer: '黄伟',
              createdAt: '2024-01-05 10:05',
            },
            {
              amount: '¥11,200.00',
              status: '处理中',
              orderNo: 'ORD-20240104-013',
              customer: '刘洋',
              createdAt: '2024-01-04 14:30',
            },
            {
              amount: '¥35,600.00',
              status: '已完成',
              orderNo: 'ORD-20240103-014',
              customer: '杨静',
              createdAt: '2024-01-03 16:55',
            },
            {
              amount: '¥4,920.30',
              status: '待付款',
              orderNo: 'ORD-20240102-015',
              customer: '何磊',
              createdAt: '2024-01-02 08:15',
            },
            {
              amount: '¥16,800.00',
              status: '已完成',
              orderNo: 'ORD-20240101-016',
              customer: '马丽',
              createdAt: '2024-01-01 11:45',
            },
            {
              amount: '¥9,100.00',
              status: '已取消',
              orderNo: 'ORD-20231231-017',
              customer: '徐强',
              createdAt: '2023-12-31 15:30',
            },
            {
              amount: '¥22,750.00',
              status: '处理中',
              orderNo: 'ORD-20231230-018',
              customer: '高敏',
              createdAt: '2023-12-30 09:50',
            },
            {
              amount: '¥7,600.00',
              status: '已完成',
              orderNo: 'ORD-20231229-019',
              customer: '田华',
              createdAt: '2023-12-29 13:10',
            },
            {
              amount: '¥31,200.00',
              status: '待付款',
              orderNo: 'ORD-20231228-020',
              customer: '罗杰',
              createdAt: '2023-12-28 10:25',
            },
          ],
        },
      ],
      components: [
        {
          id: 'comp_1776540278357_s105jpt1',
          type: 'ea-container',
          props: {
            direction: 'vertical',
          },
          slots: {},
          style: {
            padding: '24px',
            minHeight: '100vh',
            backgroundColor: '#f0f2f5',
          },
          events: [],
          children: [
            {
              id: 'comp_1776540278357_uz91mfom',
              type: 'ea-row',
              props: {
                align: 'middle',
                gutter: 16,
              },
              slots: {},
              style: {
                marginBottom: '20px',
              },
              events: [],
              children: [
                {
                  id: 'comp_1776540278357_u4dz1hhr',
                  type: 'ea-col',
                  props: {
                    span: 16,
                  },
                  slots: {},
                  style: {},
                  events: [],
                  children: [
                    {
                      id: 'comp_1776540278357_npb9n0c3',
                      type: 'ea-text',
                      props: {
                        size: 'large',
                        children: '工作台',
                      },
                      slots: {},
                      style: {
                        color: '#1d2129',
                        display: 'block',
                        fontWeight: '600',
                      },
                      events: [],
                      children: [],
                    },
                    {
                      id: 'comp_1776540278357_jy70lgg2',
                      type: 'ea-text',
                      props: {
                        size: 'medium',
                        type: 'info',
                        children: '欢迎回来，管理员，祝您今天工作愉快！',
                      },
                      slots: {},
                      style: {
                        display: 'block',
                        marginTop: '6px',
                      },
                      events: [],
                      children: [],
                    },
                  ],
                },
                {
                  id: 'comp_1776540278357_c88tlxco',
                  type: 'ea-col',
                  props: {
                    span: 8,
                  },
                  slots: {},
                  style: {
                    textAlign: 'right',
                  },
                  events: [],
                  children: [
                    {
                      id: 'comp_1776540278357_nwkqtgpu',
                      type: 'ea-text',
                      props: {
                        size: 'small',
                        type: 'info',
                        children: '2024年01月15日 星期一',
                      },
                      slots: {},
                      style: {},
                      events: [],
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              id: 'comp_1776540278357_cqicqv3r',
              type: 'ea-row',
              props: {
                gutter: 16,
              },
              slots: {},
              style: {
                marginBottom: '20px',
              },
              events: [],
              children: [
                {
                  id: 'comp_1776540278357_eix5vuc8',
                  type: 'ea-col',
                  props: {
                    span: 6,
                  },
                  slots: {},
                  style: {},
                  events: [],
                  children: [
                    {
                      id: 'comp_1776540278357_48wbitwx',
                      type: 'ea-card',
                      props: {
                        shadow: 'hover',
                      },
                      slots: {},
                      style: {
                        padding: '20px',
                        borderLeft: '4px solid #1890ff',
                        borderRadius: '8px',
                      },
                      events: [],
                      children: [
                        {
                          id: 'comp_1776540278357_ed4m4ilb',
                          type: 'ea-row',
                          props: {
                            align: 'middle',
                            justify: 'space-between',
                          },
                          slots: {},
                          style: {
                            marginBottom: '12px',
                          },
                          events: [],
                          children: [
                            {
                              id: 'comp_1776540278357_ynwcst7s',
                              type: 'ea-col',
                              props: {
                                span: 12,
                              },
                              slots: {},
                              style: {},
                              events: [],
                              children: [
                                {
                                  id: 'comp_1776540278357_txmsns5m',
                                  type: 'ea-text',
                                  props: {
                                    size: 'medium',
                                    type: 'info',
                                    children: '总销售额',
                                  },
                                  slots: {},
                                  style: {},
                                  events: [],
                                  children: [],
                                },
                              ],
                            },
                            {
                              id: 'comp_1776540278357_f33bplsy',
                              type: 'ea-col',
                              props: {
                                span: 12,
                              },
                              slots: {},
                              style: {
                                textAlign: 'right',
                              },
                              events: [],
                              children: [
                                {
                                  id: 'comp_1776540278357_oxpm7zt6',
                                  type: 'ea-icon',
                                  props: {
                                    name: 'chart-line',
                                    size: '24',
                                    color: '#1890ff',
                                  },
                                  slots: {},
                                  style: {},
                                  events: [],
                                  children: [],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          id: 'comp_1776540278357_l93wuag4',
                          type: 'ea-statistic',
                          props: {
                            value: '128000',
                          },
                          slots: {},
                          style: {},
                          events: [],
                          children: [
                            {
                              id: 'comp_1776540278357_zmcl7uvb',
                              type: 'ea-text',
                              props: {
                                size: 'small',
                                slot: 'suffix',
                                children: ' 元',
                              },
                              slots: {},
                              style: {},
                              events: [],
                              children: [],
                            },
                          ],
                        },
                        {
                          id: 'comp_1776540278357_vyf3wpa7',
                          type: 'ea-text',
                          props: {
                            size: 'small',
                            type: 'success',
                            children: '↑ 12.5% 较上周',
                          },
                          slots: {},
                          style: {
                            display: 'block',
                            marginTop: '8px',
                          },
                          events: [],
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'comp_1776540278357_1xwbl4u2',
                  type: 'ea-col',
                  props: {
                    span: 6,
                  },
                  slots: {},
                  style: {},
                  events: [],
                  children: [
                    {
                      id: 'comp_1776540278357_6heoq9sa',
                      type: 'ea-card',
                      props: {
                        shadow: 'hover',
                      },
                      slots: {},
                      style: {
                        padding: '20px',
                        borderLeft: '4px solid #52c41a',
                        borderRadius: '8px',
                      },
                      events: [],
                      children: [
                        {
                          id: 'comp_1776540278357_zjksda6p',
                          type: 'ea-row',
                          props: {
                            align: 'middle',
                            justify: 'space-between',
                          },
                          slots: {},
                          style: {
                            marginBottom: '12px',
                          },
                          events: [],
                          children: [
                            {
                              id: 'comp_1776540278357_f8pwmlyc',
                              type: 'ea-col',
                              props: {
                                span: 12,
                              },
                              slots: {},
                              style: {},
                              events: [],
                              children: [
                                {
                                  id: 'comp_1776540278357_lr1h0199',
                                  type: 'ea-text',
                                  props: {
                                    size: 'medium',
                                    type: 'info',
                                    children: '订单总数',
                                  },
                                  slots: {},
                                  style: {},
                                  events: [],
                                  children: [],
                                },
                              ],
                            },
                            {
                              id: 'comp_1776540278357_emkz1m1s',
                              type: 'ea-col',
                              props: {
                                span: 12,
                              },
                              slots: {},
                              style: {
                                textAlign: 'right',
                              },
                              events: [],
                              children: [
                                {
                                  id: 'comp_1776540278357_5rrth8o3',
                                  type: 'ea-icon',
                                  props: {
                                    name: 'cart-shopping',
                                    size: '24',
                                    color: '#52c41a',
                                  },
                                  slots: {},
                                  style: {},
                                  events: [],
                                  children: [],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          id: 'comp_1776540278357_rjm86e7l',
                          type: 'ea-statistic',
                          props: {
                            value: '3560',
                          },
                          slots: {},
                          style: {},
                          events: [],
                          children: [
                            {
                              id: 'comp_1776540278357_nsa3avpc',
                              type: 'ea-text',
                              props: {
                                size: 'small',
                                slot: 'suffix',
                                children: ' 单',
                              },
                              slots: {},
                              style: {},
                              events: [],
                              children: [],
                            },
                          ],
                        },
                        {
                          id: 'comp_1776540278357_pxfx04gh',
                          type: 'ea-text',
                          props: {
                            size: 'small',
                            type: 'success',
                            children: '↑ 8.2% 较上周',
                          },
                          slots: {},
                          style: {
                            display: 'block',
                            marginTop: '8px',
                          },
                          events: [],
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'comp_1776540278357_fciq4qjs',
                  type: 'ea-col',
                  props: {
                    span: 6,
                  },
                  slots: {},
                  style: {},
                  events: [],
                  children: [
                    {
                      id: 'comp_1776540278357_gilqvhqz',
                      type: 'ea-card',
                      props: {
                        shadow: 'hover',
                      },
                      slots: {},
                      style: {
                        padding: '20px',
                        borderLeft: '4px solid #faad14',
                        borderRadius: '8px',
                      },
                      events: [],
                      children: [
                        {
                          id: 'comp_1776540278357_k0515zj6',
                          type: 'ea-row',
                          props: {
                            align: 'middle',
                            justify: 'space-between',
                          },
                          slots: {},
                          style: {
                            marginBottom: '12px',
                          },
                          events: [],
                          children: [
                            {
                              id: 'comp_1776540278357_ht5pi5kw',
                              type: 'ea-col',
                              props: {
                                span: 12,
                              },
                              slots: {},
                              style: {},
                              events: [],
                              children: [
                                {
                                  id: 'comp_1776540278357_ucrlcwko',
                                  type: 'ea-text',
                                  props: {
                                    size: 'medium',
                                    type: 'info',
                                    children: '访客数量',
                                  },
                                  slots: {},
                                  style: {},
                                  events: [],
                                  children: [],
                                },
                              ],
                            },
                            {
                              id: 'comp_1776540278357_h12tilsn',
                              type: 'ea-col',
                              props: {
                                span: 12,
                              },
                              slots: {},
                              style: {
                                textAlign: 'right',
                              },
                              events: [],
                              children: [
                                {
                                  id: 'comp_1776540278357_m5cjy3pv',
                                  type: 'ea-icon',
                                  props: {
                                    name: 'users',
                                    size: '24',
                                    color: '#faad14',
                                  },
                                  slots: {},
                                  style: {},
                                  events: [],
                                  children: [],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          id: 'comp_1776540278357_zx7aqdwg',
                          type: 'ea-statistic',
                          props: {
                            value: '8920',
                          },
                          slots: {},
                          style: {},
                          events: [],
                          children: [
                            {
                              id: 'comp_1776540278357_dvrlq1ne',
                              type: 'ea-text',
                              props: {
                                size: 'small',
                                slot: 'suffix',
                                children: ' 人',
                              },
                              slots: {},
                              style: {},
                              events: [],
                              children: [],
                            },
                          ],
                        },
                        {
                          id: 'comp_1776540278357_fcyzvsr9',
                          type: 'ea-text',
                          props: {
                            size: 'small',
                            type: 'danger',
                            children: '↓ 3.1% 较上周',
                          },
                          slots: {},
                          style: {
                            display: 'block',
                            marginTop: '8px',
                          },
                          events: [],
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'comp_1776540278357_d5z0a6xk',
                  type: 'ea-col',
                  props: {
                    span: 6,
                  },
                  slots: {},
                  style: {},
                  events: [],
                  children: [
                    {
                      id: 'comp_1776540278357_r1p2gubc',
                      type: 'ea-card',
                      props: {
                        shadow: 'hover',
                      },
                      slots: {},
                      style: {
                        padding: '20px',
                        borderLeft: '4px solid #722ed1',
                        borderRadius: '8px',
                      },
                      events: [],
                      children: [
                        {
                          id: 'comp_1776540278357_1a2cunij',
                          type: 'ea-row',
                          props: {
                            align: 'middle',
                            justify: 'space-between',
                          },
                          slots: {},
                          style: {
                            marginBottom: '12px',
                          },
                          events: [],
                          children: [
                            {
                              id: 'comp_1776540278357_odkcfucx',
                              type: 'ea-col',
                              props: {
                                span: 12,
                              },
                              slots: {},
                              style: {},
                              events: [],
                              children: [
                                {
                                  id: 'comp_1776540278357_2gm1vauk',
                                  type: 'ea-text',
                                  props: {
                                    size: 'medium',
                                    type: 'info',
                                    children: '转化率',
                                  },
                                  slots: {},
                                  style: {},
                                  events: [],
                                  children: [],
                                },
                              ],
                            },
                            {
                              id: 'comp_1776540278357_0p04w4t7',
                              type: 'ea-col',
                              props: {
                                span: 12,
                              },
                              slots: {},
                              style: {
                                textAlign: 'right',
                              },
                              events: [],
                              children: [
                                {
                                  id: 'comp_1776540278357_872tk7gz',
                                  type: 'ea-icon',
                                  props: {
                                    name: 'percentage',
                                    size: '24',
                                    color: '#722ed1',
                                  },
                                  slots: {},
                                  style: {},
                                  events: [],
                                  children: [],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          id: 'comp_1776540278357_94q4lu18',
                          type: 'ea-statistic',
                          props: {
                            value: '72.8',
                          },
                          slots: {},
                          style: {},
                          events: [],
                          children: [
                            {
                              id: 'comp_1776540278357_40sabf82',
                              type: 'ea-text',
                              props: {
                                size: 'small',
                                slot: 'suffix',
                                children: ' %',
                              },
                              slots: {},
                              style: {},
                              events: [],
                              children: [],
                            },
                          ],
                        },
                        {
                          id: 'comp_1776540278357_64j0g1y2',
                          type: 'ea-text',
                          props: {
                            size: 'small',
                            type: 'success',
                            children: '↑ 2.4% 较上周',
                          },
                          slots: {},
                          style: {
                            display: 'block',
                            marginTop: '8px',
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
            {
              id: 'comp_1776540278357_08jnqg8x',
              type: 'ea-row',
              props: {
                gutter: 20,
              },
              slots: {},
              style: {
                marginBottom: '20px',
              },
              events: [],
              children: [
                {
                  id: 'comp_1776540278357_cb8e6ndq',
                  type: 'ea-col',
                  props: {
                    span: 12,
                  },
                  slots: {},
                  style: {},
                  events: [],
                  children: [
                    {
                      id: 'comp_1776540773998_ilseekpi',
                      type: 'ea-table',
                      props: {
                        data: {
                          type: 'variable',
                          value: 'orderData',
                        },
                        border: false,
                        height: '500px',
                        stripe: false,
                        'max-height': '',
                        'show-summary': false,
                        'highlight-current-row': false,
                      },
                      style: {
                        width: '100%',
                      },
                      events: [],
                      children: [
                        {
                          id: 'comp_1776541079178_wmaea3v9',
                          type: 'ea-table-column',
                          props: {
                            prop: 'orderNo',
                            type: '',
                            align: 'left',
                            fixed: 'false',
                            label: 'OrderNo',
                            width: '',
                            sortable: false,
                          },
                          style: {},
                          events: [],
                          children: [],
                        },
                        {
                          id: 'comp_1776541206466_wtnu2e10',
                          type: 'ea-table-column',
                          props: {
                            prop: 'customer',
                            type: '',
                            align: 'left',
                            fixed: 'false',
                            label: 'Customer',
                            width: '',
                            sortable: false,
                          },
                          style: {},
                          events: [],
                          children: [],
                        },
                        {
                          id: 'comp_1776541209578_izdwwa00',
                          type: 'ea-table-column',
                          props: {
                            prop: 'amount',
                            type: '',
                            align: 'left',
                            fixed: 'false',
                            label: 'Amount',
                            width: '',
                            sortable: false,
                          },
                          style: {},
                          events: [],
                          children: [],
                        },
                        {
                          id: 'comp_1776541212155_l52tuf5m',
                          type: 'ea-table-column',
                          props: {
                            prop: 'status',
                            type: '',
                            align: 'left',
                            fixed: 'false',
                            label: 'Status',
                            width: '',
                            sortable: false,
                          },
                          style: {},
                          events: [],
                          children: [],
                        },
                        {
                          id: 'comp_1776541214200_zq47qjtw',
                          type: 'ea-table-column',
                          props: {
                            prop: 'createdAt',
                            type: '',
                            align: 'left',
                            fixed: 'false',
                            label: 'CreatedAt',
                            width: '',
                            sortable: false,
                          },
                          style: {},
                          events: [],
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'comp_1776540747850_7qv2kj93',
                  type: 'ea-col',
                  props: {
                    pull: 0,
                    push: 0,
                    span: 12,
                    offset: 0,
                  },
                  style: {},
                  events: [],
                  children: [
                    {
                      id: 'comp_1776540807208_bks5zhms',
                      type: 'ea-row',
                      props: {
                        align: 'top',
                        gutter: 0,
                        justify: 'start',
                      },
                      style: {},
                      events: [],
                      children: [
                        {
                          id: 'comp_1776543006865_igielec3',
                          type: 'ea-card',
                          props: {
                            footer: '',
                            header: '',
                            shadow: 'always',
                          },
                          style: {
                            width: '',
                          },
                          events: [],
                          children: [
                            {
                              id: 'comp_1776543040220_akj4fskz',
                              type: 'ea-calendar',
                              props: {
                                value: 1776542241136,
                                'controller-type': 'button',
                              },
                              style: {},
                              events: [],
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'comp_1776541029610_t6mnqmhd',
                      type: 'ea-row',
                      props: {
                        align: 'top',
                        gutter: 0,
                        justify: 'start',
                      },
                      style: {},
                      events: [],
                      children: [
                        {
                          id: 'comp_1776543136388_yra5skmb',
                          type: 'ea-card',
                          props: {
                            footer: '',
                            header: '',
                            shadow: 'always',
                          },
                          style: {
                            width: '100%',
                          },
                          events: [],
                          children: [
                            {
                              id: 'comp_1776542605021_dw7ay0mj',
                              type: 'ea-collapse',
                              props: {
                                active: '',
                                accordion: false,
                                'expand-icon-position': 'right',
                              },
                              style: {},
                              events: [],
                              children: [
                                {
                                  id: 'comp_1776542608569_za1hxlif',
                                  type: 'ea-collapse-item',
                                  props: {
                                    name: 'today',
                                    title: '今日待办',
                                    disabled: false,
                                  },
                                  style: {},
                                  events: [],
                                  children: [
                                    {
                                      id: 'comp_1776542806128_gv1i1rbw',
                                      type: 'ea-tag',
                                      props: {
                                        size: 'default',
                                        type: 'primary',
                                        color: '',
                                        round: false,
                                        effect: 'light',
                                        children: '工作',
                                        closable: false,
                                        'disable-transitions': false,
                                      },
                                      style: {},
                                      events: [],
                                      children: [],
                                    },
                                  ],
                                },
                                {
                                  id: 'comp_1776542612204_xpku4vea',
                                  type: 'ea-collapse-item',
                                  props: {
                                    name: 'week',
                                    title: '本周计划',
                                    disabled: false,
                                  },
                                  style: {},
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
              ],
            },
            {
              id: 'comp_1776540278357_x8cenpu3',
              type: 'ea-row',
              props: {
                gutter: 16,
              },
              slots: {},
              style: {},
              events: [],
              children: [
                {
                  id: 'comp_1776540278357_2smodf2i',
                  type: 'ea-col',
                  props: {
                    span: 12,
                  },
                  slots: {},
                  style: {},
                  events: [],
                  children: [
                    {
                      id: 'comp_1776540278357_3jxkkzny',
                      type: 'ea-card',
                      props: {
                        shadow: 'always',
                      },
                      slots: {},
                      style: {
                        borderRadius: '8px',
                      },
                      events: [],
                      children: [
                        {
                          id: 'comp_1776540278357_n7sc143l',
                          type: 'ea-text',
                          props: {
                            size: 'medium',
                            slot: 'header',
                            children: '系统公告',
                          },
                          slots: {},
                          style: {
                            padding: '16px 20px',
                            fontWeight: '600',
                            borderBottom: '1px solid #f0f0f0',
                          },
                          events: [],
                          children: [],
                        },
                        {
                          id: 'comp_1776540278357_4h53vfxx',
                          type: 'ea-descriptions',
                          props: {
                            border: true,
                            column: 1,
                          },
                          slots: {},
                          style: {},
                          events: [],
                          children: [
                            {
                              id: 'comp_1776540278357_43dl5ndx',
                              type: 'ea-descriptions-item',
                              props: {
                                label: '2024-01-15',
                                children:
                                  '系统将于本周六凌晨2:00-4:00进行维护升级，届时服务将暂停访问。',
                              },
                              slots: {},
                              style: {},
                              events: [],
                              children: [],
                            },
                            {
                              id: 'comp_1776540278357_6qjortq6',
                              type: 'ea-descriptions-item',
                              props: {
                                label: '2024-01-12',
                                children: '新版本v2.5.0已发布，新增数据导出功能和性能优化。',
                              },
                              slots: {},
                              style: {},
                              events: [],
                              children: [],
                            },
                            {
                              id: 'comp_1776540278357_hgpknybe',
                              type: 'ea-descriptions-item',
                              props: {
                                label: '2024-01-10',
                                children: '请各位同事及时更新个人资料，确保联系方式准确无误。',
                              },
                              slots: {},
                              style: {},
                              events: [],
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'comp_1776540278357_ncfww1jc',
                  type: 'ea-col',
                  props: {
                    span: 12,
                  },
                  slots: {},
                  style: {},
                  events: [],
                  children: [
                    {
                      id: 'comp_1776540278357_3roja3bn',
                      type: 'ea-card',
                      props: {
                        shadow: 'always',
                      },
                      slots: {},
                      style: {
                        borderRadius: '8px',
                      },
                      events: [],
                      children: [
                        {
                          id: 'comp_1776540278357_bqy9mlhq',
                          type: 'ea-text',
                          props: {
                            size: 'medium',
                            slot: 'header',
                            children: '快捷操作',
                          },
                          slots: {},
                          style: {
                            padding: '16px 20px',
                            fontWeight: '600',
                            borderBottom: '1px solid #f0f0f0',
                          },
                          events: [],
                          children: [],
                        },
                        {
                          id: 'comp_1776540278357_puyj0ara',
                          type: 'ea-row',
                          props: {
                            gutter: 16,
                          },
                          slots: {},
                          style: {
                            padding: '16px 0',
                          },
                          events: [],
                          children: [
                            {
                              id: 'comp_1776540278357_xru21ays',
                              type: 'ea-col',
                              props: {
                                span: 6,
                              },
                              slots: {},
                              style: {
                                textAlign: 'center',
                                marginBottom: '12px',
                              },
                              events: [],
                              children: [
                                {
                                  id: 'comp_1776540278357_kp1v89ts',
                                  type: 'ea-button',
                                  props: {
                                    icon: 'user-plus',
                                    type: 'primary',
                                    children: '新增用户',
                                  },
                                  slots: {},
                                  style: {
                                    width: '100%',
                                  },
                                  events: [],
                                  children: [],
                                },
                              ],
                            },
                            {
                              id: 'comp_1776540278357_cqj3ox44',
                              type: 'ea-col',
                              props: {
                                span: 6,
                              },
                              slots: {},
                              style: {
                                textAlign: 'center',
                                marginBottom: '12px',
                              },
                              events: [],
                              children: [
                                {
                                  id: 'comp_1776540278357_9mt0g2hb',
                                  type: 'ea-button',
                                  props: {
                                    icon: 'file-lines',
                                    type: 'success',
                                    children: '新建文档',
                                  },
                                  slots: {},
                                  style: {
                                    width: '100%',
                                  },
                                  events: [],
                                  children: [],
                                },
                              ],
                            },
                            {
                              id: 'comp_1776540278357_sffhjjgl',
                              type: 'ea-col',
                              props: {
                                span: 6,
                              },
                              slots: {},
                              style: {
                                textAlign: 'center',
                                marginBottom: '12px',
                              },
                              events: [],
                              children: [
                                {
                                  id: 'comp_1776540278357_ha0dsuvs',
                                  type: 'ea-button',
                                  props: {
                                    icon: 'chart-simple',
                                    type: 'warning',
                                    children: '数据报表',
                                  },
                                  slots: {},
                                  style: {
                                    width: '100%',
                                  },
                                  events: [],
                                  children: [],
                                },
                              ],
                            },
                            {
                              id: 'comp_1776540278357_lipkg5il',
                              type: 'ea-col',
                              props: {
                                span: 6,
                              },
                              slots: {},
                              style: {
                                textAlign: 'center',
                                marginBottom: '12px',
                              },
                              events: [],
                              children: [
                                {
                                  id: 'comp_1776540278357_hs7sjnbr',
                                  type: 'ea-button',
                                  props: {
                                    icon: 'gear',
                                    type: 'danger',
                                    children: '系统设置',
                                  },
                                  slots: {},
                                  style: {
                                    width: '100%',
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
              ],
            },
          ],
        },
      ],
    },
  },

  form: {
    name: '表单页面',
    schema: {
      meta: {
        title: '表单页面',
        description: '',
      },
      layout: {
        type: 'absolute',
        config: {},
      },
      version: '2.0',
      components: [
        {
          id: 'comp_1776532057997_731bkk04',
          type: 'ea-container',
          props: {
            direction: 'vertical',
          },
          slots: {},
          style: {
            padding: '20px',
            minHeight: '100vh',
            backgroundColor: '#f5f7fa',
          },
          events: [],
          children: [
            {
              id: 'comp_1776532057997_g02bzj6y',
              type: 'ea-card',
              props: {
                header: '信息录入',
              },
              slots: {},
              style: {
                width: '100%',
                margin: '0 auto',
                maxWidth: '800px',
                borderRadius: '8px',
              },
              events: [],
              children: [
                {
                  id: 'comp_1776532057997_il4t1pd7',
                  type: 'form',
                  props: {
                    action: '/api/form/submit',
                    method: 'post',
                    enctype: 'application/x-www-form-urlencoded',
                  },
                  slots: {},
                  style: {
                    padding: '20px',
                  },
                  events: [
                    {
                      id: 'event_1776532292808_8rg9arkb',
                      name: 'event1',
                      eventType: 'submit',
                      customEventType: 'submit',
                      action: 'message',
                      actionConfig: {
                        message: '提交成功',
                        type: 'success',
                        duration: 3000,
                        showClose: false,
                        dangerouslyUseHTMLString: false,
                        placement: 'top',
                        offset: 16,
                      },
                    },
                    {
                      id: 'event_1776532326655_7ydiyubu',
                      name: 'event2',
                      eventType: 'reset',
                      customEventType: 'reset',
                      action: 'message',
                      actionConfig: {
                        message: '重置表单',
                        type: 'info',
                        duration: 3000,
                        showClose: false,
                        dangerouslyUseHTMLString: false,
                        placement: 'top',
                        offset: 16,
                      },
                    },
                  ],
                  children: [
                    {
                      id: 'comp_1776532057997_izg8pjtk',
                      type: 'ea-row',
                      props: {
                        gutter: 20,
                      },
                      slots: {},
                      style: {
                        marginBottom: '16px',
                      },
                      events: [],
                      children: [
                        {
                          id: 'comp_1776532057997_vf0bee31',
                          type: 'ea-col',
                          props: {
                            span: 12,
                          },
                          slots: {},
                          style: {},
                          events: [],
                          children: [
                            {
                              id: 'comp_1776532057997_8k5rq40g',
                              type: 'ea-input',
                              props: {
                                name: 'name',
                                label: '姓名',
                                required: true,
                                clearable: true,
                                maxlength: 20,
                                minlength: 2,
                                placeholder: '请输入姓名',
                                autocomplete: 'off',
                                showWordLimit: true,
                              },
                              slots: {},
                              style: {},
                              events: [],
                              children: [],
                            },
                          ],
                        },
                        {
                          id: 'comp_1776532057997_4snqj5zn',
                          type: 'ea-col',
                          props: {
                            span: 12,
                          },
                          slots: {},
                          style: {},
                          events: [],
                          children: [
                            {
                              id: 'comp_1776532057997_3gx0sszp',
                              type: 'ea-input',
                              props: {
                                name: 'email',
                                type: 'email',
                                label: '邮箱',
                                pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                                required: true,
                                clearable: true,
                                placeholder: '请输入邮箱地址',
                              },
                              slots: {},
                              style: {},
                              events: [],
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'comp_1776532057997_hwlch2v7',
                      type: 'ea-row',
                      props: {
                        gutter: 20,
                      },
                      slots: {},
                      style: {
                        marginBottom: '16px',
                      },
                      events: [],
                      children: [
                        {
                          id: 'comp_1776532057997_f1u3ml3p',
                          type: 'ea-col',
                          props: {
                            span: 12,
                          },
                          slots: {},
                          style: {},
                          events: [],
                          children: [
                            {
                              id: 'comp_1776532057997_sn0e8dzm',
                              type: 'ea-input',
                              props: {
                                name: 'phone',
                                type: 'tel',
                                label: '手机号',
                                pattern: '^1[3-9]\\d{9}$',
                                required: true,
                                clearable: true,
                                maxlength: 11,
                                placeholder: '请输入11位手机号',
                              },
                              slots: {},
                              style: {},
                              events: [],
                              children: [],
                            },
                          ],
                        },
                        {
                          id: 'comp_1776532057997_x0vyw0vz',
                          type: 'ea-col',
                          props: {
                            span: 12,
                          },
                          slots: {},
                          style: {},
                          events: [],
                          children: [
                            {
                              id: 'comp_1776532057997_7gfa6gy2',
                              type: 'ea-select',
                              props: {
                                name: 'department',
                                label: '部门',
                                required: true,
                                clearable: true,
                                filterable: true,
                                placeholder: '请选择部门',
                              },
                              slots: {},
                              style: {},
                              events: [],
                              children: [
                                {
                                  id: 'comp_1776532057997_pblpllzx',
                                  type: 'ea-option',
                                  props: {
                                    slot: 'default',
                                    value: 'frontend',
                                  },
                                  slots: {},
                                  childrenText: '前端开发部',
                                },
                                {
                                  id: 'comp_1776532057997_19qzkvln',
                                  type: 'ea-option',
                                  props: {
                                    slot: 'default',
                                    value: 'backend',
                                  },
                                  slots: {},
                                  childrenText: '后端开发部',
                                },
                                {
                                  id: 'comp_1776532057997_8epmzkva',
                                  type: 'ea-option',
                                  props: {
                                    slot: 'default',
                                    value: 'design',
                                  },
                                  slots: {},
                                  childrenText: '设计部',
                                },
                                {
                                  id: 'comp_1776532057997_49bfxz8v',
                                  type: 'ea-option',
                                  props: {
                                    slot: 'default',
                                    value: 'product',
                                  },
                                  slots: {},
                                  childrenText: '产品部',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'comp_1776532057997_faql357k',
                      type: 'ea-row',
                      props: {
                        gutter: 20,
                      },
                      slots: {},
                      style: {
                        marginBottom: '16px',
                      },
                      events: [],
                      children: [
                        {
                          id: 'comp_1776532057997_nkutri0l',
                          type: 'ea-col',
                          props: {
                            span: 12,
                          },
                          slots: {},
                          style: {},
                          events: [],
                          children: [
                            {
                              id: 'comp_1776532057997_f0lgj44p',
                              type: 'ea-input',
                              props: {
                                max: 65,
                                min: 18,
                                name: 'age',
                                type: 'number',
                                label: '年龄',
                                placeholder: '请输入年龄',
                              },
                              slots: {},
                              style: {},
                              events: [],
                              children: [],
                            },
                          ],
                        },
                        {
                          id: 'comp_1776532057997_ruuopg0e',
                          type: 'ea-col',
                          props: {
                            span: 12,
                          },
                          slots: {},
                          style: {},
                          events: [],
                          children: [
                            {
                              id: 'comp_1776532057997_8vypte88',
                              type: 'ea-input',
                              props: {
                                name: 'password',
                                type: 'password',
                                label: '密码',
                                required: true,
                                maxlength: 20,
                                minlength: 6,
                                placeholder: '请设置登录密码（6-20位）',
                                autocomplete: 'new-password',
                                showPassword: true,
                              },
                              slots: {},
                              style: {},
                              events: [],
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'comp_1776532057997_nahlijq6',
                      type: 'ea-input',
                      props: {
                        name: 'remark',
                        rows: 4,
                        type: 'textarea',
                        label: '备注说明',
                        resize: 'vertical',
                        maxlength: 500,
                        placeholder: '请输入备注信息',
                        showWordLimit: true,
                      },
                      slots: {},
                      style: {
                        marginBottom: '16px',
                      },
                      events: [],
                      children: [],
                    },
                    {
                      id: 'comp_1776532057997_c44hnlyx',
                      type: 'ea-button-group',
                      props: {},
                      slots: {},
                      style: {
                        gap: '12px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                      },
                      events: [],
                      children: [
                        {
                          id: 'comp_1776532057997_rspu7wyt',
                          type: 'ea-button',
                          props: {
                            type: 'default',
                            children: '重置',
                            'button-type': 'reset',
                          },
                          slots: {},
                          style: {},
                          events: [
                            {
                              eventType: 'click',
                              handlerType: 'resetForm',
                            },
                          ],
                          children: [],
                        },
                        {
                          id: 'comp_1776532057997_cgciirav',
                          type: 'ea-button',
                          props: {
                            type: 'primary',
                            children: '提交',
                            'button-type': 'submit',
                          },
                          slots: {},
                          style: {},
                          events: [
                            {
                              eventType: 'click',
                              handlerType: 'submitForm',
                            },
                          ],
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
      ],
      variables: [],
    },
  },

  list: {
    name: '列表页面',
    schema: {
      meta: {
        title: '列表页面',
        description: '',
      },
      layout: {
        type: 'absolute',
        config: {},
      },
      version: '2.0',
      components: [
        {
          id: 'comp_1776535005883_se01s39u',
          type: 'ea-container',
          props: {
            direction: 'vertical',
          },
          slots: {},
          style: {
            padding: '20px',
            minHeight: '100vh',
            backgroundColor: '#f5f7fa',
          },
          events: [],
          children: [
            {
              id: 'comp_1776535005883_4c13jzey',
              type: 'ea-row',
              props: {
                gutter: 16,
              },
              slots: {},
              style: {
                marginBottom: '16px',
              },
              events: [],
              children: [
                {
                  id: 'comp_1776535005883_kz82s8s8',
                  type: 'ea-col',
                  props: {
                    span: 6,
                  },
                  slots: {},
                  style: {},
                  events: [],
                  children: [
                    {
                      id: 'comp_1776535005883_4448mixb',
                      type: 'ea-card',
                      props: {
                        shadow: 'hover',
                      },
                      slots: {},
                      style: {
                        padding: '16px',
                        textAlign: 'center',
                      },
                      events: [],
                      children: [
                        {
                          id: 'comp_1776535005883_kb8jw0v8',
                          type: 'ea-statistic',
                          props: {
                            title: '总用户数',
                            value: '26800',
                          },
                          slots: {},
                          style: {},
                          events: [],
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'comp_1776535005883_nue5yt0z',
                  type: 'ea-col',
                  props: {
                    span: 6,
                  },
                  slots: {},
                  style: {},
                  events: [],
                  children: [
                    {
                      id: 'comp_1776535005883_b29w29al',
                      type: 'ea-card',
                      props: {
                        shadow: 'hover',
                      },
                      slots: {},
                      style: {
                        padding: '16px',
                        textAlign: 'center',
                      },
                      events: [],
                      children: [
                        {
                          id: 'comp_1776535005883_sm1shjy0',
                          type: 'ea-statistic',
                          props: {
                            title: '今日访问',
                            value: '1234',
                          },
                          slots: {},
                          style: {},
                          events: [],
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'comp_1776535005883_8kouysgf',
                  type: 'ea-col',
                  props: {
                    span: 6,
                  },
                  slots: {},
                  style: {},
                  events: [],
                  children: [
                    {
                      id: 'comp_1776535005883_pgxdjtcb',
                      type: 'ea-card',
                      props: {
                        shadow: 'hover',
                      },
                      slots: {},
                      style: {
                        padding: '16px',
                        textAlign: 'center',
                      },
                      events: [],
                      children: [
                        {
                          id: 'comp_1776535005883_s0c2z2sn',
                          type: 'ea-statistic',
                          props: {
                            title: '活跃用户',
                            value: '8900',
                          },
                          slots: {},
                          style: {},
                          events: [],
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'comp_1776535005883_mrm6tlc4',
                  type: 'ea-col',
                  props: {
                    span: 6,
                  },
                  slots: {},
                  style: {},
                  events: [],
                  children: [
                    {
                      id: 'comp_1776535005883_b8xfj05v',
                      type: 'ea-card',
                      props: {
                        shadow: 'hover',
                      },
                      slots: {},
                      style: {
                        padding: '16px',
                        textAlign: 'center',
                      },
                      events: [],
                      children: [
                        {
                          id: 'comp_1776535005883_wc1zxx9o',
                          type: 'ea-statistic',
                          props: {
                            title: '转化率',
                            value: '68.5',
                          },
                          slots: {},
                          style: {},
                          events: [],
                          children: [
                            {
                              id: 'comp_1776535005883_cy51k8vd',
                              type: 'ea-text',
                              props: {
                                size: 'small',
                                slot: 'suffix',
                                children: '%',
                              },
                              slots: {},
                              style: {},
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
            {
              id: 'comp_1776535005883_rcs4kuqj',
              type: 'ea-card',
              props: {
                header: '数据列表',
                shadow: 'always',
              },
              slots: {},
              style: {
                borderRadius: '8px',
              },
              events: [],
              children: [
                {
                  id: 'comp_1776535005883_6puk20ba',
                  type: 'ea-row',
                  props: {
                    gutter: 16,
                  },
                  slots: {},
                  style: {
                    padding: '0 4px',
                    marginBottom: '16px',
                  },
                  events: [],
                  children: [
                    {
                      id: 'comp_1776535005883_d3on7ni8',
                      type: 'ea-col',
                      props: {
                        span: 8,
                      },
                      slots: {},
                      style: {},
                      events: [],
                      children: [
                        {
                          id: 'comp_1776535005883_rbf2mn8q',
                          type: 'ea-input',
                          props: {
                            clearable: true,
                            prefixIcon: 'magnifying-glass',
                            placeholder: '请输入搜索关键词',
                          },
                          slots: {},
                          style: {},
                          events: [],
                          children: [],
                        },
                      ],
                    },
                    {
                      id: 'comp_1776535005883_7jyfuywp',
                      type: 'ea-col',
                      props: {
                        span: 16,
                      },
                      slots: {},
                      style: {
                        gap: '8px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                      },
                      events: [],
                      children: [
                        {
                          id: 'comp_1776535005883_ok26iy1n',
                          type: 'ea-button',
                          props: {
                            icon: 'magnifying-glass',
                            type: 'primary',
                            children: '搜索',
                          },
                          slots: {},
                          style: {},
                          events: [],
                          children: [],
                        },
                        {
                          id: 'comp_1776535005883_0rrrimzy',
                          type: 'ea-button',
                          props: {
                            icon: 'rotate-left',
                            children: '重置',
                          },
                          slots: {},
                          style: {},
                          events: [],
                          children: [],
                        },
                        {
                          id: 'comp_1776535005883_yz7vi180',
                          type: 'ea-button',
                          props: {
                            icon: 'plus',
                            type: 'success',
                            children: '新增',
                          },
                          slots: {},
                          style: {},
                          events: [],
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'comp_1776535005883_t3unbb0n',
                  type: 'ea-table',
                  props: {
                    border: true,
                    stripe: true,
                  },
                  slots: {},
                  style: {
                    width: '100%',
                  },
                  events: [
                    {
                      id: 'event_1776535540505_a2dywrdy',
                      name: 'event1',
                      eventType: 'load',
                      customEventType: 'load',
                      action: 'custom',
                      actionConfig: {
                        code: '// 使用 $component 操作其他组件\n// 示例：设置按钮 loading\nconst tableData = $vars.get("tableData");\n$alias.setProp(\'table\', "data", tableData);\n$component.setProp("comp_1776535005883_t3unbb0n", "data", tableData)\nconsole.log($alias.getElement("table"))',
                      },
                    },
                  ],
                  children: [
                    {
                      id: 'comp_1776535005883_fu0buqop',
                      type: 'ea-table-column',
                      props: {
                        type: 'index',
                        align: 'center',
                        label: '序号',
                        width: '80px',
                      },
                      slots: {},
                      style: {},
                      events: [],
                      children: [],
                    },
                    {
                      id: 'comp_1776535005883_1jj1wr1s',
                      type: 'ea-table-column',
                      props: {
                        prop: 'name',
                        label: '名称',
                        width: '180px',
                      },
                      slots: {},
                      style: {},
                      events: [],
                      children: [],
                    },
                    {
                      id: 'comp_1776535005883_5h23puqx',
                      type: 'ea-table-column',
                      props: {
                        prop: 'status',
                        align: 'center',
                        label: '状态',
                        width: '120px',
                      },
                      slots: {},
                      style: {},
                      events: [],
                      children: [],
                    },
                    {
                      id: 'comp_1776535005883_fm5ek9wn',
                      type: 'ea-table-column',
                      props: {
                        prop: 'createdAt',
                        align: 'center',
                        label: '创建时间',
                        width: '180px',
                      },
                      slots: {},
                      style: {},
                      events: [],
                      children: [],
                    },
                    {
                      id: 'comp_1776535005883_a93rxjrm',
                      type: 'ea-table-column',
                      props: {
                        align: 'center',
                        label: '操作',
                        width: '200px',
                      },
                      slots: {},
                      style: {},
                      events: [],
                      children: [],
                    },
                  ],
                  alias: 'table',
                },
                {
                  id: 'comp_1776535005883_gumednwj',
                  type: 'ea-pagination',
                  props: {
                    total: 100,
                    pageSize: 10,
                    background: true,
                  },
                  slots: {},
                  style: {
                    display: 'flex',
                    marginTop: '16px',
                    justifyContent: 'flex-end',
                  },
                  events: [],
                  children: [],
                },
              ],
            },
          ],
        },
      ],
      variables: [
        {
          id: 'var_1776535065151_0q2mi9ai',
          name: 'tableData',
          type: 'array',
          defaultValue: [
            {
              date: '2016-05-03',
              name: 'Tom',
              address: 'No. 189, Grove St, Los Angeles',
            },
            {
              date: '2016-05-02',
              name: 'Tom',
              address: 'No. 189, Grove St, Los Angeles',
            },
            {
              date: '2016-05-04',
              name: 'Tom',
              address: 'No. 189, Grove St, Los Angeles',
            },
            {
              date: '2016-05-01',
              name: 'Tom',
              address: 'No. 189, Grove St, Los Angeles',
            },
          ],
          remark: '',
        },
      ],
      settings: {
        events: [
          {
            id: 'event_1776535180533_lqdh1z6d',
            name: 'setTableData',
            eventType: 'load',
            customEventType: 'load',
            action: 'custom',
            actionConfig: {
              code: '// 使用 $component 操作其他组件\n// 示例：设置按钮 loading\nconst tableData = $vars.get("tableData");\n$alias.setProp(\'table\', "data", tableData);\n$component.setProp("comp_1776535005883_t3unbb0n", "data", tableData)\nconsole.log($alias.getElement("table"))',
            },
          },
        ],
      },
    },
  },

  detail: {
    name: '详情页面',
    schema: {
      meta: {
        title: '详情页面',
        description: '',
      },
      layout: {
        type: 'absolute',
        config: {},
      },
      version: '2.0',
      settings: {
        style: {
          width: '',
        },
      },
      variables: [],
      components: [
        {
          id: 'comp_1776532472876_2wixl3z9',
          type: 'ea-container',
          props: {
            direction: 'vertical',
          },
          slots: {},
          style: {
            padding: '20px',
            minHeight: '100vh',
            backgroundColor: '#ffffff',
          },
          events: [],
          children: [
            {
              id: 'comp_1776532627151_86eykhbb',
              type: 'ea-header',
              props: {
                height: 'auto',
              },
              style: {},
              events: [],
              children: [
                {
                  id: 'comp_1776532674022_34i5imm4',
                  type: 'ea-page-header',
                  props: {
                    icon: 'angle-left',
                    title: 'Back',
                    content: '详情页',
                  },
                  style: {},
                  events: [],
                  children: [],
                },
              ],
            },
            {
              id: 'comp_1776532629865_mmyfjiq2',
              type: 'ea-main',
              props: {},
              style: {
                padding: '16px 0px',
              },
              events: [],
              children: [
                {
                  id: 'comp_1776532885146_u81hvor2',
                  type: 'ea-card',
                  props: {
                    footer: '',
                    header: '',
                    shadow: 'hover',
                  },
                  style: {},
                  events: [],
                  children: [
                    {
                      id: 'comp_1776533187331_nktxhag1',
                      type: 'ea-descriptions',
                      props: {
                        size: 'small',
                        title: '',
                        border: false,
                        column: 3,
                        direction: 'vertical',
                        'label-width': '150px',
                      },
                      style: {
                        width: '1px',
                      },
                      events: [],
                      children: [
                        {
                          id: 'comp_1776533757615_y4xyhk70',
                          type: 'ea-descriptions-item',
                          props: {
                            align: '',
                            label: 'Avatar',
                            width: '',
                            colspan: 1,
                            rowspan: 1,
                            children: '',
                            'label-part': '',
                            'label-align': '',
                            'label-width': '',
                            'content-part': '',
                          },
                          style: {},
                          events: [],
                          children: [
                            {
                              id: 'comp_1776533807745_37aamlqy',
                              type: 'ea-avatar',
                              props: {
                                alt: '',
                                fit: 'cover',
                                src: '',
                                icon: '',
                                size: 'default',
                                shape: 'circle',
                                'src-set': '',
                              },
                              style: {},
                              events: [],
                              children: [],
                            },
                          ],
                        },
                        {
                          id: 'comp_1776533192893_u5sht8zi',
                          type: 'ea-descriptions-item',
                          props: {
                            align: '',
                            label: 'Username',
                            width: '',
                            colspan: 1,
                            rowspan: 1,
                            children: 'Lilyiro ',
                            'label-part': '',
                            'label-align': '',
                            'label-width': '',
                            'content-part': '',
                          },
                          style: {},
                          events: [],
                          children: [],
                        },
                        {
                          id: 'comp_1776533256303_hmlz6577',
                          type: 'ea-descriptions-item',
                          props: {
                            align: '',
                            label: 'Essence',
                            width: '',
                            colspan: 1,
                            rowspan: 1,
                            children: 'Lord of the Wild',
                            'label-part': '',
                            'label-align': '',
                            'label-width': '',
                            'content-part': '',
                          },
                          style: {},
                          events: [],
                          children: [],
                        },
                        {
                          id: 'comp_1776533308807_ck5r45cu',
                          type: 'ea-descriptions-item',
                          props: {
                            align: '',
                            label: 'Place',
                            width: '',
                            colspan: 1,
                            rowspan: 1,
                            children: 'Lunacrest Continent',
                            'label-part': '',
                            'label-align': '',
                            'label-width': '',
                            'content-part': '',
                          },
                          style: {},
                          events: [],
                          children: [],
                        },
                        {
                          id: 'comp_1776533580059_hwcew4hr',
                          type: 'ea-descriptions-item',
                          props: {
                            align: '',
                            label: 'Traits',
                            width: '',
                            colspan: 1,
                            rowspan: 1,
                            children: '',
                            'label-part': '',
                            'label-align': '',
                            'label-width': '',
                            'content-part': '',
                          },
                          style: {},
                          events: [],
                          children: [
                            {
                              id: 'comp_1776533613734_o9om3v1i',
                              type: 'ea-tag',
                              props: {
                                size: 'default',
                                type: 'warning',
                                color: '',
                                round: false,
                                effect: 'light',
                                children: 'Thunderous Veins',
                                closable: false,
                                'disable-transitions': false,
                              },
                              style: {},
                              events: [],
                              children: [],
                            },
                            {
                              id: 'comp_1776533647349_enotpwns',
                              type: 'ea-tag',
                              props: {
                                size: 'default',
                                type: 'info',
                                color: '',
                                round: false,
                                effect: 'light',
                                children: 'Daredevil',
                                closable: false,
                                'disable-transitions': false,
                              },
                              style: {},
                              events: [],
                              children: [],
                            },
                          ],
                        },
                        {
                          id: 'comp_1776533582897_7c8kbu3w',
                          type: 'ea-descriptions-item',
                          props: {
                            align: '',
                            label: 'Description',
                            width: '',
                            colspan: 1,
                            rowspan: 1,
                            children: '',
                            'label-part': '',
                            'label-align': '',
                            'label-width': '',
                            'content-part': '',
                          },
                          style: {},
                          events: [],
                          children: [
                            {
                              id: 'comp_1776533690387_qve3v1zi',
                              type: 'ea-text',
                              props: {
                                tag: 'span',
                                size: 'medium',
                                type: 'normal',
                                title: '',
                                children:
                                  '      She was once an elf lord, defending the border from goblin invaders. She       was then a goblin warrior, protecting her clan from being slaughtered by       elves. She has the unwavering courage to uphold justice in her heart and       she is prepared to betray or be betrayed for the greater good. Despite her       inner gentleness, Lilyiro, who has spilled so much blood on battlefields,       is more straightforward than men.',
                                truncated: false,
                                'line-clamp': 0,
                              },
                              style: {},
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
            {
              id: 'comp_1776532631412_6um8rqcm',
              type: 'ea-footer',
              props: {
                height: 'auto',
              },
              style: {},
              events: [],
              children: [
                {
                  id: 'comp_1776534118623_ekoqay74',
                  type: 'ea-space',
                  props: {
                    fill: false,
                    size: 'small',
                    wrap: false,
                    spacer: ' | ',
                    alignment: 'center',
                    direction: 'horizontal',
                    'fill-ratio': 0,
                  },
                  style: {},
                  events: [],
                  children: [
                    {
                      id: 'comp_1776534124076_f42il9jj',
                      type: 'ea-text',
                      props: {
                        tag: 'span',
                        size: 'medium',
                        type: 'normal',
                        title: '',
                        children: 'LuminaQAQ',
                        truncated: false,
                        'line-clamp': 0,
                      },
                      style: {},
                      events: [],
                      children: [],
                    },
                    {
                      id: 'comp_1776534360586_6ic7gzg3',
                      type: 'ea-link',
                      props: {
                        children: 'Github',
                        type: 'info',
                        disabled: false,
                        underline: '',
                        href: 'https://github.com/LuminaQAQ',
                        icon: 'coffee',
                      },
                      style: {},
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
  },
}

export function getTemplateSchema(templateId: string): any | null {
  const template = TEMPLATES[templateId]
  return template ? JSON.parse(JSON.stringify(template.schema)) : null
}
