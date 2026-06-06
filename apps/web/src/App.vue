<template>
  <div class="app-container h-screen w-screen overflow-hidden">
    <RouterView />
    <!-- 全局弹窗容器 -->
    <GlobalDialogContainer />
  </div>
</template>

<script setup>
  import { RouterView } from 'vue-router'
  import GlobalDialogContainer from '@/components/designer/common/GlobalDialogContainer.vue'
</script>

<style></style>
