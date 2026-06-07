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
          <ea-icon
            name="link"
            variant="solid"
            size="10"
            :class="{ 'is-active': isLinked }"
          ></ea-icon>
        </div>
      </div>
    </div>
    <div class="space-controls">
      <div class="space-row">
        <div class="space-item">
          <span class="space-label">上</span>
          <UnitInput
            :value="formatValueForUnitInput(values.top)"
            @input-change="(input, unit) => handleInputChange('top', input, unit)"
            @unit-change="(input, unit) => handleUnitChange('top', input, unit)"
            @focus="handleFocus('top')"
            @blur="handleBlur"
            :units="units"
            class="space-unit-input"
            placeholder="0"
          />
        </div>
        <div class="space-item">
          <span class="space-label">右</span>
          <UnitInput
            :value="formatValueForUnitInput(values.right)"
            @input-change="(input, unit) => handleInputChange('right', input, unit)"
            @unit-change="(input, unit) => handleUnitChange('right', input, unit)"
            @focus="handleFocus('right')"
            @blur="handleBlur"
            :units="units"
            class="space-unit-input"
            placeholder="0"
          />
        </div>
      </div>
      <div class="space-row">
        <div class="space-item">
          <span class="space-label">下</span>
          <UnitInput
            :value="formatValueForUnitInput(values.bottom)"
            @input-change="(input, unit) => handleInputChange('bottom', input, unit)"
            @unit-change="(input, unit) => handleUnitChange('bottom', input, unit)"
            @focus="handleFocus('bottom')"
            @blur="handleBlur"
            :units="units"
            class="space-unit-input"
            placeholder="0"
          />
        </div>
        <div class="space-item">
          <span class="space-label">左</span>
          <UnitInput
            :value="formatValueForUnitInput(values.left)"
            @input-change="(input, unit) => handleInputChange('left', input, unit)"
            @unit-change="(input, unit) => handleUnitChange('left', input, unit)"
            @focus="handleFocus('left')"
            @blur="handleBlur"
            :units="units"
            class="space-unit-input"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import UnitInput from './UnitInput.vue'

  type Direction = 'top' | 'right' | 'bottom' | 'left'

  interface ParsedValue {
    input: string
    unit: string
  }

  interface DirectionValues {
    top: ParsedValue
    right: ParsedValue
    bottom: ParsedValue
    left: ParsedValue
  }

  const props = withDefaults(defineProps<{
    value?: string
    units?: string[]
  }>(), {
    value: '',
    units: () => ['px', '%', 'em', 'rem', 'vw', 'vh'],
  })

  const emit = defineEmits<{
    (e: 'update:value', value: string): void
  }>()

  // 是否链接四边（同步更新）
  const isLinked = ref(false)
  // 当前激活的方向（用于非链接状态下的高亮）
  const activeDirection = ref<Direction | null>(null)

  // 切换链接状态
  function toggleLink() {
    isLinked.value = !isLinked.value
  }

  // 处理 input focus
  function handleFocus(direction: Direction) {
    if (!isLinked.value) {
      activeDirection.value = direction
    }
  }

  // 处理 input blur
  function handleBlur() {
    activeDirection.value = null
  }

  // 解析单个值（数字+单位）
  function parseValue(val: string | undefined): ParsedValue {
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
  const values = computed<DirectionValues>(() => {
    const val = props.value?.trim() || ''
    if (!val) {
      const empty: ParsedValue = { input: '', unit: props.units[0] }
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

    const empty: ParsedValue = { input: '', unit: props.units[0] }
    return { top: empty, right: empty, bottom: empty, left: empty }
  })

  // 将解析后的值格式化为 UnitInput 需要的字符串格式
  function formatValueForUnitInput({ input, unit }: ParsedValue): string {
    if (input === 'auto') return 'auto'
    if (!input || input === '') return `0${unit}`
    return `${input}${unit}`
  }

  // 处理输入值变化（来自 UnitInput 的 input-change 事件）
  function handleInputChange(direction: Direction, input: string, unit: string) {
    const currentValues = values.value
    const newInput = input || ''

    let newValues: DirectionValues

    if (isLinked.value) {
      // 链接状态下，所有方向同步更新
      newValues = {
        top: { input: newInput, unit },
        right: { input: newInput, unit },
        bottom: { input: newInput, unit },
        left: { input: newInput, unit },
      }
    } else {
      newValues = {
        ...currentValues,
        [direction]: { ...currentValues[direction], input: newInput, unit },
      }
    }

    emitCombinedValue(newValues)
  }

  // 处理单位变化（来自 UnitInput 的 unit-change 事件）
  function handleUnitChange(direction: Direction, input: string, unit: string) {
    const currentValues = values.value

    let newValues: DirectionValues

    if (isLinked.value) {
      // 链接状态下，所有方向同步更新单位，但保持各自的 input 值
      newValues = {
        top: { input: currentValues.top.input, unit },
        right: { input: currentValues.right.input, unit },
        bottom: { input: currentValues.bottom.input, unit },
        left: { input: currentValues.left.input, unit },
      }
    } else {
      const currentInput = input || currentValues[direction].input
      newValues = {
        ...currentValues,
        [direction]: { ...currentValues[direction], input: currentInput, unit },
      }
    }

    emitCombinedValue(newValues)
  }

  // 生成并发送组合值
  function emitCombinedValue(newValues: DirectionValues) {
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
  function formatValue({ input, unit }: ParsedValue): string {
    if (input === 'auto') return 'auto'
    if (!input || input === '') return `0${unit}`
    return `${input}${unit}`
  }
</script>

<style lang="scss" scoped>
  .space-input-wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 12px;
  }

  .space-visual {
    flex-shrink: 0;
  }

  .space-box {
    width: 80px;
    height: 80px;
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
    width: 40px;
    height: 40px;
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
    display: block;
    font-size: 12px;
    color: #606266;
  }

  .space-unit-input {
    flex: 1;
  }
</style>
