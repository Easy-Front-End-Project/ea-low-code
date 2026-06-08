---
name: toolchain
description: 开发工具链配置。当需要配置 ESLint/Prettier/Husky/lint-staged/stylelint/Vite/TypeScript 等工具时触发。
---

# 工具链配置 Skill

## 适用场景

- 配置或修改 ESLint / Prettier / Husky / lint-staged
- 配置 Vite / TypeScript
- 配置 monorepo workspace

## 当前工具链

| 工具        | 配置位置                       | 用途       |
| ----------- | ------------------------------ | ---------- |
| ESLint      | `apps/web/` + `apps/server/`   | 代码检查   |
| oxlint      | `apps/web/`                    | 快速 lint  |
| Prettier    | 根目录                         | 代码格式化 |
| Husky       | `.husky/`                      | Git hooks  |
| lint-staged | 根 `package.json`              | 暂存区检查 |
| stylelint   | `apps/web/stylelint.config.js` | 样式检查   |
| Vite        | `apps/web/vite.config.ts`      | 前端构建   |
| TypeScript  | `apps/web/tsconfig.json`       | 类型检查   |

## 配置原则

1. **统一配置**：ESLint / Prettier 配置在 monorepo 根目录统一管理
2. **自动修复**：lint-staged 中配置 `--fix` 自动修复
3. **CI 集成**：`vue-tsc --noEmit` 和 `npm run lint` 必须在 CI 中通过
4. **不冲突**：ESLint 和 Prettier 配置使用 `eslint-config-prettier` 避免冲突
