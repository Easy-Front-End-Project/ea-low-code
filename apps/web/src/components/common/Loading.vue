<template>
  <div class="loading-wrapper">
    <!-- 内容插槽 -->
    <div class="loading-wrapper__content" :class="{ 'is-loading': loading }">
      <slot />
    </div>

    <!-- 加载遮罩层 -->
    <div v-show="loading" class="loading-wrapper__overlay">
      <div class="loading-wrapper__spinner"></div>
      <p v-if="text" class="loading-wrapper__text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{
    loading?: boolean
    text?: string
  }>(), {
    loading: false,
    text: '加载中...',
  })
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(loading-wrapper) {
    position: relative;
    height: 100%;

    @include e(content) {
      height: 100%;

      @include when(loading) {
        pointer-events: none;
      }
    }

    @include e(overlay) {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background-color: rgb(255 255 255 / 95%);
      z-index: 100;

      &[style*='display: none'] {
        pointer-events: none;
      }
    }

    @include e(spinner) {
      width: 40px;
      height: 40px;
      border: 3px solid var(--ea-border-light);
      border-top-color: var(--ea-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @include e(text) {
      font-size: 14px;
      color: var(--ea-text-secondary);
      margin: 0;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
