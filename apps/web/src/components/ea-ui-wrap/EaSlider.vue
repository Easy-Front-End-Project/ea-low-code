<template>
  <ea-slider
    ref="sliderRef"
    :value.attr="localValue"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    :vertical="vertical"
    :show-tooltip="showTooltip"
    :placement="placement"
    :size="size"
    :show-stops="showStops"
    :show-input="showInput"
    @change.stop.prevent="handleChange"
    @input.stop.prevent="handleInput"
  >
    <slot></slot>
  </ea-slider>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    modelValue?: number
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    vertical?: boolean
    showTooltip?: boolean
    placement?: string
    size?: string
    showStops?: boolean
    showInput?: boolean
  }>(), {
    modelValue: 0,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    vertical: false,
    showTooltip: true,
    placement: 'top',
    size: '',
    showStops: false,
    showInput: false,
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
    (e: 'change', value: number): void
    (e: 'input', value: number): void
  }>()

  const sliderRef = ref<HTMLElement | null>(null)
  const localValue = ref(props.modelValue !== undefined ? props.modelValue : 0)

  // 监听外部值变化
  watch(
    () => props.modelValue,
    (newVal: number | undefined) => {
      if (newVal !== undefined && newVal !== localValue.value) {
        localValue.value = newVal
      }
    },
    { immediate: true }
  )

  // 处理 change 事件
  function handleChange(event: any) {
    const value: number = event.detail?.value
    if (value !== undefined && value !== localValue.value) {
      localValue.value = value
      emit('update:modelValue', value)
      emit('change', value)
    }
  }

  // 处理 input 事件（拖动时）
  function handleInput(event: any) {
    const value: number = event.detail?.value
    if (value !== undefined) {
      localValue.value = value
      emit('update:modelValue', value)
      emit('input', value)
    }
  }

  // 暴露方法
  defineExpose({
    focus: () => (sliderRef.value as any)?.focus(),
  })
</script>
