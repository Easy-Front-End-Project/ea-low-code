<template>
  <div class="page-settings-panel flex flex-col h-full w-full">
    <!-- 内容区域 -->
    <div class="flex-1 overflow-y-auto p-y-4">
      <!-- 页面元信息 -->
      <div class="settings-section mb-6">
        <h4 class="section-title">页面信息</h4>
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
      <div class="settings-section">
        <h4 class="section-title">页面级组件</h4>
        <div class="space-y-4">
          <!-- 回到顶部设置 -->
          <!-- <div class="component-setting-item">
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium text-gray-700">回到顶部</span>
              <span v-if="isBacktopInherited" class="tag tag-info">继承项目默认</span>
              <span v-else class="tag tag-success">自定义</span>
            </div>

            <div class="inherit-toggle mb-3">
              <EaSwitch v-model="useProjectDefault" size="small" @change="handleInheritChange" />
              <span class="toggle-text">使用项目默认配置</span>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useSchemaStore } from '@/stores/designer/schema'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

  const schemaStore = useSchemaStore()

  // 页面元信息
  const pageMeta = ref({
    title: '',
    description: '',
  })

  // 是否使用项目默认配置
  const useProjectDefault = ref(true)

  // 计算是否继承项目默认
  // const isBacktopInherited = computed(() => {
  //   return useProjectDefault.value
  // })

  // 从 schema 同步页面元信息
  watch(
    () => schemaStore.pageSchema.meta,
    newMeta => {
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
    newSettings => {
      if (newSettings?.backtop && Object.keys(newSettings.backtop).length > 0) {
        useProjectDefault.value = false
      } else {
        useProjectDefault.value = true
      }
    },
    { immediate: true, deep: true }
  )

  // 更新页面元信息
  function updatePageMeta() {
    schemaStore.updatePageMeta({
      title: pageMeta.value.title,
      description: pageMeta.value.description,
    })
  }

  // 处理继承切换
  // function handleInheritChange() {
  //   if (useProjectDefault.value) {
  //     schemaStore.updatePageSettings({ backtop: undefined })
  //   }
  // }
</script>

<style scoped>
  .page-settings-panel {
    background-color: #fff;
  }

  .settings-section {
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .settings-section:last-child {
    border-bottom: none;
  }

  .section-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
  }

  .setting-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .setting-label {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .component-setting-item {
    padding: 0.75rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
  }

  .inherit-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .toggle-text {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .tag {
    display: inline-block;
    padding: 0 0.375rem;
    font-size: 0.625rem;
    line-height: 1.25rem;
    border-radius: 0.25rem;
    font-weight: 500;
  }

  .tag-info {
    background-color: #e6f7ff;
    color: #1890ff;
    border: 1px solid #91d5ff;
  }

  .tag-success {
    background-color: #f6ffed;
    color: #52c41a;
    border: 1px solid #b7eb8f;
  }
</style>
