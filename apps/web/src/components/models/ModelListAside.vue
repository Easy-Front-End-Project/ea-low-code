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

<script setup>
import ModelListItem from './ModelListItem.vue'

defineProps({
  models: { type: Array, default: () => [] },
  selectedId: { type: Number, default: null },
  loading: { type: Boolean, default: false },
})

defineEmits(['select', 'edit', 'delete'])
</script>

<style lang="scss" scoped>
.model-list-aside {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__header {
    padding: 16px;
    font-size: 14px;
    font-weight: 600;
    color: var(--ea-text-primary);
    border-bottom: 1px solid var(--ea-border-light);
  }

  &__list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }

  &__empty {
    padding: 24px 12px;
  }
}
</style>
