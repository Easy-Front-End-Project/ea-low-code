<template>
  <div class="props-section">
    <h4 class="section-title">样式</h4>
    <div class="space-y-3">
      <!-- 基础样式 -->
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
        <label class="prop-label">外边距(px)</label>
        <SpaceInput
          :value="style?.margin || ''"
          @update:value="handleInlineStyleChange('margin', $event)"
        />
      </div>
      <div class="prop-item">
        <label class="prop-label">内边距(px)</label>
        <SpaceInput
          :value="style?.padding || ''"
          @update:value="handleInlineStyleChange('padding', $event)"
        />
      </div>

      <!-- 动态 CSS 变量样式（根据 type 属性变化） -->
      <template v-if="dynamicCssVariablesList.length > 0">
        <div class="divider"></div>
        <h5 class="subsection-title">组件样式</h5>
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
      <template v-if="(styleConfig?.cssVariables?.length ?? 0) > 0">
        <div class="divider"></div>
        <h5 class="subsection-title">通用样式</h5>
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
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { getComponentMeta, type StyleConfig } from '@/components/designer/constants/componentMeta'
  import UnitInput from '@/components/common/UnitInput.vue'
  import SpaceInput from '@/components/common/SpaceInput.vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaColorPicker from '@/components/ea-ui-wrap/EaColorPicker.vue'

  interface DynamicCssVariable {
    key: string
    name: string
    label: string
    type: string
    default: string
  }

  interface Props {
    componentType?: string
    componentProps?: Record<string, any>
    style?: Record<string, string>
    cssVariables?: Record<string, string>
  }

  const props = withDefaults(defineProps<Props>(), {
    componentType: '',
    componentProps: () => ({}),
    style: () => ({}),
    cssVariables: () => ({}),
  })

  const emit = defineEmits<{
    'style-change': [styleName: string, value: string, styleType: string]
    'css-variable-change': [variableName: string, value: string]
  }>()

  const emptyStyleConfig: StyleConfig = { parts: [], cssVariables: [], dynamicCssVariables: {} }

  // 获取组件的样式配置
  const styleConfig = computed(() => {
    if (!props.componentType) return emptyStyleConfig
    const meta = getComponentMeta(props.componentType)
    return meta?.styleConfig || emptyStyleConfig
  })

  // 动态生成 CSS 变量列表
  const dynamicCssVariablesList = computed<DynamicCssVariable[]>(() => {
    const config = styleConfig.value?.dynamicCssVariables
    if (!config) return []

    // 确保 type 有有效值，空字符串或 undefined 都使用 'normal'
    const rawType = props.componentProps?.type
    const type = rawType || 'normal'

    return Object.entries(config).map(([key, variableConfig]: [string, any]) => {
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

  // 处理内联样式变更
  function handleInlineStyleChange(styleName: string, value: string) {
    emit('style-change', styleName, value, 'inline')
  }

  // 处理 CSS 变量样式变更
  function handleCssVariableChange(variableName: string, value: string) {
    emit('css-variable-change', variableName, value)
  }

  // 检查值是否包含 CSS 单位
  function hasUnit(value: string | undefined): boolean {
    if (!value || typeof value !== 'string') return false
    // 匹配常见的 CSS 单位：px, %, em, rem, vw, vh, pt, pc, in, cm, mm, ex, ch, vmin, vmax
    return /^[\d.]+(px|%|em|rem|vw|vh|pt|pc|in|cm|mm|ex|ch|vmin|vmax)$/i.test(value)
  }
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/bem.scss';

@include b(props-section) {
  margin-bottom: 1.5rem;

  @include e(section-title) {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
  }

  @include e(subsection-title) {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @include e(prop-item) {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  @include e(prop-label) {
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
  }

  @include e(divider) {
    height: 1px;
    background-color: #e5e7eb;
    margin: 0.75rem 0;
  }
}
</style>
