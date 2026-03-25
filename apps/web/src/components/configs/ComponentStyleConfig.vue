<template>
  <div class="props-section">
    <h4 class="section-title">组件样式</h4>
    <div class="space-y-3">
      <!-- 动态 CSS 变量样式（根据 type 属性变化） -->
      <template v-if="dynamicCssVariablesList.length > 0">
        <h5 class="subsection-title">类型相关样式</h5>
        <div v-for="variable in dynamicCssVariablesList" :key="variable.name" class="prop-item">
          <label class="prop-label">{{ variable.label }}</label>
          <!-- 颜色类型变量 -->
          <EaColorPicker
            v-if="variable.type === 'color'"
            :model-value="cssVariables?.[variable.name] || variable.default"
            @update:model-value="handleCssVariableChange(variable.name, $event)"
            class="prop-input m-x-auto"
          />
          <!-- 字符串类型变量 -->
          <EaInput
            v-else
            :model-value="cssVariables?.[variable.name] || ''"
            @update:model-value="handleCssVariableChange(variable.name, $event)"
            class="prop-input"
            :placeholder="variable.default"
          />
        </div>
      </template>

      <!-- 通用的 CSS 变量样式（不随 type 变化） -->
      <template v-if="styleConfig?.cssVariables?.length > 0">
        <h5 class="subsection-title">通用主题样式</h5>
        <div v-for="variable in styleConfig.cssVariables" :key="variable.name" class="prop-item">
          <label class="prop-label">{{ variable.label }}</label>
          <!-- 颜色类型变量 -->
          <EaColorPicker
            v-if="variable.type === 'color'"
            :model-value="cssVariables?.[variable.name] || variable.default"
            @update:model-value="handleCssVariableChange(variable.name, $event)"
            class="prop-input m-x-auto"
          />
          <!-- 带单位的变量使用 UnitInput -->
          <UnitInput
            v-else-if="hasUnit(variable.default)"
            :value="cssVariables?.[variable.name] || variable.default"
            @update:value="handleCssVariableChange(variable.name, $event)"
            :placeholder="variable.default"
          />
          <!-- 普通字符串类型变量 -->
          <EaInput
            v-else
            :model-value="cssVariables?.[variable.name] || ''"
            @update:model-value="handleCssVariableChange(variable.name, $event)"
            class="prop-input"
            :placeholder="variable.default"
          />
        </div>
      </template>

      <!-- 无组件样式时显示提示 -->
      <div
        v-if="dynamicCssVariablesList.length === 0 && !styleConfig?.cssVariables?.length"
        class="empty-tip"
      >
        <p class="text-gray-400 text-sm text-center py-4">该组件暂无自定义样式配置</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { getComponentMeta } from '@/constants/componentMeta'
  import UnitInput from '../common/UnitInput.vue'
  import EaInput from '../ea-ui-wrap/EaInput.vue'
  import EaColorPicker from '../ea-ui-wrap/EaColorPicker.vue'

  const props = defineProps({
    componentType: {
      type: String,
      default: '',
    },
    componentProps: {
      type: Object,
      default: () => ({}),
    },
    cssVariables: {
      type: Object,
      default: () => ({}),
    },
  })

  const emit = defineEmits(['css-variable-change'])

  // 获取组件的样式配置
  const styleConfig = computed(() => {
    if (!props.componentType) return null
    const meta = getComponentMeta(props.componentType)
    return meta?.styleConfig || null
  })

  // 动态生成 CSS 变量列表
  const dynamicCssVariablesList = computed(() => {
    const config = styleConfig.value?.dynamicCssVariables
    if (!config) return []

    // 确保 type 有有效值，空字符串或 undefined 都使用 'normal'
    const rawType = props.componentProps?.type
    const type = rawType || 'normal'

    return Object.entries(config).map(([key, variableConfig]) => {
      // 替换模板中的 {type} 为实际的类型值
      const variableName = variableConfig.template.replace('{type}', type)
      // 获取对应类型的默认值，优先使用 type 对应的值，其次使用 normal 作为回退
      const defaultValue =
        variableConfig.defaultValue?.[type] || variableConfig.defaultValue?.normal || ''

      return {
        key,
        name: variableName,
        label: variableConfig.label,
        type: variableConfig.type,
        default: defaultValue,
      }
    })
  })

  // 处理 CSS 变量样式变更
  function handleCssVariableChange(variableName, value) {
    emit('css-variable-change', variableName, value)
  }

  // 检查值是否包含 CSS 单位
  function hasUnit(value) {
    if (!value || typeof value !== 'string') return false
    // 匹配常见的 CSS 单位：px, %, em, rem, vw, vh, pt, pc, in, cm, mm, ex, ch, vmin, vmax
    return /^[\d.]+(px|%|em|rem|vw|vh|pt|pc|in|cm|mm|ex|ch|vmin|vmax)$/i.test(value)
  }
</script>

<style scoped>
  .props-section {
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
  }

  .subsection-title {
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

  .empty-tip {
    padding: 1rem 0;
  }
</style>
