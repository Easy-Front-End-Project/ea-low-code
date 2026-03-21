<template>
  <ea-input
    ref="inputRef"
    :value="localValue"
    :size="size"
    :placeholder="placeholder"
    :disabled="disabled"
    :clearable="clearable"
    :type="type"
    :rows="rows"
    @input.stop.prevent="handleInput"
    @ea-clear="handleClear"
  >
    <div v-if="$slots.prefix" slot="prepend">
      <slot name="prefix"></slot>
    </div>
    <template v-if="$slots.suffix" slot="append">
      <slot name="suffix"></slot>
    </template>
  </ea-input>
</template>

<script setup>
  import { ref, watch } from 'vue'

  const props = defineProps({
    modelValue: {
      type: [String, Number],
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
    type: {
      type: String,
      default: 'text',
    },
    rows: {
      type: Number,
      default: 2,
    },
  })

  const emit = defineEmits(['update:modelValue', 'change', 'input', 'clear'])

  const inputRef = ref(null)
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

  // 处理 input 事件
  function handleInput(event) {
    const value = event.target?.value
    if (value !== localValue.value) {
      localValue.value = value
      emit('update:modelValue', value)
      emit('input', value)
      emit('change', value)
    }
  }

  // 处理清除事件
  function handleClear() {
    localValue.value = ''
    emit('update:modelValue', '')
    emit('clear')
  }

  // 暴露方法
  defineExpose({
    focus: () => inputRef.value?.focus(),
    blur: () => inputRef.value?.blur(),
    select: () => inputRef.value?.select(),
  })
</script>
