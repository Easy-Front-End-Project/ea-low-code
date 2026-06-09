/**
 * Schema v1 → v2 迁移工具
 * 将旧版 Schema 转换为 v2 规范化格式
 *
 * v2 变更点：
 * - version: '1.0' → '2.0'
 * - ComponentSchema.slots: Record<string, unknown> → Record<string, SlotProps>
 * - 新增 ComponentSchema.slotProps 可选字段
 * - 确保 style / positionStyle / cssVariables / customCSS 字段存在且类型正确
 */

import type {
  ComponentSchema,
  PageSchema,
  StorePageSchema,
  SlotProps,
  ValidationResult,
} from '../types/index.js'
import { SCHEMA_VERSION, LEGACY_SCHEMA_VERSION } from '../constants/index.js'

// ==================== 类型守卫 ====================

/**
 * 判断 Schema 是否为 v1 格式
 * @param schema - 页面 Schema
 * @returns 是否为 v1 格式
 */
export function isV1Schema(schema: unknown): boolean {
  if (!schema || typeof schema !== 'object') return false
  const obj = schema as Record<string, unknown>
  return obj.version === LEGACY_SCHEMA_VERSION || (!obj.version && Array.isArray(obj.components))
}

/**
 * 判断 Schema 是否为 v2 格式
 * @param schema - 页面 Schema
 * @returns 是否为 v2 格式
 */
export function isV2Schema(schema: unknown): boolean {
  if (!schema || typeof schema !== 'object') return false
  const obj = schema as Record<string, unknown>
  return obj.version === SCHEMA_VERSION
}

// ==================== 组件迁移 ====================

/**
 * 迁移单个组件 Schema 从 v1 到 v2
 * @param component - v1 组件 Schema
 * @returns v2 组件 Schema
 */
export function migrateComponentV1ToV2(component: Record<string, unknown>): ComponentSchema {
  // 迁移 slots 字段：从 Record<string, unknown> 转为 Record<string, SlotProps>
  const migratedSlots = migrateSlots(component.slots as Record<string, unknown> | undefined)

  // 迁移 scopeBindings → slotProps（如果 scopeBindings 包含插槽作用域数据）
  const slotProps = component.scopeBindings
    ? { ...component.scopeBindings as Record<string, unknown> }
    : undefined

  return {
    id: component.id as string,
    type: component.type as string,
    props: (component.props as Record<string, unknown>) ?? {},
    style: (component.style as Record<string, string>) ?? {},
    events: (component.events as ComponentSchema['events']) ?? [],
    children: migrateChildrenV1ToV2(component.children as Record<string, unknown>[] | undefined),
    slots: migratedSlots,
    slotProps,
    positionStyle: component.positionStyle as Record<string, string> | undefined,
    cssVariables: component.cssVariables as Record<string, string> | undefined,
    customCSS: component.customCSS as string | undefined,
    isRemote: component.isRemote as boolean | undefined,
    remoteConfig: component.remoteConfig as ComponentSchema['remoteConfig'] | undefined,
    childrenText: component.childrenText as string | undefined,
    alias: component.alias as string | undefined,
    scopeBindings: component.scopeBindings as Record<string, unknown> | undefined,
  }
}

/**
 * 迁移 slots 字段
 * v1 中 slots 为 Record<string, unknown>，v2 中为 Record<string, SlotProps>
 *
 * 转换规则：
 * - 如果 slot 值已经是 SlotProps 格式（含 name 字段），直接保留
 * - 如果 slot 值是普通对象，包装为 { name: slotName, props: value }
 * - 如果 slot 值为空/undefined，创建默认 SlotProps
 */
function migrateSlots(slots: Record<string, unknown> | undefined): Record<string, SlotProps> {
  if (!slots || typeof slots !== 'object') return {}

  const result: Record<string, SlotProps> = {}

  for (const [slotName, slotValue] of Object.entries(slots)) {
    if (slotValue && typeof slotValue === 'object' && 'name' in (slotValue as Record<string, unknown>)) {
      // 已经是 SlotProps 格式
      result[slotName] = slotValue as SlotProps
    } else if (slotValue && typeof slotValue === 'object') {
      // 普通对象，包装为 SlotProps
      result[slotName] = {
        name: slotName,
        props: slotValue as Record<string, unknown>,
      }
    } else {
      // 空值或基本类型，创建默认 SlotProps
      result[slotName] = { name: slotName }
    }
  }

  return result
}

/**
 * 递归迁移子组件列表
 * @param children - v1 子组件列表
 * @returns v2 子组件列表
 */
function migrateChildrenV1ToV2(children: Record<string, unknown>[] | undefined): ComponentSchema[] {
  if (!Array.isArray(children)) return []
  return children.map(child => migrateComponentV1ToV2(child))
}

// ==================== 页面 Schema 迁移 ====================

/**
 * 迁移页面 Schema 从 v1 到 v2
 * @param schema - v1 页面 Schema
 * @returns v2 页面 Schema
 */
export function migratePageSchemaV1ToV2(schema: Record<string, unknown>): PageSchema {
  return {
    version: SCHEMA_VERSION,
    components: migrateChildrenV1ToV2(schema.components as Record<string, unknown>[] | undefined),
    layout: (schema.layout as PageSchema['layout']) ?? { type: 'default', config: {} },
    meta: (schema.meta as PageSchema['meta']) ?? { title: '未命名页面', description: '', viewport: {} },
  }
}

/**
 * 迁移 Store 页面 Schema 从 v1 到 v2
 * @param schema - v1 Store 页面 Schema
 * @returns v2 Store 页面 Schema
 */
export function migrateStorePageSchemaV1ToV2(schema: Record<string, unknown>): StorePageSchema {
  const pageSchema = migratePageSchemaV1ToV2(schema)

  return {
    ...pageSchema,
    settings: (schema.settings as Record<string, unknown>) ?? {},
    variables: (schema.variables as StorePageSchema['variables']) ?? [],
  }
}

// ==================== 自动迁移入口 ====================

/**
 * 自动检测 Schema 版本并迁移到 v2
 * 如果已经是 v2 则直接返回，否则执行迁移
 * @param schema - 任意版本的页面 Schema
 * @returns v2 页面 Schema
 */
export function migrateToV2(schema: unknown): PageSchema {
  if (isV2Schema(schema)) {
    return schema as PageSchema
  }

  return migratePageSchemaV1ToV2(schema as Record<string, unknown>)
}

/**
 * 自动检测 Store Schema 版本并迁移到 v2
 * @param schema - 任意版本的 Store 页面 Schema
 * @returns v2 Store 页面 Schema
 */
export function migrateStoreSchemaToV2(schema: unknown): StorePageSchema {
  if (isV2Schema(schema)) {
    return schema as StorePageSchema
  }

  return migrateStorePageSchemaV1ToV2(schema as Record<string, unknown>)
}

// ==================== 迁移验证 ====================

/**
 * 验证迁移后的 Schema 是否符合 v2 规范
 * @param schema - 迁移后的 Schema
 * @returns 验证结果
 */
export function validateV2Migration(schema: unknown): ValidationResult {
  const errors: string[] = []

  if (!schema || typeof schema !== 'object') {
    return { valid: false, errors: ['Schema 不能为空'] }
  }

  const obj = schema as Record<string, unknown>

  // 检查版本号
  if (obj.version !== SCHEMA_VERSION) {
    errors.push(`版本号应为 ${SCHEMA_VERSION}，实际为 ${obj.version}`)
  }

  // 检查组件列表
  if (!Array.isArray(obj.components)) {
    errors.push('components 必须是数组')
  } else {
    validateV2Components(obj.components as Record<string, unknown>[], errors)
  }

  return { valid: errors.length === 0, errors }
}

/**
 * 递归验证 v2 组件
 */
function validateV2Components(components: Record<string, unknown>[], errors: string[], prefix = ''): void {
  for (let i = 0; i < components.length; i++) {
    const comp = components[i]
    const path = prefix ? `${prefix}.children[${i}]` : `components[${i}]`

    if (!comp.id) errors.push(`${path}: 缺少 id`)
    if (!comp.type) errors.push(`${path}: 缺少 type`)

    // 验证 slots 是否为 Record<string, SlotProps> 格式
    if (comp.slots && typeof comp.slots === 'object') {
      const slots = comp.slots as Record<string, unknown>
      for (const [slotName, slotValue] of Object.entries(slots)) {
        if (slotValue && typeof slotValue === 'object') {
          const slotObj = slotValue as Record<string, unknown>
          if (!slotObj.name) {
            errors.push(`${path}.slots.${slotName}: SlotProps 缺少 name 字段`)
          }
        }
      }
    }

    // 递归验证子组件
    if (Array.isArray(comp.children)) {
      validateV2Components(comp.children as Record<string, unknown>[], errors, path)
    }
  }
}
