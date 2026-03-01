<template>
  <component
    :is="componentTag"
    v-bind="component.props"
    :style="component.style"
    @click="handleClick"
  >
    <!-- 默认插槽内容 -->
    <template v-if="component.children && component.children.length > 0">
      <PreviewComponent v-for="child in component.children" :key="child.id" :component="child" />
    </template>
    <template v-else-if="hasDefaultSlot">
      {{ component.props.label || component.props.title || '' }}
    </template>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { getComponentMeta } from '@/constants/componentMeta'

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
})

const componentMeta = computed(() => getComponentMeta(props.component.type))

// 组件标签名（Web Components）
const componentTag = computed(() => props.component.type)

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
