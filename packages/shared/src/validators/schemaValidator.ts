/**
 * Schema 校验器
 * 校验页面 Schema 结构的合法性
 */

import type { ComponentSchema, PageSchema, ValidationResult } from '../types'

/**
 * 校验页面 Schema
 * @param schema - 页面 Schema 对象
 * @returns 校验结果
 */
export function validatePageSchema(schema: unknown): ValidationResult {
  const errors: string[] = []

  if (!schema) {
    errors.push('Schema 不能为空')
    return { valid: false, errors }
  }

  const schemaObj = schema as Record<string, unknown>

  // 校验版本号
  if (!schemaObj.version) {
    errors.push('Schema 缺少版本号')
  }

  // 校验组件列表
  if (!Array.isArray(schemaObj.components)) {
    errors.push('Schema 组件列表必须是数组')
  }

  // 校验组件
  if (Array.isArray(schemaObj.components)) {
    const idSet = new Set<string>()
    ;(schemaObj.components as ComponentSchema[]).forEach((comp, index) => {
      const compErrors = validateComponent(comp, `components[${index}]`, idSet)
      errors.push(...compErrors)
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * 校验组件 Schema
 * @param component - 组件 Schema
 * @param path - 路径
 * @param idSet - 已有 ID 集合（用于唯一性检查）
 * @returns 错误列表
 */
export function validateComponent(
  component: ComponentSchema,
  path: string,
  idSet?: Set<string>
): string[] {
  const errors: string[] = []

  if (!component) {
    errors.push(`${path}: 组件不能为空`)
    return errors
  }

  // 校验 id
  if (!component.id) {
    errors.push(`${path}: 组件缺少 id`)
  } else if (idSet) {
    if (idSet.has(component.id)) {
      errors.push(`${path}: 组件 id 重复 (${component.id})`)
    } else {
      idSet.add(component.id)
    }
  }

  // 校验 type
  if (!component.type) {
    errors.push(`${path}: 组件缺少 type`)
  }

  // 校验 props
  if (!component.props || typeof component.props !== 'object') {
    errors.push(`${path}: 组件 props 必须是对象`)
  }

  // 校验子组件
  if (component.children && Array.isArray(component.children)) {
    component.children.forEach((child, index) => {
      const childErrors = validateComponent(child, `${path}.children[${index}]`, idSet)
      errors.push(...childErrors)
    })
  }

  return errors
}
