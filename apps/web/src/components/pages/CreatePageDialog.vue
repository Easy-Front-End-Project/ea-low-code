<template>
  <ea-dialog
    :visible="visible"
    title="创建页面"
    width="500px"
    :close-on-click-modal="false"
    @update:visible="handleVisibleChange"
    @close="handleClose"
  >
    <div class="create-page-dialog">
      <div class="create-page-dialog__form-item">
        <label class="create-page-dialog__label">
          页面名称
          <span class="create-page-dialog__required">*</span>
        </label>
        <EaInput v-model="form.name" placeholder="请输入页面名称" clearable></EaInput>
      </div>

      <div class="create-page-dialog__form-item">
        <label class="create-page-dialog__label">页面描述</label>
        <EaInput
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="请输入页面描述（可选）"
        ></EaInput>
      </div>

      <div class="create-page-dialog__footer">
        <ea-button @click="handleClose">取消</ea-button>
        <ea-button type="primary" :disabled="!canSubmit" :loading="loading" @click="handleSubmit">
          确定创建
        </ea-button>
      </div>
    </div>
  </ea-dialog>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import { usePagesStore } from '@/stores/pages'

  interface Props {
    visible?: boolean
    projectId?: number | string | null
  }

  const props = withDefaults(defineProps<Props>(), {
    visible: false,
    projectId: null,
  })

  const emit = defineEmits<{
    'update:visible': [val: boolean]
  }>()
  const pagesStore = usePagesStore()

  const loading = ref(false)

  const form = ref({
    name: '',
    description: '',
  })

  const canSubmit = computed(() => !!form.value.name.trim())

  function resetForm() {
    form.value = {
      name: '',
      description: '',
    }
  }

  function handleVisibleChange(val: boolean) {
    emit('update:visible', val)
  }

  function handleClose() {
    emit('update:visible', false)
    resetForm()
  }

  async function handleSubmit() {
    if (!canSubmit.value || !props.projectId) return

    loading.value = true
    try {
      await pagesStore.createPage({
        projectId: Number(props.projectId),
        name: form.value.name.trim(),
        description: form.value.description,
      })
      window.$message?.success('创建成功')
      handleClose()
    } catch (error: any) {
      window.$message?.error(error.message || '创建失败')
    } finally {
      loading.value = false
    }
  }

  watch(
    () => props.visible,
    (val: boolean) => {
      if (val) {
        resetForm()
      }
    }
  )
</script>

<style lang="scss" scoped>
  @include b(create-page-dialog) {
    @include e(form-item) {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    @include e(label) {
      display: block;
      font-size: 14px;
      color: var(--ea-text-regular);
      margin-bottom: 8px;
    }

    @include e(required) {
      color: var(--ea-danger);
      margin-left: 4px;
    }

    @include e(footer) {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid var(--ea-border-lighter);
    }
  }
</style>
