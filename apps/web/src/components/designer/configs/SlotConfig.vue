<template>
  <div v-if="shouldShow" class="slot-config-section">
    <h4 class="section-title">目标插槽</h4>
    <div class="prop-item">
      <label class="prop-label">插入位置</label>
      <VariableBindingInput
        :value="slotValue"
        input-type="select"
        :options="slotOptions"
        placeholder="选择目标插槽"
        @update:value="handleSlotChange"
      />
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import VariableBindingInput from '@/components/designer/common/VariableBindingInput.vue'

  const props = defineProps({
    // 父组件的插槽定义
    parentSlots: {
      type: Array,
      default: () => [],
    },
    // 当前组件的 slot 值
    slotValue: {
      type: String,
      default: 'default',
    },
  })

  const emit = defineEmits(['slot-change'])

  // 是否显示插槽配置（只有父组件有除 default 外的其他插槽时才显示）
  const shouldShow = computed(() => {
    const namedSlots = props.parentSlots.filter((slot) => slot.name !== 'default')
    return namedSlots.length > 0
  })

  // 插槽选项（包含 default）
  const slotOptions = computed(() => {
    return props.parentSlots.map((slot) => ({
      label: slot.label || slot.name,
      value: slot.name,
    }))
  })

  // 处理插槽变更
  function handleSlotChange(value) {
    // 如果值是变量绑定格式，提取实际值
    if (value && typeof value === 'object' && value.type === 'variable') {
      emit('slot-change', value.value)
    } else {
      emit('slot-change', value)
    }
  }
</script>

<style scoped>
  .slot-config-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .section-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
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
</style>
