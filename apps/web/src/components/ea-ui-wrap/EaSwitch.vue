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
    @change.stop.prevent="handleChange"
  >
    <template v-if="$slots.active" slot="active">
      <slot name="active"></slot>
    </template>
    <template v-if="$slots.inactive" slot="inactive">
      <slot name="inactive"></slot>
    </template>
  </ea-switch>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  type SwitchValue = boolean | string | number

  const props = withDefaults(defineProps<{
    modelValue?: SwitchValue
    name?: string
    size?: string
    disabled?: boolean
    activeText?: string
    inactiveText?: string
    activeValue?: SwitchValue
    inactiveValue?: SwitchValue
    activeColor?: string
    inactiveColor?: string
  }>(), {
    modelValue: false,
    name: '',
    size: 'default',
    disabled: false,
    activeText: '',
    inactiveText: '',
    activeValue: true,
    inactiveValue: false,
    activeColor: '',
    inactiveColor: '',
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: SwitchValue): void
    (e: 'change', value: SwitchValue): void
  }>()

  const switchRef = ref<HTMLElement | null>(null)
  const localValue = ref(props.modelValue !== undefined ? props.modelValue : false)

  // 监听外部值变化
  watch(
    () => props.modelValue,
    (newVal: SwitchValue | undefined) => {
      if (newVal !== undefined && newVal !== localValue.value) {
        localValue.value = newVal
      }
    },
    { immediate: true }
  )

  // 处理 change 事件
  function handleChange(event: any) {
    let value: SwitchValue = event.detail?.value

    if (typeof value === 'string') {
      if (value === 'true') value = true
      else if (value === 'false') value = false
    }

    if (value !== undefined && value !== localValue.value) {
      localValue.value = value
      emit('update:modelValue', value)
      emit('change', value)
    }
  }

  // 暴露方法
  defineExpose({
    focus: () => (switchRef.value as any)?.focus(),
  })
</script>
