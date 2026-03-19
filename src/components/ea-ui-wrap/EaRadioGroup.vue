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

<script setup>
  import { ref, watch } from 'vue'

  const props = defineProps({
    modelValue: {
      type: [String, Number, Boolean],
      default: '',
    },
    size: {
      type: String,
      default: 'default',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['update:modelValue', 'change'])

  const radioGroupRef = ref(null)
  const localValue = ref(props.modelValue)

  // 监听外部值变化
  watch(
    () => props.modelValue,
    (newVal) => {
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

  // 暴露方法
  defineExpose({
    focus: () => radioGroupRef.value?.focus(),
    blur: () => radioGroupRef.value?.blur(),
  })
</script>
