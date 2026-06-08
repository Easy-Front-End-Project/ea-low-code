/**
 * 深拷贝工具
 * 提供支持 Schema 结构的深拷贝方法
 */

import type { ComponentSchema, PageSchema } from '../types/index.js'
import { generateComponentId } from './idGenerator.js'

/**
 * 深拷贝对象
 * 使用 JSON 序列化实现，适用于 Schema 等纯数据结构
 * @param obj - 要拷贝的对象
 * @returns 拷贝后的对象
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 克隆组件 Schema（含新 ID）
 * 递归更新所有组件 ID，确保唯一性
 * @param schema - 组件 Schema
 * @returns 克隆的组件 Schema
 */
export function cloneComponentSchema(schema: ComponentSchema): ComponentSchema {
  const cloned = deepClone(schema)
  cloned.id = generateComponentId()

  // 递归更新子组件 ID
  updateComponentIds(cloned.children)

  return cloned
}

/**
 * 递归更新组件 ID
 * @param components - 组件列表
 */
function updateComponentIds(components: ComponentSchema[]): void {
  if (!components?.length) return

  for (const comp of components) {
    comp.id = generateComponentId()
    if (comp.children?.length) {
      updateComponentIds(comp.children)
    }
  }
}

/**
 * 克隆页面 Schema
 * @param schema - 页面 Schema
 * @returns 克隆的页面 Schema
 */
export function clonePageSchema(schema: PageSchema): PageSchema {
  const cloned = deepClone(schema)

  // 递归更新所有组件 ID
  if (cloned.components?.length) {
    updateComponentIds(cloned.components)
  }

  return cloned
}
