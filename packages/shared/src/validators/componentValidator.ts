/**
 * 组件元数据校验器
 * 校验组件元数据的合法性
 */

import type { ComponentMeta, PropDefinition, ValidationResult } from '../types'
import { PROP_TYPES } from '../constants'

/** 合法的属性类型集合 */
const VALID_PROP_TYPES = new Set<string>(Object.values(PROP_TYPES))

/**
 * 校验组件元数据
 * @param meta - 组件元数据
 * @returns 校验结果
 */
export function validateComponentMeta(meta: unknown): ValidationResult {
  const errors: string[] = []

  if (!meta) {
    errors.push('组件元数据不能为空')
    return { valid: false, errors }
  }

  const metaObj = meta as ComponentMeta

  // 校验 type
  if (!metaObj.type) {
    errors.push('组件元数据缺少 type')
  }

  // 校验 name
  if (!metaObj.name) {
    errors.push('组件元数据缺少 name')
  }

  // 校验 category
  if (!metaObj.category) {
    errors.push('组件元数据缺少 category')
  }

  // 校验 icon
  if (!metaObj.icon) {
    errors.push('组件元数据缺少 icon')
  }

  // 校验 props
  if (Array.isArray(metaObj.props)) {
    metaObj.props.forEach((prop, index) => {
      const propErrors = validatePropDefinition(prop, `props[${index}]`)
      errors.push(...propErrors)
    })
  }

  // 校验 slots
  if (Array.isArray(metaObj.slots)) {
    metaObj.slots.forEach((slot, index) => {
      if (!slot.name) {
        errors.push(`slots[${index}]: 缺少 name`)
      }
      if (!slot.label) {
        errors.push(`slots[${index}]: 缺少 label`)
      }
    })
  }

  // 校验 events
  if (Array.isArray(metaObj.events)) {
    metaObj.events.forEach((event, index) => {
      if (!event.name) {
        errors.push(`events[${index}]: 缺少 name`)
      }
      if (!event.label) {
        errors.push(`events[${index}]: 缺少 label`)
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * 校验属性定义
 * @param prop - 属性定义
 * @param path - 路径
 * @returns 错误列表
 */
export function validatePropDefinition(prop: PropDefinition, path: string): string[] {
  const errors: string[] = []

  if (!prop.name) {
    errors.push(`${path}: 缺少 name`)
  }

  if (!prop.label) {
    errors.push(`${path}: 缺少 label`)
  }

  if (!prop.type) {
    errors.push(`${path}: 缺少 type`)
  } else if (!VALID_PROP_TYPES.has(prop.type)) {
    // 允许自定义类型，但给出警告（不作为错误）
    // 自定义类型可能是组件特有的
  }

  // select / multi-select 类型必须有 options
  if ((prop.type === 'select' || prop.type === 'multi-select') && !prop.options?.length) {
    errors.push(`${path}: select/multi-select 类型必须有 options`)
  }

  return errors
}
