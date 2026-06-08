# EA-UI 组件核心约束

## 1. 组件技术

- 基于 **Web Components**（Custom Elements + Shadow DOM）
- 所有组件标签以 `ea-` 为前缀
- 异步注册，操作前需 `await customElements.whenDefined('ea-xxx')`

## 2. 属性操作

```javascript
button.disabled = true // 布尔属性
button.type = 'primary' // 字符串属性
table.data = [{ id: 1 }] // 复杂数据
```

## 3. Slot 插槽

- 使用 `slot="slot-name"` 属性（非 Vue 的 `v-slot`）
- 默认插槽：直接放入组件内部
- 具名插槽：`<div slot="header">...</div>`

## 4. 样式定制

- **CSS Part**：`ea-button::part(container) { ... }`
- **CSS 变量**：修改组件 `:host` 中定义的 `--ea-*` 变量
- 修改变量前须查阅 `ea-components/src/*/ea-xxx/` 下的 SCSS 文件

## 5. 文档参考

- 实现 `ea-xxx` 组件前，先查阅 `docs/ea-xxx.md`
- ea-components 文件夹仅作参考源码，不可直接修改
- 详细实现指南参见 `ea-ui-component` skill

## 6. Vue 集成

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
