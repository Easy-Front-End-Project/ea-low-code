<template>
  <ea-tabs :active="activeTab" class="model-editor-tabs" tab-position="top">
    <ea-tab panel="fields">模型字段</ea-tab>
    <ea-tab-panel name="fields">
      <FieldsPanel
        :fields="fields"
        :loading="loading"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        @add-field="$emit('add-field')"
        @edit-field="$emit('edit-field', $event)"
        @delete-field="$emit('delete-field', $event)"
        @sort-fields="$emit('sort-fields', $event)"
        @page-change="$emit('page-change', $event)"
        @size-change="$emit('size-change', $event)"
        @refresh="$emit('refresh')"
      />
    </ea-tab-panel>

    <ea-tab panel="sortFields">排序字段</ea-tab>
    <ea-tab-panel name="sortFields">
      <SortFieldsPanel
        :all-fields="fields"
        :sort-rules="sortRules"
        @add-sort="handleAddSort"
        @update-sort="handleUpdateSort"
        @delete-sort="handleDeleteSort"
        @refresh="$emit('refresh')"
      />
    </ea-tab-panel>

    <ea-tab panel="dynamicData">模型数据</ea-tab>
    <ea-tab-panel name="dynamicData">
      <DynamicDataPanel v-if="model" :model="model" :fields="fields" />
    </ea-tab-panel>
  </ea-tabs>
</template>

<script setup>
  import { ref } from 'vue'
  import FieldsPanel from './FieldsPanel.vue'
  import SortFieldsPanel from './SortFieldsPanel.vue'
  import DynamicDataPanel from './DynamicDataPanel.vue'

  defineProps({
    model: { type: Object, default: null },
    fields: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    total: { type: Number, default: 0 },
    currentPage: { type: Number, default: 1 },
    pageSize: { type: Number, default: 50 },
    sortRules: { type: Array, default: () => [] },
  })

  const emit = defineEmits([
    'add-field',
    'edit-field',
    'delete-field',
    'sort-fields',
    'page-change',
    'size-change',
    'refresh',
    'add-sort-rule',
    'update-sort-rule',
    'delete-sort-rule',
  ])

  const activeTab = ref('fields')

  function handleAddSort(rule) {
    emit('add-sort-rule', rule)
  }

  function handleUpdateSort(rule) {
    emit('update-sort-rule', rule)
  }

  function handleDeleteSort(rule) {
    emit('delete-sort-rule', rule)
  }
</script>

<style lang="scss" scoped>
  .model-editor-tabs {
    &__placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 300px;
    }
  }
</style>
