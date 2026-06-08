/**
 * Schema 辅助工具
 * 类型从 @ea-low-code/shared 统一导出，消除前端重复定义
 * 本文件保留前端特有的工具函数（函数执行、变量解析、别名工具等）
 */

// ==================== 从 shared 重新导出类型 ====================
export type {
  ComponentSchema,
  PageSchema,
  StorePageSchema,
  EventConfig,
  ActionConfig,
  ParamItem,
  ValidationResult,
  VariableBinding,
  VariableItem,
  VariableType,
  SlotProps,
  RemoteConfig,
  FunctionExecutionContext,
} from '@ea-low-code/shared'

// ==================== 从 shared 重新导出工具函数 ====================
export {
  SCHEMA_VERSION,
  LEGACY_SCHEMA_VERSION,
  generateComponentId,
  generateUniqueId,
  generateVariableId,
  findComponentById,
  findParentComponent,
  traverseComponents,
  flattenComponents,
  getComponentTreeDepth,
  findComponentPath,
  findComponentByAlias,
  cloneComponentSchema,
  clonePageSchema,
  deepClone,
  migrateToV2,
  migratePageSchemaV1ToV2,
  migrateStoreSchemaToV2,
  migrateComponentV1ToV2,
  isV1Schema,
  isV2Schema,
  validateV2Migration,
} from '@ea-low-code/shared'

// 本地使用
import type {
  ComponentSchema,
  PageSchema,
  ValidationResult,
  VariableBinding,
  FunctionExecutionContext,
} from '@ea-low-code/shared'
import { SCHEMA_VERSION, generateComponentId } from '@ea-low-code/shared'

// ==================== 前端特有工具函数 ====================

/**
 * 创建新的组件 Schema
 * @param type - 组件类型
 * @param defaultProps - 默认属性
 * @returns 组件 Schema
 */
export function createComponentSchema(
  type: string,
  defaultProps: Record<string, unknown> = {}
): ComponentSchema {
  return {
    id: generateComponentId(),
    type,
    props: { ...defaultProps },
    style: {},
    events: [],
    children: [],
    slots: {},
  }
}

/**
 * 验证 Schema 有效性
 * @param schema - Schema 对象
 * @returns 验证结果
 */
export function validateSchema(schema: unknown): ValidationResult {
  const errors: string[] = []

  if (!schema) {
    errors.push('Schema 不能为空')
    return { valid: false, errors }
  }

  const schemaObj = schema as Record<string, unknown>

  if (!schemaObj.version) {
    errors.push('Schema 缺少版本号')
  }

  if (!Array.isArray(schemaObj.components)) {
    errors.push('Schema 组件列表必须是数组')
  }

  if (Array.isArray(schemaObj.components)) {
    const components = schemaObj.components as ComponentSchema[]
    components.forEach((comp, index) => {
      const compErrors = validateComponent(comp, `components[${index}]`)
      errors.push(...compErrors)
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * 验证组件 Schema
 */
function validateComponent(component: ComponentSchema, path: string): string[] {
  const errors: string[] = []

  if (!component.id) {
    errors.push(`${path}: 组件缺少 id`)
  }

  if (!component.type) {
    errors.push(`${path}: 组件缺少 type`)
  }

  if (!component.props || typeof component.props !== 'object') {
    errors.push(`${path}: 组件 props 必须是对象`)
  }

  if (component.children && Array.isArray(component.children)) {
    component.children.forEach((child, index) => {
      const childErrors = validateComponent(child, `${path}.children[${index}]`)
      errors.push(...childErrors)
    })
  }

  return errors
}

/**
 * 生成默认页面 Schema
 * @returns 默认页面 Schema
 */
export function createDefaultPageSchema(): PageSchema {
  return {
    version: SCHEMA_VERSION,
    components: [],
    layout: {
      type: 'absolute',
      config: {},
    },
    meta: {
      title: '未命名页面',
      description: '',
      viewport: {},
    },
  }
}

/**
 * 导出 Schema 为 JSON 字符串
 */
export function exportSchemaToJson(schema: unknown): string {
  return JSON.stringify(schema, null, 2)
}

/**
 * 从 JSON 字符串导入 Schema
 */
export function importSchemaFromJson(json: string): unknown | null {
  try {
    return JSON.parse(json)
  } catch (error) {
    console.error('Schema JSON 解析失败:', error)
    return null
  }
}

/**
 * 执行函数代码字符串
 * @param code - 函数代码字符串
 * @param context - 执行上下文
 * @returns 函数执行结果
 */
export function executeFunctionCode(
  code: string,
  context: FunctionExecutionContext = {}
): Promise<any> | null {
  if (!code || typeof code !== 'string') {
    return null
  }

  try {
    const wrappedCode = `
      return (async function() {
        try {
          ${code}
        } catch (error) {
          console.error('函数执行错误:', error);
          throw error;
        }
      })();
    `

    const fn = new Function('$component', '$vars', '$alias', '$utils', wrappedCode) as any

    const result = fn(
      context.$component || {},
      context.$vars || {},
      context.$alias || {},
      context.$utils || {}
    )

    return result instanceof Promise ? result : Promise.resolve(result)
  } catch (error) {
    console.error('执行函数代码失败:', error)
    if (window.$message) {
      window.$message.error('函数执行失败: ' + (error as Error).message)
    }
    return null
  }
}

/**
 * 同步执行函数代码字符串
 */
export function executeFunctionCodeSync(code: string, context: FunctionExecutionContext = {}): any {
  if (!code || typeof code !== 'string') {
    return null
  }

  try {
    const wrappedCode = `
      ${code}
    `

    const fn = new Function('$component', '$vars', '$alias', '$utils', wrappedCode) as any

    return fn(
      context.$component || {},
      context.$vars || {},
      context.$alias || {},
      context.$utils || {}
    )
  } catch (error) {
    console.error('同步执行函数代码失败:', error)
    return null
  }
}

/**
 * 解析值（处理变量绑定）
 */
export function resolveValue(
  value: unknown,
  getVariableValue?: (name: string) => unknown,
  getVariableType?: (name: string) => string | undefined,
  context?: FunctionExecutionContext,
  defaultValue: unknown = ''
): unknown {
  if (value && typeof value === 'object' && (value as VariableBinding).type === 'variable') {
    const varName = (value as VariableBinding).value
    const varValue = getVariableValue?.(varName)
    const varType = getVariableType?.(varName)

    if (varValue === undefined) {
      return defaultValue
    }

    if (varType === 'function' && typeof varValue === 'string') {
      return executeFunctionCodeSync(varValue, context)
    }

    return varValue
  }
  return value
}

/**
 * 解析组件ID（支持 alias: 前缀）
 */
export function resolveComponentId(
  componentIdOrAlias: string | null | undefined,
  getComponentIdByAlias?: (alias: string) => string | null
): string | null {
  if (!componentIdOrAlias) return null

  if (componentIdOrAlias.startsWith('alias:')) {
    const alias = componentIdOrAlias.slice(6)
    return getComponentIdByAlias?.(alias) || null
  }

  return componentIdOrAlias
}

/**
 * 检查是否为别名格式
 */
export function isAliasFormat(value: unknown): boolean {
  return typeof value === 'string' && value.startsWith('alias:')
}

/**
 * 从 alias:xxx 格式中提取别名
 */
export function extractAlias(value: string): string | null {
  if (!isAliasFormat(value)) return null
  return value.slice(6)
}
