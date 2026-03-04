<template>
  <ea-input-number
    ref="inputRef"
    :value="modelValue"
    :size="size"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    @change="handleChange"
  />
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  size: {
    type: String,
    default: 'default',
  },
  min: {
    type: Number,
    default: -Infinity,
  },
  max: {
    type: Number,
    default: Infinity,
  },
  step: {
    type: Number,
    default: 1,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const inputRef = ref(null)
const localValue = ref(props.modelValue)

// 监听外部值变化
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== localValue.value) {
      localValue.value = newVal
    }
  },
  { immediate: true }
)

// 处理 change 事件
function handleChange(event) {
  const value = event.detail?.currentValue !== undefined ? event.detail.currentValue : event
  if (value !== localValue.value) {
    localValue.value = value
    emit('update:modelValue', value)
    emit('change', value)
  }
}

// 暴露方法
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>
