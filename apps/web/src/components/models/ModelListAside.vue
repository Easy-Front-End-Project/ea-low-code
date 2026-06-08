<template>
  <div class="model-list-aside">
    <div class="model-list-aside__header">模型列表</div>
    <div class="model-list-aside__list">
      <ModelListItem
        v-for="model in models"
        :key="model.id"
        :model="model"
        :is-selected="selectedId === model.id"
        @select="$emit('select', model)"
        @edit="$emit('edit', model)"
        @delete="$emit('delete', model)"
      />
      <div v-if="!models.length && !loading" class="model-list-aside__empty">
        <ea-empty description="暂无模型"></ea-empty>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ModelListItem from './ModelListItem.vue'

interface ModelItem {
  id: number
  name: string
  description?: string
}

interface Props {
  models?: ModelItem[]
  selectedId?: number | null
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  models: () => [],
  selectedId: null,
  loading: false,
})

defineEmits<{
  'select': [model: ModelItem]
  'edit': [model: ModelItem]
  'delete': [model: ModelItem]
}>()
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/bem.scss';

@include b(model-list-aside) {
  display: flex;
  flex-direction: column;
  height: 100%;

  @include e(header) {
    padding: 16px;
    font-size: 14px;
    font-weight: 600;
    color: var(--ea-text-primary);
    border-bottom: 1px solid var(--ea-border-light);
  }

  @include e(list) {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }

  @include e(empty) {
    padding: 24px 12px;
  }
}
</style>
