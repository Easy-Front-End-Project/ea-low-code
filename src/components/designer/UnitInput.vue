<template>
  <div class="unit-input-wrapper flex gap-2">
    <ea-input
      :value="inputValue"
      @input="handleInputChange($event.target.value)"
      class="prop-input flex-1"
      :placeholder="placeholder"
    />
    <ea-select
      :value="unitValue"
      @change="handleUnitChange($event.detail.value)"
      class="unit-select w-20"
    >
      <ea-option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</ea-option>
    </ea-select>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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
  const match = str.match(/^([\d.]*)\s*(.*)$/)
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

// 处理输入值变化
function handleInputChange(value) {
  const unit = unitValue.value
  const combinedValue = value ? `${value}${unit === 'auto' ? '' : unit}` : ''
  emit('update:value', combinedValue)
}

// 处理单位变化
function handleUnitChange(unit) {
  const input = inputValue.value
  const combinedValue = input ? `${input}${unit === 'auto' ? '' : unit}` : ''
  emit('update:value', combinedValue)
}
</script>

<style scoped>
.unit-input-wrapper {
  display: flex;
  gap: 0.5rem;
}

.prop-input {
  flex: 1;
}

.unit-select {
  width: 5rem;
}
</style>
