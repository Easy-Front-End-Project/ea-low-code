<template>
  <ea-radio-group
    ref="radioGroupRef"
    :value="localValue"
    :size="size"
    :disabled="disabled"
    @change="handleChange"
  >
    <slot></slot>
  </ea-radio-group>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    modelValue?: string | number | boolean
    size?: string
    disabled?: boolean
  }>(), {
    modelValue: '',
    size: 'default',
    disabled: false,
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number | boolean): void
    (e: 'change', value: string | number | boolean): void
  }>()

  const radioGroupRef = ref<HTMLElement | null>(null)
  const localValue = ref(props.modelValue)

  // 监听外部值变化
  watch(
    () => props.modelValue,
    (newVal: string | number | boolean | undefined) => {
      if (newVal !== undefined && newVal !== localValue.value) {
        localValue.value = newVal
      }
    },
    { immediate: true }
  )

  // 处理 change 事件
  function handleChange(event: any) {
    const value: string | number | boolean = event.detail?.value
    if (value !== undefined && value !== localValue.value) {
      localValue.value = value
      emit('update:modelValue', value)
      emit('change', value)
    }
  }

  // 暴露方法
  defineExpose({
    focus: () => (radioGroupRef.value as any)?.focus(),
    blur: () => (radioGroupRef.value as any)?.blur(),
  })
</script>
