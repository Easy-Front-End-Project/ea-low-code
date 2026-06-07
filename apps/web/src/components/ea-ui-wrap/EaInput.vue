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
    :name="name || undefined"
    :pattern="pattern || undefined"
    :required="required || undefined"
    :minlength="minlength || undefined"
    :maxlength="maxlength || undefined"
    @input.stop.prevent="handleInput"
    @ea-clear="handleClear"
  >
    <div v-if="$slots.prefix" slot="prepend">
      <slot name="prefix"></slot>
    </div>
    <div v-if="$slots.suffix" slot="append">
      <slot name="suffix"></slot>
    </div>
  </ea-input>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    modelValue?: string | number
    size?: string
    placeholder?: string
    disabled?: boolean
    clearable?: boolean
    type?: string
    rows?: number
    name?: string
    pattern?: string
    required?: boolean
    minlength?: number
    maxlength?: number
  }>(), {
    modelValue: '',
    size: 'default',
    placeholder: '',
    disabled: false,
    clearable: false,
    type: 'text',
    rows: 2,
    name: '',
    pattern: '',
    required: false,
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'change', value: string): void
    (e: 'input', value: string): void
    (e: 'clear'): void
  }>()

  const inputRef = ref<HTMLElement | null>(null)
  const localValue = ref(props.modelValue !== undefined ? props.modelValue : '')

  // 监听外部值变化
  watch(
    () => props.modelValue,
    (newVal: string | number | undefined) => {
      if (newVal !== undefined && newVal !== localValue.value) {
        localValue.value = newVal
      }
    },
    { immediate: true }
  )

  // 处理 input 事件
  function handleInput(event: any) {
    const value: string = (event.target as HTMLInputElement)?.value
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
    focus: () => (inputRef.value as any)?.focus(),
    blur: () => (inputRef.value as any)?.blur(),
    select: () => (inputRef.value as any)?.select(),
    checkValidity: () => (inputRef.value as any)?.checkValidity(),
    reportValidity: () => (inputRef.value as any)?.reportValidity(),
    setCustomValidity: (message: string) => (inputRef.value as any)?.setCustomValidity(message),
  })
</script>
