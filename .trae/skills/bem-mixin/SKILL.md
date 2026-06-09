---
name: 'bem-mixin'
description: 'Provides BEM (Block Element Modifier) SCSS mixins for consistent CSS naming. Invoke when writing component styles or when user asks about BEM naming conventions.'
---

# BEM Mixin Skill

## Overview

This skill provides BEM (Block Element Modifier) mixins for writing consistent, maintainable SCSS styles in Vue components.

## Location

```
src/styles/mixins/bem.scss
```

## Available Mixins

### 1. `@include b($block)` - Block

Defines the root block element.

```scss
@include b(button) {
  display: inline-block;
  padding: 8px 16px;
}
// Output: .button { ... }
```

### 2. `@include e($element)` - Element

Defines child elements of the block.

```scss
@include b(button) {
  @include e(icon) {
    margin-right: 4px;
  }
  @include e(text) {
    font-size: 14px;
  }
}
// Output: .button__icon { ... }
//         .button__text { ... }
```

### 3. `@include m($modifier)` - Modifier

Defines modifier variants of the block or element.

```scss
@include b(button) {
  @include m(primary) {
    background: #409eff;
    color: #fff;
  }
  @include m(large) {
    padding: 12px 24px;
  }
}
// Output: .button--primary { ... }
//         .button--large { ... }
```

### 4. `@include when($state)` - State

Defines state classes (like disabled, active, etc.).

```scss
@include b(button) {
  @include when(disabled) {
    opacity: 0.5;
    pointer-events: none;
  }
  @include when(active) {
    background: #3a8ee6;
  }
}
// Output: .button.disabled { ... }
//         .button.active { ... }
```

## Complete Example

```vue
<template>
  <div class="user-card" :class="{ disabled: isDisabled }">
    <div class="user-card__avatar">
      <img src="avatar.jpg" />
    </div>
    <div class="user-card__info">
      <h3 class="user-card__name">{{ name }}</h3>
      <p class="user-card__email">{{ email }}</p>
    </div>
    <button class="user-card__action user-card__action--primary">关注</button>
  </div>
</template>

<style lang="scss" scoped>
@include b(user-card) {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  @include e(avatar) {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  @include e(info) {
    flex: 1;
  }

  @include e(name) {
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 600;
    color: var(--ea-text-primary);
  }

  @include e(email) {
    margin: 0;
    font-size: 14px;
    color: var(--ea-text-secondary);
  }

  @include e(action) {
    padding: 6px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.2s;

    @include m(primary) {
      background: var(--ea-primary);
      color: #fff;
    }

    &:hover {
      opacity: 0.8;
    }
  }

  @include when(disabled) {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
```

## Usage Guidelines

1. **BEM mixins are auto-injected** via Vite `additionalData` (`@use '@/styles/mixins/bem.scss' as *;`), **no manual import needed** in Vue components.

2. **Start with `@include b()`** to define the block:

   ```scss
   @include b(component-name) { ... }
   ```

3. **Nest elements and modifiers** inside the block for clarity.

4. **Use meaningful names** that describe the component's purpose.

5. **Keep nesting shallow** - maximum 3 levels recommended.

## Benefits

- **Consistency**: Enforces BEM naming across all components
- **Readability**: Clear structure shows relationship between elements
- **Maintainability**: Easy to find and update styles
- **No naming conflicts**: BEM ensures unique class names
