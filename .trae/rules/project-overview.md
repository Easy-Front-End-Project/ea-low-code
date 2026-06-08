# EA-LowCode 项目概述

## 项目定位

基于 **Vue 3 + Web Components** 的低代码平台。

## 技术栈

| 层级     | 技术                                 |
| -------- | ------------------------------------ |
| 前端框架 | Vue 3 + Pinia + Vue Router           |
| 组件库   | EA-UI（Web Components）              |
| 样式方案 | SCSS + UNO CSS                       |
| 后端框架 | NestJS + TypeORM + MySQL             |
| 语言     | TypeScript（后端已全量，前端待迁移） |
| 包管理   | npm workspaces monorepo              |

## 通用原则

1. 样式开发：SCSS 为主，UNO CSS 为辅
2. 样式位置：所有组件样式内联在 Vue 文件中
3. 命名规范：BEM 命名法 + 有意义的类名
4. 代码精简：移除冗余逻辑，使用现代 JavaScript 特性
5. 文件组织：按功能分组，保持清晰的目录结构
