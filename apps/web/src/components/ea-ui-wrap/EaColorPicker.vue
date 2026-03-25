<template>
  <ea-color-picker
    ref="colorPickerRef"
    :value="localValue"
    :size="size"
    :disabled="disabled"
    :clearable="clearable"
    :color-format="colorFormat"
    :show-alpha="showAlpha"
    :tabindex="tabindex"
    :placement="placement"
    :popper-class="popperClass"
    @change.stop.prevent="handleChange"
  >
    <slot></slot>
  </ea-color-picker>
</template>

<script setup>
  import { ref, watch } from 'vue'

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
    size: {
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
    colorFormat: {
      type: String,
      default: 'hex',
    },
    showAlpha: {
      type: Boolean,
      default: false,
    },
    tabindex: {
      type: Number,
      default: 0,
    },
    placement: {
      type: String,
      default: 'bottom',
    },
    popperClass: {
      type: String,
      default: '',
    },
  })

  const emit = defineEmits(['update:modelValue', 'change'])

  const colorPickerRef = ref(null)
  const localValue = ref(props.modelValue !== undefined ? props.modelValue : '')

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

  // 暴露方法
  defineExpose({
    show: () => colorPickerRef.value?.show(),
    hide: () => colorPickerRef.value?.hide(),
    focus: () => colorPickerRef.value?.focus(),
    blur: () => colorPickerRef.value?.blur(),
  })
</script>
