<template>
  <div class="config-group">
    <h5 class="group-title">背景</h5>
    <div class="space-y-3">
      <!-- 颜色 -->
      <div class="prop-item">
        <label class="prop-label">颜色</label>
        <div class="color-input-wrapper">
          <EaColorPicker
            :model-value="style?.backgroundColor || ''"
            @update:model-value="handleInlineStyleChange('backgroundColor', $event)"
            class="color-picker text-center"
          />
        </div>
      </div>

      <!-- 图片或渐变 -->
      <div class="prop-item">
        <label class="prop-label">图片或渐变</label>
        <EaInput
          :model-value="isEditing ? localBackgroundImage : (style?.backgroundImage || '')"
          @update:model-value="handleBackgroundImageInput"
          @blur="handleBackgroundImageBlur"
          placeholder="http://xxx.png"
          class="bg-image-input"
        />
      </div>

      <!-- 尺寸 -->
      <div class="prop-row">
        <div class="prop-item flex-1">
          <label class="prop-label">尺寸</label>
          <EaSelect
            :model-value="backgroundSize"
            @update:model-value="handleBackgroundSizeChange"
            placeholder="默认"
          >
            <ea-option value="">默认</ea-option>
            <ea-option value="cover">覆盖</ea-option>
            <ea-option value="contain">包含</ea-option>
            <ea-option value="100% 100%">拉伸</ea-option>
          </EaSelect>
        </div>
        <div class="prop-item flex-1">
          <label class="prop-label">大小</label>
          <div class="size-input-row">
            <UnitInput
              :value="customBackgroundSize"
              @update:value="handleCustomBackgroundSizeInput"
              @unit-change="handleCustomBackgroundSizeUnitChange"
              @blur="handleCustomBackgroundSizeBlur"
              placeholder="auto"
            />
          </div>
        </div>
      </div>

      <!-- 平铺和位置 -->
      <div class="prop-row">
        <div class="prop-item flex-1">
          <label class="prop-label">平铺</label>
          <EaSelect
            :model-value="style?.backgroundRepeat || ''"
            @update:model-value="handleInlineStyleChange('backgroundRepeat', $event)"
            placeholder="默认"
          >
            <ea-option value="">默认</ea-option>
            <ea-option value="no-repeat">不平铺</ea-option>
            <ea-option value="repeat">平铺</ea-option>
            <ea-option value="repeat-x">水平平铺</ea-option>
            <ea-option value="repeat-y">垂直平铺</ea-option>
          </EaSelect>
        </div>
        <div class="prop-item flex-1">
          <label class="prop-label">位置</label>
          <EaSelect
            :model-value="style?.backgroundPosition || ''"
            @update:model-value="handleInlineStyleChange('backgroundPosition', $event)"
            placeholder="默认"
          >
            <ea-option value="">默认</ea-option>
            <ea-option value="center">居中</ea-option>
            <ea-option value="top">顶部</ea-option>
            <ea-option value="bottom">底部</ea-option>
            <ea-option value="left">左侧</ea-option>
            <ea-option value="right">右侧</ea-option>
            <ea-option value="left top">左上</ea-option>
            <ea-option value="right top">右上</ea-option>
            <ea-option value="left bottom">左下</ea-option>
            <ea-option value="right bottom">右下</ea-option>
          </EaSelect>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import UnitInput from '@/components/common/UnitInput.vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'
  import EaColorPicker from '@/components/ea-ui-wrap/EaColorPicker.vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

  interface Props {
    style?: Record<string, string>
  }

  const props = withDefaults(defineProps<Props>(), {
    style: () => ({}),
  })

  const emit = defineEmits<{
    'style-change': [styleName: string, value: string, styleType: string]
  }>()

  // 本地状态：用于编辑期间暂存值
  const localBackgroundImage = ref('')
  const localCustomBackgroundSize = ref('')
  const isEditing = ref(false)

  // 初始化本地状态
  function initLocalState() {
    localBackgroundImage.value = props.style?.backgroundImage || ''
    const size = props.style?.backgroundSize || ''
    if (['cover', 'contain', '100% 100%', ''].includes(size)) {
      localCustomBackgroundSize.value = ''
    } else {
      localCustomBackgroundSize.value = size.replace(/(px|%|em|rem)$/, '')
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

  // 背景尺寸
  const backgroundSize = computed(() => {
    const size = props.style?.backgroundSize || ''
    if (size && !['cover', 'contain', '100% 100%'].includes(size)) {
      return ''
    }
    return size
  })

  // 自定义背景尺寸值
  const customBackgroundSize = computed(() => {
    if (isEditing.value) {
      return localCustomBackgroundSize.value
    }
    const size = props.style?.backgroundSize || ''
    if (['cover', 'contain', '100% 100%', ''].includes(size)) {
      return ''
    }
    return size.replace(/(px|%|em|rem)$/, '')
  })

  // 尺寸单位
  const sizeUnit = ref('px')

  // 处理背景图片变化 - 只更新本地状态
  function handleBackgroundImageInput(value: string) {
    isEditing.value = true
    localBackgroundImage.value = value
  }

  // 失去焦点时提交背景图片
  function handleBackgroundImageBlur() {
    isEditing.value = false
    let value = localBackgroundImage.value
    if (
      value &&
      !value.startsWith('url(') &&
      !value.startsWith('linear-gradient') &&
      !value.startsWith('radial-gradient')
    ) {
      value = `url(${value})`
    }
    emit('style-change', 'backgroundImage', value, 'inline')
  }

  // 处理背景尺寸变化
  function handleBackgroundSizeChange(value: any) {
    if (value) {
      emit('style-change', 'backgroundSize', value, 'inline')
    } else {
      emit('style-change', 'backgroundSize', '', 'inline')
    }
  }

  // 处理自定义背景尺寸变化 - 只更新本地状态
  function handleCustomBackgroundSizeInput(value: string) {
    isEditing.value = true
    localCustomBackgroundSize.value = value
  }

  // 处理自定义背景尺寸单位变化 - 立即提交（用户明确选择单位）
  function handleCustomBackgroundSizeUnitChange(input: string, unit: string) {
    localCustomBackgroundSize.value = input
    sizeUnit.value = unit
    if (input) {
      emit('style-change', 'backgroundSize', `${input}${unit}`, 'inline')
    } else {
      emit('style-change', 'backgroundSize', '', 'inline')
    }
  }

  // 失去焦点时提交自定义背景尺寸
  function handleCustomBackgroundSizeBlur() {
    isEditing.value = false
    if (localCustomBackgroundSize.value) {
      emit(
        'style-change',
        'backgroundSize',
        `${localCustomBackgroundSize.value}${sizeUnit.value}`,
        'inline'
      )
    } else {
      emit('style-change', 'backgroundSize', '', 'inline')
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

@include b(config-group) {
  margin-bottom: 1rem;

  @include e(bg-image-input) {
    width: 100%;
  }

  @include e(size-input-row) {
    display: flex;
    gap: 0.25rem;

    :deep(.unit-input) {
      flex: 1;
    }
  }

  @include e(unit-select) {
    width: 70px;
  }
}
</style>
