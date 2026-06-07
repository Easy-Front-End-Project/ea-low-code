<template>
  <div class="dashboard">
    <!-- 欢迎区域 -->
    <div class="dashboard__welcome">
      <div class="dashboard__welcome-content">
        <h1 class="dashboard__welcome-title">
          <ea-icon name="hand" size="32" color="#f7ba2a"></ea-icon>
          欢迎回来，{{ userStore.user?.nickname || userStore.user?.username || '用户' }}
        </h1>
        <p class="dashboard__welcome-subtitle">开始创建您的下一个精彩项目吧</p>
      </div>
      <ea-button type="primary" size="large" icon="plus" @click="showCreateDialog = true">
        新建项目
      </ea-button>
    </div>

    <!-- 统计区域 -->
    <div class="dashboard__stats">
      <ea-card class="dashboard__stat-card" shadow="hover" @click="goToProjects">
        <ea-statistic :value="stats.projectCount">
          <div slot="title" class="dashboard__stat-title">
            <ea-icon name="folder" size="16" color="#409eff"></ea-icon>
            <span>项目数</span>
          </div>
        </ea-statistic>
      </ea-card>

      <ea-card class="dashboard__stat-card" shadow="hover">
        <ea-statistic :value="stats.pageCount">
          <div slot="title" class="dashboard__stat-title">
            <ea-icon name="file-lines" size="16" color="#67c23a"></ea-icon>
            <span>页面数</span>
          </div>
        </ea-statistic>
      </ea-card>

      <ea-card class="dashboard__stat-card" shadow="hover">
        <ea-statistic :value="stats.componentCount">
          <div slot="title" class="dashboard__stat-title">
            <ea-icon name="puzzle-piece" size="16" color="#e6a23c"></ea-icon>
            <span>组件数</span>
          </div>
        </ea-statistic>
      </ea-card>

      <ea-card class="dashboard__stat-card" shadow="hover">
        <ea-statistic :value="stats.todayActivityCount">
          <div slot="title" class="dashboard__stat-title">
            <ea-icon name="clock" size="16" color="#909399"></ea-icon>
            <span>今日动态数</span>
          </div>
        </ea-statistic>
      </ea-card>
    </div>

    <!-- 中间区域：最近项目 + 快捷操作 -->
    <div class="dashboard__middle">
      <!-- 最近项目 -->
      <ea-card class="dashboard__recent-projects" shadow="never">
        <div slot="header" class="dashboard__section-header">
          <span class="dashboard__section-title">
            <ea-icon name="clock-rotate-left" size="18" color="#409eff"></ea-icon>
            最近项目
          </span>
          <ea-button type="text" @click="goToProjects">
            查看全部
            <ea-icon name="angle-right" size="12"></ea-icon>
          </ea-button>
        </div>

        <ea-empty
          v-if="recentProjects.length === 0"
          description="暂无项目，点击新建按钮创建"
        ></ea-empty>

        <div v-else class="dashboard__project-grid">
          <ProjectCard
            v-for="project in recentProjects"
            :key="project.id"
            :project="project"
            @card-click="() => handleCardClick(project)"
            @settings="() => handleSettings(project)"
            @delete="() => handleDelete(project)"
            @clone="() => handleClone(project)"
          />
        </div>
      </ea-card>

      <!-- 快捷操作 -->
      <ea-card class="dashboard__quick-actions" shadow="never">
        <div slot="header" class="dashboard__section-header">
          <span class="dashboard__section-title">
            <ea-icon name="bolt" size="18" color="#409eff"></ea-icon>
            快捷操作
          </span>
        </div>

        <div class="dashboard__action-list">
          <div class="dashboard__action-item" @click="showCreateDialog = true">
            <div class="dashboard__action-icon dashboard__action-icon--primary">
              <ea-icon name="plus" size="20" color="#fff"></ea-icon>
            </div>
            <span class="dashboard__action-text">新建项目</span>
          </div>

          <div class="dashboard__action-item" @click="goToProjects">
            <div class="dashboard__action-icon dashboard__action-icon--success">
              <ea-icon name="folder-open" size="20" color="#fff"></ea-icon>
            </div>
            <span class="dashboard__action-text">查看全部项目</span>
          </div>

          <div class="dashboard__action-item" @click="goToComponents">
            <div class="dashboard__action-icon dashboard__action-icon--warning">
              <ea-icon name="puzzle-piece" size="20" color="#fff"></ea-icon>
            </div>
            <span class="dashboard__action-text">组件库</span>
          </div>

          <div class="dashboard__action-item" @click="goToTemplates">
            <div class="dashboard__action-icon dashboard__action-icon--info">
              <ea-icon name="layer-group" size="20" color="#fff"></ea-icon>
            </div>
            <span class="dashboard__action-text">模板中心</span>
          </div>
        </div>
      </ea-card>
    </div>

    <!-- 最近动态 -->
    <ea-card class="dashboard__activity" shadow="never">
      <div slot="header" class="dashboard__section-header">
        <span class="dashboard__section-title">
          <ea-icon name="list-ul" size="18" color="#409eff"></ea-icon>
          最近动态
        </span>
      </div>

      <ea-empty v-if="activities.length === 0" description="暂无动态" />

      <div v-else class="dashboard__activity-list">
        <div v-for="(activity, index) in activities" :key="index" class="dashboard__activity-item">
          <div
            class="dashboard__activity-icon"
            :class="`dashboard__activity-icon--${activity.type}`"
          >
            <ea-icon :name="getActivityIcon(activity.type)" size="14" color="#fff"></ea-icon>
          </div>
          <div class="dashboard__activity-content">
            <span class="dashboard__activity-time">{{ activity.time }}</span>
            <span class="dashboard__activity-text">{{ activity.text }}</span>
          </div>
        </div>
      </div>
    </ea-card>

    <!-- 创建项目弹窗 -->
    <CreateProjectDialog v-model:visible="showCreateDialog" @success="handleCreateSuccess" />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'
  import { useProjectsStore } from '@/stores/projects'
  import ProjectCard from '@/components/projects/ProjectCard.vue'
  import CreateProjectDialog from '@/components/projects/CreateProjectDialog.vue'
  import { getDashboardStats, getRecentProjects, getRecentActivities } from '@/api/stats'

  const router = useRouter()
  const userStore = useUserStore()
  const projectsStore = useProjectsStore()
  const showCreateDialog = ref(false)

  // 统计数据
  const stats = ref({
    projectCount: 0,
    pageCount: 0,
    componentCount: 0,
    todayActivityCount: 0,
  })

  // 最近项目
  const recentProjects = ref<any[]>([])

  // 最近动态
  const activities = ref<any[]>([])

  // 获取活动图标
  function getActivityIcon(type: string) {
    const iconMap: Record<string, string> = {
      create: 'plus',
      update: 'pen',
      delete: 'trash',
      clone: 'copy',
    }
    return iconMap[type] || 'circle'
  }

  // 格式化时间
  function formatTime(dateStr: string) {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    // 小于1分钟
    if (diff < 60000) return '刚刚'
    // 小于1小时
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    // 小于24小时
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    // 小于7天
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`

    return date.toLocaleDateString('zh-CN')
  }

  async function fetchDashboardData() {
    // 并行获取统计数据
    try {
      const [statsData, recentProjectsData, activitiesData] = await Promise.all([
        getDashboardStats(),
        getRecentProjects(),
        getRecentActivities(),
      ])

      // 更新统计数据
      stats.value = statsData

      // 更新最近项目
      recentProjects.value = recentProjectsData

      // 更新最近动态
      activities.value = activitiesData.map((activity: any) => ({
        type: activity.type,
        time: formatTime(activity.createdAt),
        text: activity.description,
      }))
    } catch (error: any) {
      console.error('获取仪表盘数据失败:', error)
      window.$message?.error('获取数据失败')
    }
  }

  // 页面加载时获取数据
  onMounted(async () => {
    // 获取用户信息（如果还没有）
    if (!userStore.user) {
      await userStore.fetchProfile()
    }

    fetchDashboardData()
  })

  // 跳转到项目列表
  function goToProjects() {
    router.push('/projects')
  }

  // 跳转到组件库
  function goToComponents() {
    router.push('/components')
  }

  // 跳转到模板中心
  function goToTemplates() {
    router.push('/templates')
  }

  // 点击卡片进入项目设置
  function handleCardClick(project: any) {
    router.push({ name: 'project-settings', params: { id: project.id } })
  }

  // 进入项目设置
  function handleSettings(project: any) {
    router.push({ name: 'project-settings', params: { id: project.id } })
  }

  // 删除项目
  async function handleDelete(project: any) {
    try {
      await projectsStore.remove(project.id)
      window.$message?.success('删除成功')
      projectsStore.fetchProjects()

      fetchDashboardData()
    } catch (error: any) {
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
    fetchDashboardData()
  }
</script>

<style lang="scss" scoped>
  .dashboard {
    padding: 24px;
    max-width: 1440px;
    margin: 0 auto;

    // 欢迎区域
    &__welcome {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      padding: 24px;
      background: linear-gradient(135deg, #409eff 0%, #64b5f6 100%);
      border-radius: 12px;
      color: #fff;

      &-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      &-title {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }

      &-subtitle {
        margin: 0;
        font-size: 14px;
        opacity: 0.9;
      }
    }

    // 统计区域
    &__stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      margin-bottom: 24px;

      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    &__stat-card {
      cursor: pointer;
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-4px);
      }
    }

    &__stat-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: var(--ea-text-secondary);
    }

    // 中间区域
    &__middle {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
      margin-bottom: 24px;

      @media (max-width: 992px) {
        grid-template-columns: 1fr;
      }
    }

    // 区域标题
    &__section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: var(--ea-text-primary);
    }

    &__project-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;

      @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 576px) {
        grid-template-columns: 1fr;
      }
    }

    &__action-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__action-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--ea-fill-light);
      }
    }

    &__action-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 8px;

      &--primary {
        background: linear-gradient(135deg, #409eff 0%, #64b5f6 100%);
      }

      &--success {
        background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
      }

      &--warning {
        background: linear-gradient(135deg, #e6a23c 0%, #ebb563 100%);
      }

      &--info {
        background: linear-gradient(135deg, #909399 0%, #a6a9ad 100%);
      }
    }

    &__action-text {
      font-size: 14px;
      color: var(--ea-text-primary);
    }

    &__activity-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__activity-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      background-color: var(--ea-fill-light);
    }

    &__activity-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      flex-shrink: 0;

      &--create {
        background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
      }

      &--update {
        background: linear-gradient(135deg, #409eff 0%, #64b5f6 100%);
      }

      &--delete {
        background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
      }

      &--clone {
        background: linear-gradient(135deg, #e6a23c 0%, #ebb563 100%);
      }
    }

    &__activity-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    &__activity-time {
      font-size: 12px;
      color: var(--ea-text-secondary);
    }

    &__activity-text {
      font-size: 14px;
      color: var(--ea-text-primary);
    }
  }
</style>
