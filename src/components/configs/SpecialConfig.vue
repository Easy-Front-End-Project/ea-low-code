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

<script setup>
  import { computed } from 'vue'
  import SelectOptionsConfig from '@/components/configs/special/SelectOptionsConfig.vue'
  import CheckboxGroupConfig from '@/components/configs/special/CheckboxGroupConfig.vue'
  import RadioGroupConfig from '@/components/configs/special/RadioGroupConfig.vue'
  import DropdownOptionsConfig from '@/components/configs/special/DropdownOptionsConfig.vue'

  /**
   * 特殊配置渲染器
   */
  const props = defineProps({
    // 当前选中的组件
    component: {
      type: Object,
      default: null,
    },
    // 组件元数据中的 specialConfig
    specialConfig: {
      type: Object,
      default: null,
    },
  })

  // 配置类型到组件的映射表（策略模式）
  const configMap = {
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
