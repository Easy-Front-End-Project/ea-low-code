/**
 * ID 生成器
 * 提供唯一 ID 生成功能
 */

/**
 * 生成唯一 ID
 * 使用当前时间戳 + 随机数，确保唯一性
 * @param prefix - ID 前缀，默认为 'id'
 * @returns 唯一 ID，格式：{prefix}_{timestamp}_{random}
 */
export function generateUniqueId(prefix: string = 'id'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 10)
  return `${prefix}_${timestamp}_${random}`
}

/**
 * 生成唯一组件 ID
 * @returns 组件 ID，格式：comp_{timestamp}_{random}
 */
export function generateComponentId(): string {
  return generateUniqueId('comp')
}

/**
 * 生成唯一变量 ID
 * @returns 变量 ID，格式：var_{timestamp}_{random}
 */
export function generateVariableId(): string {
  return generateUniqueId('var')
}
