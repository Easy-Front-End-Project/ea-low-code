<template>
  <ea-radio
    ref="radioRef"
    :value="value"
    :disabled="disabled"
    :name="name"
  >
    <slot></slot>
  </ea-radio>
</template>

<script setup>
  import { ref } from 'vue'

  const props = defineProps({
    value: {
      type: [String, Number, Boolean],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
  })

  const radioRef = ref(null)

  // 暴露方法
  defineExpose({
    focus: () => radioRef.value?.focus(),
    blur: () => radioRef.value?.blur(),
  })
</script>
