<template>
  <ea-card
    class="remote-component-card"
    :class="{ 'is-active': component.enabled !== false }"
    shadow="hover"
  >
    <!-- 卡片头部 -->
    <div slot="header" class="remote-component-card__header">
      <div class="remote-component-card__title-wrap">
        <ea-icon name="crown" size="14" color="white"></ea-icon>
        <span class="remote-component-card__title">{{ component.name }}</span>
      </div>
      <EaSwitch
        :model-value="component.enabled !== false"
        size="small"
        @update:model-value="(val) => $emit('toggle-enabled', component.id, val)"
        @click.stop
      />
    </div>

    <!-- 卡片内容 -->
    <div class="remote-component-card__body">
      <div class="remote-component-card__info">
        <ea-text class="remote-component-card__info-label">类型:</ea-text>
        <ea-text class="remote-component-card__info-value">
          {{ component.type || 'remote-' + component.id }}
        </ea-text>
      </div>
      <div class="remote-component-card__info">
        <ea-text class="remote-component-card__info-label">URL:</ea-text>
        <ea-text class="remote-component-card__info-value url-text" :title="component.url">
          {{ component.url || '未配置' }}
        </ea-text>
      </div>
      <div v-if="component.description" class="remote-component-card__description">
        {{ component.description || '暂无描述' }}
      </div>
    </div>

    <!-- 卡片底部 - 操作按钮 -->
    <div slot="footer" class="remote-component-card__footer">
      <ea-button text size="small" icon="pen-to-square" @click.stop="$emit('edit', component)">
        编辑
      </ea-button>
      <ea-button
        type="danger"
        icon="trash"
        text
        size="small"
        @click.stop="$emit('delete', component.id)"
      >
        删除
      </ea-button>
    </div>
  </ea-card>
</template>

<script setup>
  import EaSwitch from '@/components/ea-ui-wrap/EaSwitch.vue'

  defineProps({
    component: {
      type: Object,
      required: true,
    },
  })

  defineEmits(['edit', 'delete', 'toggle-enabled'])
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(remote-component-card) {
    transition: all 0.2s;

    &.is-active {
      border-color: #8b5cf6;
      background-color: #f5f3ff;
    }

    &::part(header) {
      padding: 0;
    }

    &::part(footer) {
      padding: 0;
    }

    @include e(header) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%);
      min-height: 80px;
    }

    @include e(title-wrap) {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @include e(title) {
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @include e(body) {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    @include e(info) {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;

      &:last-child {
        margin-bottom: 0;
      }
    }

    @include e(info-label) {
      color: #6b7280;
      min-width: 40px;
      margin-right: 0.5rem;
    }

    @include e(info-value) {
      color: #374151;
      font-weight: 500;
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
      justify-content: flex-end;
      gap: 8px;
      padding: 12px 16px;
      border-top: 1px solid #f3f4f6;
    }
  }

  .url-text {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
