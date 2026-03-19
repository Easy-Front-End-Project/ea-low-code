<template>
  <div class="props-section">
    <!-- 基础分组 -->
    <BasicLayoutConfig :style="style" @style-change="handleStyleChange" />

    <!-- 文字分组 -->
    <TextStyleConfig :style="style" @style-change="handleStyleChange" />
  </div>
</template>

<script setup>
  import BasicLayoutConfig from './BasicLayoutConfig.vue'
  import TextStyleConfig from './TextStyleConfig.vue'

  const props = defineProps({
    style: {
      type: Object,
      default: () => ({}),
    },
  })

  const emit = defineEmits(['style-change'])

  function handleStyleChange(styleName, value, styleType) {
    emit('style-change', styleName, value, styleType)
  }
</script>

<style scoped>
  .props-section {
    margin-bottom: 1.5rem;
  }
</style>
