/**
 * 事件执行器 - 统一处理组件事件执行逻辑
 * 用于 CanvasComponent 和 PreviewComponent 中的事件执行
 */

import { useComponentInstanceStore } from '@/components/designer/stores/componentInstance'
import { useVariableStore } from '@/components/designer/stores/variable'
import { useSchemaStore } from '@/components/designer/stores/schema'
import {
  resolveValue as resolveValueUtil,
  resolveComponentId as resolveComponentIdUtil,
} from '@/utils/schemaHelper'
import type { ActionConfig, EventConfig } from '@/utils/schemaHelper'

/**
 * 组件操作上下文
 */
interface ComponentContext {
  get: (id: string) => HTMLElement | null
  setProp: (id: string, prop: string, value: unknown) => boolean
  getProp: (id: string, prop: string) => unknown
  call: (id: string, method: string, ...args: unknown[]) => unknown
}

/**
 * 变量操作上下文
 */
interface VarsContext {
  get: (name: string) => unknown
  set: (name: string, value: unknown) => void
  call: (name: string, ...args: unknown[]) => unknown
}

/**
 * 别名操作上下文
 */
interface AliasContext {
  get: (alias: string) => string | null
  find: (alias: string) => unknown
  getElement: (alias: string) => HTMLElement | null
  setProp: (alias: string, prop: string, value: unknown) => void
  getProp: (alias: string, prop: string) => unknown
  call: (alias: string, method: string, ...args: unknown[]) => void
}

/**
 * 执行上下文
 */
interface ExecutionContext {
  $component: ComponentContext
  $vars: VarsContext
  $alias: AliasContext
}

/**
 * 创建事件执行上下文
 * 提供 $component、$vars、$event、$alias 等辅助对象
 * @returns 执行上下文对象
 */
export function createExecutionContext(): ExecutionContext {
  const instanceStore = useComponentInstanceStore()
  const variableStore = useVariableStore()
  const schemaStore = useSchemaStore()

  return {
    // 组件操作
    $component: {
      get: (id: string) => instanceStore.getComponentElement(id),
      setProp: (id: string, prop: string, value: unknown) => instanceStore.setComponentProp(id, prop, value),
      getProp: (id: string, prop: string) => instanceStore.getComponentProp(id, prop),
      call: (id: string, method: string, ...args: unknown[]) => instanceStore.callComponentMethod(id, method, ...args),
    },
    // 变量操作
    $vars: {
      get: (name: string) => variableStore.getVariableDefaultValue(name),
      set: (name: string, value: unknown) => variableStore.updateVariableByName(name, { defaultValue: value }),
      call: (name: string, ...args: unknown[]) => {
        const funcCode = variableStore.getVariableDefaultValue(name)
        if (typeof funcCode !== 'string') {
          console.warn(`变量 ${name} 不是函数类型或没有定义`)
          return null
        }
        try {
          // 创建函数执行上下文
          // eslint-disable-next-line no-new-func
          const fn = new Function(
            '$component',
            '$vars',
            '$alias',
            ...args.map((_, i) => `arg${i}`),
            funcCode
          ) as any

          return fn(
            {
              get: (id: string) => instanceStore.getComponentElement(id),
              setProp: (id: string, prop: string, value: unknown) => instanceStore.setComponentProp(id, prop, value),
              getProp: (id: string, prop: string) => instanceStore.getComponentProp(id, prop),
              call: (id: string, method: string, ...args: unknown[]) => instanceStore.callComponentMethod(id, method, ...args),
            },
            {
              get: (n: string) => variableStore.getVariableDefaultValue(n),
              set: (n: string, v: unknown) => variableStore.updateVariableByName(n, { defaultValue: v }),
            },
            {
              get: (alias: string) => schemaStore.getComponentIdByAlias(alias),
              find: (alias: string) => schemaStore.findComponentByAlias(alias),
              getElement: (alias: string) => {
                const id = schemaStore.getComponentIdByAlias(alias)
                return id ? instanceStore.getComponentElement(id) : null
              },
              setProp: (alias: string, prop: string, value: unknown) => {
                const id = schemaStore.getComponentIdByAlias(alias)
                if (id) {
                  instanceStore.setComponentProp(id, prop, value)
                }
              },
              getProp: (alias: string, prop: string) => {
                const id = schemaStore.getComponentIdByAlias(alias)
                return id ? instanceStore.getComponentProp(id, prop) : null
              },
              call: (alias: string, method: string, ...args: unknown[]) => {
                const id = schemaStore.getComponentIdByAlias(alias)
                if (id) {
                  instanceStore.callComponentMethod(id, method, ...args)
                }
              },
            },
            ...args
          )
        } catch (error) {
          console.error(`执行函数变量 ${name} 失败:`, error)
          if (window.$message) {
            window.$message.error(`函数执行失败: ${(error as Error).message}`)
          }
          return null
        }
      },
    },
    // 别名操作
    $alias: {
      get: (alias: string) => schemaStore.getComponentIdByAlias(alias),
      find: (alias: string) => schemaStore.findComponentByAlias(alias),
      getElement: (alias: string) => {
        const id = schemaStore.getComponentIdByAlias(alias)
        return id ? instanceStore.getComponentElement(id) : null
      },
      setProp: (alias: string, prop: string, value: unknown) => {
        const id = schemaStore.getComponentIdByAlias(alias)
        if (id) {
          instanceStore.setComponentProp(id, prop, value)
        }
      },
      getProp: (alias: string, prop: string) => {
        const id = schemaStore.getComponentIdByAlias(alias)
        return id ? instanceStore.getComponentProp(id, prop) : null
      },
      call: (alias: string, method: string, ...args: unknown[]) => {
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
 * @param value - 原始值
 * @returns 解析后的值
 */
export function resolveValue(value: unknown): unknown {
  const variableStore = useVariableStore()
  const context = createExecutionContext()

  return resolveValueUtil(
    value,
    variableStore.getVariableDefaultValue.bind(variableStore),
    (name: string) => variableStore.getVariableByName(name)?.type,
    context
  )
}

/**
 * 执行自定义代码
 * @param code - 用户编写的代码
 * @param context - 执行上下文
 * @param originalEvent - 原始事件对象
 */
export function executeCustomCode(code: string, context: ExecutionContext, originalEvent: Event | null): void {
  if (!code) return

  try {
    const { $component, $vars, $alias } = context

    // 构建代码包装器
    const wrappedCode = `
      const $event = event;
      ${code}
    `

    // eslint-disable-next-line no-new-func
    const fn = new Function('event', '$component', '$vars', '$alias', wrappedCode) as any
    fn(originalEvent, $component, $vars, $alias)
  } catch (error) {
    console.error('执行自定义代码失败:', error)
    if (window.$message) {
      window.$message.error('代码执行失败: ' + (error as Error).message)
    }
  }
}

/**
 * 执行 API 请求
 * @param actionConfig - 请求配置
 * @param context - 执行上下文
 */
export async function executeApiRequest(actionConfig: ActionConfig, context: ExecutionContext): Promise<any> {
  const {
    url,
    method = 'GET',
    params = [],
    body = [],
    enableDataBinding,
    targetVariable,
  } = actionConfig

  if (!url) {
    console.warn('API 请求 URL 不能为空')
    return
  }

  try {
    // 构建查询参数
    const queryParams = new URLSearchParams()
    params.forEach((param: { key: string; value: string }) => {
      if (param.key) {
        // 解析值（支持变量绑定）
        const resolvedValue = resolveTemplateString(param.value, context)
        queryParams.append(param.key, String(resolvedValue))
      }
    })

    // 构建完整 URL
    let fullUrl = url
    const queryString = queryParams.toString()
    if (queryString) {
      fullUrl += (url.includes('?') ? '&' : '?') + queryString
    }

    // 构建请求选项
    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
      },
    }

    // 添加 body（非 GET 请求）
    if (method.toUpperCase() !== 'GET' && body.length > 0) {
      const bodyObj: Record<string, unknown> = {}
      body.forEach((item: { key: string; value: string }) => {
        if (item.key) {
          const resolvedValue = resolveTemplateString(item.value, context)
          bodyObj[item.key] = resolvedValue
        }
      })
      fetchOptions.body = JSON.stringify(bodyObj)
    }

    // 发送请求
    const response = await fetch(fullUrl, fetchOptions)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // 数据绑定：将响应数据赋值给变量
    if (enableDataBinding && targetVariable) {
      const { $vars } = context
      if ($vars && $vars.set) {
        $vars.set(targetVariable, data)
        console.log(`API 响应数据已绑定到变量: ${targetVariable}`, data)
      }
    }

    return data
  } catch (error) {
    console.error('API 请求失败:', error)
    if (window.$message) {
      window.$message.error('请求失败: ' + (error as Error).message)
    }
    throw error
  }
}

/**
 * 解析模板字符串（支持 {{variable}} 语法）
 * @param template - 模板字符串
 * @param context - 执行上下文
 * @returns 解析后的字符串
 */
function resolveTemplateString(template: string, context: ExecutionContext): string {
  if (!template || typeof template !== 'string') {
    return template
  }

  // 支持 {{variable}} 语法
  return template.replace(/\{\{([^}]+)\}\}/g, (match: string, varName: string) => {
    const trimmedName = varName.trim()
    const value = context.$vars?.get(trimmedName)
    return value !== undefined ? String(value) : match
  })
}

/**
 * 显示消息
 * @param actionConfig - 消息配置
 */
export function showMessage(actionConfig: ActionConfig): void {
  if (window.$message && actionConfig.message) {
    window.$message(actionConfig as any)
  } else if (actionConfig.message) {
    alert(actionConfig.message)
  }
}

/**
 * 显示通知
 * @param actionConfig - 通知配置
 */
export function showNotification(actionConfig: ActionConfig): void {
  if (window.$notify && actionConfig.message) {
    window.$notify(actionConfig as any)
  } else if (actionConfig.message) {
    alert(
      actionConfig.title ? `${actionConfig.title}: ${actionConfig.message}` : actionConfig.message
    )
  }
}

/**
 * 调用组件方法
 * @param componentId - 组件ID
 * @param methodName - 方法名
 * @param methodArgs - 方法参数
 */
export function callComponentMethod(componentId: string, methodName: string, methodArgs: unknown[] = []): void {
  const instanceStore = useComponentInstanceStore()
  const resolvedId = resolveComponentId(componentId)
  if (resolvedId && methodName) {
    instanceStore.callComponentMethod(resolvedId, methodName, ...methodArgs)
  }
}

/**
 * 解析组件ID（支持 alias: 前缀）
 * @param componentIdOrAlias - 组件ID或别名（如：alias:submitBtn 或 button_123）
 * @returns 解析后的组件ID
 */
function resolveComponentId(componentIdOrAlias: string | null | undefined): string | null {
  const schemaStore = useSchemaStore()
  return resolveComponentIdUtil(
    componentIdOrAlias,
    schemaStore.getComponentIdByAlias.bind(schemaStore)
  )
}

/**
 * 设置组件属性
 * @param componentId - 组件ID（支持 alias: 前缀）
 * @param propName - 属性名
 * @param propValue - 属性值
 */
export function setComponentProp(componentId: string, propName: string, propValue: unknown): void {
  const instanceStore = useComponentInstanceStore()
  const resolvedId = resolveComponentId(componentId)

  if (resolvedId && propName !== undefined) {
    const resolvedValue = resolveValue(propValue)
    instanceStore.setComponentProp(resolvedId, propName, resolvedValue)
  }
}

/**
 * 执行事件配置
 * 统一的事件执行入口
 * @param eventConfig - 事件配置
 * @param originalEvent - 原始事件对象
 */
export async function executeEvent(eventConfig: EventConfig | null | undefined, originalEvent: Event | null): Promise<void> {
  if (!eventConfig) return

  const context = createExecutionContext()

  const actionConfig = eventConfig.actionConfig || {}

  switch (eventConfig.action) {
    case 'message':
      showMessage(actionConfig)
      break

    case 'notification':
      showNotification(actionConfig)
      break

    case 'custom':
      executeCustomCode(actionConfig.code || '', context, originalEvent)
      break

    case 'callMethod':
      callComponentMethod(
        actionConfig.targetComponentId || '',
        actionConfig.methodName || '',
        actionConfig.methodArgs || []
      )
      break

    case 'setProp':
      setComponentProp(
        actionConfig.targetComponentId || '',
        actionConfig.propName || '',
        actionConfig.propValue
      )
      break

    case 'apiRequest':
      await executeApiRequest(actionConfig, context)
      break

    default:
      console.warn('未知的事件动作类型:', eventConfig.action)
  }
}

/**
 * 通过别名执行事件
 * 支持使用别名而不是ID来操作组件
 * @param eventConfig - 事件配置
 * @param originalEvent - 原始事件对象
 */
export async function executeEventWithAlias(eventConfig: EventConfig | null | undefined, originalEvent: Event | null): Promise<void> {
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
