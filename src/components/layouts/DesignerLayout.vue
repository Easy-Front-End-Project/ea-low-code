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
        class="bg-white flex flex-col items-center py-4 gap-4 border-0 border-r-1 border-solid border-gray-200"
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

      <ea-main class="flex-1 overflow-hidden">
        <ea-container class="h-full" direction="horizontal">
          <!-- 左侧：组件库/JSON/AI面板区 -->
          <ea-aside
            :width="leftAsideCollapsed ? '0px' : '250px'"
            class="bg-white border-r border-gray-200 relative transition-all duration-300"
          >
            <div v-show="!leftAsideCollapsed" class="h-full">
              <ComponentPanel class="h-full" />
            </div>
            <!-- 左侧切换按钮 -->
            <ea-button
              @click="toggleLeftAside"
              class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-5 h-12 z-10"
              :title="leftAsideCollapsed ? '展开' : '收起'"
            >
              <span class="text-xs text-gray-500">{{ leftAsideCollapsed ? '›' : '‹' }}</span>
            </ea-button>
          </ea-aside>

          <!-- 中间：画布 -->
          <ea-main class="bg-gray-100">
            <CanvasArea class="h-full" />
          </ea-main>

          <!-- 右侧：组件属性配置 -->
          <ea-aside
            :width="rightAsideCollapsed ? '0px' : '320px'"
            class="bg-white border-l border-gray-200 relative transition-all duration-300"
          >
            <div v-show="!rightAsideCollapsed" class="h-full">
              <PropsPanel class="h-full w-full" />
            </div>
            <!-- 右侧切换按钮 -->
            <ea-button
              @click="toggleRightAside"
              class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-5 h-12"
              :title="rightAsideCollapsed ? '展开' : '收起'"
            >
              <span class="text-xs text-gray-500">{{ rightAsideCollapsed ? '‹' : '›' }}</span>
            </ea-button>
          </ea-aside>
        </ea-container>
      </ea-main>
    </ea-container>
  </ea-container>
</template>

<script setup>
  import { ref } from 'vue'
  import Toolbar from './header/Toolbar.vue'
  import ComponentPanel from './material/ComponentPanel.vue'
  import CanvasArea from './canvas/CanvasArea.vue'
  import PropsPanel from './props/PropsPanel.vue'

  // 左侧边栏展开/收起状态
  const leftAsideCollapsed = ref(false)
  // 右侧边栏展开/收起状态
  const rightAsideCollapsed = ref(false)

  // 切换左侧边栏
  function toggleLeftAside() {
    leftAsideCollapsed.value = !leftAsideCollapsed.value
  }

  // 切换右侧边栏
  function toggleRightAside() {
    rightAsideCollapsed.value = !rightAsideCollapsed.value
  }
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

  ea-aside::part(container) {
    align-items: center;
  }

  ea-main::part(container) {
    padding: 0;
  }
</style>
