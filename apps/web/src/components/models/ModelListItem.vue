<template>
  <div
    class="model-list-item"
    :class="{ 'model-list-item--active': isSelected }"
    @click="$emit('select')"
  >
    <div class="model-list-item__body">
      <div class="model-list-item__desc" :title="model.description || model.name">
        {{ model.description || model.name }}
      </div>
      <div class="model-list-item__name">{{ model.name }}</div>
    </div>
    <div class="model-list-item__actions">
      <ea-button text size="small" icon="pen-to-square" title="编辑" @click.stop="$emit('edit', model)">
      </ea-button>
      <ea-button type="danger" text size="small" icon="trash" title="删除" @click.stop="$emit('delete', model)">
      </ea-button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ModelItem {
  id: number
  name: string
  description?: string
}

interface Props {
  model: ModelItem
  isSelected?: boolean
}

withDefaults(defineProps<Props>(), {
  isSelected: false,
})

defineEmits<{
  'select': []
  'edit': [model: ModelItem]
  'delete': [model: ModelItem]
}>()
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/bem.scss';

@include b(model-list-item) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  margin-bottom: 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--ea-fill-light, #f5f7fa);
  }

  @include m(active) {
    background-color: var(--ea-primary-light, #ecf5ff);
    border-left: 3px solid var(--ea-primary, #409eff);
  }

  @include e(body) {
    flex: 1;
    min-width: 0;
  }

  @include e(desc) {
    font-size: 13px;
    color: var(--ea-text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @include e(name) {
    font-size: 11px;
    color: var(--ea-text-secondary);
    margin-top: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: monospace;
  }

  @include e(actions) {
    display: flex;
    align-items: center;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover &__actions {
    opacity: 1;
  }
}
</style>
