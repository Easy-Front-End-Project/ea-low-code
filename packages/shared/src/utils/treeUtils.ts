/**
 * 组件树操作工具
 * 提供查找、遍历、插入、删除、移动等树操作方法
 */

import type { ComponentSchema } from '../types/index.js'

/**
 * 根据 ID 查找组件
 * @param components - 组件列表
 * @param id - 组件 ID
 * @returns 组件对象，未找到返回 null
 */
export function findComponentById(components: ComponentSchema[], id: string | null): ComponentSchema | null {
  if (!Array.isArray(components) || !id) return null

  for (const comp of components) {
    if (comp.id === id) return comp
    if (comp.children?.length) {
      const found = findComponentById(comp.children, id)
      if (found) return found
    }
  }
  return null
}

/**
 * 查找父组件
 * @param components - 组件列表
 * @param targetId - 目标组件 ID
 * @param parent - 当前父组件
 * @returns 父组件对象，未找到返回 null
 */
export function findParentComponent(
  components: ComponentSchema[],
  targetId: string,
  parent: ComponentSchema | null = null
): ComponentSchema | null {
  for (const comp of components) {
    if (comp.id === targetId) return parent
    if (comp.children?.length) {
      const found = findParentComponent(comp.children, targetId, comp)
      if (found !== undefined) return found
    }
  }
  return null
}

/**
 * 遍历组件树
 * @param components - 组件列表
 * @param callback - 回调函数，返回 false 可中断遍历
 */
export function traverseComponents(
  components: ComponentSchema[],
  callback: (component: ComponentSchema, parent: ComponentSchema | null, index: number) => boolean | void
): void {
  function walk(list: ComponentSchema[], parent: ComponentSchema | null): boolean {
    for (let i = 0; i < list.length; i++) {
      const comp = list[i]
      if (callback(comp, parent, i) === false) return false
      if (comp.children?.length) {
        if (!walk(comp.children, comp)) return false
      }
    }
    return true
  }
  walk(components, null)
}

/**
 * 扁平化组件树
 * @param components - 组件列表
 * @returns 扁平化的组件列表
 */
export function flattenComponents(components: ComponentSchema[]): ComponentSchema[] {
  const result: ComponentSchema[] = []

  traverseComponents(components, (comp) => {
    result.push(comp)
  })

  return result
}

/**
 * 获取组件树深度
 * @param components - 组件列表
 * @returns 最大深度
 */
export function getComponentTreeDepth(components: ComponentSchema[]): number {
  let maxDepth = 0

  function getDepth(list: ComponentSchema[], currentDepth: number): void {
    maxDepth = Math.max(maxDepth, currentDepth)
    for (const comp of list) {
      if (comp.children?.length) {
        getDepth(comp.children, currentDepth + 1)
      }
    }
  }

  getDepth(components, 1)
  return maxDepth
}

/**
 * 查找组件路径
 * @param components - 组件列表
 * @param targetId - 目标组件 ID
 * @returns 组件路径（ID 数组），未找到返回 null
 */
export function findComponentPath(components: ComponentSchema[], targetId: string): string[] | null {
  function findPath(list: ComponentSchema[], path: string[]): string[] | null {
    for (const comp of list) {
      const currentPath = [...path, comp.id]
      if (comp.id === targetId) {
        return currentPath
      }
      if (comp.children?.length) {
        const result = findPath(comp.children, currentPath)
        if (result) return result
      }
    }
    return null
  }

  return findPath(components, [])
}

/**
 * 插入组件
 * @param components - 组件列表
 * @param component - 要插入的组件
 * @param parentId - 父组件 ID，为 null 则插入到根级
 * @param index - 插入位置索引
 * @returns 新的组件列表
 */
export function insertComponent(
  components: ComponentSchema[],
  component: ComponentSchema,
  parentId: string | null,
  index?: number
): ComponentSchema[] {
  const newComponents = structuredClone(components)

  if (!parentId) {
    if (index !== undefined && index >= 0) {
      newComponents.splice(index, 0, component)
    } else {
      newComponents.push(component)
    }
    return newComponents
  }

  traverseComponents(newComponents, (comp) => {
    if (comp.id === parentId) {
      comp.children ??= []
      if (index !== undefined && index >= 0) {
        comp.children.splice(index, 0, component)
      } else {
        comp.children.push(component)
      }
      return false
    }
  })

  return newComponents
}

/**
 * 删除组件
 * @param components - 组件列表
 * @param targetId - 目标组件 ID
 * @returns 新的组件列表
 */
export function removeComponent(components: ComponentSchema[], targetId: string): ComponentSchema[] {
  const newComponents = structuredClone(components)

  function removeFromList(list: ComponentSchema[]): boolean {
    const index = list.findIndex((comp) => comp.id === targetId)
    if (index > -1) {
      list.splice(index, 1)
      return true
    }
    for (const comp of list) {
      if (comp.children?.length) {
        if (removeFromList(comp.children)) return true
      }
    }
    return false
  }

  removeFromList(newComponents)
  return newComponents
}

/**
 * 移动组件
 * @param components - 组件列表
 * @param sourceId - 源组件 ID
 * @param targetParentId - 目标父组件 ID，为 null 则移动到根级
 * @param targetIndex - 目标位置索引
 * @returns 新的组件列表
 */
export function moveComponent(
  components: ComponentSchema[],
  sourceId: string,
  targetParentId: string | null,
  targetIndex?: number
): ComponentSchema[] {
  // 先找到源组件
  const source = findComponentById(components, sourceId)
  if (!source) return components

  // 检查不能将父组件移动到自己的子组件中
  if (targetParentId) {
    const sourcePath = findComponentPath(components, sourceId)
    const targetPath = findComponentPath(components, targetParentId)
    if (sourcePath && targetPath && targetPath.join(',').startsWith(sourcePath.join(','))) {
      return components
    }
  }

  // 先删除再插入
  const afterRemove = removeComponent(components, sourceId)
  return insertComponent(afterRemove, source, targetParentId, targetIndex)
}

/**
 * 根据 alias 查找组件
 * @param components - 组件列表
 * @param alias - 组件别名
 * @returns 组件对象，未找到返回 null
 */
export function findComponentByAlias(components: ComponentSchema[], alias: string): ComponentSchema | null {
  let result: ComponentSchema | null = null

  traverseComponents(components, (comp) => {
    if (comp.alias === alias) {
      result = comp
      return false
    }
  })

  return result
}
