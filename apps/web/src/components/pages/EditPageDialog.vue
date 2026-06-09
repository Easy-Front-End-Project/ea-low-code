<template>
  <ea-dialog
    :visible="visible"
    title="编辑页面"
    width="500px"
    :close-on-click-modal="false"
    @update:visible="handleVisibleChange"
    @close="handleClose"
  >
    <div class="edit-page-dialog">
      <div class="edit-page-dialog__form-item">
        <label class="edit-page-dialog__label">
          名称
          <span class="edit-page-dialog__required">*</span>
        </label>
        <EaInput
          v-model="form.name"
          placeholder="请输入名称"
          clearable
          show-word-limit
          :maxlength="15"
        ></EaInput>
      </div>

      <div class="edit-page-dialog__form-item">
        <label class="edit-page-dialog__label">描述</label>
        <EaInput
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入描述"
          show-word-limit
          :maxlength="100"
        ></EaInput>
      </div>

      <div class="edit-page-dialog__footer">
        <ea-button @click="handleClose">取消</ea-button>
        <ea-button type="primary" :disabled="!canSubmit" :loading="loading" @click="handleSubmit">
          确定
        </ea-button>
      </div>
    </div>
  </ea-dialog>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import { usePagesStore } from '@/stores/pages'

  interface PageItem {
    id?: number
    name?: string
    description?: string
  }

  interface Props {
    visible?: boolean
    page?: PageItem | null
  }

  const props = withDefaults(defineProps<Props>(), {
    visible: false,
    page: null,
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

  function initForm() {
    if (props.page) {
      form.value = {
        name: props.page.name || '',
        description: props.page.description || '',
      }
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
    if (!canSubmit.value || !props.page?.id) return

    loading.value = true
    try {
      await pagesStore.updatePage({
        id: props.page.id,
        name: form.value.name.trim(),
        description: form.value.description,
      })
      window.$message?.success('更新成功')
      handleClose()
    } catch (error: any) {
      window.$message?.error(error.message || '更新失败')
    } finally {
      loading.value = false
    }
  }

  watch(
    () => props.visible,
    (val: boolean) => {
      if (val) {
        initForm()
      }
    }
  )

  watch(
    () => props.page,
    (val: PageItem | null | undefined) => {
      if (val && props.visible) {
        initForm()
      }
    },
    { immediate: true }
  )
</script>

<style lang="scss" scoped>
  @include b(edit-page-dialog) {
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
