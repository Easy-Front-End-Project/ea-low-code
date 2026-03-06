<template>
  <div class="app-container h-screen w-screen overflow-hidden">
    <DesignerLayout v-show="!isPreviewMode" />
    <PreviewMode v-show="isPreviewMode" />
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useSchemaStore } from '@/stores/designer/schema'
  import DesignerLayout from '@/components/designer/DesignerLayout.vue'
  import PreviewMode from '@/components/designer/PreviewMode.vue'

  const schemaStore = useSchemaStore()
  const isPreviewMode = computed(() => schemaStore.isPreviewMode)
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .app-container {
    background-color: #f5f7fa;
  }
</style>
