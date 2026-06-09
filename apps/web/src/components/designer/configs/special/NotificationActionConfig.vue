<template>
  <div class="notification-action-config space-y-3">
    <div class="config-item">
      <label class="config-label">HTML渲染</label>
      <EaSwitch v-model="modelValue.dangerouslyUseHTMLString" size="small" />
    </div>
    <div class="config-item">
      <label class="config-label">消息类型</label>
      <EaSelect v-model="modelValue.type" size="small" class="w-full">
        <ea-option value="info">信息</ea-option>
        <ea-option value="primary">主要</ea-option>
        <ea-option value="success">成功</ea-option>
        <ea-option value="warning">警告</ea-option>
        <ea-option value="error">错误</ea-option>
      </EaSelect>
    </div>
    <div class="config-item">
      <label class="config-label">标题</label>
      <EaInput v-model="modelValue.title" placeholder="输入标题" size="small" />
    </div>
    <div class="config-item">
      <label class="config-label">正文内容</label>
      <EaInput v-model="modelValue.message" placeholder="输入提示消息内容" size="small" />
    </div>
    <div class="config-item">
      <label class="config-label">出现位置</label>
      <EaSelect v-model="modelValue.placement" size="small" class="w-full">
        <ea-option value="top-right">右上</ea-option>
        <ea-option value="top-left">左上</ea-option>
        <ea-option value="bottom-right">右下</ea-option>
        <ea-option value="bottom-left">左下</ea-option>
      </EaSelect>
    </div>
    <div class="config-item">
      <label class="config-label">显示时长(ms)</label>
      <EaInputNumber
        v-model="modelValue.duration"
        :min="0"
        :step="1000"
        size="small"
        placeholder="3000"
      />
    </div>
    <div class="config-item">
      <label class="config-label">显示关闭按钮</label>
      <EaSwitch v-model="modelValue.showClose" size="small" />
    </div>
    <div class="config-item">
      <label class="config-label">关闭按钮图标</label>
      <EaInput v-model="modelValue.closeIcon" placeholder="icon-cancel" size="small" />
    </div>
    <div class="config-item">
      <label class="config-label">自定义图标</label>
      <EaInput v-model="modelValue.icon" placeholder="输入图标 class" size="small" />
    </div>
    <div class="config-item">
      <label class="config-label">z-index</label>
      <EaInputNumber v-model="modelValue.zIndex" :min="0" :step="1" size="small" placeholder="0" />
    </div>
    <div class="config-item">
      <label class="config-label">挂载容器</label>
      <EaInput v-model="modelValue.appendTo" placeholder="body" size="small" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaInputNumber from '@/components/ea-ui-wrap/EaInputNumber.vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'
  import EaSwitch from '@/components/ea-ui-wrap/EaSwitch.vue'

  interface NotificationModel {
    dangerouslyUseHTMLString: boolean
    type: string
    title: string
    message: string
    placement: string
    duration: number
    showClose: boolean
    closeIcon: string
    icon: string
    zIndex: number
    appendTo: string
  }

  const props = defineProps<{
    modelValue: NotificationModel
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: NotificationModel]
  }>()

  const modelValue = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val),
  })
</script>

<style lang="scss" scoped>
@include b(notification-action-config) {
  @include e(config-item) {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  @include e(config-label) {
    font-size: 12px;
    color: #606266;
    font-weight: 500;
  }
}
</style>
