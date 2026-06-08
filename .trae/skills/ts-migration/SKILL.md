---
name: ts-migration
description: TypeScript 迁移模式与最佳实践。当需要将 .js 文件迁移为 .ts、为 Vue 组件添加 lang="ts"、定义接口/类型、处理 any 类型时触发。
---

# TypeScript 迁移 Skill

## 适用场景

- 将 `.js` 文件迁移为 `.ts`
- 为 Vue 组件添加 `<script setup lang="ts">`
- 定义接口和类型
- 处理迁移中的 `any` 类型问题

## 迁移策略

### 1. 迁移顺序

按依赖关系从底层到上层迁移：

1. `utils/` → 2. `constants/` → 3. `stores/` → 4. `composables/` → 5. `components/` → 6. `views/`

### 2. Vue 组件迁移

```vue
<!-- 迁移前 -->
<script>
export default { ... }
</script>

<!-- 迁移后 -->
<script setup lang="ts">
import type { Ref } from 'vue'
// ...
</script>
```

### 3. 类型定义原则

- 优先使用 `interface`，联合类型用 `type`
- Props 使用 `defineProps<{...}>()`
- Emits 使用 `defineEmits<{...}>()`
- 避免过度使用 `any`，必要时用 `unknown` + 类型守卫

### 4. 常见问题处理

- `new Function()` 动态代码：保留 `any`，添加运行时校验
- 动态属性访问（`obj[key]`）：使用索引签名或 `Record<string, unknown>`
- 第三方库无类型：创建 `.d.ts` 声明文件

## 验证

迁移完成后运行 `vue-tsc --noEmit` 确保零类型错误。
