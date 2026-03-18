<template>
  <div class="message-action-config space-y-3">
    <div class="config-item">
      <label class="config-label">提示内容</label>
      <EaInput v-model="modelValue.message" placeholder="输入提示消息内容" size="small" />
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
      <label class="config-label">HTML渲染</label>
      <EaSwitch v-model="modelValue.dangerouslyUseHTMLString" size="small" />
    </div>
    <div class="config-item">
      <label class="config-label">出现位置</label>
      <EaSelect v-model="modelValue.placement" size="small" class="w-full">
        <ea-option value="top">顶部</ea-option>
        <ea-option value="top-left">左上</ea-option>
        <ea-option value="top-right">右上</ea-option>
        <ea-option value="bottom">底部</ea-option>
        <ea-option value="bottom-left">左下</ea-option>
        <ea-option value="bottom-right">右下</ea-option>
      </EaSelect>
    </div>
    <div class="config-item">
      <label class="config-label">偏移距离</label>
      <EaInputNumber v-model="modelValue.offset" :min="0" :step="8" size="small" placeholder="16" />
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaInputNumber from '@/components/ea-ui-wrap/EaInputNumber.vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'
  import EaSwitch from '@/components/ea-ui-wrap/EaSwitch.vue'

  const props = defineProps({
    modelValue: {
      type: Object,
      required: true,
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const modelValue = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val),
  })
</script>

<style scoped>
  .config-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .config-label {
    font-size: 12px;
    color: #606266;
    font-weight: 500;
  }
</style>
