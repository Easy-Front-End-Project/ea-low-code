<template>
  <div class="space-input-wrapper">
    <div class="space-visual">
      <div
        class="space-box"
        :class="{
          'is-linked': isLinked,
          'is-top-active': activeDirection === 'top',
          'is-right-active': activeDirection === 'right',
          'is-bottom-active': activeDirection === 'bottom',
          'is-left-active': activeDirection === 'left',
        }"
      >
        <div class="space-inner" @click="toggleLink">
          <ea-icon name="link" variant="solid" :class="{ 'is-active': isLinked }"></ea-icon>
        </div>
      </div>
    </div>
    <div class="space-controls">
      <div class="space-row">
        <div class="space-item">
          <span class="space-label">上</span>
          <div class="space-unit-wrapper">
            <EaInput
              :model-value="values.top.input"
              @update:model-value="handleChange('top', $event)"
              @focus="handleFocus('top')"
              @blur="handleBlur"
              class="space-input"
              placeholder="0"
            />
            <EaSelect
              :model-value="values.top.unit"
              @update:model-value="handleUnitChange('top', $event)"
              class="space-unit-select"
            >
              <ea-option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</ea-option>
            </EaSelect>
          </div>
        </div>
        <div class="space-item">
          <span class="space-label">右</span>
          <div class="space-unit-wrapper">
            <EaInput
              :model-value="values.right.input"
              @update:model-value="handleChange('right', $event)"
              @focus="handleFocus('right')"
              @blur="handleBlur"
              class="space-input"
              placeholder="0"
            />
            <EaSelect
              :model-value="values.right.unit"
              @update:model-value="handleUnitChange('right', $event)"
              class="space-unit-select"
            >
              <ea-option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</ea-option>
            </EaSelect>
          </div>
        </div>
      </div>
      <div class="space-row">
        <div class="space-item">
          <span class="space-label">下</span>
          <div class="space-unit-wrapper">
            <EaInput
              :model-value="values.bottom.input"
              @update:model-value="handleChange('bottom', $event)"
              @focus="handleFocus('bottom')"
              @blur="handleBlur"
              class="space-input"
              placeholder="0"
            />
            <EaSelect
              :model-value="values.bottom.unit"
              @update:model-value="handleUnitChange('bottom', $event)"
              class="space-unit-select"
            >
              <ea-option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</ea-option>
            </EaSelect>
          </div>
        </div>
        <div class="space-item">
          <span class="space-label">左</span>
          <div class="space-unit-wrapper">
            <EaInput
              :model-value="values.left.input"
              @update:model-value="handleChange('left', $event)"
              @focus="handleFocus('left')"
              @blur="handleBlur"
              class="space-input"
              placeholder="0"
            />
            <EaSelect
              :model-value="values.left.unit"
              @update:model-value="handleUnitChange('left', $event)"
              class="space-unit-select"
            >
              <ea-option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</ea-option>
            </EaSelect>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import EaInput from '../ea-ui-wrap/EaInput.vue'
  import EaSelect from '../ea-ui-wrap/EaSelect.vue'

  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
    units: {
      type: Array,
      default: () => ['px', '%', 'em', 'rem', 'vw', 'vh'],
    },
  })

  const emit = defineEmits(['update:value'])

  // 是否链接四边（同步更新）
  const isLinked = ref(false)
  // 当前激活的方向（用于非链接状态下的高亮）
  const activeDirection = ref(null)

  // 切换链接状态
  function toggleLink() {
    isLinked.value = !isLinked.value
  }

  // 处理 input focus
  function handleFocus(direction) {
    if (!isLinked.value) {
      activeDirection.value = direction
    }
  }

  // 处理 input blur
  function handleBlur() {
    activeDirection.value = null
  }

  // 解析单个值（数字+单位）
  function parseValue(val) {
    const str = String(val || '').trim()
    if (!str || str === 'auto') {
      return { input: str === 'auto' ? 'auto' : '', unit: props.units[0] }
    }
    // 匹配数字部分和单位部分
    const match = str.match(/^(-?\d[\d.]*)(.*)$/)
    if (match) {
      const unit = match[2] || props.units[0]
      return {
        input: match[1],
        unit: props.units.includes(unit) ? unit : props.units[0],
      }
    }
    return { input: '', unit: props.units[0] }
  }

  // 解析 margin/padding 值
  const values = computed(() => {
    const val = props.value?.trim() || ''
    if (!val) {
      const empty = { input: '', unit: props.units[0] }
      return { top: empty, right: empty, bottom: empty, left: empty }
    }

    const parts = val.split(/\s+/)

    // CSS margin/padding 简写规则
    if (parts.length === 1) {
      const parsed = parseValue(parts[0])
      return { top: parsed, right: parsed, bottom: parsed, left: parsed }
    } else if (parts.length === 2) {
      const parsed0 = parseValue(parts[0])
      const parsed1 = parseValue(parts[1])
      return { top: parsed0, right: parsed1, bottom: parsed0, left: parsed1 }
    } else if (parts.length === 3) {
      const parsed0 = parseValue(parts[0])
      const parsed1 = parseValue(parts[1])
      const parsed2 = parseValue(parts[2])
      return { top: parsed0, right: parsed1, bottom: parsed2, left: parsed1 }
    } else if (parts.length >= 4) {
      return {
        top: parseValue(parts[0]),
        right: parseValue(parts[1]),
        bottom: parseValue(parts[2]),
        left: parseValue(parts[3]),
      }
    }

    const empty = { input: '', unit: props.units[0] }
    return { top: empty, right: empty, bottom: empty, left: empty }
  })

  // 处理输入值变化
  function handleChange(direction, value) {
    const currentValues = values.value
    const newInput = value || ''

    let newValues

    if (isLinked.value) {
      // 链接状态下，所有方向同步更新
      const unit = currentValues[direction].unit
      newValues = {
        top: { input: newInput, unit },
        right: { input: newInput, unit },
        bottom: { input: newInput, unit },
        left: { input: newInput, unit },
      }
    } else {
      newValues = {
        ...currentValues,
        [direction]: { ...currentValues[direction], input: newInput },
      }
    }

    emitCombinedValue(newValues)
  }

  // 处理单位变化
  function handleUnitChange(direction, unit) {
    const currentValues = values.value

    let newValues

    if (isLinked.value) {
      // 链接状态下，所有方向同步更新单位
      const input = currentValues[direction].input
      newValues = {
        top: { input, unit },
        right: { input, unit },
        bottom: { input, unit },
        left: { input, unit },
      }
    } else {
      newValues = {
        ...currentValues,
        [direction]: { ...currentValues[direction], unit },
      }
    }

    emitCombinedValue(newValues)
  }

  // 生成并发送组合值
  function emitCombinedValue(newValues) {
    const { top, right, bottom, left } = newValues

    const topVal = formatValue(top)
    const rightVal = formatValue(right)
    const bottomVal = formatValue(bottom)
    const leftVal = formatValue(left)

    // 如果四个值都相同
    if (topVal === rightVal && rightVal === bottomVal && bottomVal === leftVal) {
      emit('update:value', topVal)
      return
    }

    // 如果上下相同，左右相同
    if (topVal === bottomVal && rightVal === leftVal) {
      emit('update:value', `${topVal} ${rightVal}`)
      return
    }

    // 如果左右相同
    if (rightVal === leftVal) {
      emit('update:value', `${topVal} ${rightVal} ${bottomVal}`)
      return
    }

    // 四个值都不同
    emit('update:value', `${topVal} ${rightVal} ${bottomVal} ${leftVal}`)
  }

  // 格式化单个值
  function formatValue({ input, unit }) {
    if (input === 'auto') return 'auto'
    if (!input || input === '') return '0'
    return `${input}${unit}`
  }
</script>

<style lang="scss" scoped>
  .space-input-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .space-visual {
    flex-shrink: 0;
  }

  .space-box {
    width: 60px;
    height: 60px;
    border: 1px dashed #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f7fa;
    transition: border-color 0.2s;

    /* 链接状态 - 四边都高亮 */
    &.is-linked {
      border-color: #409eff;
      border-style: solid;
    }

    /* 各个方向的高亮状态 */
    &.is-top-active {
      border-top-color: #409eff;
      border-top-style: solid;
    }

    &.is-right-active {
      border-right-color: #409eff;
      border-right-style: solid;
    }

    &.is-bottom-active {
      border-bottom-color: #409eff;
      border-bottom-style: solid;
    }

    &.is-left-active {
      border-left-color: #409eff;
      border-left-style: solid;
    }
  }

  .space-inner {
    width: 30px;
    height: 30px;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #409eff;
    }

    ea-icon {
      font-size: 14px;
      color: #909399;
      transition: color 0.2s;

      &.is-active {
        color: #409eff;
      }
    }
  }

  .space-controls {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .space-row {
    display: flex;
    gap: 12px;
  }

  .space-item {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
  }

  .space-label {
    font-size: 12px;
    color: #606266;
    min-width: 20px;
  }

  .space-unit-wrapper {
    flex: 1;
    display: flex;
    gap: 4px;
  }

  .space-input {
    flex: 1;
  }

  .space-unit-select {
    width: 60px;
  }
</style>
