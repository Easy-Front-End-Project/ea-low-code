import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * 组件实例类型
 * 可能是 HTMLElement、Vue 组件实例、或 Ref 包装的对象
 */
type ComponentInstance = HTMLElement | Record<string, any>  

/**
 * 组件实例管理器
 * 用于管理画布上所有组件的实例，支持组件间联动
 */
export const useComponentInstanceStore = defineStore('componentInstance', () => {
  // 存储组件实例的 Map：componentId -> instance
  const instanceMap = ref<Map<string, ComponentInstance>>(new Map())

  /**
   * 注册组件实例
   * @param componentId - 组件ID
   * @param instance - 组件实例
   */
  function registerInstance(componentId: string, instance: ComponentInstance): void {
    if (componentId && instance) {
      instanceMap.value.set(componentId, instance)
    }
  }

  /**
   * 注销组件实例
   * @param componentId - 组件ID
   */
  function unregisterInstance(componentId: string): void {
    if (componentId) {
      instanceMap.value.delete(componentId)
    }
  }

  /**
   * 获取组件实例
   * @param componentId - 组件ID
   * @returns 组件实例
   */
  function getInstance(componentId: string): ComponentInstance | null {
    return instanceMap.value.get(componentId) || null
  }

  /**
   * 获取组件 DOM 元素
   * @param componentId - 组件ID
   * @returns 组件 DOM 元素
   */
  function getComponentElement(componentId: string): HTMLElement | null {
    const instance = instanceMap.value.get(componentId)
    if (!instance) return null
    if ((instance as any)._isRef || (instance as any).__v_isRef) {  
      return (instance as any).value  
    }
    return instance as HTMLElement
  }

  /**
   * 调用组件方法
   * @param componentId - 组件ID
   * @param methodName - 方法名
   * @param args - 参数
   * @returns 方法返回值
   */
  function callComponentMethod(componentId: string, methodName: string, ...args: unknown[]): unknown {
    const element = getComponentElement(componentId)
    if (!element) {
      console.warn(`组件 ${componentId} 不存在`)
      return null
    }

    // 直接调用方法
    if (typeof (element as any)[methodName] === 'function') {  
      return (element as any)[methodName](...args)  
    }

    // 尝试调用 setXXX 方法（设置属性）
    if (methodName.startsWith('set')) {
      const propName = methodName.replace('set', '').toLowerCase()
      ;(element as any)[propName] = args[0]  
      return true
    }

    console.warn(`组件 ${componentId} 没有方法 ${methodName}`)
    return null
  }

  /**
   * 设置组件属性
   * @param componentId - 组件ID
   * @param propName - 属性名
   * @param value - 属性值
   * @returns 是否设置成功
   */
  function setComponentProp(componentId: string, propName: string, value: unknown): boolean {
    const element = getComponentElement(componentId)
    if (!element) {
      console.warn(`组件 ${componentId} 不存在`)
      return false
    }

    ;(element as any)[propName] = value  
    return true
  }

  /**
   * 获取组件属性
   * @param componentId - 组件ID
   * @param propName - 属性名
   * @returns 属性值
   */
  function getComponentProp(componentId: string, propName: string): unknown {
    const element = getComponentElement(componentId)
    if (!element) {
      console.warn(`组件 ${componentId} 不存在`)
      return undefined
    }

    return (element as any)[propName]  
  }

  /**
   * 清空所有实例
   */
  function clearAll(): void {
    instanceMap.value.clear()
  }

  /**
   * 获取所有组件ID
   * @returns 组件ID列表
   */
  function getAllComponentIds(): string[] {
    return Array.from(instanceMap.value.keys())
  }

  return {
    instanceMap,
    registerInstance,
    unregisterInstance,
    getInstance,
    getComponentElement,
    callComponentMethod,
    setComponentProp,
    getComponentProp,
    clearAll,
    getAllComponentIds,
  }
})
