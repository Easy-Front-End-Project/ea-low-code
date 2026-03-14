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

<script setup>
  import { ref, watch } from 'vue'

  const props = defineProps({
    modelValue: {
      type: [String, Number, Boolean, Object, Array],
      default: '',
    },
    size: {
      type: String,
      default: 'default',
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['update:modelValue', 'change'])

  const selectRef = ref(null)
  const localValue = ref(Array.isArray(props.modelValue) ? [...props.modelValue] : props.modelValue)

  // 处理 change 事件
  function handleChange(event) {
    const value = event.detail?.value
    const options = [...event.target.querySelectorAll('ea-option')]
    const selectedOption = options.find(o => o.getAttribute('value') === value)

    if ((value !== undefined && value !== localValue.value && selectedOption) || value === true) {
      localValue.value = value
      emit('update:modelValue', value)
      emit('change', value)

      return
    }

    if (props.multiple) {
      localValue.value = value
      emit('update:modelValue', value)
      emit('change', value)
      return
    }
  }

  function handleClear() {
    localValue.value = ''
    emit('update:modelValue', '')
    emit('change', '')
  }

  // 暴露方法
  defineExpose({
    focus: () => selectRef.value?.focus(),
    blur: () => selectRef.value?.blur(),
  })
</script>
