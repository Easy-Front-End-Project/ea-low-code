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
          :model-value="style?.backgroundImage || ''"
          @update:model-value="handleBackgroundImageChange($event)"
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
              @update:value="handleCustomBackgroundSizeChange"
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

<script setup>
  import { computed, ref } from 'vue'
  import UnitInput from '../common/UnitInput.vue'
  import EaSelect from '../ea-ui-wrap/EaSelect.vue'
  import EaColorPicker from '../ea-ui-wrap/EaColorPicker.vue'
  import EaInput from '../ea-ui-wrap/EaInput.vue'

  const props = defineProps({
    style: {
      type: Object,
      default: () => ({}),
    },
  })

  const emit = defineEmits(['style-change'])

  // 背景尺寸
  const backgroundSize = computed(() => {
    const size = props.style?.backgroundSize || ''
    // 如果是自定义尺寸（包含px/%等单位），返回空字符串让下拉框显示placeholder
    if (size && !['cover', 'contain', '100% 100%'].includes(size)) {
      return ''
    }
    return size
  })

  // 自定义背景尺寸值
  const customBackgroundSize = computed(() => {
    const size = props.style?.backgroundSize || ''
    // 如果是预设值，返回空
    if (['cover', 'contain', '100% 100%', ''].includes(size)) {
      return ''
    }
    // 提取数值部分
    return size.replace(/(px|%|em|rem)$/, '')
  })

  // 尺寸单位
  const sizeUnit = ref('px')

  // 处理背景图片变化
  function handleBackgroundImageChange(value) {
    // 如果用户输入的是URL但不是url()格式，自动添加
    if (
      value &&
      !value.startsWith('url(') &&
      !value.startsWith('linear-gradient') &&
      !value.startsWith('radial-gradient')
    ) {
      value = `url(${value})`
    }
    handleInlineStyleChange('backgroundImage', value)
  }

  // 处理背景尺寸变化
  function handleBackgroundSizeChange(value) {
    if (value) {
      handleInlineStyleChange('backgroundSize', value)
    } else {
      handleInlineStyleChange('backgroundSize', '')
    }
  }

  // 处理自定义背景尺寸变化
  function handleCustomBackgroundSizeChange(value) {
    if (value) {
      handleInlineStyleChange('backgroundSize', `${value}${sizeUnit.value}`)
    } else {
      handleInlineStyleChange('backgroundSize', '')
    }
  }

  // 处理单位变化
  function handleSizeUnitChange(unit) {
    sizeUnit.value = unit
    // 如果有自定义尺寸值，更新它
    if (customBackgroundSize.value) {
      handleInlineStyleChange('backgroundSize', `${customBackgroundSize.value}${unit}`)
    }
  }

  function handleInlineStyleChange(styleName, value) {
    emit('style-change', styleName, value, 'inline')
  }
</script>

<style scoped>
  @import './styles/config-styles.css';

  .config-group {
    margin-bottom: 1rem;
  }

  .bg-image-input {
    width: 100%;
  }

  .size-input-row {
    display: flex;
    gap: 0.25rem;
  }

  .size-input-row :deep(.unit-input) {
    flex: 1;
  }

  .unit-select {
    width: 70px;
  }
</style>
