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
        <SpaceInput
          :value="borderWidthValue"
          @update:value="handleBorderWidthInput"
          @blur="handleBorderWidthBlur"
        />
      </div>

      <!-- 圆角 -->
      <div class="prop-item">
        <label class="prop-label">圆角</label>
        <SpaceInput
          :value="radiusValue"
          @update:value="handleRadiusInput"
          @blur="handleRadiusBlur"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import SpaceInput from '@/components/common/SpaceInput.vue'
  import EaColorPicker from '@/components/ea-ui-wrap/EaColorPicker.vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'

  interface Props {
    style?: Record<string, string>
  }

  const props = withDefaults(defineProps<Props>(), {
    style: () => ({}),
  })

  const emit = defineEmits<{
    'style-change': [styleName: string, value: string, styleType: string]
  }>()

  // 本地状态
  const localBorderWidth = ref('')
  const localRadius = ref('')
  const isEditing = ref(false)

  // 初始化本地状态
  function initLocalState() {
    // 边框宽度
    const top = props.style?.borderTopWidth || ''
    const right = props.style?.borderRightWidth || ''
    const bottom = props.style?.borderBottomWidth || ''
    const left = props.style?.borderLeftWidth || ''

    if (top && top === right && top === bottom && top === left) {
      localBorderWidth.value = top
    } else {
      const values = [top, right, bottom, left].filter(Boolean)
      localBorderWidth.value = values.length === 0 ? '' : values.join(' ')
    }

    // 圆角
    const topLeft = props.style?.borderTopLeftRadius || ''
    const topRight = props.style?.borderTopRightRadius || ''
    const bottomLeft = props.style?.borderBottomLeftRadius || ''
    const bottomRight = props.style?.borderBottomRightRadius || ''

    if (topLeft && topLeft === topRight && topLeft === bottomLeft && topLeft === bottomRight) {
      localRadius.value = topLeft
    } else {
      const values = [topLeft, topRight, bottomRight, bottomLeft].filter(Boolean)
      localRadius.value = values.length === 0 ? '' : values.join(' ')
    }
  }

  // 监听外部 props 变化
  watch(
    () => props.style,
    () => {
      if (!isEditing.value) {
        initLocalState()
      }
    },
    { deep: true }
  )

  // 边框样式
  const borderStyle = computed(() => {
    return props.style?.borderStyle || 'none'
  })

  // 边框宽度值（用于 SpaceInput）
  const borderWidthValue = computed(() => {
    return isEditing.value
      ? localBorderWidth.value
      : (() => {
          const top = props.style?.borderTopWidth || ''
          const right = props.style?.borderRightWidth || ''
          const bottom = props.style?.borderBottomWidth || ''
          const left = props.style?.borderLeftWidth || ''

          if (top && top === right && top === bottom && top === left) {
            return top
          }

          const values = [top, right, bottom, left].filter(Boolean)
          if (values.length === 0) return ''

          return values.join(' ')
        })()
  })

  // 圆角值（用于 SpaceInput）
  const radiusValue = computed(() => {
    return isEditing.value
      ? localRadius.value
      : (() => {
          const topLeft = props.style?.borderTopLeftRadius || ''
          const topRight = props.style?.borderTopRightRadius || ''
          const bottomLeft = props.style?.borderBottomLeftRadius || ''
          const bottomRight = props.style?.borderBottomRightRadius || ''

          if (
            topLeft &&
            topLeft === topRight &&
            topLeft === bottomLeft &&
            topLeft === bottomRight
          ) {
            return topLeft
          }

          const values = [topLeft, topRight, bottomRight, bottomLeft].filter(Boolean)
          if (values.length === 0) return ''

          return values.join(' ')
        })()
  })

  // 处理边框样式变化
  function handleBorderStyleChange(style: any) {
    emit('style-change', 'borderStyle', style, 'inline')
  }

  // 处理边框宽度变化 - 只更新本地状态
  function handleBorderWidthInput(value: string) {
    isEditing.value = true
    localBorderWidth.value = value
  }

  // 失去焦点时提交边框宽度
  function handleBorderWidthBlur() {
    isEditing.value = false
    commitBorderWidthChange(localBorderWidth.value)
  }

  // 提交边框宽度变更
  function commitBorderWidthChange(value: string) {
    if (!value) {
      emit('style-change', 'borderTopWidth', '', 'inline')
      emit('style-change', 'borderRightWidth', '', 'inline')
      emit('style-change', 'borderBottomWidth', '', 'inline')
      emit('style-change', 'borderLeftWidth', '', 'inline')
      return
    }

    const values = value.split(' ').filter(Boolean)

    if (values.length === 1) {
      emit('style-change', 'borderTopWidth', values[0], 'inline')
      emit('style-change', 'borderRightWidth', values[0], 'inline')
      emit('style-change', 'borderBottomWidth', values[0], 'inline')
      emit('style-change', 'borderLeftWidth', values[0], 'inline')
    } else if (values.length === 4) {
      emit('style-change', 'borderTopWidth', values[0], 'inline')
      emit('style-change', 'borderRightWidth', values[1], 'inline')
      emit('style-change', 'borderBottomWidth', values[2], 'inline')
      emit('style-change', 'borderLeftWidth', values[3], 'inline')
    } else if (values.length === 2) {
      emit('style-change', 'borderTopWidth', values[0], 'inline')
      emit('style-change', 'borderRightWidth', values[1], 'inline')
      emit('style-change', 'borderBottomWidth', values[0], 'inline')
      emit('style-change', 'borderLeftWidth', values[1], 'inline')
    } else if (values.length === 3) {
      emit('style-change', 'borderTopWidth', values[0], 'inline')
      emit('style-change', 'borderRightWidth', values[1], 'inline')
      emit('style-change', 'borderBottomWidth', values[2], 'inline')
      emit('style-change', 'borderLeftWidth', values[1], 'inline')
    }
  }

  // 处理圆角变化 - 只更新本地状态
  function handleRadiusInput(value: string) {
    isEditing.value = true
    localRadius.value = value
  }

  // 失去焦点时提交圆角
  function handleRadiusBlur() {
    isEditing.value = false
    commitRadiusChange(localRadius.value)
  }

  // 提交圆角变更
  function commitRadiusChange(value: string) {
    if (!value) {
      emit('style-change', 'borderTopLeftRadius', '', 'inline')
      emit('style-change', 'borderTopRightRadius', '', 'inline')
      emit('style-change', 'borderBottomLeftRadius', '', 'inline')
      emit('style-change', 'borderBottomRightRadius', '', 'inline')
      return
    }

    const values = value.split(' ').filter(Boolean)

    if (values.length === 1) {
      emit('style-change', 'borderTopLeftRadius', values[0], 'inline')
      emit('style-change', 'borderTopRightRadius', values[0], 'inline')
      emit('style-change', 'borderBottomLeftRadius', values[0], 'inline')
      emit('style-change', 'borderBottomRightRadius', values[0], 'inline')
    } else if (values.length === 4) {
      emit('style-change', 'borderTopLeftRadius', values[0], 'inline')
      emit('style-change', 'borderTopRightRadius', values[1], 'inline')
      emit('style-change', 'borderBottomRightRadius', values[2], 'inline')
      emit('style-change', 'borderBottomLeftRadius', values[3], 'inline')
    } else if (values.length === 2) {
      emit('style-change', 'borderTopLeftRadius', values[0], 'inline')
      emit('style-change', 'borderTopRightRadius', values[1], 'inline')
      emit('style-change', 'borderBottomLeftRadius', values[1], 'inline')
      emit('style-change', 'borderBottomRightRadius', values[0], 'inline')
    } else if (values.length === 3) {
      emit('style-change', 'borderTopLeftRadius', values[0], 'inline')
      emit('style-change', 'borderTopRightRadius', values[1], 'inline')
      emit('style-change', 'borderBottomLeftRadius', values[1], 'inline')
      emit('style-change', 'borderBottomRightRadius', values[2], 'inline')
    }
  }

  function handleInlineStyleChange(styleName: string, value: any) {
    emit('style-change', styleName, value, 'inline')
  }

  // 初始化
  initLocalState()
</script>

<style lang="scss" scoped>
@import './styles/config-styles.css';
</style>
