<template>
  <div class="config-group">
    <h5 class="group-title">基础</h5>
    <div class="space-y-3">
      <div class="prop-item">
        <label class="prop-label">宽度</label>
        <UnitInput
          :value="style?.width || ''"
          @update:value="handleInlineStyleChange('width', $event)"
          placeholder="auto"
        />
      </div>
      <div class="prop-item">
        <label class="prop-label">高度</label>
        <UnitInput
          :value="style?.height || ''"
          @update:value="handleInlineStyleChange('height', $event)"
          placeholder="auto"
        />
      </div>
      <div class="prop-item">
        <label class="prop-label">外边距</label>
        <SpaceInput
          :value="style?.margin || ''"
          @update:value="handleInlineStyleChange('margin', $event)"
        />
      </div>
      <div class="prop-item">
        <label class="prop-label">内边距</label>
        <SpaceInput
          :value="style?.padding || ''"
          @update:value="handleInlineStyleChange('padding', $event)"
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

<script setup>
  import { computed } from 'vue'
  import UnitInput from '../common/UnitInput.vue'
  import SpaceInput from '../common/SpaceInput.vue'
  import EaSlider from '../ea-ui-wrap/EaSlider.vue'

  const props = defineProps({
    style: {
      type: Object,
      default: () => ({}),
    },
  })

  const emit = defineEmits(['style-change'])

  const opacityValue = computed(() => {
    const opacity = props.style?.opacity
    if (opacity === undefined || opacity === '') return 1
    const val = parseFloat(opacity)
    return isNaN(val) ? 1 : Math.max(0, Math.min(1, val))
  })

  function handleOpacityChange(value) {
    emit('style-change', 'opacity', String(value), 'inline')
  }

  function handleInlineStyleChange(styleName, value) {
    emit('style-change', styleName, value, 'inline')
  }
</script>

<style scoped>
  .config-group {
    margin-bottom: 1rem;
  }

  .group-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .prop-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .prop-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
  }

  .opacity-control {
    padding: 0.5rem 0;
  }
</style>
