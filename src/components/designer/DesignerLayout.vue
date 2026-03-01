<template>
  <ea-container class="h-screen w-screen">
    <!-- 顶部工具栏 -->
    <ea-header height="60px" class="bg-white border-b border-gray-200">
      <Toolbar class="h-full" />
    </ea-header>

    <!-- 主要内容区域 -->
    <ea-container class="h-full">
      <!-- 最左侧：切换按钮 -->
      <ea-aside
        width="48px"
        class="bg-white flex flex-col items-center py-4 gap-4 border-0 border-r-1 border-solid  border-gray-200"
      >
        <div
          title="组件"
          class="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded text-sm font-medium"
        >
          组件
        </div>
        <div
          title="JSON"
          class="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded text-sm font-medium"
        >
          JSON
        </div>
        <div
          title="AI"
          class="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded text-sm font-medium"
        >
          AI
        </div>
      </ea-aside>

      <ea-main class="flex-1 overflow-hidden ">
        <ea-container class="h-full" direction="horizontal">
          <!-- 左侧：组件库/JSON/AI面板区 -->
          <ea-aside width="250px" class="bg-white border-r border-gray-200">
            <ComponentPanel class="h-full" />
          </ea-aside>

          <!-- 中间：画布 -->
          <ea-main class="bg-gray-100">
            <CanvasArea class="h-full" />
          </ea-main>

          <!-- 右侧：组件属性配置 -->
          <ea-aside width="320px" class="bg-white border-l border-gray-200">
            <PropsPanel class="h-full" />
          </ea-aside>
        </ea-container>
      </ea-main>
    </ea-container>
  </ea-container>
</template>

<script setup>
import Toolbar from './Toolbar.vue'
import ComponentPanel from './ComponentPanel.vue'
import CanvasArea from './CanvasArea.vue'
import PropsPanel from './PropsPanel.vue'
</script>

<style scoped>
ea-container {
  height: 100%;
}

ea-main {
  height: 100%;
}

ea-aside {
  height: 100%;
}

ea-main::part(container) {
  padding: 0;
}
</style>
