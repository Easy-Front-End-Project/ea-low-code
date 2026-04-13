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
    </div>

    <!-- 卡片底部 -->
    <div slot="footer" class="project-card__footer">
      <span class="project-card__time">{{ formatDate(project.createdAt) }}</span>
    </div>
  </ea-card>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    project: {
      type: Object,
      required: true,
    },
  })

  const emit = defineEmits(['card-click', 'settings', 'delete', 'clone'])

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

  function handleCommand({ detail }) {
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

  function formatDate(date) {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day} 创建`
  }
</script>

<style lang="scss" scoped>
  .project-card {
    cursor: pointer;

    &::part(header) {
padding: 0;
    }

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: linear-gradient(135deg, #409eff 0%, #64b5f6 50%, #90caf9 100%);
      min-height: 80px;
    }

    &__title {
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__actions {
      flex-shrink: 0;
      margin-left: 8px;
    }

    &__settings-btn {
      padding: 4px;
      opacity: 0.8;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }

    &__body {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__info {
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

    &__time {
      font-size: 12px;
      color: var(--ea-text-secondary);
    }
  }
</style>
