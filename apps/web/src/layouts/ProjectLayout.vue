<template>
  <ea-container class="project-layout" direction="vertical">
    <!-- Header 区域 - 使用 ea-header -->
    <ea-header height="64px" class="project-layout__header">
      <div class="project-layout__header-content">
        <!-- 导航菜单 - 使用 ea-menu -->
        <ea-menu
          :default-active="activeMenu"
          mode="horizontal"
          background-color="#ffffff"
          text-color="#606266"
          active-text-color="#409eff"
          @select="handleMenuSelect"
        >
          <ea-menu-item index="home" class="mr-a">
            <EaLogo />
          </ea-menu-item>
          <ea-menu-item index="projects">
            <ea-icon name="folder-open" size="16"></ea-icon>
            <span>我的项目</span>
          </ea-menu-item>
          <ea-menu-item index="components">
            <ea-icon name="cubes" size="16"></ea-icon>
            <span>组件库</span>
          </ea-menu-item>
          <ea-menu-item index="datasources">
            <ea-icon name="database" size="16"></ea-icon>
            <span>数据源管理</span>
          </ea-menu-item>
          <!-- <ea-menu-item index="templates">
            <ea-icon name="clipboard" size="16"></ea-icon>
            <span>模板中心</span>
          </ea-menu-item> -->

          <ea-menu-item index="cloud">
            <ea-icon name="cloud" size="16"></ea-icon>
            <span>图片云</span>
          </ea-menu-item>
          <ea-menu-item index="profile">
            <div class="user-info">
              <ea-avatar size="small">{{ avatarText }}</ea-avatar>
              <span class="user-name"
                >{{ userStore.user?.nickname || userStore.user?.username || '-' }}</span
              >
            </div>
          </ea-menu-item>
          <ea-menu-item index="logout">
            <ea-icon name="arrow-right-from-bracket" size="14" color="#f56c6c"></ea-icon>
            <span style="color: #f56c6c">退出登录</span>
          </ea-menu-item>
        </ea-menu>
      </div>
    </ea-header>

    <!-- 主内容区域 - 子页面自己管理内部布局 -->
    <ea-main class="project-layout__main">
      <router-view />
    </ea-main>
  </ea-container>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user.js'
  import EaLogo from '@/components/common/EaLogo.vue'

  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  // 当前激活的菜单
  const activeMenu = computed(() => {
    const pathMap = {
      '/': 'home',
      '/projects': 'projects',
      '/components': 'components',
      '/datasources': 'datasources',
      '/templates': 'templates',
      '/cloud': 'cloud',
      '/profile': 'profile',
    }
    const exactMatch = pathMap[route.path]
    if (exactMatch) return exactMatch

    if (route.path.startsWith('/components')) return 'components'
    if (route.path.startsWith('/datasources')) return 'datasources'
    if (route.path.startsWith('/projects')) return 'projects'
    if (route.path.startsWith('/templates')) return 'templates'
    if (route.path.startsWith('/cloud')) return 'cloud'
    if (route.path.startsWith('/profile')) return 'profile'

    return 'home'
  })

  // 用户头像文字
  const avatarText = computed(() => {
    const username = userStore.user?.username
    return username?.charAt(0)?.toUpperCase() || 'U'
  })

  // 菜单选择
  function handleMenuSelect({ detail }) {
    const { index } = detail

    if (index === 'logout') {
      userStore.logout()
      router.push('/login')
      return
    }

    const routeMap = {
      home: '/',
      projects: '/projects',
      components: '/components',
      datasources: '/datasources',
      templates: '/templates',
      cloud: '/cloud',
      profile: 'profile',
    }

    if (index === 'projects' && route.params.id) {
      return
    }

    router.push(routeMap[index] || '/')
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  ea-menu {
    width: 100%;

    &::part(container) {
      padding: 0;
    }
  }

  ea-dropdown-menu {
    line-height: normal;
  }

  // Block
  @include b(project-layout) {
    min-height: 100vh;

    &::part(container) {
      height: 100vh;
    }

    // Element (第2级)
    @include e(header) {
      padding: 0;
      border-bottom: 1px solid var(--ea-border-light);

      // 第3级开始用完整类名
      .project-layout__header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100%;
      }

      .project-layout__header-right {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-left: 1rem;
      }
    }

    @include e(logo-text) {
      font-size: 18px;
      font-weight: 600;
      color: var(--ea-text-primary);
    }

    // 用户信息样式
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 8px;

      .user-name {
        margin-left: 0.25rem;
        font-size: 14px;
        color: var(--ea-text-primary);
      }
    }

    @include e(main) {
      padding: 0;
      overflow: hidden;
    }
  }
</style>
