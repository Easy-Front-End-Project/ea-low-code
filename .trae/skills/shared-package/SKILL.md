---
name: shared-package
description: 共享包 @ea-low-code/shared 开发规范。当需要创建/修改共享类型、常量、校验器、工具函数时触发。
---

# 共享包开发 Skill

## 适用场景

- 在 `packages/shared` 中添加类型定义
- 创建共享常量或校验器
- 前后端需要共享类型时

## 包结构

```
packages/shared/src/
├── types/          # 类型定义
│   ├── schema.ts   # Schema 相关类型
│   ├── meta.ts     # 元数据类型
│   ├── event.ts    # 事件类型
│   ├── style.ts    # 样式类型
│   ├── project.ts  # 项目类型
│   └── api.ts      # API 类型
├── constants/      # 共享常量
├── validators/     # 校验器
└── utils/          # 工具函数
```

## 开发原则

1. **纯 TypeScript**：不使用 class-validator 装饰器（后端 DTO 需单独包装）
2. **零依赖**：shared 包不应依赖框架特定库
3. **子路径导出**：通过 `package.json` 的 `exports` 字段支持按需导入
4. **类型优先**：先定义类型，再实现逻辑

## 导入方式

```typescript
import type { PageSchema } from '@ea-low-code/shared'
import { CATEGORIES } from '@ea-low-code/shared/constants'
```
