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
  .app-container {
    background-color: #f5f7fa;
  }
</style>
