<template>
  <div class="project-settings-view">
    <div class="project-settings-view__container">
      <!-- 左侧菜单 -->
      <div class="project-settings-view__sidebar">
        <div class="project-settings-view__menu">
          <div
            v-for="item in menuItems"
            :key="item.key"
            :class="['project-settings-view__menu-item', { 'is-active': activeMenu === item.key }]"
            @click="activeMenu = item.key"
          >
            <ea-icon :name="item.icon" size="16"></ea-icon>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="project-settings-view__main">
        <div class="project-settings-view__header">
          <h2 class="project-settings-view__title">{{ currentMenuItem?.label }}</h2>
          <ea-button type="primary" @click="handleSave">保存设置</ea-button>
        </div>

        <div class="project-settings-view__body">
          <!-- 基础设置 -->
          <template v-if="activeMenu === 'basic'">
            <div class="project-settings-view__form">
              <div class="project-settings-view__form-item">
                <label class="project-settings-view__label">
                  项目名称
                  <span class="project-settings-view__required">*</span>
                </label>
                <ea-input v-model="form.name" placeholder="请输入项目名称"></ea-input>
              </div>
              <div class="project-settings-view__form-item">
                <label class="project-settings-view__label">项目描述</label>
                <ea-input
                  v-model="form.description"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入项目描述"
                ></ea-input>
              </div>
            </div>
          </template>

          <!-- 其他菜单项 -->
          <template v-else>
            <div class="project-settings-view__placeholder">
              <ea-icon name="screwdriver-wrench" size="48" color="#c0c4cc"></ea-icon>
              <p>{{ currentMenuItem?.label }}功能开发中...</p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProjectDetail, updateProject } from '@/api/projects.js'

const route = useRoute()

const projectId = computed(() => route.params.id)
const activeMenu = ref('basic')
const loading = ref(false)
const saving = ref(false)

const form = ref({
  name: '',
  description: '',
})

const menuItems = [
  { key: 'basic', label: '基础设置', icon: 'gear' },
  { key: 'pages', label: '页面管理', icon: 'file-lines' },
  { key: 'members', label: '成员管理', icon: 'users' },
  { key: 'export', label: '导入导出', icon: 'file-export' },
]

const currentMenuItem = computed(() => menuItems.find((item) => item.key === activeMenu.value))

onMounted(async () => {
  if (projectId.value) {
    loading.value = true
    try {
      const project = await getProjectDetail(projectId.value)
      form.value.name = project.name || ''
      form.value.description = project.description || ''
    } catch (error) {
      window.$message?.error('获取项目详情失败')
    } finally {
      loading.value = false
    }
  }
})

async function handleSave() {
  if (!form.value.name.trim()) {
    window.$message?.warning('请输入项目名称')
    return
  }

  saving.value = true
  try {
    await updateProject({
      id: projectId.value,
      name: form.value.name.trim(),
      description: form.value.description,
    })
    window.$message?.success('保存成功')
  } catch (error) {
    window.$message?.error(error.message || '保存失败')
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
.project-settings-view {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;

  &__container {
    display: flex;
    gap: 24px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    min-height: calc(100vh - 112px);
  }

  &__sidebar {
    width: 200px;
    padding: 16px 0;
    border-right: 1px solid var(--ea-border-lighter);
  }

  &__menu {
    &-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      font-size: 14px;
      color: var(--ea-text-regular);
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        color: var(--ea-primary);
        background: var(--ea-primary-light);
      }

      &.is-active {
        color: var(--ea-primary);
        background: var(--ea-primary-light);
        border-right: 2px solid var(--ea-primary);
      }
    }
  }

  &__main {
    flex: 1;
    padding: 24px;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--ea-border-lighter);
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    color: var(--ea-text-primary);
  }

  &__form {
    max-width: 480px;

    &-item {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &__label {
    display: block;
    font-size: 14px;
    color: var(--ea-text-regular);
    margin-bottom: 8px;
  }

  &__required {
    color: var(--ea-danger);
    margin-left: 4px;
  }

  &__placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 48px 0;

    p {
      font-size: 14px;
      color: var(--ea-text-secondary);
    }
  }
}
</style>
