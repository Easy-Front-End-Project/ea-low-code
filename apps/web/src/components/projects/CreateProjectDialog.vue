<template>
  <ea-dialog
    :visible="visible"
    title="创建项目"
    width="600px"
    :close-on-click-modal="false"
    @update:visible="handleVisibleChange"
    @close="handleClose"
  >
    <div class="create-project-dialog">
      <!-- 创建方式选择 -->
      <div class="create-project-dialog__types">
        <div
          v-for="type in createTypes"
          :key="type.value"
          :class="['create-project-dialog__type', { 'is-active': currentType === type.value }]"
          @click="currentType = type.value"
        >
          <ea-icon :name="type.icon" size="24" :color="currentType === type.value ? '#409eff' : '#909399'"></ea-icon>
          <span class="create-project-dialog__type-label">{{ type.label }}</span>
        </div>
      </div>

      <!-- 表单区域 -->
      <div class="create-project-dialog__form">
        <!-- 模板创建 -->
        <div v-if="currentType === 'template'">
          <div class="create-project-dialog__form-item">
            <label class="create-project-dialog__label">选择模板</label>
            <div class="create-project-dialog__templates">
              <div
                v-for="template in templates"
                :key="template.id"
                :class="['create-project-dialog__template', { 'is-active': selectedTemplate === template.id }]"
                @click="selectedTemplate = template.id"
              >
                <ea-icon :name="template.icon" size="20" :color="selectedTemplate === template.id ? '#409eff' : '#606266'"></ea-icon>
                <span>{{ template.name }}</span>
              </div>
            </div>
          </div>
          <div class="create-project-dialog__form-item">
            <label class="create-project-dialog__label">项目名称</label>
            <ea-input v-model="form.name" placeholder="请输入项目名称" clearable></ea-input>
          </div>
        </div>

        <!-- AI 创建 -->
        <!-- <div v-if="currentType === 'ai'">
          <div class="create-project-dialog__form-item">
            <label class="create-project-dialog__label">需求描述</label>
            <ea-input
              v-model="form.aiPrompt"
              type="textarea"
              :rows="4"
              placeholder="描述你想要的页面，例如：创建一个电商商品详情页，包含商品图片、价格、规格选择和购买按钮..."
            ></ea-input>
          </div>
          <div class="create-project-dialog__form-item">
            <label class="create-project-dialog__label">项目名称</label>
            <ea-input v-model="form.name" placeholder="请输入项目名称" clearable></ea-input>
          </div>
        </div> -->

        <!-- 空白创建 -->
        <div v-if="currentType === 'blank'">
          <div class="create-project-dialog__form-item">
            <label class="create-project-dialog__label">
              项目名称
              <span class="create-project-dialog__required">*</span>
            </label>
            <ea-input v-model="form.name" placeholder="请输入项目名称" clearable></ea-input>
          </div>
          <div class="create-project-dialog__form-item">
            <label class="create-project-dialog__label">项目描述</label>
            <ea-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="请输入项目描述（可选）"
            ></ea-input>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="create-project-dialog__footer">
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
import { useProjectsStore } from '@/stores/projects'

interface Props {
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
})

const emit = defineEmits<{
  'update:visible': [val: boolean]
  'success': []
}>()

const projectsStore = useProjectsStore()

const currentType = ref('blank')
const selectedTemplate = ref('')
const loading = ref(false)

const form = ref({
  name: '',
  description: '',
  aiPrompt: '',
})

const createTypes = [
  { value: 'template', label: '模板创建', icon: 'clipboard' },
  // { value: 'ai', label: 'AI 创建', icon: 'robot' },
  { value: 'blank', label: '空白创建', icon: 'file' },
]

const templates = [
  { id: 'dashboard', name: '数据看板', icon: 'chart-line' },
  { id: 'form', name: '表单页面', icon: 'list-check' },
  { id: 'list', name: '列表页面', icon: 'table' },
  { id: 'detail', name: '详情页面', icon: 'file-lines' },
]

const canSubmit = computed(() => {
  if (!form.value.name.trim()) return false
  if (currentType.value === 'template' && !selectedTemplate.value) return false
  return true
})

// 重置表单
function resetForm() {
  form.value = {
    name: '',
    description: '',
    aiPrompt: '',
  }
  currentType.value = 'blank'
  selectedTemplate.value = ''
}

function handleVisibleChange(val: boolean) {
  emit('update:visible', val)
}

function handleClose() {
  emit('update:visible', false)
  resetForm()
}

async function handleSubmit() {
  if (!canSubmit.value) return

  loading.value = true
  try {
    const data: Record<string, any> = {
      name: form.value.name.trim(),
      description: form.value.description,
      createType: currentType.value,
    }

    if (currentType.value === 'template') {
      data.templateId = selectedTemplate.value
    } else if (currentType.value === 'ai') {
      data.aiPrompt = form.value.aiPrompt
    }

    await projectsStore.create(data)
    window.$message?.success('创建成功')
    emit('success')
    handleClose()
  } catch (error: any) {
    window.$message?.error(error.message || '创建失败')
  } finally {
    loading.value = false
  }
}

// 监听 visible 变化，打开时重置表单
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
.create-project-dialog {
  &__types {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
  }

  &__type {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 20px 16px;
    border: 1px solid var(--ea-border-light);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: var(--ea-primary);
    }

    &.is-active {
      border-color: var(--ea-primary);
      background: var(--ea-primary-light);
    }

    &-label {
      font-size: 14px;
      color: var(--ea-text-regular);
    }

    &.is-active &-label {
      color: var(--ea-primary);
    }
  }

  &__form {
    &-item {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &__label {
    display: block;
    font-size: 14px;
    color: var(--ea-text-regular);
    margin-bottom: 8px;
  }

  &__required {
    color: var(--ea-danger);
    margin-left: 4px;
  }

  &__templates {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  &__template {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border: 1px solid var(--ea-border-light);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: var(--ea-primary);
    }

    &.is-active {
      border-color: var(--ea-primary);
      background: var(--ea-primary-light);

      span {
        color: var(--ea-primary);
      }
    }

    span {
      font-size: 14px;
      color: var(--ea-text-regular);
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
