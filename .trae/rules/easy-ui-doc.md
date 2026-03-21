---
alwaysApply: true
---

# EA-UI 组件开发规范

## 概述

EA-UI 是一个基于 **Web Components** 技术构建的组件库，使用原生自定义元素（Custom Elements）和 Shadow DOM 实现。所有组件均遵循 W3C Web Components 标准，可在任何支持现代 Web 标准的框架（Vue、React、Angular）或原生 HTML 环境中使用。

## 文档参考要求

### 适用范围

- 所有匹配 `ea-*` 命名模式的组件
- 所有表单相关组件

### 要求

当实现上述组件时，开发者必须：

1. **文档查阅**：首先查阅并参考位于 `e:\repo\ea-low-code\docs\` 目录中的对应文档文件
2. **实现遵循**：严格按照文档中的规范和示例进行实现
3. **验证步骤**：完成实现后，必须按照以下步骤进行验证

### 具体实现指南

1. **文档定位**：
   - 对于 `ea-xxx` 组件，查找 `docs/ea-xxx.md` 文件
   - 对于表单组件，查找对应的表单组件文档

2. **文档内容参考**：
   - 组件属性定义和默认值
   - 事件处理方式
   - 插槽使用方法
   - 样式规范
   - 最佳实践示例

3. **验证步骤**：
   - 确认组件实现符合文档中描述的所有功能
   - 验证组件在不同场景下的表现
   - 确保组件与其他EA-UI组件的兼容性
   - 运行相关测试用例

### 违规处理

- 未参考文档实现的组件将被视为不符合规范
- 实现与文档不符的组件需要重新修改
- 严重违反规范的实现可能会被拒绝合并
- ea-components 文件夹下的组件仅作参考（源文件），并非平台直接使用的组件（打包后，node_modules 下的组件）。所以在实现组件时，不能直接使用或修改 ea-components 文件夹下的组件，而应该根据文档规范实现。

---

## Web Components 技术规范

### 1. 架构特性

EA-UI 组件基于以下 Web Components 核心技术构建：

| 技术                | 说明                                                                       |
| ------------------- | -------------------------------------------------------------------------- |
| **Custom Elements** | 使用 `customElements.define()` 注册自定义元素，所有组件标签以 `ea-` 为前缀 |
| **Shadow DOM**      | 组件使用 Shadow DOM 封装样式和结构，实现真正的样式隔离                     |
| **HTML Templates**  | 使用 `<template>` 元素定义组件内部结构                                     |
| **CSS Parts**       | 通过 `part` 属性暴露可样式化的组件内部元素                                 |
| **Slots**           | 使用 `<slot>` 和 `slot="slot-name"` 元素实现内容分发和自定义               |

### 2. 组件注册检测

由于 Web Components 是异步注册的，在操作组件属性和方法前必须确保组件已定义：

```javascript
// 等待组件注册完成
await customElements.whenDefined('ea-button')

const button = document.querySelector('ea-button')
// 现在可以安全地操作组件
button.disabled = true
```

### 3. 属性操作规范

EA-UI 组件属性遵循以下规则：

```javascript
// 1. 布尔属性：使用属性存在性判断
button.disabled = true // 设置禁用
button.disabled = false // 取消禁用

// 2. 字符串属性：直接赋值
button.type = 'primary'
dialog.title = '提示信息'

// 3. 复杂数据：通过属性设置对象/数组
table.data = [{ id: 1, name: 'Item 1' }]
transfer.data = [{ key: 1, label: '选项1' }]
```

---

## Slot 插槽机制详解

### 1. Slot 概述

Slot 是 Web Components 的内容分发机制，允许开发者在自定义元素中插入自定义内容。EA-UI 组件广泛使用了以下 Slot 类型：

- **默认插槽（Default Slot）**：未指定名称的插槽，用于放置组件主要内容
- **具名插槽（Named Slots）**：通过 `name` 属性标识的插槽，用于特定位置的内容分发
- **作用域插槽（Scoped Slots）**：通过 `data-scope` 实现数据绑定的插槽

### 2. Slot 使用语法

#### 2.1 默认插槽

当组件内容不需要特定位置时，使用默认插槽：

```html
<!-- Card 组件的默认插槽用于内容区域 -->
<ea-card>
  <p>这是卡片的主要内容</p>
  <p>可以包含多个元素</p>
</ea-card>

<!-- Dialog 组件的默认插槽用于对话框内容 -->
<ea-dialog title="提示">
  <span>这是对话框的内容</span>
</ea-dialog>
```

#### 2.2 具名插槽

> 注意：插槽应该直接使用 slot="slot-name" 属性，而不是使用 Vue 的 v-slot:reference 等语法，注意 vue 的写法完全不等同原生的写法。

通过 `slot` 属性指定内容要插入的具名插槽：

```html
<!-- Card 组件的 header 和 footer 插槽 -->
<ea-card>
  <div slot="header">
    <span>卡片标题</span>
    <ea-button type="primary">操作</ea-button>
  </div>
  <p>卡片主要内容</p>
  <div slot="footer">
    <span>页脚内容</span>
  </div>
</ea-card>

<!-- Dialog 组件的 header 和 footer 插槽 -->
<ea-dialog>
  <header slot="header">
    <h3>自定义标题</h3>
  </header>
  <main>对话框内容</main>
  <footer slot="footer">
    <ea-button>取消</ea-button>
    <ea-button type="primary">确定</ea-button>
  </footer>
</ea-dialog>
```

#### 2.3 表格列插槽

Table 组件支持在列定义中使用插槽：

```html
<ea-table id="customTable">
  <!-- 自定义列内容 -->
  <ea-table-column prop="date" label="日期">
    <ea-icon name="clock" variant="solid"></ea-icon>
    <span data-scope="date"></span>
  </ea-table-column>

  <!-- 自定义表头 -->
  <ea-table-column prop="action" label="操作">
    <ea-input slot="header" placeholder="搜索..."></ea-input>
    <ea-button size="small">编辑</ea-button>
  </ea-table-column>
</ea-table>
```

### 3. Slot 命名规范

> 注意：插槽应该直接使用 slot="slot-name" 属性，而不是使用 Vue 的 v-slot:reference 等语法，注意 vue 的写法完全不等同原生的写法。

EA-UI 组件遵循以下 Slot 命名约定：

| 插槽名称   | 使用场景       | 典型组件                                       |
| ---------- | -------------- | ---------------------------------------------- |
| `header`   | 组件头部区域   | ea-card, ea-dialog, ea-drawer, ea-table-column |
| `footer`   | 组件底部区域   | ea-card, ea-dialog, ea-drawer                  |
| `empty`    | 无数据状态显示 | ea-table, ea-select                            |
| `-` (默认) | 主要内容区域   | 所有容器类组件                                 |

### 4. 默认内容处理

当插槽未提供内容时，组件会显示默认内容：

```html
<!-- 如果未提供 header 插槽，Card 组件可能显示默认标题或隐藏头部 -->
<ea-card>
  <!-- 无 header 插槽，头部区域不显示 -->
  <p>只有内容区域</p>
</ea-card>
```

### 5. 作用域规则

#### 5.1 样式作用域

- **Shadow DOM 内部样式**：组件内部样式完全隔离，外部样式无法直接影响
- **::part() 伪元素**：通过 CSS Part 暴露可样式化的内部元素
- **全局样式**：通过 `::part()` 或自定义属性影响组件外观

```css
/* 通过 ::part() 修改 Button 样式 */
ea-button::part(container) {
  background-color: #409eff;
  border-radius: 4px;
}

/* 通过 ::part() 修改 Card 头部样式 */
ea-card::part(header) {
  background-color: #f5f7fa;
  padding: 16px;
}
```

#### 5.2 事件作用域

插槽内容的事件在 Shadow DOM 外部捕获：

```html
<ea-card>
  <div slot="header">
    <button id="headerBtn">点击我</button>
  </div>
</ea-card>

<script>
  // 事件监听在 Light DOM 中正常工作
  document.querySelector('#headerBtn').addEventListener('click', () => {
    console.log('按钮被点击')
  })
</script>
```

### 6. 高级使用技巧

#### 6.1 条件性插槽内容

```html
<ea-dialog id="dynamicDialog">
  <!-- 动态决定是否显示自定义头部 -->
  <template id="customHeader">
    <header slot="header">
      <span>动态标题</span>
    </header>
  </template>
</ea-dialog>

<script>
  // 动态添加插槽内容
  const dialog = document.querySelector('#dynamicDialog')
  const template = document.querySelector('#customHeader')
  dialog.appendChild(template.content.cloneNode(true))
</script>
```

#### 6.2 嵌套组件插槽

```html
<ea-dialog>
  <div slot="footer">
    <ea-button-group>
      <ea-button>取消</ea-button>
      <ea-button type="primary">确定</ea-button>
    </ea-button-group>
  </div>
</ea-dialog>
```

#### 6.3 表单组件插槽

```html
<ea-select placeholder="请选择">
  <!-- 选项通过默认插槽传入 -->
  <ea-option value="beijing">北京</ea-option>
  <ea-option value="shanghai">上海</ea-option>
  <ea-option value="guangzhou">广州</ea-option>
</ea-select>
```

---

## CSS Part 样式定制

### 1. CSS Part 概述

CSS Part 是 Shadow DOM 提供的样式定制机制，允许开发者通过 `::part()` 伪元素访问和修改组件内部特定元素的样式。

### 2. 使用语法

```css
/* 基本语法 */
ea-component::part(part-name) {
  /* 样式规则 */
}

/* 示例：修改 Button 容器样式 */
ea-button::part(container) {
  background-color: #409eff;
  color: white;
}

/* 示例：修改 Table 行样式 */
ea-table::part(tbody-tr) {
  background-color: #f5f7fa;
}
```

### 3. 常见 CSS Part 命名

| Part 名称   | 说明       | 适用组件            |
| ----------- | ---------- | ------------------- |
| `container` | 组件根容器 | 大多数组件          |
| `header`    | 头部容器   | ea-card, ea-dialog  |
| `content`   | 内容容器   | ea-card, ea-tabs    |
| `footer`    | 页脚容器   | ea-card, ea-dialog  |
| `icon`      | 图标元素   | ea-button, ea-input |

---

## CSS 变量样式定制

### 1. CSS 变量概述

CSS 变量（Custom Properties）是 EA-UI 组件样式定制的重要机制。通过修改组件暴露的 CSS 变量，可以实现全局或局部的样式主题定制，而无需直接修改组件内部样式。

### 2. 使用要求

当需要通过修改 EA-UI 组件的 CSS 变量来实现样式更新时，开发者必须：

1. **样式文件查阅**：首先查阅并参考位于 `e:\repo\ea-low-code\ea-components\` 目录下对应组件的 SCSS 样式文件
2. **变量定义参考**：重点关注组件样式文件中的 `:host` 选择器定义的 CSS 变量
3. **变量使用规范**：严格按照组件定义的变量名称和默认值进行样式定制

### 3. 具体实现指南

#### 3.1 样式文件定位

- 对于 `ea-xxx` 组件，查找 `ea-components/src/*/ea-xxx/` 目录下的 SCSS 样式文件
- 重点关注 `index.scss` 或主要样式文件中的 `:host` 选择器定义

#### 3.2 变量定义参考

在组件样式文件中查找类似结构：

```scss
:host {
  // 组件暴露的 CSS 变量定义
  --ea-button-primary-bg-color: #409eff;
  --ea-button-primary-text-color: #ffffff;
  --ea-button-border-radius: 4px;

  // 其他样式定义
}
```

#### 3.3 样式定制语法

```css
/* 全局样式定制 */
:root {
  --ea-button-primary-bg-color: #67c23a; /* 修改主按钮背景色 */
  --ea-button-border-radius: 8px; /* 修改按钮圆角 */
}

/* 局部样式定制 */
.custom-theme {
  --ea-card-background-color: #f0f9ff;
  --ea-card-border-color: #bae0ff;
}

/* 特定组件样式定制 */
ea-button[type='primary'] {
  --ea-button-primary-bg-color: #ff6b6b;
}
```

### 4. 最佳实践

#### 4.1 变量命名规范

- 使用 `--ea-{组件名}-{属性名}-{状态}` 的命名约定
- 保持与组件内部变量命名的一致性
- 避免使用过于通用的变量名

#### 4.2 样式作用域控制

```css
/* ✅ 推荐：使用作用域控制样式影响范围 */
.app-theme {
  --ea-button-primary-bg-color: #409eff;
}

/* ❌ 避免：全局修改可能影响其他组件 */
:root {
  --ea-button-primary-bg-color: #ff0000; /* 可能影响所有按钮 */
}
```

#### 4.3 变量回退机制

```css
/* 提供合理的回退值 */
.custom-button {
  background-color: var(--ea-button-primary-bg-color, #409eff);
  color: var(--ea-button-primary-text-color, #ffffff);
}
```

### 5. 验证步骤

1. 确认使用的 CSS 变量名称与组件定义一致
2. 验证样式修改在目标组件上正确生效
3. 确保样式修改不会破坏组件的功能和行为
4. 在不同浏览器和设备上测试样式兼容性

### 6. 违规处理

- 未参考组件样式文件直接修改 CSS 变量将被视为不符合规范
- 使用未定义的 CSS 变量可能导致样式失效
- 随意修改全局 CSS 变量可能影响其他组件

---

## 最佳实践

### 1. 组件引入顺序

```html
<!-- 1. 先引入图标样式（如需要） -->
<link rel="stylesheet" href="./node_modules/easy-component-ui/components/ea-icon/index.css" />

<!-- 2. 引入组件 -->
<script type="module">
  import './node_modules/easy-component-ui/components/ea-button/index.js'
  import './node_modules/easy-component-ui/components/ea-card/index.js'
</script>
```

### 2. 等待组件定义

```javascript
// 在 Vue/React 等框架中，确保组件已定义后再操作
async function initComponent() {
  await customElements.whenDefined('ea-table')
  const table = document.querySelector('#myTable')
  table.setData(data)
}
```

### 3. Slot 内容最佳实践

```html
<!-- ✅ 推荐：使用语义化标签包裹插槽内容 -->
<ea-card>
  <header slot="header" class="card-header">
    <h3>标题</h3>
  </header>
  <article>内容</article>
  <footer slot="footer">页脚</footer>
</ea-card>

<!-- ❌ 避免：直接放置无包裹的文本 -->
<ea-card>
  <span slot="header">标题</span>
</ea-card>
```

### 4. 框架集成注意事项

#### Vue 3 配置

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('ea-'),
        },
      },
    }),
  ],
})
```

---

## 示例

### 正确做法

1. 实现 `ea-button` 组件前，先查阅 `docs/ea-button.md`
2. 按照文档中的属性定义和示例进行实现
3. 验证组件功能是否与文档一致
4. 使用 `await customElements.whenDefined()` 确保组件已注册
5. 通过 `::part()` 进行样式定制而非直接修改 Shadow DOM

### 错误做法

1. 直接实现 `ea-input` 组件而不参考 `docs/ea-input.md`
2. 随意修改组件属性或行为，与文档不符
3. 忽略文档中规定的最佳实践
4. 在组件未定义时尝试操作组件属性和方法
5. 直接尝试通过 CSS 选择器穿透 Shadow DOM

---

## 参考资源

- [MDN Web Components 指南](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)
- [MDN ::part() 伪类](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::part)
- [MDN <slot> 元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/slot)
- [Custom Elements 规范](https://html.spec.whatwg.org/multipage/custom-elements.html)
