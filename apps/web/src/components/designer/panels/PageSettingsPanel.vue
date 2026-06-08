<template>
  <div class="page-settings-panel flex flex-col h-full w-full">
    <!-- 内容区域 -->
    <div class="flex-1 overflow-y-auto p-y-4">
      <!-- 页面元信息 -->
      <div class="settings-section mb-6">
        <h4 class="section-title">
          页面信息
          <span v-if="isSaving" class="saving-hint">保存中...</span>
        </h4>
        <div class="space-y-3">
          <div class="setting-item">
            <label class="setting-label">页面标题</label>
            <EaInput v-model="pageMeta.title" size="small" @change="updatePageMeta" />
          </div>
          <div class="setting-item">
            <label class="setting-label">页面描述</label>
            <EaInput
              v-model="pageMeta.description"
              type="textarea"
              :rows="2"
              size="small"
              @change="updatePageMeta"
            />
          </div>
        </div>
      </div>

      <!-- 项目级组件设置 -->
      <!-- <div class="settings-section">
        <h4 class="section-title">页面级组件</h4>
        <div class="space-y-4">
          <div class="component-setting-item">
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium text-gray-700">回到顶部</span>
              <span v-if="isBacktopInherited" class="tag tag-info">继承项目默认</span>
              <span v-else class="tag tag-success">自定义</span>
            </div>

            <div class="inherit-toggle mb-3">
              <EaSwitch v-model="useProjectDefault" size="small" @change="handleInheritChange" />
              <span class="toggle-text">使用项目默认配置</span>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { useSchemaStore } from '@/components/designer/stores/schema'
  import { usePagesStore } from '@/stores/pages'
  import { useRoute } from 'vue-router'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

  interface PageMeta {
    title: string
    description: string
  }

  const schemaStore = useSchemaStore()
  const pagesStore = usePagesStore()
  const route = useRoute()

  const currentPageId = computed(() => route.params.id as string | undefined)
  const isSaving = ref(false)

  // 页面元信息
  const pageMeta = ref<PageMeta>({
    title: '',
    description: '',
  })

  // 是否使用项目默认配置
  const useProjectDefault = ref(true)

  // 从 schema 同步页面元信息
  watch(
    () => schemaStore.pageSchema.meta,
    (newMeta: any) => {
      if (newMeta) {
        pageMeta.value = {
          title: newMeta.title || '',
          description: newMeta.description || '',
        }
      }
    },
    { immediate: true, deep: true }
  )

  // 从 schema 同步页面设置
  watch(
    () => schemaStore.pageSchema.settings,
    (newSettings: any) => {
      if (newSettings?.backtop && Object.keys(newSettings.backtop).length > 0) {
        useProjectDefault.value = false
      } else {
        useProjectDefault.value = true
      }
    },
    { immediate: true, deep: true }
  )

  // 更新页面元信息
  async function updatePageMeta() {
    // 1. 更新本地 schema
    schemaStore.updatePageMeta({
      title: pageMeta.value.title,
      description: pageMeta.value.description,
    })

    // 2. 如果有页面 ID，同步保存到后端
    if (currentPageId.value) {
      isSaving.value = true
      try {
        await pagesStore.updatePage({
          id: Number(currentPageId.value),
          name: pageMeta.value.title,
          description: pageMeta.value.description,
        })
        ;(window as any).$message?.success('页面信息已保存')
      } catch (error: any) {
        ;(window as any).$message?.error('保存失败: ' + (error.message || '未知错误'))
      } finally {
        isSaving.value = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(page-settings-panel) {
    background-color: #fff;
  }

  @include b(settings-section) {
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;

    &:last-child {
      border-bottom: none;
    }
  }

  @include b(section-title) {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  @include b(saving-hint) {
    font-size: 0.75rem;
    font-weight: normal;
    color: #409eff;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: 0.5;
    }
  }

  @include b(setting-item) {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  @include b(setting-label) {
    font-size: 0.75rem;
    color: #6b7280;
  }

  @include b(component-setting-item) {
    padding: 0.75rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
  }

  @include b(inherit-toggle) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  @include b(toggle-text) {
    font-size: 0.75rem;
    color: #6b7280;
  }

  @include b(tag) {
    display: inline-block;
    padding: 0 0.375rem;
    font-size: 0.625rem;
    line-height: 1.25rem;
    border-radius: 0.25rem;
    font-weight: 500;

    @include m(info) {
      background-color: #e6f7ff;
      color: #1890ff;
      border: 1px solid #91d5ff;
    }

    @include m(success) {
      background-color: #f6ffed;
      color: #52c41a;
      border: 1px solid #b7eb8f;
    }
  }
</style>
