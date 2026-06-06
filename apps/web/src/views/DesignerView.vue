<template>
  <div class="h-screen w-screen overflow-hidden">
    <Loading :loading="isLoading" text="正在加载页面...">
      <DesignerLayout />
    </Loading>
  </div>
</template>

<script setup>
  import { onMounted, onBeforeUnmount } from 'vue'
  import { useRoute, onBeforeRouteLeave } from 'vue-router'
  import DesignerLayout from '@/components/designer/DesignerLayout.vue'
  import Loading from '@/components/common/Loading.vue'
  import { useDesignerInit } from '@/components/designer/composables/useDesignerInit'

  const route = useRoute()
  const { isLoading, isDirty, triggerAutoSave, loadPageSchema, getLeaveGuard } = useDesignerInit(
    route.params.id
  )

  onBeforeRouteLeave(getLeaveGuard())

  function handleBeforeUnload(e) {
    if (isDirty.value) {
      e.preventDefault()
      e.returnValue = ''
    }
  }

  onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
    loadPageSchema()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })
</script>
