<template>
  <ea-select
    ref="selectRef"
    :value="localValue"
    :size="size"
    :placeholder="placeholder"
    :disabled="disabled"
    :clearable="clearable"
    :multiple="multiple"
    @change.stop.prevent="handleChange"
    @ea-clear="handleClear"
  >
    <slot></slot>
  </ea-select>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  type ModelValueType = string | number | boolean | object | Array<unknown>

  const props = withDefaults(defineProps<{
    modelValue?: ModelValueType
    size?: string
    placeholder?: string
    disabled?: boolean
    clearable?: boolean
    multiple?: boolean
  }>(), {
    modelValue: '',
    size: 'default',
    placeholder: '',
    disabled: false,
    clearable: false,
    multiple: false,
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: ModelValueType): void
    (e: 'change', value: ModelValueType): void
  }>()

  const selectRef = ref<HTMLElement | null>(null)
  const localValue = ref(Array.isArray(props.modelValue) ? [...(props.modelValue as Array<unknown>)] : props.modelValue)

  // 监听 props.modelValue 变化，同步更新 localValue
  watch(() => props.modelValue, (newVal: ModelValueType) => {
    localValue.value = Array.isArray(newVal) ? [...(newVal as Array<unknown>)] : newVal
  })

  // 处理 change 事件
  function handleChange(event: any) {
    const value: ModelValueType = event.detail?.value

    if (value !== undefined && value !== localValue.value) {
      localValue.value = value
      emit('update:modelValue', value)
      emit('change', value)
    }
  }

  function handleClear() {
    localValue.value = ''
    emit('update:modelValue', '')
    emit('change', '')
  }

  // 暴露方法
  defineExpose({
    focus: () => (selectRef.value as any)?.focus(),
    blur: () => (selectRef.value as any)?.blur(),
  })
</script>
