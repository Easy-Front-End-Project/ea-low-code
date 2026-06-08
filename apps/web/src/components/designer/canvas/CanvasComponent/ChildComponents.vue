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

<script setup lang="ts">
  import { NON_SELECTABLE_TYPES, NON_SELECTABLE_IN_PARENT } from '@ea-low-code/shared'
  import type { ComponentSchema } from '@/utils/schemaHelper'
  import CanvasComponent from '../CanvasComponent.vue'

  withDefaults(defineProps<{
    children: ComponentSchema[]
    parentComponent: ComponentSchema
    selectedComponentId?: string | null
  }>(), {
    selectedComponentId: null,
  })

  defineEmits<{
    select: [componentId: string]
    delete: [componentId: string]
    copy: [component: ComponentSchema]
    'drop-to-parent': [payload: { componentMeta: any; parentId: string; slotName: string }]
  }>()

  /** 检查组件类型是否不可选择 */
  function isNonSelectableType(type: string, parentType: string): boolean {
    if (NON_SELECTABLE_TYPES.includes(type)) return true
    return NON_SELECTABLE_IN_PARENT.some(
      (config: any) => config.childType === type && config.parentType === parentType
    )
  }

  /** 获取子组件的属性（排除 slot 和 children） */
  function getChildComponentProps(child: ComponentSchema): Record<string, unknown> {
    const props = child.props || {}
    const resolvedProps: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(props)) {
      if (key === 'slot') continue
      if (key === 'children') continue
      resolvedProps[key] = value
    }

    return resolvedProps
  }
</script>
