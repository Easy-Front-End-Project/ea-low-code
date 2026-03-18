/**
 * 事件执行器 - 统一处理组件事件执行逻辑
 * 用于 CanvasComponent 和 PreviewComponent 中的事件执行
 */

import { useComponentInstanceStore } from '@/stores/designer/componentInstance'
import { useVariableStore } from '@/stores/designer/variable'
import { useSchemaStore } from '@/stores/designer/schema'

/**
 * 创建事件执行上下文
 * 提供 $component、$vars、$event、$alias 等辅助对象
 * @returns {Object} 执行上下文对象
 */
export function createExecutionContext() {
  const instanceStore = useComponentInstanceStore()
  const variableStore = useVariableStore()
  const schemaStore = useSchemaStore()

  return {
    // 组件操作
    $component: {
      get: id => instanceStore.getComponentElement(id),
      setProp: (id, prop, value) => instanceStore.setComponentProp(id, prop, value),
      getProp: (id, prop) => instanceStore.getComponentProp(id, prop),
      call: (id, method, ...args) => instanceStore.callComponentMethod(id, method, ...args),
    },
    // 变量操作
    $vars: {
      get: name => variableStore.getVariableDefaultValue(name),
      set: (name, value) => variableStore.updateVariableByName(name, { defaultValue: value }),
    },
    // 别名操作
    $alias: {
      get: alias => schemaStore.getComponentIdByAlias(alias),
      find: alias => schemaStore.findComponentByAlias(alias),
      getElement: alias => {
        const id = schemaStore.getComponentIdByAlias(alias)
        return id ? instanceStore.getComponentElement(id) : null
      },
      setProp: (alias, prop, value) => {
        const id = schemaStore.getComponentIdByAlias(alias)
        if (id) {
          instanceStore.setComponentProp(id, prop, value)
        }
      },
      getProp: (alias, prop) => {
        const id = schemaStore.getComponentIdByAlias(alias)
        return id ? instanceStore.getComponentProp(id, prop) : null
      },
      call: (alias, method, ...args) => {
        const id = schemaStore.getComponentIdByAlias(alias)
        if (id) {
          instanceStore.callComponentMethod(id, method, ...args)
        }
      },
    },
  }
}

/**
 * 解析值（处理变量绑定）
 * @param {*} value - 原始值
 * @returns {*} 解析后的值
 */
export function resolveValue(value) {
  // 如果是变量绑定对象
  if (value && typeof value === 'object' && value.type === 'variable') {
    const variableStore = useVariableStore()
    return variableStore.getVariableDefaultValue(value.value)
  }
  return value
}

/**
 * 执行自定义代码
 * @param {string} code - 用户编写的代码
 * @param {Object} context - 执行上下文
 * @param {Event} originalEvent - 原始事件对象
 */
export function executeCustomCode(code, context, originalEvent) {
  if (!code) return

  try {
    const { $component, $vars, $alias } = context

    // 构建代码包装器
    const wrappedCode = `
      const $event = event;
      ${code}
    `

    const fn = new Function('event', '$component', '$vars', '$alias', wrappedCode)
    fn(originalEvent, $component, $vars, $alias)
  } catch (error) {
    console.error('执行自定义代码失败:', error)
    if (window.$message) {
      window.$message.error('代码执行失败: ' + error.message)
    }
  }
}

/**
 * 显示消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型: 'success' | 'error' | 'warning' | 'info'
 */
export function showMessage(actionConfig) {
  if (window.$message && actionConfig.message) {
    window.$message(actionConfig)
  } else if (actionConfig.message) {
    alert(actionConfig.message)
  }
}

/**
 * 调用组件方法
 * @param {string} componentId - 组件ID
 * @param {string} methodName - 方法名
 * @param {Array} methodArgs - 方法参数
 */
export function callComponentMethod(componentId, methodName, methodArgs = []) {
  const instanceStore = useComponentInstanceStore()
  if (componentId && methodName) {
    instanceStore.callComponentMethod(componentId, methodName, ...methodArgs)
  }
}

/**
 * 设置组件属性
 * @param {string} componentId - 组件ID
 * @param {string} propName - 属性名
 * @param {*} propValue - 属性值
 */
export function setComponentProp(componentId, propName, propValue) {
  const instanceStore = useComponentInstanceStore()
  if (componentId && propName !== undefined) {
    const resolvedValue = resolveValue(propValue)
    instanceStore.setComponentProp(componentId, propName, resolvedValue)
  }
}

/**
 * 执行事件配置
 * 统一的事件执行入口
 * @param {Object} eventConfig - 事件配置
 * @param {Event} originalEvent - 原始事件对象
 */
export function executeEvent(eventConfig, originalEvent) {
  if (!eventConfig) return

  const context = createExecutionContext()

  const actionConfig = eventConfig.actionConfig || {}

  switch (eventConfig.action) {
    case 'message':
      showMessage(actionConfig)
      break

    case 'custom':
      executeCustomCode(actionConfig.code, context, originalEvent)
      break

    case 'callMethod':
      callComponentMethod(
        actionConfig.targetComponentId,
        actionConfig.methodName,
        actionConfig.methodArgs || []
      )
      break

    case 'setProp':
      setComponentProp(
        actionConfig.targetComponentId,
        actionConfig.propName,
        actionConfig.propValue
      )
      break

    default:
      console.warn('未知的事件动作类型:', eventConfig.action)
  }
}

/**
 * 通过别名执行事件
 * 支持使用别名而不是ID来操作组件
 * @param {Object} eventConfig - 事件配置
 * @param {Event} originalEvent - 原始事件对象
 */
export function executeEventWithAlias(eventConfig, originalEvent) {
  if (!eventConfig) return

  const schemaStore = useSchemaStore()

  // 如果配置中有 targetComponentAlias，转换为 ID
  if (eventConfig.targetComponentAlias) {
    const componentId = schemaStore.getComponentIdByAlias(eventConfig.targetComponentAlias)
    if (componentId) {
      eventConfig = {
        ...eventConfig,
        targetComponentId: componentId,
      }
    }
  }

  executeEvent(eventConfig, originalEvent)
}
