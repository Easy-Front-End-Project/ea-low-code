<template>
  <ea-drawer
    :visible="visible"
    title="页面预览"
    size="90%"
    placement="right"
    :close-on-click-modal="false"
    @update:visible="handleVisibleChange"
  >
    <template v-if="visible">
      <PreviewMode @close="handleClose" />
    </template>
  </ea-drawer>
</template>

<script setup>
import { watch } from 'vue'
import { useSchemaStore } from '@/stores/designer/schema'
import { getProjectDetail } from '@/api/projects.js'
import PreviewMode from '@/components/layouts/preview/PreviewMode.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  pageId: {
    type: [Number, String],
    default: null,
  },
})

const emit = defineEmits(['update:visible'])

const schemaStore = useSchemaStore()

function handleVisibleChange(val) {
  emit('update:visible', val)
}

function handleClose() {
  emit('update:visible', false)
}

async function loadPageSchema() {
  if (!props.pageId) return

  try {
    const page = await getProjectDetail(props.pageId)
    if (page?.schema) {
      schemaStore.setPageSchema(page.schema)
      schemaStore.setComponents(page.schema.components || [])
    }
  } catch (error) {
    console.error('加载页面预览失败:', error)
    window.$message?.error('加载预览数据失败')
  }
}

watch(
  () => props.visible,
  async val => {
    if (val && props.pageId) {
      await loadPageSchema()
    }
  }
)
</script>
