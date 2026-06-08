---
name: ea-ui-component
description: EA-UI 组件实现指南。当需要实现或修改 ea-* Web Components 组件、使用 Slot/CSS Part/CSS 变量定制组件样式时触发。
---

# EA-UI 组件实现 Skill

## 适用场景

- 实现新的 `ea-*` Web Components 组件
- 使用 Slot / CSS Part / CSS 变量定制组件
- 查阅组件文档和属性定义

## 组件技术架构

| 技术            | 说明                                       |
| --------------- | ------------------------------------------ |
| Custom Elements | `customElements.define()` 注册，`ea-` 前缀 |
| Shadow DOM      | 样式隔离，通过 `part` 暴露可样式化元素     |
| HTML Templates  | `<template>` 定义组件结构                  |
| CSS Parts       | `::part()` 伪元素定制样式                  |
| Slots           | `<slot>` 内容分发                          |

## Slot 使用

```html
<!-- 默认插槽 -->
<ea-card>内容</ea-card>

<!-- 具名插槽：使用 slot 属性，非 v-slot -->
<ea-card>
  <div slot="header">标题</div>
  <p>内容</p>
  <div slot="footer">页脚</div>
</ea-card>
```

## CSS Part 定制

```css
ea-button::part(container) {
  background: #409eff;
}
ea-card::part(header) {
  padding: 16px;
}
```

## CSS 变量定制

修改前须查阅 `ea-components/src/*/ea-xxx/` 下的 SCSS 文件中 `:host` 定义的变量：

```css
ea-button[type='primary'] {
  --ea-button-primary-bg-color: #ff6b6b;
}
```

## 文档查阅

- 组件文档：`docs/ea-xxx.md`
- 组件源码：`ea-components/src/*/ea-xxx/`（仅供参考，不可直接修改）
- 使用组件：`node_modules/easy-component-ui/components/ea-xxx/`

## 组件注册检测

```javascript
await customElements.whenDefined('ea-table')
const table = document.querySelector('#myTable')
table.setData(data)
```

## Vue 集成

```javascript
// vite.config.js
vue({
  template: {
    compilerOptions: {
      isCustomElement: tag => tag.startsWith('ea-'),
    },
  },
})
```
