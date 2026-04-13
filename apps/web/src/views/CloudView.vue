<template>
  <div class="cloud-view">
    <div class="cloud-view__empty">
      <ea-icon name="cloud" size="64" color="#c0c4cc"></ea-icon>
      <p class="cloud-view__text">图片云功能开发中，敬请期待...</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cloud-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px);

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  &__text {
    font-size: 14px;
    color: var(--ea-text-secondary);
  }
}
</style>
