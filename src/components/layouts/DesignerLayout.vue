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

              <MonacoEditor
                v-else-if="activeLeftPanel === 'json'"
                v-model="jsonContent"
                language="json"
                height="100%"
              />

              <!-- AI 面板 -->
              <!-- <div v-else-if="activeLeftPanel === 'ai'" class="h-full p-4">
                <ea-text type="info">AI 助手（待实现）</ea-text>
              </div> -->
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
  import { ref, computed, watch } from 'vue'
  import { useSchemaStore } from '@/stores/designer/schema'
  import Toolbar from './header/Toolbar.vue'
  import ComponentPanel from './material/ComponentPanel.vue'
  import PageSettingsPanel from './page/PageSettingsPanel.vue'
  import CanvasArea from './canvas/CanvasArea.vue'
  import PropsPanel from './props/PropsPanel.vue'
  import MonacoEditor from '@/components/common/MonacoEditor.vue'

  const schemaStore = useSchemaStore()

  // 当前激活的左侧面板
  const activeLeftPanel = ref('components')
  // 左侧边栏展开/收起状态
  const leftAsideCollapsed = ref(false)
  // 右侧边栏展开/收起状态
  const rightAsideCollapsed = ref(false)

  // JSON 编辑器内容 - 从 schema 计算得出
  const jsonContent = computed({
    get: () => JSON.stringify(schemaStore.pageSchema, null, 2),
    set: value => {
      try {
        const parsed = JSON.parse(value)
        schemaStore.importSchema(parsed)
      } catch (e) {
        // JSON 格式错误时不更新
        console.warn('Invalid JSON:', e)
      }
    },
  })

  // 左侧面板配置
  const leftPanelItems = [
    { key: 'components', label: '组件', title: '组件库' },
    { key: 'page', label: '页面', title: '页面设置' },
    { key: 'json', label: 'JSON', title: 'JSON 编辑器' },
    // { key: 'ai', label: 'AI', title: 'AI 助手' },
  ]

  // 切换左侧面板
  function switchLeftPanel(panel) {
    activeLeftPanel.value = panel

    if (leftAsideCollapsed.value) {
      leftAsideCollapsed.value = false
    }
  }

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
