<template>
  <div class="slots-config-panel">
    <div class="config-header">
      <span class="text-sm text-gray-500">配置组件的插槽 ({{ slots.length }})</span>
      <ea-button type="primary" size="small" icon="plus" @click="$emit('add')">
        添加插槽
      </ea-button>
    </div>

    <ea-empty v-if="slots.length === 0" description="暂无插槽配置，点击上方按钮添加"></ea-empty>

    <div v-else class="config-list">
      <div v-for="(item, index) in slots" :key="index" class="config-item">
        <div class="config-item-row">
          <EaInput v-model="item.name" placeholder="插槽名 (如: default)" size="small" />
          <EaInput v-model="item.label" placeholder="显示名称 (如: 默认插槽)" size="small" />
          <ea-button
            type="danger"
            text
            size="small"
            icon="trash-can"
            @click="$emit('remove', index)"
          />
        </div>
        <EaInput v-model="item.description" placeholder="插槽描述" size="small" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

  defineProps({
    slots: {
      type: Array,
      default: () => [],
    },
  })

  defineEmits(['add', 'remove'])
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(slots-config-panel) {
    max-width: 800px;

    .config-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .config-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .config-item {
      padding: 0.75rem;
      background-color: #f9fafb;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }

    .config-item-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      align-items: center;
    }
  }

  .config-item-row :deep(.ea-input) {
    flex: 1;
  }
</style>
