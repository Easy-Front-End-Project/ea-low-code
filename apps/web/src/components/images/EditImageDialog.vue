<template>
  <ea-dialog
    :visible="visible"
    title="编辑图片信息"
    width="480px"
    :close-on-click-modal="false"
    @update:visible="handleVisibleChange"
    @close="handleClose"
  >
    <div class="edit-image-dialog">
      <div class="edit-image-dialog__preview" v-if="image?.url">
        <img :src="imageUrl" :alt="image.alt || image.filename" />
      </div>

      <div class="edit-image-dialog__form">
        <div class="edit-image-dialog__form-item">
          <label class="edit-image-dialog__label">文件名称</label>
          <EaInput
            v-model="formData.filename"
            placeholder="请输入文件名称（将自动保留原扩展名）"
            :maxlength="255"
            show-word-limit
          ></EaInput>
          <span class="edit-image-dialog__hint">提示：如不填写扩展名，将自动保留原始扩展名</span>
        </div>

        <div class="edit-image-dialog__form-item">
          <label class="edit-image-dialog__label">目标分组</label>
          <EaSelect
            v-model="formData.groupId"
            placeholder="选择分组（可选）"
            clearable
            style="width: 100%"
          >
            <ea-option :value="null">不分组</ea-option>
            <ea-option v-for="group in groupOptions" :key="group.id" :value="group.id"
              >{{ group.name }}</ea-option
            >
          </EaSelect>
        </div>

        <div class="edit-image-dialog__form-item">
          <label class="edit-image-dialog__label">图片描述</label>
          <EaInput
            v-model="formData.alt"
            placeholder="输入图片描述（可选）"
            type="textarea"
            :rows="3"
            :maxlength="100"
            show-word-limit
          ></EaInput>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="edit-image-dialog__footer">
        <ea-button @click="handleClose">取消</ea-button>
        <ea-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ submitting ? '保存中...' : '确认保存' }}
        </ea-button>
      </div>
    </div>
  </ea-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref, watch, computed } from 'vue'
  import { updateImage } from '@/api/images'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'

  interface ImageItem {
    id: number
    url?: string
    filename?: string
    groupId?: number | null
    alt?: string
  }

  interface GroupOption {
    id: number
    name: string
  }

  interface Props {
    visible?: boolean
    image?: ImageItem | null
    groupOptions?: GroupOption[]
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    'update:visible': [val: boolean]
    'success': []
    'close': []
  }>()

  const submitting = ref(false)
  const originalExt = ref('')

  const formData = reactive({
    filename: '',
    groupId: undefined as number | undefined,
    alt: '',
  })

  const imageUrl = computed(() => {
    if (!props.image?.url) return ''
    return props.image.url
  })

  watch(
    () => props.visible,
    (val: boolean) => {
      if (val && props.image) {
        initFormData()
      }
    }
  )

  watch(
    () => props.image,
    (newImage: ImageItem | null | undefined) => {
      if (props.visible && newImage) {
        initFormData()
      }
    }
  )

  function handleVisibleChange(val: boolean) {
    emit('update:visible', val)
  }

  function initFormData() {
    const originalFilename = props.image?.filename || ''
    formData.filename = originalFilename
    formData.groupId = props.image?.groupId ?? undefined
    formData.alt = props.image?.alt || ''

    const ext = originalFilename.match(/\.[^.]+$/)
    originalExt.value = ext ? ext[0] : ''
  }

  function ensureExtension(filename: string): string {
    if (!filename) return filename

    const currentExt = filename.match(/\.[^.]+$/)
    if (currentExt) return filename

    if (originalExt.value) {
      return filename + originalExt.value
    }

    return filename
  }

  async function handleSubmit() {
    if (!formData.filename.trim()) {
      window.$message?.warning('请输入文件名称')
      return
    }

    submitting.value = true

    try {
      const finalFilename = ensureExtension(formData.filename.trim())
      await updateImage({
        id: props.image!.id,
        filename: finalFilename,
        groupId: formData.groupId,
        alt: formData.alt.trim(),
      })

      window.$message?.success('保存成功')
      emit('success')
      handleClose()
    } catch (error: any) {
      console.error('更新图片信息失败:', error)
      const message = error.response?.data?.message || error.message || '保存失败'
      window.$message?.error(message)
    } finally {
      submitting.value = false
    }
  }

  function handleClose() {
    emit('update:visible', false)
    emit('close')
  }
</script>

<style lang="scss" scoped>
  @include b(edit-image-dialog) {
    @include e(preview) {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      padding: 16px;
      background-color: #f5f7fa;
      border-radius: 8px;

      img {
        max-width: 100%;
        max-height: 200px;
        object-fit: contain;
        border-radius: 4px;
      }
    }

    @include e(form) {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    @include e(form-item) {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    @include e(label) {
      font-size: 13px;
      font-weight: 500;
      color: var(--ea-text-primary);
    }

    @include e(hint) {
      font-size: 12px;
      color: var(--ea-text-secondary);
      margin-top: 4px;
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
