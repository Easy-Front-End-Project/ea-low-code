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

<script setup lang="ts">
  import { ref } from 'vue'

  const _props = withDefaults(defineProps<{
    value?: string | number | boolean
    disabled?: boolean
    name?: string
  }>(), {
    value: '',
    disabled: false,
    name: '',
  })

  const radioRef = ref<HTMLElement | null>(null)

  // 暴露方法
  defineExpose({
    focus: () => (radioRef.value as any)?.focus(),
    blur: () => (radioRef.value as any)?.blur(),
  })
</script>
