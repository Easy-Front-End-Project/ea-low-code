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

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    modelValue?: string
    size?: string
    disabled?: boolean
    clearable?: boolean
    colorFormat?: string
    showAlpha?: boolean
    tabindex?: number
    placement?: string
    popperClass?: string
  }>(), {
    modelValue: '',
    size: '',
    disabled: false,
    clearable: false,
    colorFormat: 'hex',
    showAlpha: false,
    tabindex: 0,
    placement: 'bottom',
    popperClass: '',
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'change', value: string): void
  }>()

  const colorPickerRef = ref<HTMLElement | null>(null)
  const localValue = ref(props.modelValue !== undefined ? props.modelValue : '')

  // 监听外部值变化
  watch(
    () => props.modelValue,
    (newVal: string | undefined) => {
      if (newVal !== undefined && newVal !== localValue.value) {
        localValue.value = newVal
      }
    },
    { immediate: true }
  )

  // 处理 change 事件
  function handleChange(event: any) {
    const value: string = event.detail?.value
    if (value !== undefined && value !== localValue.value) {
      localValue.value = value
      emit('update:modelValue', value)
      emit('change', value)
    }
  }

  // 暴露方法
  defineExpose({
    show: () => (colorPickerRef.value as any)?.show(),
    hide: () => (colorPickerRef.value as any)?.hide(),
    focus: () => (colorPickerRef.value as any)?.focus(),
    blur: () => (colorPickerRef.value as any)?.blur(),
  })
</script>
