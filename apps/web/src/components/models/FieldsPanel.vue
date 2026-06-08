<template>
  <div class="fields-panel">
    <!-- 工具栏 -->
    <div class="fields-panel__toolbar">
      <ea-button type="primary" @click="$emit('add-field')">
        <ea-icon name="plus" size="14"></ea-icon>
        <span>新增字段</span>
      </ea-button>
      <div class="fields-panel__toolbar-right">
        <ea-button circle @click="$emit('refresh')">
          <ea-icon name="rotate" size="14"></ea-icon>
        </ea-button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="fields-panel__table">
      <ea-table
        ref="tableRef"
        :data.prop="tableData"
        stripe
        border
        @ea-template-cell-click="handleCellClick"
        @ea-table-data-rendered="handleSystemFieldActionVisible"
      >
        <ea-table-column prop="fieldLabel" label="字段描述" min-width="120"></ea-table-column>
        <ea-table-column prop="fieldName" label="字段名" min-width="140"></ea-table-column>
        <ea-table-column prop="fieldTypeLabel" label="字段类型" min-width="80"></ea-table-column>
        <ea-table-column prop="sortOrder" label="序号" width="60" align="center"></ea-table-column>
        <ea-table-column
          prop="nullableLabel"
          label="不能为空"
          width="80"
          align="center"
        ></ea-table-column>
        <ea-table-column
          prop="uniqueLabel"
          label="不能重复"
          width="90"
          align="center"
        ></ea-table-column>
        <ea-table-column label="操作" width="120" align="center">
          <ea-button text size="small" data-action="edit">编辑</ea-button>
          <ea-button type="danger" text size="small" data-action="delete"> 删除 </ea-button>
        </ea-table-column>
      </ea-table>
    </div>

    <!-- 分页 -->
    <div v-if="paginationTotal > 0" class="fields-panel__footer">
      <ea-pagination
        :total="paginationTotal"
        :page-size="pageSize"
        :current-page="currentPage"
        :layout="['total', 'prev', 'pager', 'next']"
        @current-change="$emit('page-change', $event)"
        @size-change="$emit('size-change', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'

  interface FieldItem {
    fieldLabel?: string
    fieldName?: string
    fieldType?: string
    sortOrder?: number
    isNullable?: boolean
    isUnique?: boolean
    isSystem?: boolean
  }

  interface Props {
    fields?: FieldItem[]
    loading?: boolean
    total?: number
    currentPage?: number
    pageSize?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    fields: () => [],
    loading: false,
    total: 0,
    currentPage: 1,
    pageSize: 50,
  })

  const emit = defineEmits<{
    'add-field': []
    'edit-field': [field: FieldItem]
    'delete-field': [field: FieldItem]
    'sort-fields': [event: any]
    'page-change': [page: number]
    'size-change': [size: number]
    'refresh': []
  }>()

  const tableRef = ref<any>(null)

  const FIELD_TYPE_LABELS: Record<string, string> = {
    text: '文本',
    number: '数字',
    date: '日期',
    datetime: '日期时间',
    boolean: '布尔',
    json: 'JSON',
  }

  const tableData = computed(() => {
    return (props.fields || []).map(field => ({
      fieldLabel: field.fieldLabel || '',
      fieldName: field.fieldName || '',
      fieldTypeLabel: FIELD_TYPE_LABELS[field.fieldType || ''] || field.fieldType || '',
      sortOrder: String(field.sortOrder ?? ''),
      nullableLabel: field.isNullable ? '否' : '是',
      uniqueLabel: field.isUnique ? '是' : '否',
      isSystem: !!field.isSystem,
      _raw: field,
    }))
  })

  const paginationTotal = computed(() => {
    return props.total > 0 ? props.total : props.fields.length
  })

  async function handleCellClick(e: CustomEvent) {
    if (!e?.detail) return
    const { target, rowData } = e.detail
    if (!target || !rowData?._raw) return
    const action = target.getAttribute('data-action')
    const rawField: FieldItem = rowData._raw
    if (rawField.isSystem) return
    if (action === 'edit') {
      emit('edit-field', rawField)
    } else if (action === 'delete') {
      try {
        await window.$confirm!(
          `确定要删除字段「${rawField.fieldLabel}」吗？此操作不可撤销。`,
          '提示',
          { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
        )
        emit('delete-field', rawField)
      } catch {
        // 用户取消
      }
    }
  }

  function handleSystemFieldActionVisible() {
    if (!tableRef.value) return

    const tbody = tableRef.value.shadowRoot?.querySelector('tbody')
    if (!tbody) return

    const rows = tbody.querySelectorAll('tr')
    const data = tableRef.value.data || []
    rows.forEach((tr: HTMLTableRowElement, index: number) => {
      const row = data[index]
      if (row?.isSystem) {
        const lastTd = tr.querySelector('td:last-child')
        if (lastTd) {
          lastTd.part.add('is-system')
        }
      }
    })
  }
</script>

<style lang="scss" scoped>
  ea-table {
    width: 100%;

    &::part(is-system) {
      display: none;
    }
  }

  .fields-panel {
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

    &__footer {
      display: flex;
      justify-content: flex-end;
      padding: 16px 0 8px;
      border-top: 1px solid var(--ea-border-light);
    }
  }
</style>
