# 前端文件组织规范

## 1. 目录结构

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

## 2. 命名规范

| 类型       | 命名规范   | 示例                 |
| ---------- | ---------- | -------------------- |
| 组件文件   | PascalCase | `ComponentPanel.vue` |
| Store 文件 | camelCase  | `schema.js`          |
| 工具文件   | camelCase  | `schemaHelper.js`    |
| 常量文件   | camelCase  | `componentMeta.js`   |
