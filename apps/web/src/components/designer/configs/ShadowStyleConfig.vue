<template>
  <div class="config-group">
    <h5 class="group-title">阴影</h5>
    <div class="space-y-3">
      <!-- 阴影类型选择 -->
      <div class="prop-item">
        <label class="prop-label">阴影</label>
        <ea-segmented
          ref="shadowTypeRef"
          name="shadow-type"
          :value="shadowType"
          :options="shadowTypeOptions"
          @change="handleShadowTypeChange"
        />
      </div>

      <!-- 颜色、推荐阴影 -->
      <template v-if="shadowType !== 'none'">
        <div class="prop-row">
          <div class="prop-item flex-1">
            <label class="prop-label">推荐阴影</label>
            <EaSelect
              :model-value="selectedPreset"
              @update:model-value="handlePresetChange"
              placeholder="选择推荐阴影"
            >
              <ea-option value=" ">自定义</ea-option>
              <ea-option value="light">轻微阴影</ea-option>
              <ea-option value="dark">深色阴影</ea-option>
              <ea-option value="outer">外部阴影</ea-option>
              <ea-option value="inner">内阴影</ea-option>
              <ea-option value="card">卡片阴影</ea-option>
              <ea-option value="button">按钮阴影</ea-option>
              <ea-option value="float">浮动阴影</ea-option>
              <ea-option value="focus">聚焦阴影</ea-option>
            </EaSelect>
          </div>
          <div class="prop-item flex-1">
            <label class="prop-label">颜色</label>
            <EaColorPicker
              :model-value="shadowColor"
              @update:model-value="handleShadowColorChange"
              class="color-picker"
            />
          </div>
        </div>

        <!-- X轴、Y轴、模糊、扩展 -->
        <div class="prop-row">
          <div class="prop-item flex-1">
            <label class="prop-label">X轴</label>
            <UnitInput
              :value="shadowX"
              @update:value="handleShadowValueInput('x', $event)"
              @unit-change="handleShadowValueUnitChange('x', $event)"
              @blur="handleShadowValueBlur"
              placeholder="0"
            />
          </div>
          <div class="prop-item flex-1">
            <label class="prop-label">Y轴</label>
            <UnitInput
              :value="shadowY"
              @update:value="handleShadowValueInput('y', $event)"
              @unit-change="handleShadowValueUnitChange('y', $event)"
              @blur="handleShadowValueBlur"
              placeholder="0"
            />
          </div>
        </div>
        <div class="prop-row">
          <div class="prop-item flex-1">
            <label class="prop-label">模糊</label>
            <UnitInput
              :value="shadowBlur"
              @update:value="handleShadowValueInput('blur', $event)"
              @unit-change="handleShadowValueUnitChange('blur', $event)"
              @blur="handleShadowValueBlur"
              placeholder="0"
            />
          </div>
          <div class="prop-item flex-1">
            <label class="prop-label">扩展</label>
            <UnitInput
              :value="shadowSpread"
              @update:value="handleShadowValueInput('spread', $event)"
              @unit-change="handleShadowValueUnitChange('spread', $event)"
              @blur="handleShadowValueBlur"
              placeholder="0"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import UnitInput from '@/components/common/UnitInput.vue'
  import EaColorPicker from '@/components/ea-ui-wrap/EaColorPicker.vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'

  const props = defineProps({
    style: {
      type: Object,
      default: () => ({}),
    },
  })

  const emit = defineEmits(['style-change'])

  const shadowTypeRef = ref(null)

  // 阴影类型选项
  const shadowTypeOptions = [
    { label: '无', value: 'none' },
    { label: '内阴影', value: 'inset' },
    { label: '外阴影', value: 'outset' },
  ]

  // 推荐阴影预设
  const shadowPresets = {
    light: { x: '0', y: '2', blur: '4', spread: '0', color: 'rgba(0,0,0,0.1)' },
    dark: { x: '0', y: '4', blur: '8', spread: '0', color: 'rgba(0,0,0,0.3)' },
    outer: { x: '0', y: '8', blur: '16', spread: '0', color: 'rgba(0,0,0,0.15)' },
    inner: { x: '0', y: '2', blur: '4', spread: '0', color: 'rgba(0,0,0,0.1)' },
    card: { x: '0', y: '4', blur: '12', spread: '0', color: 'rgba(0,0,0,0.1)' },
    button: { x: '0', y: '2', blur: '0', spread: '0', color: 'rgba(0,0,0,0.15)' },
    float: { x: '0', y: '8', blur: '24', spread: '0', color: 'rgba(0,0,0,0.12)' },
    focus: { x: '0', y: '0', blur: '0', spread: '3', color: 'rgba(64,158,255,0.3)' },
  }

  // 当前选中的预设
  const selectedPreset = ref('')

  // 本地状态：用于编辑期间暂存阴影值
  const localShadowValues = ref({ x: '0', y: '0', blur: '0', spread: '0' })
  const isEditingShadow = ref(false)
  const currentEditingKey = ref(null)

  // 初始化本地阴影值
  function initLocalShadowValues() {
    localShadowValues.value = {
      x: shadowX.value,
      y: shadowY.value,
      blur: shadowBlur.value,
      spread: shadowSpread.value,
    }
  }

  // 解析当前的 boxShadow 值
  const parsedShadow = computed(() => {
    const boxShadow = props.style?.boxShadow
    if (!boxShadow || boxShadow === 'none') {
      return { type: 'none', x: '0', y: '0', blur: '0', spread: '0', color: '#000000' }
    }

    // 检查是否是内阴影
    const isInset = boxShadow.includes('inset')
    const type = isInset ? 'inset' : 'outset'

    // 移除 inset 关键字，便于解析
    let shadowValue = boxShadow.replace(/inset\s+/gi, '').trim()

    // 解析阴影值：x y blur spread color
    // 颜色可能是 rgb, rgba, hex 或颜色名称，可能在最前或最后
    let color = '#000000'
    let values = shadowValue

    // 尝试匹配颜色（在最后）
    const colorMatchEnd = shadowValue.match(/(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|[a-zA-Z]+)$/)
    if (colorMatchEnd) {
      color = colorMatchEnd[1]
      values = shadowValue.substring(0, shadowValue.lastIndexOf(color)).trim()
    }

    // 解析数值部分
    const numValues = values.split(/\s+/).map(v => parseFloat(v) || 0)

    return {
      type,
      x: String(numValues[0] || 0),
      y: String(numValues[1] || 0),
      blur: String(numValues[2] || 0),
      spread: String(numValues[3] || 0),
      color,
    }
  })

  // 阴影类型
  const shadowType = computed(() => parsedShadow.value.type)

  // 阴影各值
  const shadowX = computed(() =>
    isEditingShadow.value && currentEditingKey.value === 'x'
      ? localShadowValues.value.x
      : parsedShadow.value.x
  )
  const shadowY = computed(() =>
    isEditingShadow.value && currentEditingKey.value === 'y'
      ? localShadowValues.value.y
      : parsedShadow.value.y
  )
  const shadowBlur = computed(() =>
    isEditingShadow.value && currentEditingKey.value === 'blur'
      ? localShadowValues.value.blur
      : parsedShadow.value.blur
  )
  const shadowSpread = computed(() =>
    isEditingShadow.value && currentEditingKey.value === 'spread'
      ? localShadowValues.value.spread
      : parsedShadow.value.spread
  )
  const shadowColor = computed(() => parsedShadow.value.color)

  // 处理阴影类型变化
  function handleShadowTypeChange(event) {
    const type = event.detail?.value

    if (type === 'none') {
      emit('style-change', 'boxShadow', 'none', 'inline')
      selectedPreset.value = ''
    } else {
      // 根据类型设置默认阴影值
      const x = shadowX.value !== '0' ? shadowX.value : '0'
      const y = shadowY.value !== '0' ? shadowY.value : '2'
      const blur = shadowBlur.value !== '0' ? shadowBlur.value : '4'
      const spread = shadowSpread.value !== '0' ? shadowSpread.value : '0'
      const color = shadowColor.value !== '#000000' ? shadowColor.value : 'rgba(0,0,0,0.2)'

      const inset = type === 'inset' ? 'inset ' : ''
      const boxShadow = `${inset}${x}px ${y}px ${blur}px ${spread}px ${color}`
      emit('style-change', 'boxShadow', boxShadow, 'inline')
    }
  }

  // 处理推荐阴影选择
  function handlePresetChange(preset) {
    selectedPreset.value = preset

    if (!preset || !shadowPresets[preset]) return

    const presetValues = shadowPresets[preset]
    const type = shadowType.value === 'none' ? 'outset' : shadowType.value

    // 更新阴影类型为外阴影或内阴影（根据预设）
    if (preset === 'inner') {
      // 手动触发类型切换
      if (shadowTypeRef.value) {
        shadowTypeRef.value.setAttribute('value', 'inset')
      }
    }

    const inset = type === 'inset' || preset === 'inner' ? 'inset ' : ''
    const boxShadow = `${inset}${presetValues.x}px ${presetValues.y}px ${presetValues.blur}px ${presetValues.spread}px ${presetValues.color}`

    emit('style-change', 'boxShadow', boxShadow, 'inline')
  }

  // 处理阴影颜色变化
  function handleShadowColorChange(color) {
    if (shadowType.value === 'none') return

    const inset = shadowType.value === 'inset' ? 'inset ' : ''
    const boxShadow = `${inset}${shadowX.value}px ${shadowY.value}px ${shadowBlur.value}px ${shadowSpread.value}px ${color}`

    emit('style-change', 'boxShadow', boxShadow, 'inline')
    selectedPreset.value = '' // 自定义时清空预设选择
  }

  // 处理阴影数值变化 - 只更新本地状态
  function handleShadowValueInput(key, value) {
    if (!isEditingShadow.value) {
      initLocalShadowValues()
    }
    isEditingShadow.value = true
    currentEditingKey.value = key
    localShadowValues.value[key] = value
  }

  // 处理阴影数值单位变化 - 立即提交（用户明确选择单位）
  function handleShadowValueUnitChange(key, input, unit) {
    localShadowValues.value[key] = input
    isEditingShadow.value = false
    currentEditingKey.value = null

    if (shadowType.value === 'none') return

    const x = localShadowValues.value.x
    const y = localShadowValues.value.y
    const blur = localShadowValues.value.blur
    const spread = localShadowValues.value.spread

    const inset = shadowType.value === 'inset' ? 'inset ' : ''
    const boxShadow = `${inset}${x}${unit} ${y}px ${blur}px ${spread}px ${shadowColor.value}`

    emit('style-change', 'boxShadow', boxShadow, 'inline')
    selectedPreset.value = ''
  }

  // 失去焦点时提交阴影值
  function handleShadowValueBlur() {
    isEditingShadow.value = false
    currentEditingKey.value = null

    if (shadowType.value === 'none') return

    const x = localShadowValues.value.x
    const y = localShadowValues.value.y
    const blur = localShadowValues.value.blur
    const spread = localShadowValues.value.spread

    const inset = shadowType.value === 'inset' ? 'inset ' : ''
    const boxShadow = `${inset}${x}px ${y}px ${blur}px ${spread}px ${shadowColor.value}`

    emit('style-change', 'boxShadow', boxShadow, 'inline')
    selectedPreset.value = ''
  }
</script>

<style scoped>
  @import './styles/config-styles.css';
</style>
