<template>
  <ea-dialog
    :visible="visible"
    :title="isEdit ? '编辑排序规则' : '新建排序'"
    width="480px"
    @closed="$emit('update:visible', false)"
  >
    <div class="create-sort-dialog">
      <div class="create-sort-dialog__form">
        <div class="create-sort-dialog__item">
          <label class="create-sort-dialog__label"
            ><span class="required">*</span> 字段：</label
          >
          <EaSelect v-model="form.fieldId" placeholder="请选择字段" @change="handleFieldChange">
            <ea-option
              v-for="field in availableFields"
              :key="field.id"
              :value="field.id"
              >{{ field.fieldLabel }}</ea-option
            >
          </EaSelect>
        </div>

        <div class="create-sort-dialog__item">
          <label class="create-sort-dialog__label"
            ><span class="required">*</span> 排序类型：</label
          >
          <EaSelect v-model="form.sortType" placeholder="请选择排序类型">
            <ea-option value="default">默认</ea-option>
            <ea-option value="asc">升序</ea-option>
            <ea-option value="desc">降序</ea-option>
          </EaSelect>
        </div>
      </div>

      <div class="create-sort-dialog__footer">
        <ea-button @click="handleCancel">取消</ea-button>
        <ea-button type="primary" @click="handleSubmit">确定</ea-button>
      </div>
    </div>
  </ea-dialog>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, computed } from 'vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'

  interface FieldItem {
    id: number
    fieldName: string
    fieldLabel: string
  }

  interface SortRule {
    id?: number
    fieldId?: number
    fieldName?: string
    fieldLabel?: string
    sortType?: string
  }

  interface Props {
    visible?: boolean
    fields?: FieldItem[]
    sortRule?: SortRule | null
    existingFieldIds?: number[]
  }

  const props = withDefaults(defineProps<Props>(), {
    fields: () => [],
    sortRule: null,
    existingFieldIds: () => [],
  })

  const emit = defineEmits<{
    'update:visible': [val: boolean]
    'success': [data: Record<string, any>]
  }>()

  const isEdit = ref(false)

  const form = reactive({
    fieldId: undefined as number | undefined,
    fieldName: '',
    fieldLabel: '',
    sortType: 'default',
  })

  const SORT_TYPE_LABELS: Record<string, string> = {
    default: '默认',
    asc: '升序',
    desc: '降序',
  }

  const availableFields = computed(() => {
    if (isEdit.value) return props.fields || []
    const excludeIds = props.existingFieldIds || []
    return (props.fields || []).filter(f => !excludeIds.includes(f.id))
  })

  function resetForm() {
    form.fieldId = undefined
    form.fieldName = ''
    form.fieldLabel = ''
    form.sortType = 'default'
    isEdit.value = false
  }

  function handleFieldChange(fieldId: any) {
    const field = (props.fields || []).find(f => f.id === fieldId)
    if (field) {
      form.fieldName = field.fieldName
      form.fieldLabel = field.fieldLabel
    }
  }

  watch(
    () => props.visible,
    (val: boolean) => {
      if (val) {
        if (props.sortRule) {
          isEdit.value = true
          form.fieldId = props.sortRule.fieldId
          form.fieldName = props.sortRule.fieldName || ''
          form.fieldLabel = props.sortRule.fieldLabel || ''
          form.sortType = props.sortRule.sortType || 'default'
        } else {
          resetForm()
        }
      } else {
        resetForm()
      }
    }
  )

  async function handleSubmit() {
    if (!form.fieldId) {
      window.$message?.warning('请选择字段')
      return
    }
    if (!form.sortType) {
      window.$message?.warning('请选择排序类型')
      return
    }

    const selectedField = (props.fields || []).find(f => f.id === form.fieldId)
    const data: Record<string, any> = {
      fieldId: form.fieldId,
      fieldName: selectedField?.fieldName || form.fieldName,
      fieldLabel: selectedField?.fieldLabel || form.fieldLabel,
      sortType: form.sortType,
      sortTypeLabel: SORT_TYPE_LABELS[form.sortType] || form.sortType,
    }

    emit('success', data)
    emit('update:visible', false)
  }

  function handleCancel() {
    emit('update:visible', false)
  }
</script>

<style lang="scss" scoped>
  .create-sort-dialog {
    &__form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    &__label {
      font-size: 13px;
      color: var(--ea-text-regular);
      font-weight: 500;

      .required {
        color: var(--ea-color-danger, #f56c6c);
        margin-right: 2px;
      }
    }

    &__footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--ea-border-light);
    }
  }
</style>
