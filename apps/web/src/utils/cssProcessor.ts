/**
 * 处理自定义 CSS，将 & 和 :host 替换为组件唯一类名
 * @param css - 用户输入的 CSS
 * @param className - 组件唯一类名
 * @returns 处理后的 CSS
 */
export function processCustomCSS(css: string, className: string): string {
  if (!css || !css.trim()) return ''

  let processed = css.trim()

  // 处理 :host 选择器（Web Components 习惯）
  processed = processed.replace(/:host/g, `&.custom-${className}`)

  // 处理 & 选择器
  processed = processed.replace(/&/g, `.custom-${className}`)

  // 如果没有选择器开头（即纯属性），添加类名包裹
  if (!processed.startsWith('.') && !processed.startsWith('@')) {
    processed = `.custom-${className} { ${processed} }`
  }

  return processed
}

/**
 * 生成组件唯一类名
 * @param componentId - 组件 ID
 * @returns 唯一类名
 */
export function generateCustomClassName(componentId: string): string {
  return `custom-${componentId}`
}
