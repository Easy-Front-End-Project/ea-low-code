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

<script setup>
  import { ref, watch } from 'vue'

  const props = defineProps({
    modelValue: {
      type: Number,
      default: 0,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    showTooltip: {
      type: Boolean,
      default: true,
    },
    placement: {
      type: String,
      default: 'top',
    },
    size: {
      type: String,
      default: '',
    },
    showStops: {
      type: Boolean,
      default: false,
    },
    showInput: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['update:modelValue', 'change', 'input'])

  const sliderRef = ref(null)
  const localValue = ref(props.modelValue !== undefined ? props.modelValue : 0)

  // 监听外部值变化
  watch(
    () => props.modelValue,
    newVal => {
      if (newVal !== undefined && newVal !== localValue.value) {
        localValue.value = newVal
      }
    },
    { immediate: true }
  )

  // 处理 change 事件
  function handleChange(event) {
    const value = event.detail?.value
    if (value !== undefined && value !== localValue.value) {
      localValue.value = value
      emit('update:modelValue', value)
      emit('change', value)
    }
  }

  // 处理 input 事件（拖动时）
  function handleInput(event) {
    const value = event.detail?.value
    if (value !== undefined) {
      localValue.value = value
      emit('update:modelValue', value)
      emit('input', value)
    }
  }

  // 暴露方法
  defineExpose({
    focus: () => sliderRef.value?.focus(),
  })
</script>
