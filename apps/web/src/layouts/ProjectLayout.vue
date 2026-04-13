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
            <ea-icon name="layer-group" size="24" color="#409eff"></ea-icon>
            <span class="project-layout__logo-text">EA-LowCode</span>
          </ea-menu-item>
          <ea-menu-item index="projects">
            <ea-icon name="folder-open" size="16"></ea-icon>
            <span>我的项目</span>
          </ea-menu-item>
          <ea-menu-item index="components">
            <ea-icon name="cubes" size="16"></ea-icon>
            <span>组件库</span>
          </ea-menu-item>
          <ea-menu-item index="templates">
            <ea-icon name="clipboard" size="16"></ea-icon>
            <span>模板中心</span>
          </ea-menu-item>
          <ea-menu-item index="cloud">
            <ea-icon name="cloud" size="16"></ea-icon>
            <span>图片云</span>
          </ea-menu-item>
        </ea-menu>

        <!-- 右侧工具 -->
        <div class="project-layout__header-right">
          <ea-button type="text" @click="handleHelp">
            <ea-icon name="circle-question" size="16"></ea-icon>
            <span>帮助文档</span>
          </ea-button>

          <div class="project-layout__user">
            <div class="project-layout__user-trigger" @click="showUserMenu = !showUserMenu">
              <div class="project-layout__avatar">{{ avatarText }}</div>
              <ea-icon name="angle-down" size="12"></ea-icon>
            </div>

            <!-- 用户下拉菜单 -->
            <div v-if="showUserMenu" class="project-layout__user-menu">
              <div class="project-layout__user-menu-item" @click="handleProfile">
                <ea-icon name="user" size="14"></ea-icon>
                <span>个人设置</span>
              </div>
              <div class="project-layout__user-menu-divider"></div>
              <div class="project-layout__user-menu-item" @click="handleLogout">
                <ea-icon name="arrow-right-from-bracket" size="14" color="#f56c6c"></ea-icon>
                <span style="color: #f56c6c">退出登录</span>
              </div>
            </div>
          </div>
        </div>
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

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const showUserMenu = ref(false)

// 当前激活的菜单
const activeMenu = computed(() => {
  const pathMap = {
    '/': 'projects',
    '/components': 'components',
    '/templates': 'templates',
    '/cloud': 'cloud',
  }
  return pathMap[route.path] || 'projects'
})

// 用户头像文字
const avatarText = computed(() => {
  const username = userStore.user?.username
  return username?.charAt(0)?.toUpperCase() || 'U'
})

// 菜单选择
function handleMenuSelect({ detail }) {
  const { index } = detail

  if (index === 'home') {
    router.push('/')
    return
  }

  const routeMap = {
    projects: '/',
    components: '/components',
    templates: '/templates',
    cloud: '/cloud',
  }

  router.push(routeMap[index] || '/')
}

// 帮助文档
function handleHelp() {
  window.open('https://github.com/your-org/ea-low-code/wiki', '_blank')
}

// 个人设置
function handleProfile() {
  showUserMenu.value = false
  window.$message?.info('个人设置功能开发中')
}

// 退出登录
function handleLogout() {
  showUserMenu.value = false
  userStore.logout()
  router.push('/login')
}
</script>

<style lang="scss" scoped>
ea-menu::part(container) {
  padding: 0;
}

.project-layout {
  min-height: 100vh;

  &::part(container) {
    height: 100vh;
  }

  &__header {
    padding: 0;
    border-bottom: 1px solid var(--ea-border-light);

    &-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
    }

    &-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
  }

  &__logo-text {
    font-size: 18px;
    font-weight: 600;
    color: var(--ea-text-primary);
  }

  &__user {
    position: relative;

    &-trigger {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s;

      &:hover {
        background: var(--ea-bg-base);
      }
    }

    &-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      background: #ffffff;
      border-radius: 4px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      min-width: 140px;
      z-index: 1000;

      &-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        font-size: 14px;
        color: var(--ea-text-regular);
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
          background: var(--ea-bg-base);
        }
      }

      &-divider {
        height: 1px;
        background: var(--ea-border-light);
        margin: 4px 0;
      }
    }
  }

  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--ea-primary);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
  }

  &__main {
    padding: 0;
    overflow: hidden;
  }
}
</style>
