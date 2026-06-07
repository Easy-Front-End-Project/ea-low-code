<template>
  <ea-container class="project-view" direction="vertical">
    <!-- 搜索栏 - 固定在 header -->
    <ea-header height="auto" class="project-view__header">
      <ProjectSearchBar
        v-model:keyword="projectsStore.keyword"
        @search="handleSearch"
        @create="showCreateDialog = true"
        @refresh="handleRefresh"
      />
    </ea-header>

    <!-- 主内容区域 - 可滚动 -->
    <ea-main class="project-view__main">
      <Loading :loading="projectsStore.loading" text="加载中...">
        <!-- 空状态 -->
        <div v-if="!projectsStore.hasProjects" class="project-view__empty">
          <div class="project-view__empty-content">
            <ea-icon name="folder-open" size="64" color="#c0c4cc"></ea-icon>
            <p>暂无项目，点击新建按钮创建</p>
          </div>
        </div>

        <!-- 项目列表 -->
        <div v-else class="project-view__grid">
          <ProjectCard
            v-for="project in projectsStore.projects"
            :key="project.id"
            :project="project"
            @card-click="handleCardClick(project)"
            @settings="handleSettings(project)"
            @delete="handleDelete(project)"
            @clone="handleClone(project)"
          />
        </div>
      </Loading>

      <!-- 创建项目弹窗 -->
      <CreateProjectDialog v-model:visible="showCreateDialog" @success="handleCreateSuccess" />
    </ea-main>

    <!-- 分页 - 固定在 footer -->
    <ea-footer v-if="!projectsStore.loading && projectsStore.hasProjects" height="64px" class="project-view__footer">
      <div class="project-view__pagination">
        <ea-pagination
          :total="projectsStore.total"
          :page-size="projectsStore.pageSize"
          :current-page="projectsStore.currentPage"
          :layout="['total', 'prev', 'pager', 'next']"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </ea-footer>
  </ea-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import ProjectSearchBar from '@/components/projects/ProjectSearchBar.vue'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import CreateProjectDialog from '@/components/projects/CreateProjectDialog.vue'
import Loading from '@/components/common/Loading.vue'

const router = useRouter()
const projectsStore = useProjectsStore()
const showCreateDialog = ref(false)

// 页面加载时获取项目列表
onMounted(() => {
  projectsStore.fetchProjects()
})

// 搜索
function handleSearch() {
  projectsStore.setPage(1)
  projectsStore.fetchProjects()
}

// 刷新
function handleRefresh() {
  projectsStore.fetchProjects()
}

// 页码变化
function handlePageChange(page: number) {
  projectsStore.setPage(page)
  projectsStore.fetchProjects()
}

// 每页条数变化
function handleSizeChange(size) {
  projectsStore.setPageSize(size)
  projectsStore.fetchProjects()
}

// 点击卡片进入项目设置
function handleCardClick(project) {
  router.push({ name: 'project-settings', params: { id: project.id } })
}

// 进入项目设置页
function handleSettings(project) {
  router.push({ name: 'project-settings', params: { id: project.id } })
}

// 删除项目
async function handleDelete(project) {
  try {
    await projectsStore.remove(project.id)
    window.$message?.success('删除成功')
    projectsStore.fetchProjects()
  } catch (error) {
    window.$message?.error(error.message || '删除失败')
  }
}

// 复制项目
async function handleClone(project: any) {
  try {
    await projectsStore.clone(project.id)
    window.$message?.success('复制成功')
    projectsStore.fetchProjects()
  } catch (error: any) {
    window.$message?.error(error.message || '复制失败')
  }
}

// 创建成功回调
function handleCreateSuccess() {
  projectsStore.fetchProjects()
}
</script>

<style lang="scss" scoped>
.project-view {
  height: 100%;

  &__header {
    padding: 0;
  }

  &__main {
    padding: 12px 0;
    overflow-y: auto;
  }

  &__empty {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;

    &-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;

      p {
        font-size: 14px;
        color: var(--ea-text-secondary);
      }
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    max-width: 1440px;
    margin: 0 auto;
  }

  &__footer {
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-top: 1px solid var(--ea-border-light);
  }

  &__pagination {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
