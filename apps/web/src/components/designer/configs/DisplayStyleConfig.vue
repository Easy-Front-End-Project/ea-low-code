<template>
  <div class="config-group">
    <h5 class="group-title">布局</h5>
    <div class="space-y-4">
      <!-- Display 选择 -->
      <div class="prop-item">
        <ea-segmented
          name="display-type"
          :value="currentDisplay"
          :options="displayOptions"
          @change="handleDisplayChange"
          class="display-segmented"
          block
        />
      </div>

      <!-- Flex 布局配置 -->
      <template v-if="currentDisplay === 'flex'">
        <!-- 主轴方向 -->
        <div class="prop-row">
          <div class="prop-item flex-1">
            <label class="prop-label">主轴方向</label>
            <ea-segmented
              name="flex-direction"
              :value="flexDirection"
              :options="flexDirectionOptions"
              @change="handleFlexDirectionChange"
              class="flex-segmented"
              block
            />
          </div>
        </div>

        <!-- 换行方式 -->
        <div class="prop-row">
          <div class="prop-item flex-1">
            <label class="prop-label">换行方式</label>
            <EaSelect
              :model-value="flexWrap"
              @update:model-value="handleFlexWrapChange"
              placeholder="不换行"
            >
              <ea-option value="nowrap">不换行</ea-option>
              <ea-option value="wrap">换行</ea-option>
              <ea-option value="wrap-reverse">反向换行</ea-option>
            </EaSelect>
          </div>
        </div>

        <!-- 主轴对齐 -->
        <div class="prop-row">
          <div class="prop-item flex-1">
            <label class="prop-label">主轴对齐</label>
            <EaSelect
              :model-value="justifyContent"
              @update:model-value="handleJustifyContentChange"
              placeholder="起始对齐"
            >
              <ea-option value="flex-start">起始对齐</ea-option>
              <ea-option value="flex-end">末尾对齐</ea-option>
              <ea-option value="center">居中对齐</ea-option>
              <ea-option value="space-between">两端对齐</ea-option>
              <ea-option value="space-around">均匀分布</ea-option>
              <ea-option value="space-evenly">等间距分布</ea-option>
            </EaSelect>
          </div>
        </div>

        <!-- 交叉轴对齐 -->
        <div class="prop-row">
          <div class="prop-item flex-1">
            <label class="prop-label">交叉轴对齐</label>
            <EaSelect
              :model-value="alignItems"
              @update:model-value="handleAlignItemsChange"
              placeholder="拉伸"
            >
              <ea-option value="stretch">拉伸</ea-option>
              <ea-option value="flex-start">起始对齐</ea-option>
              <ea-option value="flex-end">末尾对齐</ea-option>
              <ea-option value="center">居中对齐</ea-option>
              <ea-option value="baseline">基线对齐</ea-option>
            </EaSelect>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'

  interface SegmentedOption {
    label: string
    value: string
  }

  interface Props {
    style?: Record<string, string>
  }

  const props = withDefaults(defineProps<Props>(), {
    style: () => ({}),
  })

  const emit = defineEmits<{
    'style-change': [styleName: string, value: string, styleType: string]
  }>()

  // Display options - 使用静态数据避免重复创建
  const displayOptions: SegmentedOption[] = [
    { label: '块级', value: 'block' },
    { label: '行内', value: 'inline' },
    { label: '行内块', value: 'inline-block' },
    { label: '弹性', value: 'flex' },
    { label: '隐藏', value: 'none' },
  ]

  // Flex direction options
  const flexDirectionOptions: SegmentedOption[] = [
    { label: '水平', value: 'row' },
    { label: '反向水平', value: 'row-reverse' },
    { label: '垂直', value: 'column' },
    { label: '反向垂直', value: 'column-reverse' },
  ]

  // 当前 display 值
  const currentDisplay = computed(() => {
    return props.style?.display || 'block'
  })

  // Flex 相关计算属性
  const flexDirection = computed(() => {
    return props.style?.flexDirection || 'row'
  })

  const flexWrap = computed(() => {
    return props.style?.flexWrap || 'nowrap'
  })

  const justifyContent = computed(() => {
    return props.style?.justifyContent || 'flex-start'
  })

  const alignItems = computed(() => {
    return props.style?.alignItems || 'stretch'
  })

  // 处理 display 变化
  function handleDisplayChange(e: CustomEvent) {
    const newDisplay = e.detail.value
    emit('style-change', 'display', newDisplay, 'inline')

    // 如果不是 flex，清除相关属性
    if (newDisplay !== 'flex') {
      emit('style-change', 'flexDirection', '', 'inline')
      emit('style-change', 'flexWrap', '', 'inline')
      emit('style-change', 'justifyContent', '', 'inline')
      emit('style-change', 'alignItems', '', 'inline')
    }
  }

  // Flex 相关处理函数
  function handleFlexDirectionChange(e: CustomEvent) {
    emit('style-change', 'flexDirection', e.detail.value, 'inline')
  }

  function handleFlexWrapChange(value: any) {
    emit('style-change', 'flexWrap', value, 'inline')
  }

  function handleJustifyContentChange(value: any) {
    emit('style-change', 'justifyContent', value, 'inline')
  }

  function handleAlignItemsChange(value: any) {
    emit('style-change', 'alignItems', value, 'inline')
  }
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/bem.scss';
@import './styles/config-styles.css';

@include b(config-group) {
  @include e(display-segmented) {
    width: 100%;
  }

  @include e(flex-segmented) {
    width: 100%;
  }
}
</style>
