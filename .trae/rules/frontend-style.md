# 前端样式开发规范

## 1. 样式技术栈

项目采用 **SCSS + UNO CSS** 双轨制样式方案：

| 技术        | 用途         | 使用场景                         |
| ----------- | ------------ | -------------------------------- |
| **SCSS**    | 主要样式方案 | 组件内部样式、复杂布局、主题变量 |
| **UNO CSS** | 辅助原子类   | HTML 元素上的简单样式、快速布局  |

## 2. SCSS 使用规范

### 2.1 样式位置

**所有组件样式必须内联在 Vue 组件文件中**，不抽取到外部 SCSS 文件。

### 2.2 BEM Mixin 工具（推荐）

项目提供了 BEM mixin 工具，位于 `src/styles/mixins/bem.scss`：

```scss
@import '@/styles/mixins/bem.scss';

@include b(component-panel) {
  @include e(search) {
    /* .component-panel__search */
  }
  @include e(input) {
    /* .component-panel__input */
  }
  @include m(active) {
    /* .component-panel--active */
  }
  @include when(disabled) {
    /* .component-panel.is-disabled */
  }
}
```

| Mixin                   | 输出示例                       |
| ----------------------- | ------------------------------ |
| `@include b($block)`    | `.component-panel`             |
| `@include e($element)`  | `.component-panel__search`     |
| `@include m($modifier)` | `.component-panel--active`     |
| `@include when($state)` | `.component-panel.is-disabled` |

### 2.3 BEM 嵌套规则

- **浅层嵌套（1-2 层）**：严格使用 BEM mixin
- **深层嵌套（3 层以上）**：可使用语义化类名

### 2.4 空状态组件

**统一使用 `ea-empty` 组件**展示空状态，禁止自定义空状态样式。

### 2.5 全局样式

全局 CSS 变量定义在 `src/styles/main.scss` 中，使用 `var(--ea-xxx)` 引用。

## 3. UNO CSS 使用规范

仅用于：简单原子样式、快速布局、响应式工具类。不要在复杂组件上使用 UNO CSS。

## 4. 样式优先级

1. **UNO CSS 用于**：布局类、间距、文字颜色
2. **SCSS 用于**：组件特定样式、伪类、复杂选择器、动画

## 5. Stylelint

项目已配置 stylelint BEM 命名规则，运行 `npm run lint:style` 检查。
