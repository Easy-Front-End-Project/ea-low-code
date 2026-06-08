<template>
  <ea-container class="h-screen w-screen" direction="vertical">
    <!-- 顶部工具栏 -->
    <ea-header v-show="!isPreviewMode" height="60px" class="designer-layout__header">
      <Toolbar class="designer-layout__toolbar" />
    </ea-header>

    <!-- 主要内容区域 -->
    <ea-container v-show="!isPreviewMode" class="h-full">
      <!-- 最左侧：切换按钮 -->
      <ea-aside width="48px" class="designer-layout__sidebar">
        <div
          v-for="item in leftPanelItems"
          :key="item.key"
          :title="item.title"
          class="designer-layout__sidebar-item"
          :class="{ 'designer-layout__sidebar-item--active': activeLeftPanel === item.key }"
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
            class="designer-layout__panel"
            :class="{ 'designer-layout__panel--json': activeLeftPanel === 'json' }"
          >
            <div v-show="!leftAsideCollapsed" class="designer-layout__panel-content">
              <ComponentPanel v-if="activeLeftPanel === 'components'" class="h-full" />
              <RemoteComponentPanel v-else-if="activeLeftPanel === 'remote'" class="h-full" />
              <PageSettingsPanel v-else-if="activeLeftPanel === 'page'" class="h-full" />
              <JsonEditorPanel v-else-if="activeLeftPanel === 'json'" class="h-full" />
            </div>
            <ea-button
              @click="toggleLeftAside"
              class="designer-layout__toggle-btn designer-layout__toggle-btn--left"
              :title="leftAsideCollapsed ? '展开' : '收起'"
            >
              <span class="designer-layout__toggle-btn-icon"
                >{{ leftAsideCollapsed ? '›' : '‹' }}</span
              >
            </ea-button>
          </ea-aside>

          <!-- 中间：画布 -->
          <ea-main class="designer-layout__canvas relative">
            <CanvasArea class="h-full" />
          </ea-main>

          <!-- 右侧：组件属性配置 -->
          <ea-aside
            :width="rightAsideCollapsed ? '0px' : '430px'"
            class="designer-layout__panel designer-layout__panel--right"
          >
            <div v-show="!rightAsideCollapsed" class="h-full w-full">
              <keep-alive>
                <Suspense>
                  <template #default>
                    <PropsPanel class="h-full w-full" />
                  </template>
                  <template #fallback>
                    <Loading loading text="加载属性面板..." />
                  </template>
                </Suspense>
              </keep-alive>
            </div>
            <ea-button
              @click="toggleRightAside"
              class="designer-layout__toggle-btn designer-layout__toggle-btn--right"
              :title="rightAsideCollapsed ? '展开' : '收起'"
            >
              <span class="designer-layout__toggle-btn-icon"
                >{{ rightAsideCollapsed ? '‹' : '›' }}</span
              >
            </ea-button>
          </ea-aside>
        </ea-container>
      </ea-main>
    </ea-container>

    <!-- 预览模式 -->
    <PreviewMode v-if="isPreviewMode" @close="schemaStore.setPreviewMode(false)" />
  </ea-container>
</template>

<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue'
  import { useSchemaStore } from '@/components/designer/stores/schema'
  import Toolbar from './header/Toolbar.vue'
  import ComponentPanel from './panels/ComponentPanel.vue'
  import PageSettingsPanel from './panels/PageSettingsPanel.vue'
  import JsonEditorPanel from './panels/JsonEditorPanel.vue'
  import RemoteComponentPanel from './panels/RemoteComponentPanel.vue'
  import CanvasArea from './canvas/CanvasArea.vue'
  import PreviewMode from './preview/PreviewMode.vue'
  import Loading from '@/components/common/Loading.vue'

  const PropsPanel = defineAsyncComponent(() => import('./props/PropsPanel.vue'))

  const schemaStore = useSchemaStore()
  const isPreviewMode = computed(() => schemaStore.isPreviewMode)

  const activeLeftPanel = ref('components')
  const leftAsideCollapsed = ref(false)
  const rightAsideCollapsed = ref(false)

  interface LeftPanelItem {
    key: string
    label: string
    title: string
  }

  const leftPanelItems: LeftPanelItem[] = [
    { key: 'components', label: '组件', title: '组件库' },
    { key: 'remote', label: '远程', title: '远程组件' },
    { key: 'page', label: '页面', title: '页面设置' },
    { key: 'json', label: 'JSON', title: 'JSON 编辑' },
  ]

  function switchLeftPanel(key: string) {
    if (activeLeftPanel.value === key) {
      leftAsideCollapsed.value = !leftAsideCollapsed.value
    } else {
      activeLeftPanel.value = key
      leftAsideCollapsed.value = false
    }
  }

  function toggleLeftAside() {
    leftAsideCollapsed.value = !leftAsideCollapsed.value
  }

  function toggleRightAside() {
    rightAsideCollapsed.value = !rightAsideCollapsed.value
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(designer-layout) {
    height: 100vh;
    width: 100vw;

    @include e(header) {
      background-color: #fff;
      border-bottom: 1px solid #e5e7eb;
    }

    @include e(toolbar) {
      height: 100%;
    }

    @include e(sidebar) {
      background-color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem 0;
      gap: 0.5rem;
      border-right: 1px solid #e5e7eb;
    }

    @include e(sidebar-item) {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      font-weight: 500;

      &:hover {
        background-color: #f3f4f6;
      }

      @include m(active) {
        background-color: #eff6ff;
        color: #2563eb;
      }
    }

    @include e(panel) {
      background-color: #fff;
      border-right: 1px solid #e5e7eb;
      position: relative;
      transition: all 0.3s;

      @include m(right) {
        border-right: none;
        border-left: 1px solid #e5e7eb;
      }

      @include m(json) {
        padding-bottom: 4.5rem;
      }
    }

    @include e(panel-content) {
      width: 100%;
      height: 100%;
      padding: 0 0.75rem;
    }

    @include e(toggle-btn) {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 1.25rem;
      height: 3rem;
      z-index: 10;

      @include m(left) {
        right: 0;
        transform: translate(100%, -50%);
      }

      @include m(right) {
        left: 0;
        transform: translate(-100%, -50%);
      }
    }

    @include e(toggle-btn-icon) {
      font-size: 0.75rem;
      color: #6b7280;
    }

    @include e(canvas) {
      background-color: #f3f4f6;
    }

    @include e(props) {
      background-color: #fff;
      border-left: 1px solid #e5e7eb;
    }
  }

  :deep(ea-container) {
    height: 100%;
  }

  :deep(ea-main) {
    height: 100%;

    &::part(container) {
      padding: 0;
    }
  }

  :deep(ea-aside) {
    height: 100%;

    &::part(container) {
      align-items: center;
    }
  }
</style>
