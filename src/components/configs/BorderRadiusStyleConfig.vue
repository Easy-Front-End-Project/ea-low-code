<template>
  <div class="config-group">
    <h5 class="group-title">边框 & 圆角</h5>
    <div class="space-y-3">
      <!-- 线条样式和颜色 -->
      <div class="prop-row">
        <div class="prop-item flex-1">
          <label class="prop-label">线条样式</label>
          <EaSelect
            :model-value="borderStyle"
            @update:model-value="handleBorderStyleChange"
            placeholder="选择线条样式"
          >
            <ea-option value="none">无</ea-option>
            <ea-option value="solid">实线</ea-option>
            <ea-option value="dashed">虚线</ea-option>
            <ea-option value="dotted">点线</ea-option>
          </EaSelect>
        </div>
        <div class="prop-item flex-1">
          <label class="prop-label">颜色</label>
          <div class="color-input-wrapper">
            <EaColorPicker
              :model-value="style?.borderColor || ''"
              @update:model-value="handleInlineStyleChange('borderColor', $event)"
              class="color-picker"
            />
          </div>
        </div>
      </div>

      <!-- 边框宽度 -->
      <div class="prop-item">
        <label class="prop-label">边框</label>
        <SpaceInput :value="borderWidthValue" @update:value="handleBorderWidthChange" />
      </div>

      <!-- 圆角 -->
      <div class="prop-item">
        <label class="prop-label">圆角</label>
        <SpaceInput :value="radiusValue" @update:value="handleRadiusChange" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import SpaceInput from '../common/SpaceInput.vue'
  import EaColorPicker from '../ea-ui-wrap/EaColorPicker.vue'
  import EaSelect from '../ea-ui-wrap/EaSelect.vue'

  const props = defineProps({
    style: {
      type: Object,
      default: () => ({}),
    },
  })

  const emit = defineEmits(['style-change'])

  // 边框样式
  const borderStyle = computed(() => {
    return props.style?.borderStyle || 'none'
  })

  // 边框宽度值（用于 SpaceInput）
  const borderWidthValue = computed(() => {
    const top = props.style?.borderTopWidth || ''
    const right = props.style?.borderRightWidth || ''
    const bottom = props.style?.borderBottomWidth || ''
    const left = props.style?.borderLeftWidth || ''

    // 如果四边都相同，返回统一值
    if (top && top === right && top === bottom && top === left) {
      return top
    }

    // 否则返回组合值
    const values = [top, right, bottom, left].filter(Boolean)
    if (values.length === 0) return ''

    return values.join(' ')
  })

  // 圆角值（用于 SpaceInput）
  const radiusValue = computed(() => {
    const topLeft = props.style?.borderTopLeftRadius || ''
    const topRight = props.style?.borderTopRightRadius || ''
    const bottomLeft = props.style?.borderBottomLeftRadius || ''
    const bottomRight = props.style?.borderBottomRightRadius || ''

    // 如果四个角都相同，返回统一值
    if (topLeft && topLeft === topRight && topLeft === bottomLeft && topLeft === bottomRight) {
      return topLeft
    }

    // 否则返回组合值
    const values = [topLeft, topRight, bottomRight, bottomLeft].filter(Boolean)
    if (values.length === 0) return ''

    return values.join(' ')
  })

  // 处理边框样式变化
  function handleBorderStyleChange(style) {
    emit('style-change', 'borderStyle', style, 'inline')
  }

  // 处理边框宽度变化
  function handleBorderWidthChange(value) {
    if (!value) {
      // 清空所有边框宽度
      emit('style-change', 'borderTopWidth', '', 'inline')
      emit('style-change', 'borderRightWidth', '', 'inline')
      emit('style-change', 'borderBottomWidth', '', 'inline')
      emit('style-change', 'borderLeftWidth', '', 'inline')
      return
    }

    // 解析 SpaceInput 返回的值（格式可能是单个值或空格分隔的多个值）
    const values = value.split(' ').filter(Boolean)

    if (values.length === 1) {
      // 单个值，应用到所有边
      emit('style-change', 'borderTopWidth', values[0], 'inline')
      emit('style-change', 'borderRightWidth', values[0], 'inline')
      emit('style-change', 'borderBottomWidth', values[0], 'inline')
      emit('style-change', 'borderLeftWidth', values[0], 'inline')
    } else if (values.length === 4) {
      // 四个值：上 右 下 左（CSS 标准顺序）
      emit('style-change', 'borderTopWidth', values[0], 'inline')
      emit('style-change', 'borderRightWidth', values[1], 'inline')
      emit('style-change', 'borderBottomWidth', values[2], 'inline')
      emit('style-change', 'borderLeftWidth', values[3], 'inline')
    } else if (values.length === 2) {
      // 两个值：上下 左右
      emit('style-change', 'borderTopWidth', values[0], 'inline')
      emit('style-change', 'borderRightWidth', values[1], 'inline')
      emit('style-change', 'borderBottomWidth', values[0], 'inline')
      emit('style-change', 'borderLeftWidth', values[1], 'inline')
    } else if (values.length === 3) {
      // 三个值：上 左右 下
      emit('style-change', 'borderTopWidth', values[0], 'inline')
      emit('style-change', 'borderRightWidth', values[1], 'inline')
      emit('style-change', 'borderBottomWidth', values[2], 'inline')
      emit('style-change', 'borderLeftWidth', values[1], 'inline')
    }
  }

  // 处理圆角变化
  function handleRadiusChange(value) {
    if (!value) {
      // 清空所有圆角
      emit('style-change', 'borderTopLeftRadius', '', 'inline')
      emit('style-change', 'borderTopRightRadius', '', 'inline')
      emit('style-change', 'borderBottomLeftRadius', '', 'inline')
      emit('style-change', 'borderBottomRightRadius', '', 'inline')
      return
    }

    // 解析 SpaceInput 返回的值（格式可能是单个值或空格分隔的多个值）
    const values = value.split(' ').filter(Boolean)

    if (values.length === 1) {
      // 单个值，应用到所有角
      emit('style-change', 'borderTopLeftRadius', values[0], 'inline')
      emit('style-change', 'borderTopRightRadius', values[0], 'inline')
      emit('style-change', 'borderBottomLeftRadius', values[0], 'inline')
      emit('style-change', 'borderBottomRightRadius', values[0], 'inline')
    } else if (values.length === 4) {
      // 四个值：上左 上右 下右 下左（CSS 标准顺序）
      emit('style-change', 'borderTopLeftRadius', values[0], 'inline')
      emit('style-change', 'borderTopRightRadius', values[1], 'inline')
      emit('style-change', 'borderBottomRightRadius', values[2], 'inline')
      emit('style-change', 'borderBottomLeftRadius', values[3], 'inline')
    } else if (values.length === 2) {
      // 两个值：上下 左右
      emit('style-change', 'borderTopLeftRadius', values[0], 'inline')
      emit('style-change', 'borderTopRightRadius', values[1], 'inline')
      emit('style-change', 'borderBottomLeftRadius', values[1], 'inline')
      emit('style-change', 'borderBottomRightRadius', values[0], 'inline')
    } else if (values.length === 3) {
      // 三个值：上 左右 下
      emit('style-change', 'borderTopLeftRadius', values[0], 'inline')
      emit('style-change', 'borderTopRightRadius', values[1], 'inline')
      emit('style-change', 'borderBottomLeftRadius', values[1], 'inline')
      emit('style-change', 'borderBottomRightRadius', values[2], 'inline')
    }
  }

  function handleInlineStyleChange(styleName, value) {
    emit('style-change', styleName, value, 'inline')
  }
</script>

<style scoped>
  @import './config-styles.css';
</style>
