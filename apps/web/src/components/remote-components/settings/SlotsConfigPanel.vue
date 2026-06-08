<template>
  <div class="slots-config-panel">
    <div class="slots-config-panel__header">
      <span class="text-sm">配置组件的插槽 ({{ slots.length }})</span>
      <ea-button type="primary" size="small" icon="plus" @click="$emit('add')">
        添加插槽
      </ea-button>
    </div>

    <ea-empty v-if="slots.length === 0" description="暂无插槽配置，点击上方按钮添加"></ea-empty>

    <div v-else class="slots-config-panel__list">
      <div v-for="(item, index) in slots" :key="index" class="slots-config-panel__item">
        <div class="slots-config-panel__row">
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

<script setup lang="ts">
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

  interface SlotItem {
    name?: string
    label?: string
    description?: string
  }

  interface Props {
    slots?: SlotItem[]
  }

  withDefaults(defineProps<Props>(), {
    slots: () => [],
  })

  defineEmits<{
    'add': []
    'remove': [index: number]
  }>()
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(slots-config-panel) {
    max-width: 800px;

    @include e(header) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding: 0.875rem 1rem;
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      border-radius: 10px;
      color: white;

      .text-sm {
        color: rgb(255 255 255 / 95%);
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
      background: linear-gradient(145deg, #fff 0%, #f0fdfa 100%);
      border-radius: 12px;
      border: 1px solid #99f6e4;
      box-shadow: 0 2px 8px rgb(79 172 254 / 8%);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgb(79 172 254 / 15%);
        border-color: #5eead4;
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
