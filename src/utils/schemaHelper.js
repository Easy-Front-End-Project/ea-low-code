/**
 * 生成唯一 ID
 * 使用当前时间戳 + 随机数，确保唯一性
 * @param {string} prefix - ID 前缀，默认为 'id'
 * @returns {string} 唯一 ID，格式：{prefix}_{timestamp}_{random}
 */
export function generateUniqueId(prefix = 'id') {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 10)
  return `${prefix}_${timestamp}_${random}`
}

/**
 * 生成唯一组件 ID
 * 使用当前时间戳 + 随机数，确保唯一性
 * @returns {string} 组件 ID，格式：comp_{timestamp}_{random}
 */
export function generateComponentId() {
  return generateUniqueId('comp')
}

/**
 * 创建新的组件 Schema
 * @param {string} type - 组件类型
 * @param {Object} defaultProps - 默认属性
 * @returns {Object} 组件 Schema
 */
export function createComponentSchema(type, defaultProps = {}) {
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
 * 克隆组件 Schema
 * @param {Object} schema - 组件 Schema
 * @returns {Object} 克隆的 Schema
 */
export function cloneComponentSchema(schema) {
  const cloned = JSON.parse(JSON.stringify(schema))
  cloned.id = generateComponentId()

  // 递归更新子组件ID
  function updateIds(components) {
    for (const comp of components) {
      comp.id = generateComponentId()
      if (comp.children && comp.children.length > 0) {
        updateIds(comp.children)
      }
    }
  }

  if (cloned.children && cloned.children.length > 0) {
    updateIds(cloned.children)
  }

  return cloned
}

/**
 * 验证 Schema 有效性
 * @param {Object} schema - Schema 对象
 * @returns {Object} 验证结果
 */
export function validateSchema(schema) {
  const errors = []

  if (!schema) {
    errors.push('Schema 不能为空')
    return { valid: false, errors }
  }

  if (!schema.version) {
    errors.push('Schema 缺少版本号')
  }

  if (!Array.isArray(schema.components)) {
    errors.push('Schema 组件列表必须是数组')
  }

  // 验证组件
  if (Array.isArray(schema.components)) {
    schema.components.forEach((comp, index) => {
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
 * @param {Object} component - 组件 Schema
 * @param {string} path - 路径
 * @returns {Array} 错误列表
 */
function validateComponent(component, path) {
  const errors = []

  if (!component.id) {
    errors.push(`${path}: 组件缺少 id`)
  }

  if (!component.type) {
    errors.push(`${path}: 组件缺少 type`)
  }

  if (!component.props || typeof component.props !== 'object') {
    errors.push(`${path}: 组件 props 必须是对象`)
  }

  // 验证子组件
  if (component.children && Array.isArray(component.children)) {
    component.children.forEach((child, index) => {
      const childErrors = validateComponent(child, `${path}.children[${index}]`)
      errors.push(...childErrors)
    })
  }

  return errors
}

/**
 * 扁平化组件树
 * @param {Array} components - 组件列表
 * @returns {Array} 扁平化的组件列表
 */
export function flattenComponents(components) {
  const result = []

  function flatten(list) {
    for (const comp of list) {
      result.push(comp)
      if (comp.children && comp.children.length > 0) {
        flatten(comp.children)
      }
    }
  }

  flatten(components)
  return result
}

/**
 * 获取组件树深度
 * @param {Array} components - 组件列表
 * @returns {number} 最大深度
 */
export function getComponentTreeDepth(components) {
  let maxDepth = 0

  function getDepth(list, currentDepth) {
    maxDepth = Math.max(maxDepth, currentDepth)
    for (const comp of list) {
      if (comp.children && comp.children.length > 0) {
        getDepth(comp.children, currentDepth + 1)
      }
    }
  }

  getDepth(components, 1)
  return maxDepth
}

/**
 * 查找组件路径
 * @param {Array} components - 组件列表
 * @param {string} targetId - 目标组件ID
 * @returns {Array|null} 组件路径
 */
export function findComponentPath(components, targetId) {
  function findPath(list, path) {
    for (const comp of list) {
      const currentPath = [...path, comp.id]
      if (comp.id === targetId) {
        return currentPath
      }
      if (comp.children && comp.children.length > 0) {
        const result = findPath(comp.children, currentPath)
        if (result) return result
      }
    }
    return null
  }

  return findPath(components, [])
}

/**
 * 生成默认页面 Schema
 * @returns {Object} 默认页面 Schema
 */
export function createDefaultPageSchema() {
  return {
    version: '1.0',
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
 * @param {Object} schema - Schema 对象
 * @returns {string} JSON 字符串
 */
export function exportSchemaToJson(schema) {
  return JSON.stringify(schema, null, 2)
}

/**
 * 从 JSON 字符串导入 Schema
 * @param {string} json - JSON 字符串
 * @returns {Object|null} Schema 对象
 */
export function importSchemaFromJson(json) {
  try {
    return JSON.parse(json)
  } catch (error) {
    console.error('Schema JSON 解析失败:', error)
    return null
  }
}

/**
 * 执行函数代码字符串
 * @param {string} code - 函数代码字符串
 * @param {Object} context - 执行上下文
 * @returns {*} 函数执行结果
 */
export function executeFunctionCode(code, context = {}) {
  if (!code || typeof code !== 'string') {
    return null
  }

  try {
    // 构建完整的函数执行器
    // 使用 IIFE (Immediately Invoked Function Expression) 模式执行代码
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

    // 创建函数，注入上下文变量
    const fn = new Function('$component', '$vars', '$alias', '$utils', wrappedCode)

    // 执行函数并返回结果
    const result = fn(
      context.$component || {},
      context.$vars || {},
      context.$alias || {},
      context.$utils || {}
    )

    // 处理异步结果
    return result instanceof Promise ? result : Promise.resolve(result)
  } catch (error) {
    console.error('执行函数代码失败:', error)
    if (window.$message) {
      window.$message.error('函数执行失败: ' + error.message)
    }
    return null
  }
}

/**
 * 同步执行函数代码字符串（用于需要立即返回值的场景）
 * @param {string} code - 函数代码字符串
 * @param {Object} context - 执行上下文
 * @returns {*} 函数执行结果
 */
export function executeFunctionCodeSync(code, context = {}) {
  if (!code || typeof code !== 'string') {
    return null
  }

  try {
    // 构建同步执行的函数
    const wrappedCode = `
      ${code}
    `

    // 创建函数并执行
    const fn = new Function('$component', '$vars', '$alias', '$utils', wrappedCode)

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
 * @param {*} value - 原始值，可能是变量绑定对象 { type: 'variable', value: 'varName' }
 * @param {Function} getVariableValue - 获取变量值的函数
 * @param {Function} getVariableType - 获取变量类型的函数
 * @param {Object} context - 执行上下文（用于函数类型变量）
 * @param {*} defaultValue - 默认值，当变量不存在时返回
 * @returns {*} 解析后的值
 */
export function resolveValue(value, getVariableValue, getVariableType, context, defaultValue = '') {
  // 如果是变量绑定对象
  if (value && typeof value === 'object' && value.type === 'variable') {
    const varName = value.value
    const varValue = getVariableValue?.(varName)
    const varType = getVariableType?.(varName)

    // 如果变量不存在，返回默认值
    if (varValue === undefined) {
      return defaultValue
    }

    // 如果是函数类型变量，立即执行并返回结果
    if (varType === 'function' && typeof varValue === 'string') {
      return executeFunctionCodeSync(varValue, context)
    }

    return varValue
  }
  return value
}

/**
 * 解析组件ID（支持 alias: 前缀）
 * @param {string} componentIdOrAlias - 组件ID或别名（如：alias:submitBtn 或 button_123）
 * @param {Function} getComponentIdByAlias - 通过别名获取组件ID的函数
 * @returns {string|null} 解析后的组件ID
 */
export function resolveComponentId(componentIdOrAlias, getComponentIdByAlias) {
  if (!componentIdOrAlias) return null

  // 支持 alias: 前缀格式
  if (componentIdOrAlias.startsWith('alias:')) {
    const alias = componentIdOrAlias.slice(6)
    return getComponentIdByAlias?.(alias) || null
  }

  return componentIdOrAlias
}

/**
 * 检查是否为别名格式
 * @param {string} value - 要检查的字符串
 * @returns {boolean} 是否为别名格式
 */
export function isAliasFormat(value) {
  return typeof value === 'string' && value.startsWith('alias:')
}

/**
 * 从 alias:xxx 格式中提取别名
 * @param {string} value - alias:xxx 格式的字符串
 * @returns {string|null} 提取的别名
 */
export function extractAlias(value) {
  if (!isAliasFormat(value)) return null
  return value.slice(6)
}
