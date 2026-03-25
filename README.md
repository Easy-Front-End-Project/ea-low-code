# EA Low Code Platform

一个基于 Vue 3 的低代码设计器平台，支持通过拖拽方式快速构建页面。

## 项目结构

本项目采用 Monorepo 架构，使用 npm workspaces 管理：

```
ea-low-code/
├── apps/
│   ├── web/                    # 前端应用（低代码设计器）
│   │   ├── src/                # 前端源代码
│   │   ├── package.json
│   │   └── ...
│   └── server/                 # 后端应用（待初始化）
│       ├── src/                # 后端源代码
│       ├── package.json
│       └── ...
├── packages/
│   └── shared/                 # 共享包（类型定义、工具函数）
│       ├── index.js
│       ├── types.js
│       └── package.json
├── package.json                # 根 package.json（workspace 配置）
└── ...
```

## 分支说明

- `main`: 主分支，保存最终代码
- `frontend-only`: 纯前端版本（历史备份）
- `fullstack`: 前后端整合版本（当前开发分支）

## 推荐 IDE 设置

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（禁用 Vetur）

## 推荐浏览器插件

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

## 项目设置

```sh
npm install
```

## 开发命令

### 前端开发

```sh
npm run dev:web
# 或
npm run dev
```

### 后端开发（待初始化）

```sh
npm run dev:server
```

### 构建

```sh
# 构建前端
npm run build:web

# 构建后端
npm run build:server
```

### 代码检查

```sh
npm run lint
```

### 格式化

```sh
npm run format
```

## 技术栈

### 前端

- Vue 3 + Vue Router + Pinia
- Vite（构建工具）
- UnoCSS（原子化 CSS）
- Monaco Editor（代码编辑器）
- Easy Component UI（组件库）

### 后端（待确定）

- 待初始化（可选择 NestJS、Express、FastAPI 等）

## 自定义配置

参考 [Vite 配置文档](https://vite.dev/config/)
