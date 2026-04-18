<template>
  <ea-dialog
    :visible="visible"
    :title="isEdit ? '编辑字段' : '新建'"
    width="520px"
    @closed="$emit('update:visible', false)"
  >
    <div class="create-field-dialog">
      <div class="create-field-dialog__form">
        <div class="create-field-dialog__item">
          <label class="create-field-dialog__label"
            ><span class="required">*</span> 字段中文描述：</label
          >
          <EaInput v-model="form.fieldLabel" placeholder="请输入中文描述"></EaInput>
        </div>

        <div class="create-field-dialog__item">
          <label class="create-field-dialog__label"
            ><span class="required">*</span> 字段名称：</label
          >
          <EaInput v-model="form.fieldName" placeholder="请输入字段名" :disabled="isEdit"></EaInput>
        </div>

        <div class="create-field-dialog__item create-field-dialog__item--row">
          <div class="create-field-dialog__switch-item">
            <label>不能为空</label>
            <EaSwitch v-model="form.isNullable"></EaSwitch>
          </div>
        </div>

        <div class="create-field-dialog__item create-field-dialog__item--row">
          <div class="create-field-dialog__switch-item">
            <label>是否唯一</label>
            <EaSwitch v-model="form.isUnique"></EaSwitch>
          </div>
        </div>

        <div class="create-field-dialog__item">
          <label class="create-field-dialog__label">序号：</label>
          <EaInput v-model.number="form.sortOrder" type="number" placeholder="自动排序"></EaInput>
        </div>

        <div class="create-field-dialog__item">
          <label class="create-field-dialog__label"
            ><span class="required">*</span> 字段类型：</label
          >
          <EaSelect v-model="form.fieldType" placeholder="请选择类型">
            <ea-option value="text">文本</ea-option>
            <ea-option value="number">数字</ea-option>
            <ea-option value="date">日期</ea-option>
            <ea-option value="datetime">日期时间</ea-option>
            <ea-option value="boolean">布尔</ea-option>
            <ea-option value="json">JSON</ea-option>
          </EaSelect>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="create-field-dialog__footer">
        <ea-button @click="handleCancel">取消</ea-button>
        <ea-button type="primary" @click="handleSubmit">确定</ea-button>
      </div>
    </div>
  </ea-dialog>
</template>

<script setup>
  import { ref, reactive, watch } from 'vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'
  import EaSwitch from '@/components/ea-ui-wrap/EaSwitch.vue'

  const props = defineProps({
    visible: { type: Boolean, default: false },
    modelId: { type: Number, default: null },
    field: { type: Object, default: null },
  })

  const emit = defineEmits(['update:visible', 'success'])

  const isEdit = ref(false)

  const form = reactive({
    fieldLabel: '',
    fieldName: '',
    fieldType: 'text',
    isNullable: false,
    isUnique: false,
    sortOrder: undefined,
  })

  function resetForm() {
    form.fieldLabel = ''
    form.fieldName = ''
    form.fieldType = 'text'
    form.isNullable = false
    form.isUnique = false
    form.sortOrder = undefined
    isEdit.value = false
  }

  watch(
    () => props.visible,
    val => {
      if (val) {
        if (props.field) {
          isEdit.value = true
          form.fieldLabel = props.field.fieldLabel || ''
          form.fieldName = props.field.fieldName || ''
          form.fieldType = props.field.fieldType || 'text'
          form.isNullable = !(props.field.isNullable ?? false)
          form.isUnique = props.field.isUnique ?? false
          form.sortOrder = props.field.sortOrder ?? undefined
        } else {
          resetForm()
        }
      } else {
        resetForm()
      }
    }
  )

  async function handleSubmit() {
    if (!form.fieldLabel.trim()) {
      window.$message?.warning('请输入字段中文描述')
      return
    }
    if (!form.fieldName.trim()) {
      window.$message?.warning('请输入字段名称')
      return
    }
    if (!form.fieldType) {
      window.$message?.warning('请选择字段类型')
      return
    }

    const data = {
      modelId: props.modelId,
      fieldLabel: form.fieldLabel.trim(),
      fieldName: form.fieldName.trim(),
      fieldType: form.fieldType,
      isNullable: !form.isNullable,
      isUnique: form.isUnique,
      sortOrder: form.sortOrder,
    }

    if (isEdit.value && props.field) {
      data.id = props.field.id
    }

    emit('success', data)
    emit('update:visible', false)
  }

  function handleCancel() {
    emit('update:visible', false)
  }
</script>

<style lang="scss" scoped>
  .create-field-dialog {
    &__form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__item {
      display: flex;
      flex-direction: column;
      gap: 6px;

      &--row {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
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

    &__input-row {
      display: flex;
      align-items: center;
      gap: 8px;

      EaInput {
        flex: 1;
      }
    }

    &__switch-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex: 1;

      label {
        font-size: 13px;
        color: var(--ea-text-regular);
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
