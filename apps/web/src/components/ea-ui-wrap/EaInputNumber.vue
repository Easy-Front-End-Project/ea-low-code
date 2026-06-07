<template>
  <ea-input-number
    ref="inputRef"
    :value.attr="localValue"
    :size="size"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    @ea-change.stop.prevent="handleChange"
  />
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    modelValue?: number
    size?: string
    min?: number
    max?: number
    step?: number
    disabled?: boolean
  }>(), {
    modelValue: 0,
    size: 'default',
    min: -Infinity,
    max: Infinity,
    step: 1,
    disabled: false,
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
    (e: 'change', value: number): void
  }>()

  const inputRef = ref<HTMLElement | null>(null)
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
    const value: number = event.detail?.currentValue !== undefined ? event.detail.currentValue : event
    if (value !== undefined && value !== localValue.value) {
      localValue.value = value
      emit('update:modelValue', value)
      emit('change', value)
    }
  }

  // 暴露方法
  defineExpose({
    focus: () => (inputRef.value as any)?.focus(),
    blur: () => (inputRef.value as any)?.blur(),
  })
</script>
