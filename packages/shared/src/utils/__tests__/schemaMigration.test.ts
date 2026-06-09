import { describe, it, expect } from 'vitest'
import {
  isV1Schema,
  isV2Schema,
  migrateComponentV1ToV2,
  migratePageSchemaV1ToV2,
  migrateStorePageSchemaV1ToV2,
  migrateToV2,
  migrateStoreSchemaToV2,
  validateV2Migration,
} from '../schemaMigration.js'

// ==================== 测试数据 ====================

const v1Component = {
  id: 'comp_001',
  type: 'ea-button',
  props: { children: '点击', type: 'primary' },
  style: { marginTop: '10px' },
  events: [],
  slots: { default: { text: '按钮文字' } },
  children: [],
}

const v1ComponentWithSlotProps = {
  id: 'comp_002',
  type: 'ea-card',
  props: { shadow: 'hover' },
  style: {},
  events: [],
  slots: {
    header: { name: 'header', label: '头部' },
    default: { name: 'default' },
  },
  children: [],
}

const v1PageSchema = {
  version: '1.0',
  components: [v1Component, v1ComponentWithSlotProps],
  layout: { type: 'absolute', config: {} },
  meta: { title: '测试页面', description: '', viewport: {} },
  settings: { style: { width: '100%' } },
  variables: [{ id: 'var_001', name: 'count', type: 'number', defaultValue: 0, remark: '' }],
}

const v2PageSchema = {
  version: '2.0',
  components: [],
  layout: { type: 'default', config: {} },
  meta: { title: 'v2页面', description: '', viewport: {} },
}

const storeV2Schema = {
  version: '2.0',
  components: [],
  layout: { type: 'default', config: {} },
  meta: { title: 'v2页面', description: '', viewport: {} },
  settings: {},
  variables: [],
}

// ==================== isV1Schema ====================

describe('isV1Schema', () => {
  it('应识别 version 为 1.0 的 schema', () => {
    expect(isV1Schema({ version: '1.0', components: [] })).toBe(true)
  })

  it('应识别无 version 但有 components 数组的 schema', () => {
    expect(isV1Schema({ components: [] })).toBe(true)
  })

  it('应拒绝 v2 schema', () => {
    expect(isV1Schema({ version: '2.0', components: [] })).toBe(false)
  })

  it('应拒绝空值', () => {
    expect(isV1Schema(null)).toBe(false)
    expect(isV1Schema(undefined)).toBe(false)
  })

  it('应拒绝非对象', () => {
    expect(isV1Schema('string')).toBe(false)
    expect(isV1Schema(123)).toBe(false)
  })

  it('应拒绝无 components 的对象', () => {
    expect(isV1Schema({ version: '1.0' })).toBe(true) // version 为 1.0 仍识别
    expect(isV1Schema({ foo: 'bar' })).toBe(false) // 无 version 且无 components
  })
})

// ==================== isV2Schema ====================

describe('isV2Schema', () => {
  it('应识别 version 为 2.0 的 schema', () => {
    expect(isV2Schema({ version: '2.0', components: [] })).toBe(true)
  })

  it('应拒绝 v1 schema', () => {
    expect(isV2Schema({ version: '1.0', components: [] })).toBe(false)
  })

  it('应拒绝空值和非对象', () => {
    expect(isV2Schema(null)).toBe(false)
    expect(isV2Schema(undefined)).toBe(false)
    expect(isV2Schema('2.0')).toBe(false)
  })
})

// ==================== migrateComponentV1ToV2 ====================

describe('migrateComponentV1ToV2', () => {
  it('应迁移基本组件属性', () => {
    const result = migrateComponentV1ToV2(v1Component)
    expect(result.id).toBe('comp_001')
    expect(result.type).toBe('ea-button')
    expect(result.props).toEqual({ children: '点击', type: 'primary' })
    expect(result.style).toEqual({ marginTop: '10px' })
  })

  it('应将普通对象 slots 转为 SlotProps 格式', () => {
    const result = migrateComponentV1ToV2(v1Component)
    expect(result.slots.default).toEqual({
      name: 'default',
      props: { text: '按钮文字' },
    })
  })

  it('应保留已是 SlotProps 格式的 slots', () => {
    const result = migrateComponentV1ToV2(v1ComponentWithSlotProps)
    expect(result.slots.header).toEqual({ name: 'header', label: '头部' })
    expect(result.slots.default).toEqual({ name: 'default' })
  })

  it('应处理空 slots', () => {
    const component = { id: 'c1', type: 'ea-text', props: {}, style: {}, events: [], slots: {}, children: [] }
    const result = migrateComponentV1ToV2(component)
    expect(result.slots).toEqual({})
  })

  it('应处理 undefined slots', () => {
    const component = { id: 'c1', type: 'ea-text', props: {}, style: {}, events: [], children: [] }
    const result = migrateComponentV1ToV2(component)
    expect(result.slots).toEqual({})
  })

  it('应处理基本类型 slot 值', () => {
    const component = {
      id: 'c1',
      type: 'ea-text',
      props: {},
      style: {},
      events: [],
      slots: { default: 'some string' },
      children: [],
    }
    const result = migrateComponentV1ToV2(component)
    expect(result.slots.default).toEqual({ name: 'default' })
  })

  it('应递归迁移子组件', () => {
    const parent = {
      id: 'parent',
      type: 'ea-container',
      props: {},
      style: {},
      events: [],
      slots: {},
      children: [v1Component],
    }
    const result = migrateComponentV1ToV2(parent)
    expect(result.children).toHaveLength(1)
    expect(result.children[0].id).toBe('comp_001')
    expect(result.children[0].slots.default).toEqual({
      name: 'default',
      props: { text: '按钮文字' },
    })
  })

  it('应处理 scopeBindings → slotProps', () => {
    const component = {
      id: 'c1',
      type: 'ea-table',
      props: {},
      style: {},
      events: [],
      slots: {},
      children: [],
      scopeBindings: { default: { row: 'scope.row', index: 'scope.$index' } },
    }
    const result = migrateComponentV1ToV2(component)
    expect(result.slotProps).toEqual({ default: { row: 'scope.row', index: 'scope.$index' } })
  })

  it('应处理可选字段', () => {
    const component = {
      id: 'c1',
      type: 'ea-text',
      props: {},
      style: {},
      events: [],
      slots: {},
      children: [],
      alias: 'myText',
      customCSS: '.my-text { color: red; }',
      positionStyle: { top: '10px', left: '20px' },
      cssVariables: { '--color': '#333' },
    }
    const result = migrateComponentV1ToV2(component)
    expect(result.alias).toBe('myText')
    expect(result.customCSS).toBe('.my-text { color: red; }')
    expect(result.positionStyle).toEqual({ top: '10px', left: '20px' })
    expect(result.cssVariables).toEqual({ '--color': '#333' })
  })
})

// ==================== migratePageSchemaV1ToV2 ====================

describe('migratePageSchemaV1ToV2', () => {
  it('应迁移版本号为 2.0', () => {
    const result = migratePageSchemaV1ToV2(v1PageSchema)
    expect(result.version).toBe('2.0')
  })

  it('应迁移组件列表', () => {
    const result = migratePageSchemaV1ToV2(v1PageSchema)
    expect(result.components).toHaveLength(2)
  })

  it('应保留 layout', () => {
    const result = migratePageSchemaV1ToV2(v1PageSchema)
    expect(result.layout).toEqual({ type: 'absolute', config: {} })
  })

  it('应保留 meta', () => {
    const result = migratePageSchemaV1ToV2(v1PageSchema)
    expect(result.meta.title).toBe('测试页面')
  })

  it('应为缺失的 layout 提供默认值', () => {
    const schema = { version: '1.0', components: [], meta: { title: '', description: '', viewport: {} } }
    const result = migratePageSchemaV1ToV2(schema)
    expect(result.layout).toEqual({ type: 'default', config: {} })
  })

  it('应为缺失的 meta 提供默认值', () => {
    const schema = { version: '1.0', components: [], layout: { type: 'default', config: {} } }
    const result = migratePageSchemaV1ToV2(schema)
    expect(result.meta.title).toBe('未命名页面')
  })
})

// ==================== migrateStorePageSchemaV1ToV2 ====================

describe('migrateStorePageSchemaV1ToV2', () => {
  it('应包含 settings 和 variables', () => {
    const result = migrateStorePageSchemaV1ToV2(v1PageSchema)
    expect(result.settings).toEqual({ style: { width: '100%' } })
    expect(result.variables).toHaveLength(1)
    expect(result.variables[0].name).toBe('count')
  })

  it('应为缺失的 settings 和 variables 提供默认值', () => {
    const schema = {
      version: '1.0',
      components: [],
      layout: { type: 'default', config: {} },
      meta: { title: '', description: '', viewport: {} },
    }
    const result = migrateStorePageSchemaV1ToV2(schema)
    expect(result.settings).toEqual({})
    expect(result.variables).toEqual([])
  })
})

// ==================== migrateToV2 ====================

describe('migrateToV2', () => {
  it('应自动迁移 v1 schema', () => {
    const result = migrateToV2(v1PageSchema)
    expect(result.version).toBe('2.0')
  })

  it('应直接返回 v2 schema', () => {
    const result = migrateToV2(v2PageSchema)
    expect(result).toBe(v2PageSchema)
  })
})

// ==================== migrateStoreSchemaToV2 ====================

describe('migrateStoreSchemaToV2', () => {
  it('应自动迁移 v1 store schema', () => {
    const result = migrateStoreSchemaToV2(v1PageSchema)
    expect(result.version).toBe('2.0')
    expect(result.settings).toBeDefined()
    expect(result.variables).toBeDefined()
  })

  it('应直接返回 v2 store schema', () => {
    const result = migrateStoreSchemaToV2(storeV2Schema)
    expect(result).toBe(storeV2Schema)
  })
})

// ==================== validateV2Migration ====================

describe('validateV2Migration', () => {
  it('应通过有效的 v2 schema', () => {
    const schema = {
      version: '2.0',
      components: [
        { id: 'c1', type: 'ea-text', slots: { default: { name: 'default' } } },
      ],
    }
    const result = validateV2Migration(schema)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('应拒绝空值', () => {
    const result = validateV2Migration(null)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Schema 不能为空')
  })

  it('应检测版本号错误', () => {
    const schema = { version: '1.0', components: [] }
    const result = validateV2Migration(schema)
    expect(result.valid).toBe(false)
    expect(result.errors[0]).toContain('版本号')
  })

  it('应检测 components 非数组', () => {
    const schema = { version: '2.0', components: 'not array' }
    const result = validateV2Migration(schema)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('components 必须是数组')
  })

  it('应检测组件缺少 id', () => {
    const schema = { version: '2.0', components: [{ type: 'ea-text' }] }
    const result = validateV2Migration(schema)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('缺少 id'))).toBe(true)
  })

  it('应检测组件缺少 type', () => {
    const schema = { version: '2.0', components: [{ id: 'c1' }] }
    const result = validateV2Migration(schema)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('缺少 type'))).toBe(true)
  })

  it('应检测 SlotProps 缺少 name 字段', () => {
    const schema = {
      version: '2.0',
      components: [
        { id: 'c1', type: 'ea-card', slots: { header: { label: '头部' } } },
      ],
    }
    const result = validateV2Migration(schema)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('SlotProps 缺少 name 字段'))).toBe(true)
  })

  it('应递归验证子组件', () => {
    const schema = {
      version: '2.0',
      components: [
        {
          id: 'parent',
          type: 'ea-container',
          slots: {},
          children: [{ type: 'ea-text' }], // 缺少 id
        },
      ],
    }
    const result = validateV2Migration(schema)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('children[0]') && e.includes('缺少 id'))).toBe(true)
  })

  it('应验证迁移后的完整 schema', () => {
    const migrated = migrateStoreSchemaToV2(v1PageSchema)
    const result = validateV2Migration(migrated)
    expect(result.valid).toBe(true)
  })
})
