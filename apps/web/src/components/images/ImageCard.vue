<template>
  <ea-card class="image-card" shadow="hover" @click="handlePreview">
    <!-- 卡片头部 - 图片预览区 -->
    <div slot="header" class="image-card__header">
      <div class="image-card__preview">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          :alt="image.alt || image.filename"
          class="image-card__img"
        />
        <ea-icon v-else name="image" size="48" color="#c0c4cc"></ea-icon>
      </div>
    </div>

    <!-- 卡片内容 -->
    <div class="image-card__body">
      <div class="image-card__info">
        <ea-icon name="file-image" size="14" color="#909399"></ea-icon>
        <span class="image-card__info-text" :title="image.filename">{{ image.filename }}</span>
      </div>
      <div class="image-card__info">
        <ea-icon name="folder" size="14" color="#909399"></ea-icon>
        <span class="image-card__info-text">{{ groupName }}</span>
        <ea-icon name="hard-drive" size="14" color="#909399" style="margin-left: 12px"></ea-icon>
        <span class="image-card__info-text">{{ formatSize(image.size) }}</span>
      </div>
      <div class="image-card__info">
        <ea-icon name="file-code" size="14" color="#909399"></ea-icon>
        <span class="image-card__info-text">{{ formatMimeType(image.mimeType) }}</span>
      </div>
      <div v-if="image.alt" class="image-card__description">{{ image.alt }}</div>
    </div>

    <!-- 卡片底部 - 操作按钮 -->
    <div slot="footer" class="image-card__footer">
      <span class="image-card__time">{{ formatTime(image.createdAt) }}</span>
      <div class="image-card__actions">
        <ea-button text size="small" icon="download" @click.stop="$emit('download', image)">
          下载
        </ea-button>
        <ea-button text size="small" icon="pen-to-square" @click.stop="$emit('edit', image)">
          编辑
        </ea-button>
        <ea-button
          type="danger"
          icon="trash"
          text
          size="small"
          @click.stop="$emit('delete', image)"
        >
          删除
        </ea-button>
      </div>
    </div>
  </ea-card>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    image: {
      type: Object,
      required: true,
    },
  })

  defineEmits(['preview', 'download', 'edit', 'delete'])

  const imageUrl = computed(() => {
    if (!props.image.url) return ''
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    return `${baseUrl}${props.image.url}`
  })

  const groupName = computed(() => {
    return props.image.group?.name || '未分组'
  })

  function handlePreview() {
    // 预览逻辑由父组件处理
  }

  function formatSize(bytes) {
    if (!bytes) return '0 B'
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  function formatMimeType(mimeType) {
    if (!mimeType) return '未知'
    const map = {
      'image/jpeg': 'JPEG',
      'image/png': 'PNG',
      'image/gif': 'GIF',
      'image/webp': 'WebP',
      'image/svg+xml': 'SVG',
    }
    return map[mimeType] || mimeType.split('/')[1]?.toUpperCase() || mimeType
  }

  function formatTime(date) {
    if (!date) return ''
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()

    if (diff < 3600000) return '刚刚上传'
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前上传`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前上传`

    return d.toLocaleDateString('zh-CN') + ' 上传'
  }
</script>

<style lang="scss" scoped>
  .image-card {
    cursor: pointer;

    &::part(header) {
      padding: 0;
    }

    &::part(container) {
      display: flex;
      flex-direction: column;
    }

    &::part(content) {
      flex: 1;
    }

    &__header {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      min-height: 180px;
      overflow: hidden;
    }

    &__preview {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    &__img {
      max-width: 100%;
      max-height: 160px;
      object-fit: contain;
      border-radius: 4px;
    }

    &__body {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    &__info {
      display: flex;
      align-items: center;
      gap: 6px;

      &-text {
        font-size: 13px;
        color: var(--ea-text-regular);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    &__description {
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

    &__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__time {
      font-size: 12px;
      color: var(--ea-text-secondary);
    }

    &__actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
</style>
