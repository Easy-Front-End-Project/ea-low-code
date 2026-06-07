<template>
  <div class="flex items-center gap-3 cursor-pointer" @click="handleClick">
    <div
      class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold"
    >
      EW
    </div>
    <span class="text-lg font-semibold text-gray-800">EaWeave</span>
  </div>
</template>

<script setup lang="ts">
  import router from '@/router'

  const emit = defineEmits<{
    (e: 'click'): void
  }>()

  function handleClick() {
    // emit('click')
    router.replace('/')
  }
</script>
