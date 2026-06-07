<template>
  <ea-checkbox
    ref="checkboxRef"
    :value="value"
    :label="label"
    :name="name"
    :disabled="disabled"
    :checked="localChecked"
    :indeterminate="indeterminate"
    :size="size"
    :border="border"
    @change="handleChange"
  >
    <slot></slot>
  </ea-checkbox>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    modelValue?: boolean
    value?: string
    label?: string
    name?: string
    disabled?: boolean
    checked?: boolean
    indeterminate?: boolean
    size?: string
    border?: boolean
  }>(), {
    modelValue: false,
    value: '',
    label: '',
    name: '',
    disabled: false,
    checked: false,
    indeterminate: false,
    size: 'default',
    border: false,
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'change', value: boolean): void
  }>()

  const checkboxRef = ref<HTMLElement | null>(null)
  const localChecked = ref(props.modelValue || props.checked)

  // 监听外部值变化
  watch(
    () => props.modelValue,
    (newVal: boolean) => {
      if (newVal !== localChecked.value) {
        localChecked.value = newVal
      }
    },
    { immediate: true },
  )

  // 监听 checked 属性变化
  watch(
    () => props.checked,
    (newVal: boolean) => {
      if (newVal !== localChecked.value) {
        localChecked.value = newVal
      }
    },
  )

  // 处理 change 事件
  function handleChange(event: any) {
    const checked: boolean = event.detail?.checked

    // 更新本地值
    localChecked.value = checked

    // 触发事件
    emit('update:modelValue', checked)
    emit('change', checked)
  }

  // 暴露方法
  defineExpose({
    focus: () => checkboxRef.value?.focus(),
  })
</script>
