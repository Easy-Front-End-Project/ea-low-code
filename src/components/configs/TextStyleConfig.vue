<template>
  <div class="config-group">
    <h5 class="group-title">文字</h5>
    <div class="space-y-3">
      <!-- 字体样式和对齐方式 -->
      <div class="prop-row">
        <div class="prop-item flex-1">
          <label class="prop-label">字体样式</label>
          <div class="font-style-buttons">
            <ea-check-tag
              :checked="isBold"
              @change="toggleFontStyle('bold')"
              title="加粗"
              class="style-tag"
            >
              B
            </ea-check-tag>
            <ea-check-tag
              :checked="isItalic"
              @change="toggleFontStyle('italic')"
              title="斜体"
              class="style-tag"
            >
              I
            </ea-check-tag>
            <ea-check-tag
              :checked="isUnderline"
              @change="toggleFontStyle('underline')"
              title="下划线"
              class="style-tag"
            >
              U
            </ea-check-tag>
          </div>
        </div>
        <div class="prop-item flex-1">
          <label class="prop-label">对齐方式</label>
          <div class="align-buttons">
            <ea-check-tag
              :checked="textAlign === 'left'"
              @change="setTextAlign('left')"
              title="左对齐"
              class="align-tag"
            >
              <ea-icon name="align-left" variant="solid"></ea-icon>
            </ea-check-tag>
            <ea-check-tag
              :checked="textAlign === 'center'"
              @change="setTextAlign('center')"
              title="居中"
              class="align-tag"
            >
              <ea-icon name="align-center" variant="solid"></ea-icon>
            </ea-check-tag>
            <ea-check-tag
              :checked="textAlign === 'right'"
              @change="setTextAlign('right')"
              title="右对齐"
              class="align-tag"
            >
              <ea-icon name="align-right" variant="solid"></ea-icon>
            </ea-check-tag>
            <ea-check-tag
              :checked="textAlign === 'justify'"
              @change="setTextAlign('justify')"
              title="两端对齐"
              class="align-tag"
            >
              <ea-icon name="align-justify" variant="solid"></ea-icon>
            </ea-check-tag>
          </div>
        </div>
      </div>

      <!-- 字号和行高 -->
      <div class="prop-row">
        <div class="prop-item flex-1">
          <label class="prop-label">字号</label>
          <UnitInput
            :value="style?.fontSize || ''"
            @update:value="handleInlineStyleChange('fontSize', $event)"
            placeholder="eg: 14"
          />
        </div>
        <div class="prop-item flex-1">
          <label class="prop-label">行高</label>
          <UnitInput
            :value="style?.lineHeight || ''"
            @update:value="handleInlineStyleChange('lineHeight', $event)"
            placeholder="eg: 30"
          />
        </div>
      </div>

      <!-- 颜色和字重 -->
      <div class="prop-row">
        <div class="prop-item flex-1">
          <label class="prop-label">颜色</label>
          <div class="color-input-wrapper text-center">
            <ea-color-picker
              :value="style?.color || ''"
              @change="handleInlineStyleChange('color', $event.detail.value)"
              class="color-picker mx-auto"
            />
          </div>
        </div>
      </div>
      <div class="prop-row">
        <div class="prop-item flex-1">
          <label class="prop-label">字重</label>
          <EaSelect
            :model-value="style?.fontWeight || ''"
            @update:model-value="handleInlineStyleChange('fontWeight', $event)"
            placeholder="eg: 400"
          >
            <ea-option value="">默认</ea-option>
            <ea-option value="100">100</ea-option>
            <ea-option value="200">200</ea-option>
            <ea-option value="300">300</ea-option>
            <ea-option value="400">400 (Normal)</ea-option>
            <ea-option value="500">500</ea-option>
            <ea-option value="600">600</ea-option>
            <ea-option value="700">700 (Bold)</ea-option>
            <ea-option value="800">800</ea-option>
            <ea-option value="900">900</ea-option>
          </EaSelect>
        </div>
      </div>

      <!-- 字体和字间距 -->
      <div class="prop-row">
        <div class="prop-item flex-1">
          <label class="prop-label">字体</label>
          <EaSelect
            :model-value="style?.fontFamily || ''"
            @update:model-value="handleInlineStyleChange('fontFamily', $event)"
            placeholder="请选择字体"
          >
            <ea-option value="">默认</ea-option>
            <ea-option value="Arial, sans-serif">Arial</ea-option>
            <ea-option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</ea-option>
            <ea-option value="'Microsoft YaHei', sans-serif">微软雅黑</ea-option>
            <ea-option value="'PingFang SC', sans-serif">苹方</ea-option>
            <ea-option value="'SimSun', serif">宋体</ea-option>
            <ea-option value="'SimHei', sans-serif">黑体</ea-option>
          </EaSelect>
        </div>
        <div class="prop-item flex-1">
          <label class="prop-label">字间距</label>
          <UnitInput
            :value="style?.letterSpacing || ''"
            @update:value="handleInlineStyleChange('letterSpacing', $event)"
            placeholder="eg: 1"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import UnitInput from '../common/UnitInput.vue'
  import EaSelect from '../ea-ui-wrap/EaSelect.vue'

  const props = defineProps({
    style: {
      type: Object,
      default: () => ({}),
    },
  })

  const emit = defineEmits(['style-change'])

  // 字体样式状态
  const isBold = computed(() => {
    const weight = props.style?.fontWeight
    return weight === 'bold' || weight === '700' || weight === 700
  })

  const isItalic = computed(() => props.style?.fontStyle === 'italic')

  const isUnderline = computed(() => props.style?.textDecoration === 'underline')

  // 文本对齐
  const textAlign = computed(() => props.style?.textAlign || 'left')

  // 切换字体样式
  function toggleFontStyle(type) {
    switch (type) {
      case 'bold':
        handleInlineStyleChange('fontWeight', isBold.value ? '' : 'bold')
        break
      case 'italic':
        handleInlineStyleChange('fontStyle', isItalic.value ? '' : 'italic')
        break
      case 'underline':
        handleInlineStyleChange('textDecoration', isUnderline.value ? '' : 'underline')
        break
    }
  }

  // 设置文本对齐
  function setTextAlign(align) {
    handleInlineStyleChange('textAlign', align)
  }

  // 处理样式变更
  function handleInlineStyleChange(styleName, value) {
    emit('style-change', styleName, value, 'inline')
  }
</script>

<style scoped>
  @import './styles/config-styles.css';

  .prop-row {
    gap: 1rem;
  }

  .font-style-buttons,
  .align-buttons {
    display: flex;
    gap: 0.25rem;
  }

  .style-tag,
  .align-tag {
    --ea-check-tag-height: 32px;
    --ea-check-tag-padding: 0 12px;
    font-size: 14px;
  }

  .style-tag {
    font-weight: bold;
  }

  .align-tag {
    font-size: 12px;
  }

  .color-text-input {
    flex: 1;
  }
</style>
