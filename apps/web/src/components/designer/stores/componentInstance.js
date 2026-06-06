import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * 组件实例管理器
 * 用于管理画布上所有组件的实例，支持组件间联动
 */
export const useComponentInstanceStore = defineStore('componentInstance', () => {
  // 存储组件实例的 Map：componentId -> instance
  const instanceMap = ref(new Map())

  /**
   * 注册组件实例
   * @param {string} componentId - 组件ID
   * @param {Object} instance - 组件实例
   */
  function registerInstance(componentId, instance) {
    if (componentId && instance) {
      instanceMap.value.set(componentId, instance)
    }
  }

  /**
   * 注销组件实例
   * @param {string} componentId - 组件ID
   */
  function unregisterInstance(componentId) {
    if (componentId) {
      instanceMap.value.delete(componentId)
    }
  }

  /**
   * 获取组件实例
   * @param {string} componentId - 组件ID
   * @returns {Object|null} 组件实例
   */
  function getInstance(componentId) {
    return instanceMap.value.get(componentId) || null
  }

  /**
   * 获取组件 DOM 元素
   * @param {string} componentId - 组件ID
   * @returns {HTMLElement|null} 组件 DOM 元素
   */
  function getComponentElement(componentId) {
    const instance = instanceMap.value.get(componentId)
    if (!instance) return null
    if (instance._isRef || instance.__v_isRef) {
      return instance.value
    }
    return instance
  }

  /**
   * 调用组件方法
   * @param {string} componentId - 组件ID
   * @param {string} methodName - 方法名
   * @param {...any} args - 参数
   * @returns {any} 方法返回值
   */
  function callComponentMethod(componentId, methodName, ...args) {
    const element = getComponentElement(componentId)
    if (!element) {
      console.warn(`组件 ${componentId} 不存在`)
      return null
    }

    // 直接调用方法
    if (typeof element[methodName] === 'function') {
      return element[methodName](...args)
    }

    // 尝试调用 setXXX 方法（设置属性）
    if (methodName.startsWith('set')) {
      const propName = methodName.replace('set', '').toLowerCase()
      element[propName] = args[0]
      return true
    }

    console.warn(`组件 ${componentId} 没有方法 ${methodName}`)
    return null
  }

  /**
   * 设置组件属性
   * @param {string} componentId - 组件ID
   * @param {string} propName - 属性名
   * @param {any} value - 属性值
   * @returns {boolean} 是否设置成功
   */
  function setComponentProp(componentId, propName, value) {
    const element = getComponentElement(componentId)
    if (!element) {
      console.warn(`组件 ${componentId} 不存在`)
      return false
    }

    element[propName] = value
    return true
  }

  /**
   * 获取组件属性
   * @param {string} componentId - 组件ID
   * @param {string} propName - 属性名
   * @returns {any} 属性值
   */
  function getComponentProp(componentId, propName) {
    const element = getComponentElement(componentId)
    if (!element) {
      console.warn(`组件 ${componentId} 不存在`)
      return undefined
    }

    return element[propName]
  }

  /**
   * 清空所有实例
   */
  function clearAll() {
    instanceMap.value.clear()
  }

  /**
   * 获取所有组件ID
   * @returns {Array<string>} 组件ID列表
   */
  function getAllComponentIds() {
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
