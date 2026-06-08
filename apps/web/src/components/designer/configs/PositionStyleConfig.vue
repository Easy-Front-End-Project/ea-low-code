<template>
  <div class="config-group">
    <h5 class="group-title">定位</h5>
    <div class="space-y-3">
      <!-- 定位方式 -->
      <div class="prop-item">
        <label class="prop-label">定位</label>
        <EaSelect
          :model-value="positionStyle?.position || ''"
          @update:model-value="handlePositionChange"
          placeholder="默认定位（static）"
        >
          <ea-option value="static">默认定位（static）</ea-option>
          <ea-option value="relative">相对定位（relative）</ea-option>
          <ea-option value="absolute">绝对定位（absolute）</ea-option>
          <ea-option value="fixed">固定定位（fixed）</ea-option>
          <ea-option value="sticky">sticky（不推荐使用）</ea-option>
        </EaSelect>
      </div>

      <!-- 展示层级和溢出 -->
      <div class="prop-row">
        <div class="prop-item flex-1">
          <label class="prop-label">展示层级(zIndex)</label>
          <EaInput
            :model-value="isEditing ? localZIndex : (positionStyle?.zIndex || '')"
            @update:model-value="handleZIndexInput"
            @blur="handleZIndexBlur"
            placeholder="层级"
          />
        </div>
        <div class="prop-item flex-1">
          <label class="prop-label">溢出</label>
          <EaSelect
            :model-value="positionStyle?.overflow || ''"
            @update:model-value="handleInlineStyleChange('overflow', $event)"
            placeholder="溢出状态"
          >
            <ea-option value="visible">显示</ea-option>
            <ea-option value="hidden">隐藏</ea-option>
            <ea-option value="scroll">滚动</ea-option>
            <ea-option value="auto">自动</ea-option>
          </EaSelect>
        </div>
      </div>

      <!-- 定位偏移值（仅在非 static 定位时显示） -->
      <template v-if="isPositioned">
        <div class="prop-row">
          <div class="prop-item flex-1">
            <label class="prop-label">上 (top)</label>
            <UnitInput
              :value="isEditing && localTop ? localTop : (positionStyle?.top || '')"
              @update:value="handlePositionValueInput('top', $event)"
              @unit-change="handlePositionValueUnitChange('top', $event)"
              @blur="handlePositionValueBlur('top')"
              placeholder="auto"
            />
          </div>
          <div class="prop-item flex-1">
            <label class="prop-label">右 (right)</label>
            <UnitInput
              :value="isEditing && localRight ? localRight : (positionStyle?.right || '')"
              @update:value="handlePositionValueInput('right', $event)"
              @unit-change="handlePositionValueUnitChange('right', $event)"
              @blur="handlePositionValueBlur('right')"
              placeholder="auto"
            />
          </div>
        </div>
        <div class="prop-row">
          <div class="prop-item flex-1">
            <label class="prop-label">下 (bottom)</label>
            <UnitInput
              :value="isEditing && localBottom ? localBottom : (positionStyle?.bottom || '')"
              @update:value="handlePositionValueInput('bottom', $event)"
              @unit-change="handlePositionValueUnitChange('bottom', $event)"
              @blur="handlePositionValueBlur('bottom')"
              placeholder="auto"
            />
          </div>
          <div class="prop-item flex-1">
            <label class="prop-label">左 (left)</label>
            <UnitInput
              :value="isEditing && localLeft ? localLeft : (positionStyle?.left || '')"
              @update:value="handlePositionValueInput('left', $event)"
              @unit-change="handlePositionValueUnitChange('left', $event)"
              @blur="handlePositionValueBlur('left')"
              placeholder="auto"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import UnitInput from '@/components/common/UnitInput.vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

  type PositionKey = 'top' | 'right' | 'bottom' | 'left'

  interface Props {
    positionStyle?: Record<string, string>
  }

  const props = withDefaults(defineProps<Props>(), {
    positionStyle: () => ({}),
  })

  const emit = defineEmits<{
    'style-change': [styleName: string, value: string, styleType: string]
  }>()

  // 本地状态
  const localZIndex = ref('')
  const localTop = ref('')
  const localRight = ref('')
  const localBottom = ref('')
  const localLeft = ref('')
  const isEditing = ref(false)

  // 初始化本地状态
  function initLocalState() {
    localZIndex.value = props.positionStyle?.zIndex || ''
    localTop.value = props.positionStyle?.top || ''
    localRight.value = props.positionStyle?.right || ''
    localBottom.value = props.positionStyle?.bottom || ''
    localLeft.value = props.positionStyle?.left || ''
  }

  // 监听外部 props 变化
  watch(
    () => props.positionStyle,
    () => {
      if (!isEditing.value) {
        initLocalState()
      }
    },
    { deep: true }
  )

  // 是否为非 static 定位
  const isPositioned = computed(() => {
    const position = props.positionStyle?.position
    return position && position !== 'static'
  })

  // 处理定位方式变化
  function handlePositionChange(value: any) {
    emit('style-change', 'position', value, 'position')

    if (!value || value === 'static') {
      emit('style-change', 'top', '', 'position')
      emit('style-change', 'right', '', 'position')
      emit('style-change', 'bottom', '', 'position')
      emit('style-change', 'left', '', 'position')
    }
  }

  // 处理 zIndex 变化 - 只更新本地状态
  function handleZIndexInput(value: string) {
    isEditing.value = true
    localZIndex.value = value
  }

  // 失去焦点时提交 zIndex
  function handleZIndexBlur() {
    isEditing.value = false
    emit('style-change', 'zIndex', localZIndex.value, 'position')
  }

  // 处理定位偏移值变化 - 只更新本地状态
  function handlePositionValueInput(key: PositionKey, value: string) {
    isEditing.value = true
    switch (key) {
      case 'top':
        localTop.value = value
        break
      case 'right':
        localRight.value = value
        break
      case 'bottom':
        localBottom.value = value
        break
      case 'left':
        localLeft.value = value
        break
    }
  }

  // 处理定位偏移值单位变化 - 立即提交（用户明确选择单位）
  function handlePositionValueUnitChange(key: PositionKey, input: string, unit?: string) {
    switch (key) {
      case 'top':
        localTop.value = input
        break
      case 'right':
        localRight.value = input
        break
      case 'bottom':
        localBottom.value = input
        break
      case 'left':
        localLeft.value = input
        break
    }
    isEditing.value = false
    emit('style-change', key, input ? `${input}${unit ?? 'px'}` : '', 'position')
  }

  // 失去焦点时提交定位偏移值
  function handlePositionValueBlur(key: PositionKey) {
    isEditing.value = false
    let value = ''
    switch (key) {
      case 'top':
        value = localTop.value
        break
      case 'right':
        value = localRight.value
        break
      case 'bottom':
        value = localBottom.value
        break
      case 'left':
        value = localLeft.value
        break
    }
    emit('style-change', key, value, 'position')
  }

  function handleInlineStyleChange(styleName: string, value: any) {
    emit('style-change', styleName, value, 'position')
  }

  // 初始化
  initLocalState()
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/bem.scss';
@import './styles/config-styles.css';

@include b(config-group) {
  margin-bottom: 1rem;
}
</style>
