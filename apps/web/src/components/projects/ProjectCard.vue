<template>
  <ea-card class="project-card" shadow="hover" @click="handleClick">
    <!-- 卡片头部 - 渐变色 -->
    <div slot="header" class="project-card__header">
      <div class="project-card__title">{{ project.name }}</div>
      <div class="project-card__actions" @click.stop>
        <ea-dropdown @command="handleCommand" placement="bottom-end">
          <ea-button text class="project-card__settings-btn" slot="reference">
            <ea-icon name="gear" size="16" color="#fff"></ea-icon>
          </ea-button>
          <ea-dropdown-menu>
            <ea-dropdown-item command="settings">
              <ea-icon name="gear" size="14"></ea-icon>
              <span>项目设置</span>
            </ea-dropdown-item>
            <ea-dropdown-item command="clone">
              <ea-icon name="copy" size="14"></ea-icon>
              <span>复制项目</span>
            </ea-dropdown-item>
            <ea-dropdown-item divided command="delete">
              <ea-icon name="trash" size="14" color="#f56c6c"></ea-icon>
              <span style="color: #f56c6c">删除项目</span>
            </ea-dropdown-item>
          </ea-dropdown-menu>
        </ea-dropdown>
      </div>
    </div>

    <!-- 卡片内容 -->
    <div class="project-card__body">
      <div class="project-card__info">
        <ea-icon name="user" size="14" color="#909399"></ea-icon>
        <span class="project-card__info-text">{{ userInfo }}</span>
      </div>
      <div class="project-card__info">
        <ea-icon name="file-lines" size="14" color="#909399"></ea-icon>
        <span class="project-card__info-text">{{ project.pageCount || 0 }} 个页面</span>
      </div>
      <div v-if="project.description" class="project-card__description">
        {{ project.description }}
      </div>
    </div>

    <!-- 卡片底部 -->
    <div slot="footer" class="project-card__footer">
      <span class="project-card__time">{{ formatTime(project.updatedAt) }}</span>
    </div>
  </ea-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface ProjectItem {
    name: string
    userName?: string
    userAccount?: string
    pageCount?: number
    description?: string
    updatedAt?: string
  }

  interface Props {
    project: ProjectItem
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    'card-click': []
    'settings': []
    'delete': []
    'clone': []
  }>()

  const userInfo = computed(() => {
    const { userName, userAccount } = props.project

    if (userName && userAccount) {
      return `${userName} | ${userAccount}`
    }
    return userName || userAccount || '未知用户'
  })

  function handleClick() {
    emit('card-click')
  }

  function handleCommand({ detail }: { detail: { command: string } }) {
    switch (detail.command) {
      case 'settings':
        emit('settings')
        break
      case 'delete':
        emit('delete')
        break
      case 'clone':
        emit('clone')
        break
    }
  }

  function formatTime(date?: string): string {
    if (!date) return ''
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()

    // 小于1小时
    if (diff < 3600000) return '刚刚更新'
    // 小于24小时
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前更新`
          // 小于7天
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前更新`

    return d.toLocaleDateString('zh-CN') + ' 更新'
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(project-card) {
    cursor: pointer;

    &::part(header) {
      padding: 0;
    }

    @include e(header) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: linear-gradient(135deg, #409eff 0%, #64b5f6 50%, #90caf9 100%);
      min-height: 80px;
    }

    @include e(title) {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @include e(actions) {
      flex-shrink: 0;
      margin-left: 8px;
    }

    @include e(settings-btn) {
      padding: 4px;
      opacity: 0.8;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }

    @include e(body) {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    @include e(info) {
      display: flex;
      align-items: center;
      gap: 8px;

      &-text {
        font-size: 14px;
        color: var(--ea-text-regular);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    @include e(description) {
      font-size: 12px;
      color: var(--ea-text-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 1.5;
      min-height: 36px;
    }

    @include e(footer) {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    @include e(time) {
      font-size: 12px;
      color: var(--ea-text-secondary);
    }
  }
</style>
