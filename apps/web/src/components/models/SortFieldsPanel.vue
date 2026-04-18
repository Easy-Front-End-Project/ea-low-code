<template>
  <div class="sort-fields-panel">
    <div class="sort-fields-panel__toolbar">
      <ea-button type="primary" @click="handleAdd">
        <ea-icon name="plus" size="14"></ea-icon>
        <span>新增排序</span>
      </ea-button>
      <div class="sort-fields-panel__toolbar-right">
        <ea-button circle @click="$emit('refresh')">
          <ea-icon name="rotate" size="14"></ea-icon>
        </ea-button>
      </div>
    </div>

    <div class="sort-fields-panel__table">
      <ea-table :data.prop="tableData" stripe border @ea-template-cell-click="handleCellClick">
        <ea-table-column prop="fieldLabel" label="字段描述" min-width="120"></ea-table-column>
        <ea-table-column prop="fieldName" label="字段名" min-width="140"></ea-table-column>
        <ea-table-column
          prop="sortTypeLabel"
          label="排序类型"
          width="100"
          align="center"
        ></ea-table-column>
        <ea-table-column label="操作" width="120" align="center">
          <ea-button text size="small" data-action="edit">编辑</ea-button>
          <ea-button type="danger" text size="small" data-action="delete">删除</ea-button>
        </ea-table-column>
      </ea-table>
    </div>

    <CreateSortDialog
      v-model:visible="showDialog"
      :fields="allFields"
      :sort-rule="editingRule"
      :existing-field-ids="existingFieldIds"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import CreateSortDialog from './CreateSortDialog.vue'

  const props = defineProps({
    fields: { type: Array, default: () => [] },
    allFields: { type: Array, default: () => [] },
    sortRules: { type: Array, default: () => [] },
  })

  const emit = defineEmits(['add-sort', 'update-sort', 'delete-sort', 'refresh'])

  const showDialog = ref(false)
  const editingRule = ref(null)

  const tableData = computed(() => {
    return (props.sortRules || []).map(rule => ({
      fieldLabel: rule.fieldLabel || '',
      fieldName: rule.fieldName || '',
      sortTypeLabel: rule.sortTypeLabel || rule.sortType || '',
      _raw: rule,
    }))
  })

  const existingFieldIds = computed(() => {
    return (props.sortRules || [])
      .filter(r => r !== editingRule.value)
      .map(r => r.fieldId)
      .filter(Boolean)
  })

  function handleAdd() {
    editingRule.value = null
    showDialog.value = true
  }

  async function handleCellClick(e) {
    if (!e?.detail) return
    const { target, rowData } = e.detail
    if (!target || !rowData?._raw) return
    const action = target.getAttribute('data-action')
    const rawRule = rowData._raw
    if (action === 'edit') {
      editingRule.value = rawRule
      showDialog.value = true
    } else if (action === 'delete') {
      try {
        await window.$confirm('确定要删除「' + rawRule.fieldLabel + '」的排序规则吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        emit('delete-sort', rawRule)
      } catch {
        // 用户取消
      }
    }
  }

  function handleSuccess(data) {
    if (editingRule.value) {
      emit('update-sort', Object.assign({}, data, { id: editingRule.value.id }))
    } else {
      emit('add-sort', data)
    }
    showDialog.value = false
    editingRule.value = null
  }
</script>

<style lang="scss" scoped>
  .sort-fields-panel {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
    }

    &__toolbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &__table {
      flex: 1;
      overflow: auto;

      ea-table {
        width: 100%;
      }
    }
  }
</style>
