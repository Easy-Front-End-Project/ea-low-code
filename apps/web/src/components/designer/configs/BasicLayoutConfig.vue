<template>
  <div class="config-group">
    <h5 class="group-title">基础</h5>
    <div class="space-y-3">
      <div class="prop-item">
        <label class="prop-label">宽度</label>
        <UnitInput
          :value="localWidth"
          @update:value="handleWidthChange"
          @unit-change="handleWidthUnitChange"
          @blur="handleWidthBlur"
          placeholder="auto"
        />
      </div>
      <div class="prop-item">
        <label class="prop-label">高度</label>
        <UnitInput
          :value="localHeight"
          @update:value="handleHeightChange"
          @unit-change="handleHeightUnitChange"
          @blur="handleHeightBlur"
          placeholder="auto"
        />
      </div>
      <div class="prop-item">
        <label class="prop-label">外边距</label>
        <SpaceInput
          :value="localMargin"
          @update:value="handleMarginChange"
          @blur="handleMarginBlur"
        />
      </div>
      <div class="prop-item">
        <label class="prop-label">内边距</label>
        <SpaceInput
          :value="localPadding"
          @update:value="handlePaddingChange"
          @blur="handlePaddingBlur"
        />
      </div>
      <div class="prop-item">
        <label class="prop-label">透明</label>
        <div class="opacity-control">
          <EaSlider
            :model-value="opacityValue"
            @update:model-value="handleOpacityChange"
            :min="0"
            :max="1"
            :step="0.1"
            :show-tooltip="true"
            placement="top"
            class="opacity-slider"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import UnitInput from '@/components/common/UnitInput.vue'
  import SpaceInput from '@/components/common/SpaceInput.vue'
  import EaSlider from '@/components/ea-ui-wrap/EaSlider.vue'

  interface Props {
    style?: Record<string, string>
  }

  const props = withDefaults(defineProps<Props>(), {
    style: () => ({}),
  })

  const emit = defineEmits<{
    'style-change': [styleName: string, value: string, styleType: string]
  }>()

  // 本地状态：用于编辑期间暂存值，避免频繁触发父组件更新
  const localWidth = ref(props.style?.width || '')
  const localHeight = ref(props.style?.height || '')
  const localMargin = ref(props.style?.margin || '')
  const localPadding = ref(props.style?.padding || '')
  const localOpacity = ref(1)

  // 初始化本地状态
  function initLocalState() {
    localWidth.value = props.style?.width || ''
    localHeight.value = props.style?.height || ''
    localMargin.value = props.style?.margin || ''
    localPadding.value = props.style?.padding || ''
    const opacity = props.style?.opacity
    localOpacity.value = opacity === undefined || opacity === '' ? 1 : parseFloat(opacity)
  }

  // 监听外部 props 变化，同步到本地状态（当其他地方修改时）
  watch(
    () => props.style,
    () => {
      if (!isEditing.value) {
        initLocalState()
      }
    },
    { deep: true }
  )

  // 标记是否正在编辑（防止外部更新覆盖本地编辑状态）
  const isEditing = ref(false)

  const opacityValue = computed(() => {
    const val = localOpacity.value
    return isNaN(val) ? 1 : Math.max(0, Math.min(1, val))
  })

  // 处理透明度变化 - 立即提交（滑块操作需要实时反馈）
  function handleOpacityChange(value: number) {
    localOpacity.value = value
    emit('style-change', 'opacity', String(value), 'inline')
  }

  // 处理宽度变化 - 只更新本地状态
  function handleWidthChange(value: string) {
    isEditing.value = true
    localWidth.value = value
  }

  // 处理宽度单位变化 - 立即提交（用户明确选择单位）
  function handleWidthUnitChange(input: string, unit: string) {
    localWidth.value = input ? `${input}${unit}` : ''
    commitStyleChange('width', localWidth.value)
  }

  // 处理高度变化 - 只更新本地状态
  function handleHeightChange(value: string) {
    isEditing.value = true
    localHeight.value = value
  }

  // 处理高度单位变化 - 立即提交
  function handleHeightUnitChange(input: string, unit: string) {
    localHeight.value = input ? `${input}${unit}` : ''
    commitStyleChange('height', localHeight.value)
  }

  // 处理外边距变化 - 只更新本地状态
  function handleMarginChange(value: string) {
    isEditing.value = true
    localMargin.value = value
  }

  // 处理内边距变化 - 只更新本地状态
  function handlePaddingChange(value: string) {
    isEditing.value = true
    localPadding.value = value
  }

  // 提交样式变更到父组件
  function commitStyleChange(styleName: string, value: string) {
    emit('style-change', styleName, value, 'inline')
  }

  // 失去焦点时提交更改
  function handleWidthBlur() {
    isEditing.value = false
    commitStyleChange('width', localWidth.value)
  }

  function handleHeightBlur() {
    isEditing.value = false
    commitStyleChange('height', localHeight.value)
  }

  function handleMarginBlur() {
    isEditing.value = false
    commitStyleChange('margin', localMargin.value)
  }

  function handlePaddingBlur() {
    isEditing.value = false
    commitStyleChange('padding', localPadding.value)
  }

  // 初始化
  initLocalState()
</script>

<style lang="scss" scoped>
@import './styles/config-styles.css';

@include b(config-group) {
  @include e(opacity-control) {
    padding: 0.5rem 0;
  }
}
</style>
