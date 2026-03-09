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

<script setup>
  import { ref, watch } from 'vue'

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'default',
    },
    border: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['update:modelValue', 'change'])

  const checkboxRef = ref(null)
  const localChecked = ref(props.modelValue || props.checked)

  // 监听外部值变化
  watch(
    () => props.modelValue,
    (newVal) => {
      if (newVal !== localChecked.value) {
        localChecked.value = newVal
      }
    },
    { immediate: true },
  )

  // 监听 checked 属性变化
  watch(
    () => props.checked,
    (newVal) => {
      if (newVal !== localChecked.value) {
        localChecked.value = newVal
      }
    },
  )

  // 处理 change 事件
  function handleChange(event) {
    const checked = event.detail?.checked

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
