<template>
  <ea-container class="h-screen w-screen" direction="vertical">
    <!-- 顶部工具栏 -->
    <ea-header height="60px" class="bg-white border-b border-gray-200">
      <Toolbar class="h-full" />
    </ea-header>

    <!-- 主要内容区域 -->
    <ea-container class="h-full">
      <!-- 最左侧：切换按钮 -->
      <ea-aside
        width="48px"
        class="bg-white flex flex-col items-center py-4 gap-2 border-0 border-r-1 border-solid border-gray-200"
      >
        <div
          v-for="item in leftPanelItems"
          :key="item.key"
          :title="item.title"
          class="w-10 h-10 flex items-center justify-center cursor-pointer rounded text-sm font-medium hover:bg-gray-100"
          :class="{'bg-blue-50 text-blue-600': activeLeftPanel === item.key }"
          @click="switchLeftPanel(item.key)"
        >
          {{ item.label }}
        </div>
      </ea-aside>

      <ea-main class="flex-1 overflow-hidden">
        <ea-container class="h-full" direction="horizontal">
          <!-- 左侧：面板区 -->
          <ea-aside
            :width="leftAsideCollapsed ? '0px' : activeLeftPanel === 'json' ? '350px' : '280px'"
            class="bg-white border-r border-gray-200 relative transition-all duration-300"
            :class="{'pb-18':activeLeftPanel === 'json' }"
          >
            <div v-show="!leftAsideCollapsed" class="w-full h-full px-3">
              <!-- 组件面板 -->
              <ComponentPanel v-if="activeLeftPanel === 'components'" class="h-full" />
              <!-- 页面设置面板 -->
              <PageSettingsPanel v-else-if="activeLeftPanel === 'page'" class="h-full" />
              <!-- JSON 面板 -->
              <Suspense v-else-if="activeLeftPanel === 'json'">
                <template #default>
                  <MonacoEditor v-model="jsonContent" language="json" height="100%" />
                </template>
                <template #fallback>
                  <div class="h-full flex flex-col items-center justify-center">
                    <div class="loading-spinner-small"></div>
                    <span class="mt-2 text-sm text-gray-400">加载编辑器...</span>
                  </div>
                </template>
              </Suspense>
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
            :width="rightAsideCollapsed ? '0px' : '430px'"
            class="bg-white border-l border-gray-200 relative transition-all duration-300"
          >
            <div v-show="!rightAsideCollapsed" class="h-full w-full">
              <Suspense>
                <template #default>
                  <PropsPanel class="h-full w-full" />
                </template>
                <template #fallback>
                  <div class="h-full flex flex-col items-center justify-center">
                    <div class="loading-spinner-small"></div>
                    <span class="mt-2 text-sm text-gray-400">加载属性面板...</span>
                  </div>
                </template>
              </Suspense>
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
  import { ref, computed, watch, defineAsyncComponent } from 'vue'
  import { useSchemaStore } from '@/stores/designer/schema'
  import Toolbar from './header/Toolbar.vue'
  import ComponentPanel from './material/ComponentPanel.vue'
  import PageSettingsPanel from './page/PageSettingsPanel.vue'
  import CanvasArea from './canvas/CanvasArea.vue'

  // 异步加载重型组件
  const MonacoEditor = defineAsyncComponent(() => import('@/components/common/MonacoEditor.vue'))
  const PropsPanel = defineAsyncComponent(() => import('./props/PropsPanel.vue'))

  const schemaStore = useSchemaStore()

  // 左侧面板状态
  const activeLeftPanel = ref('components')
  const leftAsideCollapsed = ref(false)

  // 右侧面板状态
  const rightAsideCollapsed = ref(false)

  // 左侧面板配置
  const leftPanelItems = [
    { key: 'components', label: '组件', title: '组件库' },
    { key: 'page', label: '页面', title: '页面设置' },
    { key: 'json', label: 'JSON', title: 'JSON 编辑' },
    // { key: 'ai', label: 'AI', title: 'AI 助手' },
  ]

  // 切换左侧面板
  function switchLeftPanel(key) {
    if (activeLeftPanel.value === key) {
      leftAsideCollapsed.value = !leftAsideCollapsed.value
    } else {
      activeLeftPanel.value = key
      leftAsideCollapsed.value = false
    }
  }

  // 切换左侧折叠
  function toggleLeftAside() {
    leftAsideCollapsed.value = !leftAsideCollapsed.value
  }

  // 切换右侧折叠
  function toggleRightAside() {
    rightAsideCollapsed.value = !rightAsideCollapsed.value
  }

  // JSON 编辑器内容
  const jsonContent = computed({
    get: () => JSON.stringify(schemaStore.pageSchema, null, 2),
    set: val => {
      try {
        const parsed = JSON.parse(val)
        schemaStore.importSchema(parsed)
      } catch (e) {
        // JSON 解析错误，忽略
      }
    },
  })

  // 监听 schema 变化，用于调试
  watch(
    () => schemaStore.pageSchema,
    newVal => {
      console.log('Schema updated:', newVal)
    },
    { deep: true }
  )
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

  /* 小型加载动画 */
  .loading-spinner-small {
    width: 32px;
    height: 32px;
    border: 2px solid #e4e7ed;
    border-top-color: #409eff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
