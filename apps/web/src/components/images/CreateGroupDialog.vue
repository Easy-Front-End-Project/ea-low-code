<template>
  <ea-dialog
    :visible="visible"
    title="新建分组"
    width="480px"
    :close-on-click-modal="false"
    @update:visible="handleVisibleChange"
    @close="handleClose"
  >
    <div class="create-group-dialog">
      <div class="create-group-dialog__form">
        <div class="create-group-dialog__form-item">
          <label class="create-group-dialog__label">
            分组名称 <span class="required">*</span>
          </label>
          <EaInput
            v-model="formData.name"
            placeholder="请输入分组名称（2-50个字符）"
            :maxlength="50"
            show-word-limit
          ></EaInput>
        </div>

        <div class="create-group-dialog__form-item">
          <label class="create-group-dialog__label">分组描述</label>
          <EaInput
            v-model="formData.description"
            placeholder="请输入分组描述（可选，最多200个字符）"
            type="textarea"
            :rows="3"
            :maxlength="200"
            show-word-limit
          ></EaInput>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="create-group-dialog__footer">
        <ea-button @click="handleClose">取消</ea-button>
        <ea-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ submitting ? '创建中...' : '确认创建' }}
        </ea-button>
      </div>
    </div>
  </ea-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { createImageGroup } from '@/api/images'
import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:visible', 'success', 'close'])

const submitting = ref(false)

const formData = reactive({
  name: '',
  description: '',
})

watch(
  () => props.visible,
  val => {
    if (val) {
      resetForm()
    }
  }
)

function handleVisibleChange(val) {
  emit('update:visible', val)
}

async function handleSubmit() {
  if (!formData.name.trim()) {
    window.$message?.warning('请输入分组名称')
    return
  }

  if (formData.name.trim().length < 2) {
    window.$message?.warning('分组名称至少需要2个字符')
    return
  }

  submitting.value = true

  try {
    await createImageGroup({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
    })

    window.$message?.success('创建成功')
    emit('success')
    handleClose()
  } catch (error) {
    console.error('创建分组失败:', error)
    const message = error.response?.data?.message || error.message || '创建失败'
    window.$message?.error(message)
  } finally {
    submitting.value = false
  }
}

function handleClose() {
  emit('update:visible', false)
  emit('close')
  resetForm()
}

function resetForm() {
  formData.name = ''
  formData.description = ''
  submitting.value = false
}
</script>

<style lang="scss" scoped>
.create-group-dialog {
  &__form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__form-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__label {
    font-size: 13px;
    font-weight: 500;
    color: var(--ea-text-primary);

    .required {
      color: #f56c6c;
      margin-left: 2px;
    }
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--ea-border-lighter);
  }
}
</style>
