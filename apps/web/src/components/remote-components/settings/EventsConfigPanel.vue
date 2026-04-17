<template>
  <div class="events-config-panel">
    <div class="events-config-panel__header">
      <span class="text-sm">配置组件的事件 ({{ events.length }})</span>
      <ea-button type="primary" size="small" icon="plus" @click="$emit('add')">
        添加事件
      </ea-button>
    </div>

    <ea-empty v-if="events.length === 0" description="暂无事件配置，点击上方按钮添加"></ea-empty>

    <div v-else class="events-config-panel__list">
      <div v-for="(item, index) in events" :key="index" class="events-config-panel__item">
        <div class="events-config-panel__row">
          <EaInput v-model="item.name" placeholder="事件名 (如: click)" size="small" />
          <EaInput v-model="item.label" placeholder="显示名称 (如: 点击事件)" size="small" />
          <ea-button type="danger" text size="small" icon="trash-can" @click="$emit('remove', index)" />
        </div>
        <EaInput
          v-model="item.description"
          placeholder="事件描述 (如: 点击时触发)"
          size="small"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

defineProps({
  events: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['add', 'remove'])
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(events-config-panel) {
    max-width: 800px;

    @include e(header) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding: 0.875rem 1rem;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      border-radius: 10px;
      color: white;

      .text-sm {
        color: rgba(255, 255, 255, 0.95);
        font-weight: 500;
        letter-spacing: 0.3px;
      }
    }

    @include e(list) {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    @include e(item) {
      padding: 1.25rem;
      background: linear-gradient(145deg, #ffffff 0%, #fef2f2 100%);
      border-radius: 12px;
      border: 1px solid #fecaca;
      box-shadow: 0 2px 8px rgba(245, 87, 108, 0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(245, 87, 108, 0.15);
        border-color: #fda4af;
      }
    }

    @include e(row) {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      align-items: center;
      transition: opacity 0.2s ease;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  :deep(.ea-input) {
    flex: 1;
    transition: all 0.25s ease;

    &:focus-within {
      transform: scale(1.01);
    }
  }
</style>
