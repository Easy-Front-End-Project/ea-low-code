<template>
  <ea-dialog :visible="visible" title="组件大纲" width="400px" @close="handleClose">
    <ea-empty v-if="treeData.length === 0" description="暂无组件" icon="box-open" />
    <ea-tree
      v-else
      :data="treeData"
      :dataProps="treeProps"
      :default-expand-all="true"
      show-line
      expand-on-icon-click
      @ea-node-click="handleNodeClick($event.detail.data)"
    />
  </ea-dialog>
</template>

<script setup>
  import { computed, onMounted } from 'vue'
  import { useSchemaStore } from '@/stores/designer/schema'

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['close'])

  const schemaStore = useSchemaStore()

  // 树形组件属性映射
  const treeProps = {
    label: 'name',
    children: 'children',
  }

  // 将组件列表转换为树形数据
  const treeData = computed(() => {
    const components = schemaStore.pageSchema?.components || []
    return components.map(component => convertToTreeNode(component))
  })

  // 转换组件为树节点
  function convertToTreeNode(component) {
    const node = {
      id: component.id,
      name: getComponentName(component),
    }

    // 如果有子组件，递归转换
    if (component.children && component.children.length > 0) {
      node.children = component.children.map(child => convertToTreeNode(child))
    }

    return node
  }

  // 获取组件显示名称
  function getComponentName(component) {
    // 优先使用 children 属性（文本内容）
    if (component.props?.children) {
      return `${component.type} - ${component.props.children}`
    }
    // 其次使用 label 或 title
    if (component.props?.label) {
      return `${component.type} - ${component.props.label}`
    }
    if (component.props?.title) {
      return `${component.type} - ${component.props.title}`
    }
    // 默认使用组件类型
    return component.type
  }

  // 处理节点点击
  function handleNodeClick(data) {
    if (data.id) {
      schemaStore.selectComponent(data.id)
      handleClose()
    }
  }

  // 关闭弹框
  function handleClose() {
    emit('close')
  }

  onMounted(() => {})
</script>

<style scoped></style>
