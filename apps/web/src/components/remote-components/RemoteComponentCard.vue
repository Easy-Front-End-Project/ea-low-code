<template>
  <ea-card class="remote-component-card" :class="{ 'is-active': component.enabled !== false }">
    <!-- 卡片头部 -->
    <div slot="header" class="remote-component-card__header">
      <div class="remote-component-card__title-wrap">
        <ea-icon :name="'crown'" size="14"></ea-icon>
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
        <ea-text class="remote-component-card__info-value">{{ component.type || 'remote-' + component.id }}</ea-text>
      </div>
      <div class="remote-component-card__info">
        <ea-text class="remote-component-card__info-label">URL:</ea-text>
        <ea-text class="remote-component-card__info-value url-text" :title="component.url">{{ component.url }}</ea-text>
      </div>
      <div v-if="component.styleUrl" class="remote-component-card__info">
        <ea-text class="remote-component-card__info-label">样式:</ea-text>
        <ea-text class="remote-component-card__info-value url-text" :title="component.styleUrl">{{ component.styleUrl }}</ea-text>
      </div>
    </div>

    <!-- 卡片底部 -->
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
  .remote-component-card {
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

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid #f3f4f6;
    }

    &__title-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &__title {
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }

    &__body {
      padding: 12px 16px;
    }

    &__info {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      font-size: 0.75rem;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &__info-label {
      color: #6b7280;
      min-width: 40px;
      margin-right: 0.5rem;
    }

    &__info-value {
      color: #374151;
      font-weight: 500;
    }

    &__footer {
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
