<template>
  <ea-dialog
    :visible="visible"
    title="上传图片"
    width="560px"
    :close-on-click-modal="false"
    @update:visible="handleVisibleChange"
    @close="handleClose"
  >
    <div class="upload-image-dialog">
      <!-- 文件选择区域 -->
      <div
        class="upload-image-dialog__dropzone"
        :class="{ 'is-dragover': isDragOver }"
        @click="triggerFileInput"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <input
          ref="fileInputRef"
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
          multiple
          style="display: none"
          @change="handleFileChange"
        />
        <ea-icon name="cloud-arrow-up" size="48" color="#c0c4cc"></ea-icon>
        <p class="upload-image-dialog__text">
          将图片拖到此处，或<span class="upload-image-dialog__link">点击选择</span>
        </p>
        <p class="upload-image-dialog__hint">
          支持 JPG、PNG、GIF、WebP、SVG 格式，单文件不超过 10MB
        </p>
      </div>

      <!-- 已选文件列表 -->
      <div v-if="selectedFiles.length > 0" class="upload-image-dialog__file-list">
        <div
          v-for="(item, index) in selectedFiles"
          :key="index"
          class="upload-image-dialog__file-item"
        >
          <div class="upload-image-dialog__file-preview">
            <img v-if="item.preview" :src="item.preview" alt="" />
            <ea-icon v-else name="image" size="32" color="#c0c4cc"></ea-icon>
          </div>
          <div class="upload-image-dialog__file-info">
            <EaInput
              v-model="item.customName"
              :placeholder="item.file.name"
              size="small"
              class="upload-image-dialog__name-input"
            ></EaInput>
            <span class="upload-image-dialog__file-size">{{ formatSize(item.file.size) }}</span>
          </div>
          <ea-button text type="danger" icon="xmark" @click="removeFile(index)"></ea-button>
        </div>
      </div>

      <!-- 表单选项 -->
      <div class="upload-image-dialog__form">
        <div class="upload-image-dialog__form-item">
          <label class="upload-image-dialog__label">目标分组</label>
          <EaSelect
            v-model="formData.groupId"
            placeholder="选择分组（可选）"
            clearable
            style="width: 100%"
          >
            <ea-option v-for="group in groupOptions" :key="group.id" :value="group.id"
              >{{ group.name }}</ea-option
            >
          </EaSelect>
        </div>

        <div class="upload-image-dialog__form-item">
          <label class="upload-image-dialog__label">图片描述</label>
          <EaInput
            v-model="formData.alt"
            placeholder="输入图片描述（可选）"
            type="textarea"
            :rows="2"
          ></EaInput>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="upload-image-dialog__footer">
        <ea-button @click="handleClose">取消</ea-button>
        <ea-button
          type="primary"
          :loading="uploading"
          :disabled="selectedFiles.length === 0"
          @click="handleUpload"
        >
          {{ uploading ? '上传中...' : `上传 (${selectedFiles.length})` }}
        </ea-button>
      </div>
    </div>
  </ea-dialog>
</template>

<script setup lang="ts">
  import { ref, reactive, watch } from 'vue'
  import { uploadImage } from '@/api/images'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'

  interface GroupOption {
    id: number
    name: string
  }

  interface SelectedFileItem {
    file: File
    preview: string
    customName: string
  }

  interface Props {
    visible?: boolean
    groupOptions?: GroupOption[]
  }

  const props = withDefaults(defineProps<Props>(), {
    groupOptions: () => [],
  })

  const emit = defineEmits<{
    'update:visible': [val: boolean]
    'success': []
    'close': []
  }>()

  const fileInputRef = ref<HTMLInputElement | null>(null)
  const selectedFiles = ref<SelectedFileItem[]>([])
  const isDragOver = ref(false)
  const uploading = ref(false)

  const formData = reactive({
    groupId: undefined as number | undefined,
    alt: '',
  })

  watch(
    () => props.visible,
    (val: boolean) => {
      if (val) {
        resetForm()
      }
    }
  )

  function handleVisibleChange(val: boolean) {
    emit('update:visible', val)
  }

  function triggerFileInput() {
    fileInputRef.value?.click()
  }

  function handleDragOver() {
    isDragOver.value = true
  }

  function handleDragLeave() {
    isDragOver.value = false
  }

  function handleDrop(e: DragEvent) {
    isDragOver.value = false
    const files = Array.from(e.dataTransfer!.files)
    addFiles(files)
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    const files = Array.from(target.files || [])
    addFiles(files)
    target.value = ''
  }

  function addFiles(files: File[]) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    const maxSize = 10 * 1024 * 1024 // 10MB

    files.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        window.$message?.warning(`不支持的文件格式: ${file.name}`)
        return
      }

      if (file.size > maxSize) {
        window.$message?.warning(`文件过大: ${file.name} (最大10MB)`)
        return
      }

      const preview = URL.createObjectURL(file)
      selectedFiles.value.push({ file, preview, customName: '' })
    })
  }

  function removeFile(index: number) {
    const removed = selectedFiles.value.splice(index, 1)[0]
    if (removed.preview) {
      URL.revokeObjectURL(removed.preview)
    }
  }

  async function handleUpload() {
    if (selectedFiles.value.length === 0) return

    uploading.value = true
    let successCount = 0
    let failCount = 0

    try {
      for (const item of selectedFiles.value) {
        const formDataObj = new FormData()
        formDataObj.append('file', item.file)

        if (formData.groupId) {
          formDataObj.append('groupId', String(formData.groupId))
        }

        if (formData.alt) {
          formDataObj.append('alt', formData.alt)
        }

        if (item.customName && item.customName.trim()) {
          formDataObj.append('customName', item.customName.trim())
        }

        try {
          await uploadImage(formDataObj)
          successCount++
        } catch (error) {
          console.error('上传失败:', error)
          failCount++
        }
      }

      if (successCount > 0) {
        window.$message?.success(`成功上传 ${successCount} 张图片`)
        emit('success')
        handleClose()
      }

      if (failCount > 0) {
        window.$message?.error(`${failCount} 张图片上传失败`)
      }
    } catch (error) {
      console.error('批量上传失败:', error)
      window.$message?.error('上传过程中出现错误')
    } finally {
      uploading.value = false
    }
  }

  function handleClose() {
    emit('update:visible', false)
    emit('close')
    resetForm()
  }

  function resetForm() {
    selectedFiles.value.forEach(item => {
      if (item.preview) {
        URL.revokeObjectURL(item.preview)
      }
    })
    selectedFiles.value = []
    formData.groupId = undefined
    formData.alt = ''
    uploading.value = false
  }

  function formatSize(bytes?: number): string {
    if (!bytes) return '0 B'
    const units = ['B', 'KB', 'MB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }
</script>

<style lang="scss" scoped>
  @include b(upload-image-dialog) {
    @include e(dropzone) {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      border: 2px dashed #dcdfe6;
      border-radius: 8px;
      background-color: #fafafa;
      cursor: pointer;
      transition: all 0.3s;

      &:hover,
      &.is-dragover {
        border-color: #667eea;
        background-color: #f0f0ff;
      }

      &.is-dragover {
        transform: scale(1.02);
      }
    }

    @include e(text) {
      margin-top: 12px;
      font-size: 14px;
      color: var(--ea-text-regular);
    }

    @include e(link) {
      color: #667eea;
      font-weight: 500;
    }

    @include e(hint) {
      margin-top: 8px;
      font-size: 12px;
      color: var(--ea-text-secondary);
    }

    @include e(file-list) {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 200px;
      overflow-y: auto;
    }

    @include e(file-item) {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background-color: #f5f7fa;
      border-radius: 6px;
    }

    @include e(file-preview) {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      border-radius: 4px;
      overflow: hidden;
      flex-shrink: 0;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }

    @include e(file-info) {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    @include e(name-input) {
      width: 100%;
    }

    @include e(file-name) {
      font-size: 13px;
      color: var(--ea-text-regular);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @include e(file-size) {
      font-size: 12px;
      color: var(--ea-text-secondary);
    }

    @include e(form) {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
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
