<template>
  <ea-switch
    ref="switchRef"
    :value.attr="localValue"
    :name="name"
    :size="size"
    :disabled="disabled"
    :active-text="activeText"
    :inactive-text="inactiveText"
    :active-value.attr="activeValue || true"
    :inactive-value.attr="inactiveValue || false"
    :active-color="activeColor"
    :inactive-color="inactiveColor"
    @change="handleChange"
  >
    <template v-if="$slots.active" slot="active">
      <slot name="active"></slot>
    </template>
    <template v-if="$slots.inactive" slot="inactive">
      <slot name="inactive"></slot>
    </template>
  </ea-switch>
</template>

<script setup>
  import { ref, watch } from 'vue'

  const props = defineProps({
    modelValue: {
      type: [Boolean, String, Number],
      default: false,
    },
    name: {
      type: String,
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
    activeText: {
      type: String,
      default: '',
    },
    inactiveText: {
      type: String,
      default: '',
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true,
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false,
    },
    activeColor: {
      type: String,
      default: '',
    },
    inactiveColor: {
      type: String,
      default: '',
    },
  })

  const emit = defineEmits(['update:modelValue', 'change'])

  const switchRef = ref(null)
  const localValue = ref(props.modelValue !== undefined ? props.modelValue : false)

  // 监听外部值变化
  watch(
    () => props.modelValue,
    (newVal) => {
      if (newVal !== undefined && newVal !== localValue.value) {
        localValue.value = newVal
      }
    },
    { immediate: true },
  )

  // 处理 change 事件
  function handleChange(event) {
    let value = event.detail?.value

    // 更新本地值
    localValue.value = value

    // 触发事件
    emit('update:modelValue', value)
    emit('change', value)
  }

  // 暴露方法
  defineExpose({
    focus: () => switchRef.value?.focus(),
  })
</script>
