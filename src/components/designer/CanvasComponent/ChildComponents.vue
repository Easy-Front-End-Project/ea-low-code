<template>
  <template v-for="child in children" :key="child.id">
    <!-- 非可选择组件 -->
    <component
      v-if="isNonSelectableType(child.type, parentComponent.type)"
      :is="child.type"
      v-bind="getChildComponentProps(child)"
      style="display: block"
    >
      {{ child.childrenText }}
      <component
        v-for="grandChild in child.children || []"
        :key="grandChild.id"
        :is="grandChild.type"
        v-bind="getChildComponentProps(grandChild)"
        style="display: block"
      >
        {{ grandChild.childrenText }}
      </component>
    </component>

    <!-- 可选择组件 -->
    <div
      v-else
      :slot="child.props?.slot !== 'default' ? child.props.slot : undefined"
      style="display: contents"
    >
      <CanvasComponent
        :component="child"
        :selected="selectedComponentId === child.id"
        :parent-component="parentComponent"
        @select="$emit('select', $event)"
        @delete="$emit('delete', $event)"
        @copy="$emit('copy', $event)"
        @drop-to-parent="$emit('drop-to-parent', $event)"
      />
    </div>
  </template>
</template>

<script setup>
  import { NON_SELECTABLE_TYPES, NON_SELECTABLE_IN_PARENT } from '@/constants/componentTypes'
  import CanvasComponent from '../CanvasComponent.vue'

  defineProps({
    children: { type: Array, required: true },
    parentComponent: { type: Object, required: true },
    selectedComponentId: { type: String, default: null },
  })

  defineEmits(['select', 'delete', 'copy', 'drop-to-parent'])

  /** 检查组件类型是否不可选择 */
  function isNonSelectableType(type, parentType) {
    if (NON_SELECTABLE_TYPES.includes(type)) return true
    return NON_SELECTABLE_IN_PARENT.some(
      config => config.childType === type && config.parentType === parentType
    )
  }

  /** 获取子组件的属性（排除 slot 和 children） */
  function getChildComponentProps(child) {
    const props = child.props || {}
    const resolvedProps = {}

    for (const [key, value] of Object.entries(props)) {
      if (key === 'slot') continue
      if (key === 'children') continue
      resolvedProps[key] = value
    }

    return resolvedProps
  }
</script>
