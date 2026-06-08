<template>
  <div class="basic-info-panel">
    <div class="basic-info-panel__form-item">
      <label class="basic-info-panel__form-label">
        组件名称<span class="required">*</span>
      </label>
      <EaInput v-model="form.name" placeholder="请输入组件名称" size="default" />
    </div>

    <div class="basic-info-panel__form-item">
      <label class="basic-info-panel__form-label">
        组件 URL<span class="required">*</span>
      </label>
      <div v-if="computedFullUrl" class="basic-info-panel__url-preview">
        <ea-icon name="link" size="14" class="text-blue-500"></ea-icon>
        <code class="url-preview__value">{{ computedFullUrl }}</code>
      </div>
      <div class="basic-info-panel__url-input-group">
        <EaInput
          v-model="form.url"
          placeholder="如: components/my-component.umd.js"
          size="default"
          class="flex-1"
        />
        <div class="url-input-group__actions">
          <ea-button size="small" text @click="$emit('select-preset')">
            <ea-icon name="folder-open" size="14"></ea-icon>
            <span>选择预设</span>
          </ea-button>
        </div>
      </div>
    </div>

    <div class="basic-info-panel__form-item">
      <label class="basic-info-panel__form-label">导出名称</label>
      <EaInput v-model="form.exportName" placeholder="UMD 导出名 (可选)" size="default" />
    </div>

    <div class="basic-info-panel__form-item">
      <label class="basic-info-panel__form-label">组件类型</label>
      <EaInput v-model="form.type" placeholder="如: remote-button (可选)" size="default" />
    </div>

    <div class="basic-info-panel__form-item">
      <label class="basic-info-panel__form-label">图标名称</label>
      <EaInput v-model="form.icon" placeholder="如: crown (可选)" size="default" />
    </div>

    <div class="basic-info-panel__form-item">
      <label class="basic-info-panel__form-label">样式文件 URL</label>
      <EaInput v-model="form.styleUrl" placeholder="CSS 文件路径 (可选)" size="default" />
    </div>

    <div class="basic-info-panel__form-item">
      <label class="basic-info-panel__form-label">启用状态</label>
      <EaSwitch v-model="form.enabled" />
    </div>

    <div class="basic-info-panel__form-item">
      <label class="basic-info-panel__form-label">描述说明</label>
      <EaInput
        v-model="form.description"
        type="textarea"
        :rows="3"
        placeholder="组件用途说明 (可选)"
        size="default"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
import EaSwitch from '@/components/ea-ui-wrap/EaSwitch.vue'

interface FormData {
  name: string
  url: string
  exportName?: string
  type?: string
  icon?: string
  styleUrl?: string
  enabled?: boolean
  description?: string
}

interface Props {
  form: FormData
  computedFullUrl?: string
}

withDefaults(defineProps<Props>(), {
  computedFullUrl: '',
})

defineEmits<{
  'select-preset': []
}>()
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(basic-info-panel) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 640px;

    @include e(form-item) {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    @include e(form-label) {
      font-size: 14px;
      font-weight: 500;
      color: var(--ea-text-primary);

      .required {
        color: #ef4444;
        margin-left: 0.25rem;
      }
    }

    @include e(url-preview) {
      background: #f0f9ff;
      border: 1px solid #bae0ff;
      border-radius: 4px;
      padding: 0.5rem 0.75rem;
      margin-top: 0.25rem;
      display: flex;
      align-items: center;
      gap: 8px;

      .url-preview__value {
        font-family: monospace;
        word-break: break-all;
        color: #0c4a6e;
        font-size: 13px;
      }
    }

    @include e(url-input-group) {
      display: flex;
      gap: 8px;
      align-items: flex-start;

      .url-input-group__actions {
        display: flex;
        align-items: center;
        padding-top: 2px;
        white-space: nowrap;
      }
    }
  }
</style>
