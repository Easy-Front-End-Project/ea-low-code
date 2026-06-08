<template>
  <!-- 根据 specialConfig.type 渲染对应的特殊配置组件 -->
  <div class="special-config-renderer">
    <component
      v-if="configComponent"
      :is="configComponent"
      :component="component"
      :prop-name="configPropName"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import SelectOptionsConfig from '@/components/designer/configs/special/SelectOptionsConfig.vue'
  import CheckboxGroupConfig from '@/components/designer/configs/special/CheckboxGroupConfig.vue'
  import RadioGroupConfig from '@/components/designer/configs/special/RadioGroupConfig.vue'
  import DropdownOptionsConfig from '@/components/designer/configs/special/DropdownOptionsConfig.vue'

  interface SpecialConfig {
    type?: string
    propName?: string
  }

  interface Props {
    component?: Record<string, any> | null
    specialConfig?: SpecialConfig | null
  }

  const props = withDefaults(defineProps<Props>(), {
    component: null,
    specialConfig: null,
  })

  // 配置类型到组件的映射表（策略模式）
  const configMap: Record<string, Component> = {
    selectOptions: SelectOptionsConfig,
    checkboxGroupOptions: CheckboxGroupConfig,
    radioGroupOptions: RadioGroupConfig,
    dropdownOptions: DropdownOptionsConfig,
  }

  // 根据类型获取对应的配置组件
  const configComponent = computed(() => {
    const type = props.specialConfig?.type
    return type ? configMap[type] : null
  })

  // 配置属性名
  const configPropName = computed(() => props.specialConfig?.propName || 'optionsConfig')
</script>

<style lang="scss" scoped>
  .special-config-renderer {
    /* 容器样式 */
  }
</style>
