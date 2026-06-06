<template>
  <ea-dialog
    :visible="visible"
    title="选择组件"
    width="400px"
    @close="handleClose"
  >
    <div class="selector-list">
      <div
        v-for="comp in flattenComponents"
        :key="comp.id"
        class="selector-item"
        :style="{ paddingLeft: `${comp.level * 16 + 12}px` }"
        @click="handleSelect(comp.id)"
      >
        <ea-icon name="folder" variant="solid" v-if="comp.children?.length" size="14"></ea-icon>
        <ea-icon name="file" variant="solid" v-else size="14"></ea-icon>
        <span class="component-name">{{ comp.name }}</span>
        <span class="component-id">{{ comp.id }}</span>
      </div>
      <ea-empty v-if="flattenComponents.length === 0" description="暂无组件"></ea-empty>
    </div>
  </ea-dialog>
</template>

<script setup>
  import { computed } from 'vue'
  import { useSchemaStore } from '@/components/designer/stores/schema'

  defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['select', 'close'])

  const schemaStore = useSchemaStore()

  // 扁平化组件列表（用于选择器）
  const flattenComponents = computed(() => {
    const result = []
    const components = schemaStore.pageSchema?.components || []

    function flatten(components, level = 0) {
      for (const comp of components) {
        result.push({
          id: comp.id,
          name: getComponentName(comp),
          level,
          children: comp.children,
        })
        if (comp.children?.length) {
          flatten(comp.children, level + 1)
        }
      }
    }

    flatten(components)
    return result
  })

  // 获取组件显示名称
  function getComponentName(component) {
    if (component.props?.children) {
      return `${component.type} - ${String(component.props.children).slice(0, 20)}`
    }
    if (component.props?.label) {
      return `${component.type} - ${component.props.label}`
    }
    if (component.props?.title) {
      return `${component.type} - ${component.props.title}`
    }
    return component.type
  }

  function handleSelect(id) {
    emit('select', id)
  }

  function handleClose() {
    emit('close')
  }
</script>

<style lang="scss" scoped>
  .selector-list {
    max-height: 400px;
    overflow-y: auto;
  }

  .selector-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f7fa;
    }

    .component-name {
      flex: 1;
      font-size: 14px;
      color: #303133;
    }

    .component-id {
      font-size: 12px;
      color: #909399;
    }
  }
</style>
