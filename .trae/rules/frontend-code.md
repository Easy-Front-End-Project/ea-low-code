# 前端代码规范

## 1. Store 开发规范

### 1.1 精简原则

- 移除不必要的条件判断
- 使用可选链操作符简化空值检查
- 合并重复代码

```javascript
// ✅ 推荐
function updateComponentStyle(componentId, style, styleType = 'inline') {
  const component = findComponentById(pageSchema.value.components, componentId)
  if (!component) return

  const styleMap = {
    cssVariable: 'cssVariables',
    position: 'positionStyle',
    customCSS: 'customCSS',
    inline: 'style',
  }

  const targetKey = styleMap[styleType]

  if (styleType === 'customCSS') {
    component.customCSS = style
  } else {
    component[targetKey] ??= {}
    Object.assign(component[targetKey], style)
  }
}
```

### 1.2 使用现代 JavaScript 特性

```javascript
const value = obj?.nested?.property // 可选链
const count = value ?? 0 // 空值合并
obj.array ??= [] // 逻辑赋值
const double = x => x * 2 // 箭头函数
```

## 2. Vue 组件规范

### 2.1 模板简化

```vue
<!-- ✅ 使用模板字符串 -->
<ea-collapse-item :title="`${category.label} (${category.componentCount})`">

<!-- ❌ 避免字符串拼接 -->
<ea-collapse-item :title="category.label + ' (' + category.componentCount + ')'">
```

### 2.2 计算属性简化

```javascript
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
const filteredList = computed(() =>
  list.value.filter(item => item.active).map(item => ({ ...item, label: item.name.toUpperCase() }))
)
```
