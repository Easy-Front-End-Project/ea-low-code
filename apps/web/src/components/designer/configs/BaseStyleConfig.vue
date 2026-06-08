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

<script setup lang="ts">
  import DisplayStyleConfig from './DisplayStyleConfig.vue'
  import BasicLayoutConfig from './BasicLayoutConfig.vue'
  import BorderRadiusStyleConfig from './BorderRadiusStyleConfig.vue'
  import ShadowStyleConfig from './ShadowStyleConfig.vue'
  import PositionStyleConfig from './PositionStyleConfig.vue'
  import BackgroundStyleConfig from './BackgroundStyleConfig.vue'
  import TextStyleConfig from './TextStyleConfig.vue'
  import CustomStyleConfig from './CustomStyleConfig.vue'

  interface Props {
    style?: Record<string, string>
    positionStyle?: Record<string, string>
    customCSS?: string
  }

  withDefaults(defineProps<Props>(), {
    style: () => ({}),
    positionStyle: () => ({}),
    customCSS: '',
  })

  const emit = defineEmits<{
    'style-change': [styleName: string, value: string, styleType: string]
  }>()

  function handleStyleChange(styleName: string, value: string, styleType: string) {
    emit('style-change', styleName, value, styleType)
  }
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/bem.scss';

@include b(props-section) {
  margin-bottom: 1.5rem;
}
</style>
