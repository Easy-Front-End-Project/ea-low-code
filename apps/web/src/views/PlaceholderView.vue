<template>
  <div class="placeholder-view">
    <div class="placeholder-view__empty">
      <ea-icon name="screwdriver-wrench" size="64" color="#c0c4cc"></ea-icon>
      <p class="placeholder-view__text">功能开发中，敬请期待...</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@include b(placeholder-view) {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px);

  @include e(empty) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  @include e(text) {
    font-size: 14px;
    color: var(--ea-text-secondary);
  }
}
</style>
