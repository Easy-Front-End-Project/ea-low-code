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
          <ea-input
            :value="positionStyle?.zIndex || ''"
            @input="handleInlineStyleChange('zIndex', $event.target.value)"
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
              :value="positionStyle?.top || ''"
              @update:value="handleInlineStyleChange('top', $event)"
              placeholder="auto"
            />
          </div>
          <div class="prop-item flex-1">
            <label class="prop-label">右 (right)</label>
            <UnitInput
              :value="positionStyle?.right || ''"
              @update:value="handleInlineStyleChange('right', $event)"
              placeholder="auto"
            />
          </div>
        </div>
        <div class="prop-row">
          <div class="prop-item flex-1">
            <label class="prop-label">下 (bottom)</label>
            <UnitInput
              :value="positionStyle?.bottom || ''"
              @update:value="handleInlineStyleChange('bottom', $event)"
              placeholder="auto"
            />
          </div>
          <div class="prop-item flex-1">
            <label class="prop-label">左 (left)</label>
            <UnitInput
              :value="positionStyle?.left || ''"
              @update:value="handleInlineStyleChange('left', $event)"
              placeholder="auto"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import UnitInput from '../common/UnitInput.vue'
  import EaSelect from '../ea-ui-wrap/EaSelect.vue'

  const props = defineProps({
    positionStyle: {
      type: Object,
      default: () => ({}),
    },
  })

  const emit = defineEmits(['style-change'])

  // 是否为非 static 定位
  const isPositioned = computed(() => {
    const position = props.positionStyle?.position
    return position && position !== 'static'
  })

  // 处理定位方式变化
  function handlePositionChange(value) {
    emit('style-change', 'position', value, 'position')

    // 如果切换到 static 或空值，清除定位偏移值
    if (!value || value === 'static') {
      emit('style-change', 'top', '', 'position')
      emit('style-change', 'right', '', 'position')
      emit('style-change', 'bottom', '', 'position')
      emit('style-change', 'left', '', 'position')
    }
  }

  function handleInlineStyleChange(styleName, value) {
    emit('style-change', styleName, value, 'position')
  }
</script>

<style scoped>
  @import './styles/config-styles.css';

  .config-group {
    margin-bottom: 1rem;
  }
</style>
