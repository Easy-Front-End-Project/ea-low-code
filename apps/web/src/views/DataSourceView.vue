<template>
  <div class="data-source-view">
    <ea-page-header>
      <span slot="content" class="text-large font-600">数据源管理</span>
    </ea-page-header>

    <ea-container class="data-source-view__container" direction="vertical">
      <ea-main class="data-source-view__main">
        <ea-empty description="数据源管理功能开发中...">
          <ea-button type="primary" @click="$message?.info('敬请期待')">了解更多</ea-button>
        </ea-empty>
      </ea-main>
    </ea-container>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(data-source-view) {
    height: 100%;
    padding: 1rem;

    &__container {
      margin-top: 1rem;
      height: calc(100% - 80px);
    }

    &__main {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
