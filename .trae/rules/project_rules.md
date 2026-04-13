# EA-LowCode 项目开发规范

## 概述

本项目是一个基于 Vue 3 + Web Components 的低代码平台。本规范定义了项目的代码风格、样式开发标准和最佳实践。

---

## 样式开发规范

### 1. 样式技术栈

项目采用 **SCSS + UNO CSS** 双轨制样式方案：

| 技术        | 用途         | 使用场景                         |
| ----------- | ------------ | -------------------------------- |
| **SCSS**    | 主要样式方案 | 组件内部样式、复杂布局、主题变量 |
| **UNO CSS** | 辅助原子类   | HTML 元素上的简单样式、快速布局  |

### 2. SCSS 使用规范

#### 2.1 样式位置

**所有组件样式必须内联在 Vue 组件文件中**，不抽取到外部 SCSS 文件。

```vue
<template>
  <div class="component-panel">
    <div class="component-panel__search">
      <input class="component-panel__input" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.component-panel {
  display: flex;
  flex-direction: column;

  &__search {
    padding: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }

  &__input {
    border-radius: 4px;

    &:focus {
      border-color: #3b82f6;
    }
  }
}
</style>
```

#### 2.2 命名规范

采用 **BEM (Block Element Modifier)** 命名规范：

```scss
// Block
.component-panel {
  // ...
}

// Element
.component-panel__search {
  // ...
}

.component-panel__content {
  // ...
}

// Modifier
.component-item--child {
  // ...
}

.component-item--remote {
  // ...
}
```

#### 2.3 BEM Mixin 工具（推荐）

项目提供了 BEM mixin 工具简化命名，位于 `src/styles/mixins/bem.scss`：

```scss
<style lang="scss" scoped>
@import '@/styles/mixins/bem.scss';

@include b(component-panel) {
  display: flex;
  flex-direction: column;

  @include e(search) {
    padding: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }

  @include e(input) {
    border-radius: 4px;

    &:focus {
      border-color: #3b82f6;
    }
  }

  @include m(active) {
    background-color: var(--ea-primary-light);
  }

  @include when(disabled) {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
```

**Mixin 说明**：

| Mixin | 参数 | 说明 | 输出示例 |
|-------|------|------|----------|
| `@include b($block)` | 块名 | 定义 Block | `.component-panel` |
| `@include e($element)` | 元素名 | 定义 Element | `.component-panel__search` |
| `@include m($modifier)` | 修饰符 | 定义 Modifier | `.component-panel--active` |
| `@include when($state)` | 状态名 | 定义状态类 | `.component-panel.disabled` |

**使用要求**：
- 所有新组件推荐使用 BEM mixin 编写样式
- mixin 支持嵌套使用，保持代码结构清晰
- 编译后的 CSS 与手动编写的 BEM 命名完全一致

#### 2.3 全局样式

全局 CSS 变量定义在 `src/styles/main.scss` 中：

```scss
:root {
  // Primary colors
  --ea-primary: #409eff;
  --ea-primary-light: #ecf5ff;
  --ea-primary-dark: #3a8ee6;

  // Success colors
  --ea-success: #67c23a;
  --ea-success-light: #f0f9eb;

  // ... 其他变量
}
```

#### 2.4 SCSS 最佳实践

```scss
// ✅ 使用嵌套（适度，最多 3 层）
.component-panel {
  &__search {
    padding: 0.75rem;
  }

  &__input {
    border-radius: 4px;

    &:focus {
      border-color: #3b82f6;
    }
  }
}

// ❌ 避免过深层级
.component {
  .header {
    .nav {
      .item {
        .link {
          // 太深了！
          // ...
        }
      }
    }
  }
}

// ✅ 使用 :deep() 修改子组件样式
:deep(ea-button) {
  --ea-button-padding: 4px 8px;
}

// ✅ 使用 CSS 变量
.component {
  color: var(--ea-text-primary);
  border: 1px solid var(--ea-border-base);
}
```

### 3. UNO CSS 使用规范

#### 3.1 使用场景

UNO CSS 仅用于以下场景：

1. **简单的原子样式**（margin、padding、display 等）
2. **快速布局**（flex、grid、position）
3. **响应式工具类**
4. **HTML 元素上的内联样式**

#### 3.2 使用示例

```vue
<template>
  <!-- ✅ 正确：UNO CSS 用于简单样式 -->
  <div class="flex items-center justify-between p-4">
    <span class="text-sm text-gray-600">Label</span>
    <button class="px-4 py-2 bg-blue-500 text-white rounded">Button</button>
  </div>

  <!-- ✅ 正确：UNO CSS 用于布局 -->
  <div class="grid grid-cols-2 gap-4">
    <div class="col-span-2">Full width</div>
    <div>Half width</div>
    <div>Half width</div>
  </div>

  <!-- ❌ 错误：不要在复杂组件上使用 UNO CSS -->
  <div
    class="component-with-many-styles p-4 m-2 border rounded shadow hover:shadow-lg transition-all duration-300 ..."
  >
    <!-- 太多 UNO 类了！应该使用 SCSS -->
  </div>
</template>
```

#### 3.3 UNO CSS 类名规范

```html
<!-- ✅ 推荐：类名按功能分组 -->
<div
  class="
  flex items-center justify-between
  p-4 m-2
  bg-white border rounded-lg shadow-sm
  hover:shadow-md transition-shadow
"
></div>

<!-- ❌ 避免：类名混乱无序 -->
<div
  class="p-4 flex hover:shadow-md items-center shadow-sm bg-white transition-shadow border m-2 rounded-lg justify-between"
></div>
```

### 4. 样式优先级

当 SCSS 和 UNO CSS 同时存在时，遵循以下优先级：

1. **UNO CSS 用于**：布局类（flex、grid）、间距（p-、m-）、文字颜色（text-）
2. **SCSS 用于**：组件特定样式、伪类（:hover、:focus）、复杂选择器、动画

```vue
<template>
  <!-- UNO CSS 处理布局，SCSS 处理组件样式 -->
  <div class="flex flex-col gap-4 p-4" :class="{ 'is-active': active }">
    <div class="custom-component">
      <!-- 组件内部样式由 SCSS 处理 -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.custom-component {
  // 复杂样式由 SCSS 处理
  position: relative;

  &::before {
    content: '';
    // ...
  }

  &:hover {
    // ...
  }

  &.is-active {
    // ...
  }
}
</style>
```

---

## JavaScript/TypeScript 规范

### 1. Store 开发规范

#### 1.1 精简原则

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

// ❌ 避免
function updateComponentStyle(componentId, style, styleType = 'inline') {
  const component = findComponentById(pageSchema.value.components, componentId)
  if (component) {
    if (styleType === 'cssVariable') {
      if (!component.cssVariables) {
        component.cssVariables = {}
      }
      Object.assign(component.cssVariables, style)
    } else if (styleType === 'position') {
      if (!component.positionStyle) {
        component.positionStyle = {}
      }
      Object.assign(component.positionStyle, style)
    }
    // ... 重复代码
  }
}
```

#### 1.2 使用现代 JavaScript 特性

```javascript
// ✅ 使用可选链
const value = obj?.nested?.property

// ✅ 使用空值合并
const count = value ?? 0

// ✅ 使用逻辑赋值
obj.array ??= []
obj.array.push(item)

// ✅ 使用箭头函数简化
const double = x => x * 2
const sum = (a, b) => a + b
```

### 2. Vue 组件规范

#### 2.1 模板简化

```vue
<!-- ✅ 使用模板字符串简化 -->
<ea-collapse-item
  v-for="category in filteredCategories"
  :key="category.key"
  :name="category.key"
  :title="`${category.label} (${category.componentCount})`"
>

<!-- ❌ 避免字符串拼接 -->
<ea-collapse-item
  :title="category.label + ' (' + category.componentCount + ')'"
>
```

#### 2.2 计算属性简化

```javascript
// ✅ 使用箭头函数和隐式返回
const fullName = computed(() => `${firstName.value} ${lastName.value}`)

// ✅ 使用数组方法链式调用
const filteredList = computed(() =>
  list.value.filter(item => item.active).map(item => ({ ...item, label: item.name.toUpperCase() }))
)
```

---

## 文件组织规范

### 1. 目录结构

```
src/
├── components/
│   ├── common/           # 通用组件
│   ├── configs/          # 配置面板组件
│   ├── designer/         # 设计器组件
│   ├── ea-ui-wrap/       # EA-UI 包装组件
│   └── layouts/          # 布局组件
├── stores/
│   └── designer/         # Pinia stores
├── styles/               # 全局 SCSS 样式（仅变量和工具）
│   └── main.scss         # 全局 CSS 变量
├── utils/                # 工具函数
└── constants/            # 常量定义
```

### 2. 命名规范

| 类型       | 命名规范   | 示例                 |
| ---------- | ---------- | -------------------- |
| 组件文件   | PascalCase | `ComponentPanel.vue` |
| Store 文件 | camelCase  | `schema.js`          |
| 工具文件   | camelCase  | `schemaHelper.js`    |
| 常量文件   | camelCase  | `componentMeta.js`   |

---

## 最佳实践总结

1. **样式开发**：SCSS 为主，UNO CSS 为辅
2. **样式位置**：所有组件样式内联在 Vue 文件中
3. **UNO CSS**：仅用于 HTML 元素上的简单样式
4. **SCSS**：组件内部样式、复杂布局、主题变量
5. **命名规范**：BEM 命名法 + 有意义的类名
6. **代码精简**：移除冗余逻辑，使用现代 JavaScript 特性
7. **文件组织**：按功能分组，保持清晰的目录结构

---

## 存储规范

### localStorage Key 命名规范

**必须使用小写+下划线命名风格**，采用企业级命名规范：

```javascript
// ✅ 正确 - 企业级命名
const STORAGE_KEYS = {
  TOKEN: 'ea_platform_session_token',
  USER: 'ea_platform_user_profile',
  SETTINGS: 'ea_platform_user_settings',
}

// ❌ 错误 - 过于简单或直接使用敏感词
const STORAGE_KEYS = {
  TOKEN: 'access_token',      // 太直接，容易被识别
  TOKEN: 'tk',                // 过于简短，无意义
  TOKEN: 'EAPlatformToken',   // 驼峰式，不符合规范
}
```

#### 命名规则

1. **格式**：`{项目标识}_{模块}_{具体含义}`
2. **项目标识**：如 `ea_platform`、`ea_lc`
3. **模块**：如 `session`、`user`、`config`
4. **具体含义**：如 `token`、`profile`、`settings`

#### 封装要求

所有 localStorage 操作必须封装在 `utils/storage.js` 中：

```javascript
// utils/storage.js
const STORAGE_KEYS = {
  TOKEN: 'ea_platform_session_token',
  USER: 'ea_platform_user_profile',
}

export function getToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

export function setToken(token) {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token)
}

export function removeToken() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
}
```

禁止在业务代码中直接调用 `localStorage.getItem/setItem`。
