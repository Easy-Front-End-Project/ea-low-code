<template>
  <ea-switch
    ref="switchRef"
    :value="localValue"
    :name="name"
    :size="size"
    :disabled="disabled"
    :active-text="activeText"
    :inactive-text="inactiveText"
    :active-value="activeValue ?? true"
    :inactive-value="inactiveValue ?? false"
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
  const localValue = ref(props.modelValue || false)

  // 监听外部值变化
  watch(
    () => props.modelValue,
    (newVal) => {
      if (newVal !== localValue.value) {
        localValue.value = newVal
      }
    },
    { immediate: true },
  )

  // 处理 change 事件
  function handleChange(event) {
    let value = event.detail?.value

    // 处理字符串类型的值
    if (typeof value === 'string') {
      if (value === 'true') value = false
      else if (value === 'false') value = true
      else if (value === 'undefined') value = true
    }

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
