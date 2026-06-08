<template>
  <ea-dialog :visible="visible" title="选择 URL 预设" width="500px" @close="handleClose">
    <div class="url-preset-selector">
      <div class="preset-list">
        <div
          v-for="preset in remoteStore.urlPresets"
          :key="preset.id"
          class="preset-item"
          :class="{ 'is-selected': modelValue === preset.id }"
          @click="handleSelect(preset)"
        >
          <div class="preset-info">
            <div class="preset-name">
              <ea-icon name="link" variant="solid" size="14" class="text-blue-500"></ea-icon>
              <span>{{ preset.name }}</span>
              <ea-tag v-if="preset.isDefault" type="primary" size="small">默认</ea-tag>
            </div>
            <div class="preset-url">
              <code>{{ preset.url }}</code>
            </div>
          </div>
          <div class="preset-check">
            <ea-icon
              v-if="modelValue === preset.id"
              name="circle-check"
              variant="solid"
              size="20"
              color="#409eff"
            ></ea-icon>
          </div>
        </div>

        <div v-if="remoteStore.urlPresets.length === 0" class="empty-state">
          <ea-icon name="inbox" variant="solid" size="32" class="text-gray-300"></ea-icon>
          <p class="text-gray-400 text-sm mt-2">暂无 URL 预设，请先添加预设</p>
        </div>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <ea-button type="primary" @click="handleManagePreset"> 管理预设 </ea-button>
      <ea-button @click="handleClear">不使用预设</ea-button>
      <ea-button @click="handleClose">取消</ea-button>
    </div>
  </ea-dialog>
</template>

<script setup lang="ts">
  import { useRemoteComponentStore } from '@/stores/designer/remoteComponent'

  interface UrlPreset {
    id: string | number
    name: string
    url: string
    isDefault?: boolean
  }

  interface Props {
    visible?: boolean
    modelValue?: number | string
  }

  withDefaults(defineProps<Props>(), {
    visible: false,
    modelValue: '',
  })

  const emit = defineEmits<{
    'update:modelValue': [val: number | string]
    'close': []
    'manage': []
  }>()

  const remoteStore = useRemoteComponentStore()

  function handleSelect(preset: UrlPreset) {
    emit('update:modelValue', preset.id)
    emit('close')
  }

  function handleClose() {
    emit('close')
  }

  function handleClear() {
    emit('update:modelValue', '')
    emit('close')
  }

  function handleManagePreset() {
    emit('manage')
  }
</script>

<style scoped>
  .url-preset-selector {
    min-height: 200px;
    max-height: 400px;
    display: flex;
    flex-direction: column;
  }

  .preset-list {
    flex: 1;
    overflow-y: auto;
    padding-top: 0.5rem;
  }

  .preset-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s;
    border: 1px solid transparent;
  }

  .preset-item:hover {
    background-color: #f3f4f6;
  }

  .preset-item.is-selected {
    background-color: #ecf5ff;
    border-color: #409eff;
  }

  .preset-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    min-width: 0;
  }

  .preset-name {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  .preset-url code {
    font-size: 0.75rem;
    color: #6b7280;
    word-break: break-all;
    padding: 0.125rem 0.375rem;
    background-color: #f3f4f6;
    border-radius: 0.25rem;
  }

  .preset-check {
    margin-left: 1rem;
    flex-shrink: 0;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
  }

  .dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
  }
</style>
