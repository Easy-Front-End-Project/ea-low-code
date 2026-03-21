<template>
  <div class="props-section">
    <!-- 基础分组 -->
    <BasicLayoutConfig :style="style" @style-change="handleStyleChange" />

    <!-- 布局分组 -->
    <DisplayStyleConfig :style="style" @style-change="handleStyleChange" />

    <!-- 文字分组 -->
    <TextStyleConfig :style="style" @style-change="handleStyleChange" />

    <!-- 背景分组 -->
    <BackgroundStyleConfig :style="style" @style-change="handleStyleChange" />

    <!-- 定位分组 -->
    <PositionStyleConfig :position-style="positionStyle" @style-change="handleStyleChange" />

    <!-- 边框 & 圆角分组 -->
    <BorderRadiusStyleConfig :style="style" @style-change="handleStyleChange" />

    <!-- 阴影分组 -->
    <ShadowStyleConfig :style="style" @style-change="handleStyleChange" />

    <!-- 自定义样式分组 -->
    <CustomStyleConfig :custom-c-s-s="customCSS" @style-change="handleStyleChange" />
  </div>
</template>

<script setup>
  import DisplayStyleConfig from './DisplayStyleConfig.vue'
  import BasicLayoutConfig from './BasicLayoutConfig.vue'
  import BorderRadiusStyleConfig from './BorderRadiusStyleConfig.vue'
  import ShadowStyleConfig from './ShadowStyleConfig.vue'
  import PositionStyleConfig from './PositionStyleConfig.vue'
  import BackgroundStyleConfig from './BackgroundStyleConfig.vue'
  import TextStyleConfig from './TextStyleConfig.vue'
  import CustomStyleConfig from './CustomStyleConfig.vue'

  defineProps({
    style: {
      type: Object,
      default: () => ({}),
    },
    positionStyle: {
      type: Object,
      default: () => ({}),
    },
    customCSS: {
      type: String,
      default: '',
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
