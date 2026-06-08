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

<script setup lang="ts">
  import { ref } from 'vue'
  import FieldsPanel from './FieldsPanel.vue'
  import SortFieldsPanel from './SortFieldsPanel.vue'
  import DynamicDataPanel from './DynamicDataPanel.vue'

  interface Props {
    model?: any
    fields?: any[]
    loading?: boolean
    total?: number
    currentPage?: number
    pageSize?: number
    sortRules?: any[]
  }

  withDefaults(defineProps<Props>(), {
    model: null,
    fields: () => [],
    loading: false,
    total: 0,
    currentPage: 1,
    pageSize: 50,
    sortRules: () => [],
  })

  const emit = defineEmits<{
    'add-field': []
    'edit-field': [field: any]
    'delete-field': [field: any]
    'sort-fields': [event: any]
    'page-change': [page: number]
    'size-change': [size: number]
    'refresh': []
    'add-sort-rule': [rule: any]
    'update-sort-rule': [rule: any]
    'delete-sort-rule': [rule: any]
  }>()

  const activeTab = ref('fields')

  function handleAddSort(rule: any) {
    emit('add-sort-rule', rule)
  }

  function handleUpdateSort(rule: any) {
    emit('update-sort-rule', rule)
  }

  function handleDeleteSort(rule: any) {
    emit('delete-sort-rule', rule)
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(model-editor-tabs) {
    @include e(placeholder) {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 300px;
    }
  }
</style>
