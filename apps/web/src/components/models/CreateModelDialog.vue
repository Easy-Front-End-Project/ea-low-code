<template>
  <ea-dialog
    :visible="visible"
    :title="isEdit ? '编辑模型' : '新建模型'"
    width="480px"
    @closed="$emit('update:visible', false)"
  >
    <div class="create-model-dialog">
      <div class="create-model-dialog__form">
        <div class="create-model-dialog__item">
          <label class="create-model-dialog__label"
            ><span class="required">*</span> 模型名称：</label
          >
          <EaInput
            v-model="form.name"
            placeholder="请输入模型名称（2-50字符）"
            :maxlength="50"
          ></EaInput>
        </div>

        <div class="create-model-dialog__item">
          <label class="create-model-dialog__label">描述：</label>
          <EaInput
            v-model="form.description"
            placeholder="请输入模型描述（可选）"
            :maxlength="500"
          ></EaInput>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="create-model-dialog__footer">
        <ea-button @click="handleCancel">取消</ea-button>
        <ea-button type="primary" @click="handleSubmit">确定</ea-button>
      </div>
    </div>
  </ea-dialog>
</template>

<script setup>
  import { ref, reactive, watch } from 'vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

  const props = defineProps({
    visible: { type: Boolean, default: false },
    model: { type: Object, default: null },
  })

  const emit = defineEmits(['update:visible', 'success'])

  const isEdit = ref(false)

  const form = reactive({
    name: '',
    description: '',
  })

  function resetForm() {
    form.name = ''
    form.description = ''
    isEdit.value = false
  }

  watch(
    () => props.visible,
    val => {
      if (val) {
        if (props.model) {
          isEdit.value = true
          form.name = props.model.name || ''
          form.description = props.model.description || ''
        } else {
          resetForm()
        }
      } else {
        resetForm()
      }
    }
  )

  async function handleSubmit() {
    if (!form.name.trim()) {
      window.$message?.warning('请输入模型名称')
      return
    }
    if (form.name.trim().length < 2 || form.name.trim().length > 50) {
      window.$message?.warning('模型名称长度必须在2-50个字符之间')
      return
    }

    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
    }

    if (isEdit.value && props.model) {
      data.id = props.model.id
    }

    emit('success', data)
    emit('update:visible', false)
  }

  function handleCancel() {
    emit('update:visible', false)
  }
</script>

<style lang="scss" scoped>
  .create-model-dialog {
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
