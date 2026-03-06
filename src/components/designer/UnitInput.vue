<template>
  <div class="unit-input-wrapper flex gap-2">
    <EaInput
      :model-value="inputValue"
      @update:model-value="handleInputChange"
      class="prop-input flex-1"
      :placeholder="placeholder"
      type="number"
    />
    <EaSelect
      :model-value="unitValue"
      @update:model-value="handleUnitChange"
      class="unit-select w-20"
    >
      <ea-option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</ea-option>
    </EaSelect>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import EaInput from '../ea-ui-wrap/EaInput.vue'
  import EaSelect from '../ea-ui-wrap/EaSelect.vue'

  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
    units: {
      type: Array,
      default: () => ['px', '%', 'em', 'rem', 'vw', 'vh', 'auto'],
    },
    placeholder: {
      type: String,
      default: '',
    },
  })

  const emit = defineEmits(['update:value'])

  // 解析值和单位
  const parsedValue = computed(() => {
    const str = String(props.value || '')
    // 匹配数字部分和单位部分
    const match = str.match(/^([\d.]*)(.*)$/)
    if (match) {
      return {
        input: match[1],
        unit: match[2] || props.units[0],
      }
    }
    return { input: '', unit: props.units[0] }
  })

  const inputValue = computed(() => parsedValue.value.input)
  const unitValue = computed(() => parsedValue.value.unit)

  // 处理输入值变化 - 只允许输入数字
  function handleInputChange(value) {
    // 过滤非数字字符（只允许数字和小数点）
    const numericValue = String(value).replace(/[^\d.]/g, '')

    // 确保只有一个小数点
    const parts = numericValue.split('.')
    const sanitizedValue =
      parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue

    const unit = unitValue.value
    const combinedValue = sanitizedValue ? `${sanitizedValue}${unit === 'auto' ? '' : unit}` : ''
    emit('update:value', combinedValue)
  }

  // 处理单位变化
  function handleUnitChange(unit) {
    const input = inputValue.value
    const combinedValue = input ? `${input}${unit === 'auto' ? '' : unit}` : ''
    emit('update:value', combinedValue)
  }
</script>

<style lang="scss" scoped>
  .unit-input-wrapper {
    display: flex;
    gap: 0.5rem;
  }

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

  .unit-select {
    width: 5rem;
  }
</style>
