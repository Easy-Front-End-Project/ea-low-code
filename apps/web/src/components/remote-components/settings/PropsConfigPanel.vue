<template>
  <div class="props-config-panel">
    <div class="props-config-panel__header">
      <span class="text-sm">配置组件的属性参数 ({{ props.length }})</span>
      <ea-button type="primary" size="small" icon="plus" @click="$emit('add')">
        添加属性
      </ea-button>
    </div>

    <ea-empty v-if="props.length === 0" description="暂无属性配置，点击上方按钮添加"></ea-empty>

    <div v-else class="props-config-panel__list">
      <div v-for="(item, index) in props" :key="index" class="props-config-panel__item">
        <div class="props-config-panel__row">
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
        <div class="props-config-panel__row">
          <EaInput v-model="item.defaultValue" placeholder="默认值" size="small" class="flex-2" />
          <!-- <EaSwitch v-model="item.required" size="small" active-text="必填" /> -->
          <ea-button
            type="danger"
            text
            size="small"
            icon="trash-can"
            @click="$emit('remove', index)"
          />
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

    @include e(header) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding: 0.875rem 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
      color: white;

      .text-sm {
        color: rgba(255, 255, 255, 0.95);
        font-weight: 500;
        letter-spacing: 0.3px;
      }
    }

    @include e(list) {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    @include e(item) {
      padding: 1.25rem;
      background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
        border-color: #a5b4fc;
      }
    }

    @include e(row) {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      align-items: center;
      transition: opacity 0.2s ease;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  :deep(.ea-input) {
    flex: 1;
    transition: all 0.25s ease;

    &:focus-within {
      transform: scale(1.01);
    }
  }

  .flex-2 {
    flex: 2;
  }
</style>
