<template>
  <div v-if="shouldShow" class="slot-scope-config-section">
    <h4 class="section-title">插槽 Scope 绑定</h4>
    <div class="scope-select">
      <EaSelect
        v-model="selectedScope"
        placeholder="选择要绑定的 scope 数据"
        clearable
        @change="handleScopeChange"
      >
        <ea-option v-for="item in scopeOptions" :key="item.value" :value="item.value">
          {{ item.label }}
        </ea-option>
      </EaSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'

  interface SlotScopeItem {
    name: string
    label?: string
  }

  interface SlotDefinition {
    name: string
    slotScope?: SlotScopeItem[]
  }

  interface Props {
    parentSlots?: SlotDefinition[]
    slotValue?: string
    scope?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    parentSlots: () => [],
    slotValue: 'default',
    scope: '',
  })

  const emit = defineEmits<{
    'scope-change': [value: string]
  }>()

  // 获取当前插槽的 slotScope 定义
  const currentSlot = computed(() => {
    return props.parentSlots.find(slot => slot.name === props.slotValue)
  })

  // 当前插槽可用的 scope 数据
  const availableSlotScope = computed(() => {
    return currentSlot.value?.slotScope || []
  })

  // 是否显示 scope 配置
  const shouldShow = computed(() => {
    return availableSlotScope.value.length > 0
  })

  // scope 选项
  const scopeOptions = computed(() => {
    return availableSlotScope.value.map(item => ({
      label: `${item.label || item.name}`,
      value: item.name,
    }))
  })

  // 当前选中的 scope
  const selectedScope = computed({
    get(): string {
      return props.scope || ''
    },
    set(value: string) {
      emit('scope-change', value || '')
    },
  })

  // 处理 scope 变更
  function handleScopeChange(value: any) {
    emit('scope-change', value || '')
  }
</script>

<style lang="scss" scoped>
@include b(slot-scope-config-section) {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;

  @include e(section-title) {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
  }

  @include e(scope-select) {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    easelect {
      width: 100%;
    }
  }
}
</style>
