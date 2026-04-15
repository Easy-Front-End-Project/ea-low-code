<template>
  <ea-card class="page-card" shadow="hover" @click="handleCardClick">
    <div slot="header" class="page-card__header">
      <span class="page-card__title">{{ page.name || `页面 ${page.id}` }}</span>
    </div>

    <div class="page-card__body">
      <p v-if="page.description" class="page-card__description">{{ page.description }}</p>
      <div class="page-card__meta">
        <span class="meta-item">
          <ea-icon name="clock" size="14"></ea-icon>
          {{ formatTime(page.updatedAt) }}
        </span>
      </div>
    </div>

    <div slot="footer" class="page-card__actions">
      <div class="action-btn" @click.stop="handleEdit">
        <ea-icon name="pen-to-square" size="18"></ea-icon>
        <span>编辑</span>
      </div>
      <div class="action-btn" @click.stop="handleClone">
        <ea-icon name="copy" size="18"></ea-icon>
        <span>复制</span>
      </div>
      <div class="action-btn action-btn--danger" @click.stop="handleDelete">
        <ea-icon name="trash" size="18"></ea-icon>
        <span>删除</span>
      </div>
      <div class="action-btn" @click.stop="handlePreview">
        <ea-icon name="globe" size="18"></ea-icon>
        <span>预览</span>
      </div>
    </div>
  </ea-card>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    page: {
      type: Object,
      required: true,
    },
  })

  const emit = defineEmits(['card-click', 'edit', 'clone', 'delete', 'preview'])

  function formatTime(date) {
    if (!date) return ''
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()

    if (diff < 3600000) return '刚刚更新'
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  function handleCardClick() {
    emit('card-click', props.page)
  }

  function handleEdit() {
    emit('edit', props.page)
  }

  function handleClone() {
    emit('clone', props.page)
  }

  function handleDelete() {
    emit('delete', props.page)
  }

  function handlePreview() {
    emit('preview', props.page)
  }
</script>

<style lang="scss" scoped>
  .page-card {
    cursor: pointer;

    &::part(header) {
      padding: 0;
    }

    &::part(footer) {
      padding: 0;
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: linear-gradient(135deg, #409eff 0%, #64b5f6 50%, #90caf9 100%);
      min-height: 60px;
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

    &__tags {
      display: flex;
      gap: 12px;
      margin-left: 16px;
    }

    &__body {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__description {
      font-size: 14px;
      color: var(--ea-text-secondary);
      line-height: 1.5;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin: 0;
    }

    &__meta {
      display: flex;
      align-items: center;
      gap: 16px;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: var(--ea-text-placeholder);
      }
    }

    &__actions {
      display: flex;
      justify-content: space-around;
      padding: 12px 0;
      border-top: 1px solid var(--ea-border-lighter);

      .action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        color: var(--ea-text-secondary);
        transition: color 0.2s;
        padding: 4px 12px;
        border-radius: 4px;

        &:hover {
          color: var(--ea-primary);
          background-color: var(--ea-primary-light);
        }

        &--danger:hover {
          color: var(--ea-danger);
          background-color: #fef0f0;
        }

        span {
          font-size: 12px;
        }
      }
    }
  }

  .status-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.2);
    color: #ffffff;

    ea-icon {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    &--draft {
      --tag-color: #909399;

      ea-icon {
        background-color: #909399;
      }
    }

    &--test {
      --tag-color: #e6a23c;

      ea-icon {
        background-color: #e6a23c;
      }
    }

    &--online {
      --tag-color: #409eff;

      ea-icon {
        background-color: #409eff;
      }
    }
  }
</style>
