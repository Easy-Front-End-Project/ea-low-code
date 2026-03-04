<template>
  <component
    :is="componentTag"
    v-bind="componentProps"
    :style="component.style"
    @click="handleClick"
  >
    <!-- 默认插槽内容 -->
    <template v-if="hasNestedChildren">
      <PreviewComponent v-for="child in component.children" :key="child.id" :component="child" />
    </template>
    <template v-else-if="hasChildrenText">
      <ea-text type="normal" size="medium">{{ resolvedChildrenText }}</ea-text>
    </template>
    <template v-else-if="hasDefaultSlot">
      <ea-text type="normal" size="medium"
        >{{ componentProps.label || componentProps.title || '' }}</ea-text
      >
    </template>
  </component>
</template>

<script setup>
  import { computed } from 'vue'
  import { getComponentMeta } from '@/constants/componentMeta'
  import { useVariableStore } from '@/stores/designer/variable'

  const props = defineProps({
    component: {
      type: Object,
      required: true,
    },
  })

  const variableStore = useVariableStore()
  const componentMeta = computed(() => getComponentMeta(props.component.type))

  // 组件标签名（Web Components）
  const componentTag = computed(() => props.component.type)

  // 是否有嵌套子组件（数组形式的 children）
  const hasNestedChildren = computed(() => {
    return Array.isArray(props.component.children) && props.component.children.length > 0
  })

  // 解析值（处理变量绑定）
  function resolveValue(value) {
    // 如果是变量绑定格式 { type: 'variable', value: 'varName' }
    if (value && typeof value === 'object' && value.type === 'variable') {
      const varValue = variableStore.getVariableDefaultValue(value.value)
      return varValue !== undefined ? varValue : ''
    }
    return value
  }

  // 是否有 children 文本属性（字符串形式的 children）
  const hasChildrenText = computed(() => {
    const childrenValue = resolveValue(props.component.props?.children)
    return typeof childrenValue === 'string' && childrenValue.length > 0
  })

  // 解析后的 children 文本
  const resolvedChildrenText = computed(() => {
    return resolveValue(props.component.props?.children) || ''
  })

  // 传递给组件的 props（解析变量绑定）
  const componentProps = computed(() => {
    const rawProps = props.component.props || {}
    const resolvedProps = {}

    // 遍历所有属性，解析变量绑定
    for (const [key, value] of Object.entries(rawProps)) {
      resolvedProps[key] = resolveValue(value)
    }

    return resolvedProps
  })

  // 是否有默认插槽
  const hasDefaultSlot = computed(() => {
    return componentMeta.value?.slots?.some((slot) => slot.name === 'default')
  })

  // 点击事件（预览模式下可以添加交互）
  function handleClick() {
    // 查找绑定的 click 事件
    const clickEvent = props.component.events?.find((e) => e.name === 'click')
    if (clickEvent?.handler) {
      console.log(`执行事件处理器: ${clickEvent.handler}`)
      // 在实际应用中，这里会执行对应的事件处理逻辑
    }
  }
</script>

<style scoped>
  /* 预览模式下组件样式 */
  :deep(*) {
    pointer-events: auto;
  }
</style>
