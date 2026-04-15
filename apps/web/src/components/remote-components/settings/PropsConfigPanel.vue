<template>
  <div class="props-config-panel">
    <div class="config-header">
      <span class="text-sm text-gray-500">配置组件的属性参数 ({{ props.length }})</span>
      <ea-button type="primary" size="small" icon="plus" @click="$emit('add')">
        添加属性
      </ea-button>
    </div>

    <ea-empty v-if="props.length === 0" description="暂无属性配置，点击上方按钮添加"></ea-empty>

    <div v-else class="config-list">
      <div v-for="(item, index) in props" :key="index" class="config-item">
        <div class="config-item-row">
          <EaInput v-model="item.name" placeholder="属性名 (如: size)" size="small" />
          <EaInput v-model="item.label" placeholder="显示名称 (如: 尺寸)" size="small" />
          <EaSelect v-model="item.type" size="small" placeholder="类型">
            <ea-option value="string">字符串</ea-option>
            <ea-option value="number">数字</ea-option>
            <ea-option value="boolean">布尔值</ea-option>
            <ea-option value="array">数组</ea-option>
            <ea-option value="object">对象</ea-option>
            <ea-option value="function">函数</ea-option>
          </EaSelect>
        </div>
        <div class="config-item-row">
          <EaInput
            v-model="item.defaultValue"
            placeholder="默认值"
            size="small"
            class="flex-2"
          />
          <EaSwitch v-model="item.required" size="small" active-text="必填" />
          <ea-button type="danger" text size="small" icon="trash-can" @click="$emit('remove', index)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'
import EaSwitch from '@/components/ea-ui-wrap/EaSwitch.vue'

defineProps({
  props: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['add', 'remove'])
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(props-config-panel) {
    max-width: 800px;

    .config-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .config-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .config-item {
      padding: 0.75rem;
      background-color: #f9fafb;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }

    .config-item-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      align-items: center;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .config-item-row :deep(.ea-input) {
    flex: 1;
  }

  .config-item-row .flex-2 {
    flex: 2;
  }
</style>
