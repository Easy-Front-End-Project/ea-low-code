# EA Low Code Platform

一个基于 Vue 3 + NestJS 的全栈低代码设计器平台，支持通过拖拽方式快速构建页面。

## 项目结构

本项目采用 Monorepo 架构，使用 npm workspaces 管理：

```
ea-low-code/
├── apps/
│   ├── web/                        # 前端应用（低代码设计器）
│   │   ├── src/
│   │   │   ├── api/               # API 请求
│   │   │   ├── components/        # 组件
│   │   │   │   ├── common/        # 通用组件
│   │   │   │   ├── designer/      # 设计器核心组件
│   │   │   │   ├── ea-ui-wrap/    # EA-UI 包装组件
│   │   │   │   ├── images/        # 图片管理组件
│   │   │   │   ├── models/        # 数据模型组件
│   │   │   │   ├── pages/         # 页面管理组件
│   │   │   │   ├── projects/      # 项目管理组件
│   │   │   │   └── remote-components/ # 远程组件管理
│   │   │   ├── layouts/           # 布局组件
│   │   │   ├── router/            # 路由配置
│   │   │   ├── stores/            # Pinia 状态管理
│   │   │   ├── styles/            # 全局样式
│   │   │   ├── utils/             # 工具函数
│   │   │   └── views/             # 页面视图
│   │   └── package.json
│   └── server/                     # 后端应用（NestJS）
│       ├── src/
│       │   ├── auth/              # 认证模块（JWT + 邮箱验证码）
│       │   ├── users/             # 用户模块
│       │   ├── pages/             # 页面/项目管理模块
│       │   ├── components/        # 组件管理模块
│       │   ├── images/            # 图片管理模块
│       │   ├── models/            # 数据模型模块（动态数据源）
│       │   ├── stats/             # 统计模块
│       │   ├── common/            # 公共代码（过滤器、服务、工具）
│       │   └── main.ts            # 应用入口
│       └── package.json
├── packages/
│   └── shared/                     # 共享包（类型定义、工具函数）
│       ├── index.js
│       ├── types.js
│       └── package.json
├── docker-compose.yml              # Docker 配置（MySQL）
├── .env.example                    # 环境变量示例
└── package.json                    # 根 package.json（workspace 配置）
```

## 功能特性

### 设计器

- 拖拽式页面搭建，支持组件树管理
- 丰富的组件库：基础组件、表单组件、布局组件、数据组件、导航组件、反馈组件
- 远程组件加载与自定义组件管理
- 样式配置：基础样式、布局、定位、文字、背景、边框、阴影、自定义 CSS
- 事件系统：API 请求、方法调用、自定义代码、消息通知等
- 变量管理与数据绑定
- 页面预览与 JSON 编辑
- 自动保存

### 平台功能

- 用户注册/登录（JWT 认证 + 邮箱验证码）
- 项目管理（创建、编辑、删除）
- 页面管理（创建、编辑、删除、预览）
- 图片云（上传、分组管理）
- 数据源管理（数据模型、字段定义、动态 CRUD）
- 组件库管理（远程组件、URL 预设）
- Swagger API 文档

## 技术栈

### 前端

- **Vue 3** + **Vue Router** + **Pinia**
- **Vite**（构建工具）
- **UnoCSS**（原子化 CSS）
- **SCSS** + BEM 命名规范
- **Monaco Editor**（代码编辑器）
- **Easy Component UI**（Web Components 组件库）
- **Axios**（HTTP 请求）

### 后端

- **NestJS**（框架）
- **TypeORM** + **MySQL**（数据库）
- **Passport** + **JWT**（认证）
- **bcrypt**（密码加密）
- **Nodemailer**（邮件服务）
- **Swagger**（API 文档）
- **class-validator** + **class-transformer**（数据校验与转换）

### 基础设施

- **Docker** + **Docker Compose**（MySQL 容器化）
- **npm Workspaces**（Monorepo 管理）

## 项目设置

### 环境要求

- Node.js `^20.19.0 || >=22.12.0`
- MySQL 8.0

### 安装依赖

```sh
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```sh
cp .env.example .env
```

主要配置项：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `DB_HOST` | MySQL 主机 | `localhost` |
| `DB_PORT` | MySQL 端口 | `3306` |
| `DB_USERNAME` | 数据库用户名 | - |
| `DB_PASSWORD` | 数据库密码 | - |
| `DB_DATABASE` | 数据库名 | `nestjs_db` |
| `PORT` | 后端端口 | `3000` |
| `JWT_SECRET` | JWT 密钥 | - |
| `CORS_ORIGIN` | 允许的跨域源 | `http://localhost:5173` |
| `SMTP_*` | 邮件服务配置（可选） | - |

### 启动 MySQL（Docker）

```sh
docker compose up -d
```

## 开发命令

### 前端开发

```sh
npm run dev:web
# 或
npm run dev
```

前端默认运行在 `http://localhost:5173`

### 后端开发

```sh
npm run dev:server
```

后端默认运行在 `http://localhost:3000`，API 文档在 `http://localhost:3000/api-docs`

### 构建

```sh
# 构建前端
npm run build:web

# 构建后端
npm run build:server
```

### 代码检查与格式化

```sh
# 前端 lint
npm run lint

# 前端格式化
npm run format
```

## API 概览

后端 API 统一使用 `/api` 前缀，仅使用 GET 和 POST 请求方式：

| 模块 | 路径前缀 | 说明 |
|------|----------|------|
| 认证 | `/api/auth` | 登录、注册、验证码、重置密码 |
| 用户 | `/api/users` | 用户 CRUD |
| 页面 | `/api/pages` | 项目与页面管理 |
| 组件 | `/api/components` | 远程组件与 URL 预设 |
| 图片 | `/api/images` | 图片上传与分组管理 |
| 数据模型 | `/api/models` | 数据模型与动态数据 CRUD |
| 统计 | `/api/stats` | 平台统计数据 |

## 推荐 IDE 设置

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（禁用 Vetur）

## 推荐浏览器插件

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

## License

[MIT](./LICENSE)
