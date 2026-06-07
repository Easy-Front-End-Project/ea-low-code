<template>
  <div class="unit-input-wrapper flex gap-1">
    <EaInput
      :model-value="displayValue"
      @update:model-value="handleInputChange"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      class="prop-input flex-1"
      :placeholder="placeholder"
    />
    <EaSelect
      v-if="!isAutoValue"
      :model-value="unitValue"
      @update:model-value="handleUnitChange"
      class="w-18"
    >
      <ea-option v-for="unit in actualUnits" :key="unit" :value="unit">{{ unit }}</ea-option>
    </EaSelect>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import EaInput from '../ea-ui-wrap/EaInput.vue'
  import EaSelect from '../ea-ui-wrap/EaSelect.vue'

  // 预定义的单位类型
  const UNIT_TYPES: Record<string, string[]> = {
    css: ['px', '%', 'em', 'rem', 'vw', 'vh', 'auto'],
    time: ['s', 'm', 'h', 'd', 'w', 'M', 'y'],
  }

  interface ParsedResult {
    input: string
    unit: string
  }

  const props = withDefaults(defineProps<{
    value?: string
    units?: string[]
    unitType?: string
    placeholder?: string
  }>(), {
    value: '',
    units: () => [],
    unitType: 'css',
    placeholder: '',
  })

  // 获取实际使用的单位列表
  const actualUnits = computed<string[]>(() => {
    if (props.units && props.units.length > 0) {
      return props.units
    }
    return UNIT_TYPES[props.unitType] || UNIT_TYPES.css
  })

  const emit = defineEmits<{
    (e: 'update:value', value: string): void
    (e: 'input-change', input: string, unit: string): void
    (e: 'unit-change', input: string, unit: string): void
    (e: 'focus', event: FocusEvent): void
    (e: 'blur', event: FocusEvent): void
  }>()

  // 判断是否为 auto 值
  const isAutoValue = computed(() => {
    return String(props.value || '').toLowerCase() === 'auto'
  })

  // 解析值和单位
  const parsedValue = computed<ParsedResult>(() => {
    const str = String(props.value || '')

    // 如果是 auto，直接返回
    if (str.toLowerCase() === 'auto') {
      return { input: 'auto', unit: '' }
    }

    // 匹配数字部分和单位部分
    const match = str.match(/^(\d[\d.]*)(.*)$/)
    if (match) {
      return {
        input: match[1],
        unit: match[2] || actualUnits.value[0],
      }
    }
    return { input: '', unit: actualUnits.value[0] }
  })

  const inputValue = computed(() => parsedValue.value.input)
  const unitValue = computed(() => parsedValue.value.unit)

  // 显示值：auto 时显示 auto，否则显示数字
  const displayValue = computed(() => {
    if (isAutoValue.value) {
      return 'auto'
    }
    return inputValue.value
  })

  // 处理输入值变化 - 支持数字或 auto
  function handleInputChange(value: string | number) {
    const strValue = String(value || '')
      .trim()
      .toLowerCase()

    // 如果输入的是 auto，直接设置为 auto
    if (strValue === 'auto') {
      emit('update:value', 'auto')
      emit('input-change', 'auto', unitValue.value)
      return
    }

    // 过滤非数字字符（只允许数字和小数点）
    const numericValue = strValue.replace(/[^\d.]/g, '')

    // 确保只有一个小数点
    const parts = numericValue.split('.')
    const sanitizedValue =
      parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue

    const unit = unitValue.value
    const combinedValue = sanitizedValue ? `${sanitizedValue}${unit === 'auto' ? '' : unit}` : ''
    emit('update:value', combinedValue)
    emit('input-change', sanitizedValue, unit)
  }

  // 处理单位变化
  function handleUnitChange(unit: string | number | boolean | object | Array<unknown>) {
    const unitStr = String(unit)
    const input = inputValue.value
    const combinedValue = input ? `${input}${unitStr === 'auto' ? '' : unitStr}` : ''
    emit('update:value', combinedValue)
    emit('unit-change', input, unitStr)
  }
</script>

<style lang="scss" scoped>
  .prop-input {
    flex: 1;
  }

  .prop-input::part(original) {
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &::-ms-clear {
      display: none;
    }

    -webkit-appearance: none;
    -moz-appearance: textfield;
    appearance: none;
  }
</style>
