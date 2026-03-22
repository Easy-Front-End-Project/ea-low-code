<template>
  <div class="app-container h-screen w-screen overflow-hidden">
    <RouterView />
    <!-- 全局弹窗容器 -->
    <GlobalDialogContainer />
  </div>
</template>

<script setup>
  import { RouterView } from 'vue-router'
  import GlobalDialogContainer from '@/components/common/GlobalDialogContainer.vue'
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .app-container {
    background-color: #f5f7fa;
  }
</style>
