<template>
  <div class="variable-binding-input">
    <!-- 输入框区域 -->
    <div class="input-wrapper">
      <!-- 显示变量绑定状态 -->
      <div v-if="isVariable" class="variable-tag">
        <ea-icon icon="icon-link" size="12"></ea-icon>
        <span>{{ variableName }}</span>
        <ea-button type="text" size="small" @click="handleClearVariable">
          <ea-icon icon="icon-cancel" size="10"></ea-icon>
        </ea-button>
      </div>

      <!-- 普通输入框 -->
      <template v-else>
        <EaInput
          v-if="resolvedInputType === 'input'"
          v-model="inputValue"
          size="small"
          :placeholder="resolvedPlaceholder"
          @input="handleInputChange"
        />
        <EaSelect
          v-else-if="resolvedInputType === 'select'"
          :model-value="inputValue"
          size="small"
          :placeholder="resolvedPlaceholder"
          @change="handleInputChange"
        >
          <ea-option v-for="option in options" :key="option.value" :value="option.value"
            >{{ option.label }}</ea-option
          >
        </EaSelect>
        <!-- 多选下拉框 -->
        <EaSelect
          v-else-if="resolvedInputType === 'multi-select'"
          :model-value="multiSelectValue"
          size="small"
          :placeholder="resolvedPlaceholder"
          multiple
          @change="handleMultiSelectChange"
        >
          <ea-option v-for="option in options" :key="option.value" :value="option.value"
            >{{ option.label }}</ea-option
          >
        </EaSelect>
        <EaSwitch
          v-else-if="resolvedInputType === 'switch'"
          :model-value="switchValue"
          @update:modelValue="handleSwitchChange"
        />
        <UnitInput
          v-else-if="resolvedInputType === 'unit'"
          :value="inputValue"
          :placeholder="resolvedPlaceholder"
          @update:value="handleInputChange"
        />
        <ea-color-picker
          v-else-if="resolvedInputType === 'color'"
          :value="inputValue"
          @change="handleColorChange"
          @ea-clear="handleClearVariable"
          class="prop-input flex-1"
        />
        <!-- Array/Object 类型使用按钮打开编辑器 -->
        <ea-button
          v-else-if="resolvedInputType === 'array' || resolvedInputType === 'object'"
          class="w-full text-center flex-1"
          type="primary"
          size="small"
          icon="icon-edit"
          @click="handleOpenEditor"
        >
          {{ editorButtonText }}
        </ea-button>
      </template>

      <!-- 绑定变量按钮 -->
      <ea-button
        type="text"
        size="small"
        class="bind-btn"
        :class="{ 'is-bound': isVariable }"
        @click="handleShowVariableSelector"
      >
        <ea-icon icon="icon-link" size="12"></ea-icon>
      </ea-button>
    </div>

    <!-- 变量选择对话框 -->
    <VariableSelector
      :visible="selectorVisible"
      @select="handleSelectVariable"
      @close="selectorVisible = false"
    />

    <!-- MonacoEditor 弹窗 -->
    <ea-dialog
      :visible="editorVisible"
      :title="editorTitle"
      width="600px"
      @close="handleCloseEditor"
    >
      <div class="editor-content">
        <MonacoEditor v-if="editorVisible" v-model="editorValue" language="json" height="300px" />
      </div>
      <div slot="footer" class="dialog-footer">
        <ea-button @click="handleCloseEditor">取消</ea-button>
        <ea-button type="primary" @click="handleSaveEditor">保存</ea-button>
      </div>
    </ea-dialog>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import VariableSelector from '@/components/designer/VariableSelector.vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'
  import EaSwitch from '@/components/ea-ui-wrap/EaSwitch.vue'
  import UnitInput from '@/components/common/UnitInput.vue'
  import MonacoEditor from '@/components/common/MonacoEditor.vue'

  const props = defineProps({
    value: {
      type: [Object, String, Number, Boolean, Array],
      default: '',
    },
    inputType: {
      type: String,
      default: '',
    },
    // PropTypes 类型（当 inputType 为空时使用）
    type: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: '',
    },
  })

  const emit = defineEmits(['update:value'])

  const selectorVisible = ref(false)
  const editorVisible = ref(false)
  const editorValue = ref('')

  // 判断当前值是否是变量绑定
  const isVariable = computed(() => {
    return props.value && typeof props.value === 'object' && props.value.type === 'variable'
  })

  // 获取变量名
  const variableName = computed(() => {
    if (isVariable.value) {
      return props.value.value
    }
    return ''
  })

  // 根据 type 获取 inputType
  function getInputTypeFromPropType(propType) {
    if (propType === 'select') {
      return 'select'
    }
    if (propType === 'multi-select') {
      return 'multi-select'
    }
    if (propType === 'boolean') {
      return 'switch'
    }
    if (propType === 'unit') {
      return 'unit'
    }
    if (propType === 'color') {
      return 'color'
    }
    if (propType === 'array') {
      return 'array'
    }
    if (propType === 'object') {
      return 'object'
    }
    return 'input'
  }

  // 解析后的 inputType
  const resolvedInputType = computed(() => {
    // 如果直接指定了 inputType，优先使用
    if (props.inputType) {
      return props.inputType
    }
    // 否则根据 type 转换
    if (props.type) {
      return getInputTypeFromPropType(props.type)
    }
    return 'input'
  })

  // 根据 type 获取 placeholder
  function getPlaceholderFromPropType(propType) {
    const placeholders = {
      string: '请输入文本',
      number: '请输入数字',
      color: '请选择颜色',
      object: '输入 JSON 格式数据',
      array: '输入 JSON 格式数据',
      unit: '请输入数值',
      'multi-select': '请选择',
    }
    return placeholders[propType] || '请输入'
  }

  // 解析后的 placeholder
  const resolvedPlaceholder = computed(() => {
    if (props.placeholder) {
      return props.placeholder
    }
    if (props.type) {
      return getPlaceholderFromPropType(props.type)
    }
    return '请输入'
  })

  // 输入框显示的值
  const inputValue = computed(() => {
    if (isVariable.value) {
      return ''
    }

    return props.value
  })

  // Switch 组件的值
  const switchValue = computed(() => {
    if (isVariable.value) {
      return false
    }
    return props.value === true || props.value === 'true'
  })

  // 多选下拉框的值
  const multiSelectValue = computed(() => {
    if (isVariable.value) {
      return []
    }
    // 确保返回数组
    if (Array.isArray(props.value)) {
      return props.value
    }
    return props.value ? [props.value] : []
  })

  // 编辑器标题
  const editorTitle = computed(() => {
    return resolvedInputType.value === 'array' ? '编辑数组' : '编辑对象'
  })

  // 编辑器按钮文本
  const editorButtonText = computed(() => {
    const hasValue = props.value && Object.keys(props.value).length > 0
    return hasValue ? '编辑' : resolvedInputType.value === 'array' ? '编辑数组' : '编辑对象'
  })

  // 处理输入变化
  function handleInputChange(event) {
    const value = event.detail?.value !== undefined ? event.detail.value : event
    emit('update:value', convertValue(value))
  }

  // 处理 Switch 变化
  function handleSwitchChange(value) {
    emit('update:value', convertValue(value))
  }

  // 处理颜色变化
  function handleColorChange(event) {
    const value = event.detail?.value
    emit('update:value', convertValue(value))
  }

  // 处理多选变化
  function handleMultiSelectChange(event) {
    const value = event.detail?.value
    if (Array.isArray(value)) {
      emit('update:value', value)
    } else {
      emit('update:value', value ? [value] : [])
    }
  }

  // 根据 type 转换值
  function convertValue(value) {
    // 获取实际使用的 type（优先使用 props.type）
    const propType = props.type || props.inputType

    switch (propType) {
      case 'number':
        return Number(value) || 0
      case 'boolean':
        return value === 'true' || value === true
      case 'object':
      case 'array':
        try {
          if (typeof value === 'string') {
            return JSON.parse(value)
          }
        } catch {
          return propType === 'array' ? [] : {}
        }
        return value
      default:
        return value
    }
  }

  // 显示变量选择器
  function handleShowVariableSelector() {
    selectorVisible.value = true
  }

  // 选择变量
  function handleSelectVariable(variableName) {
    emit('update:value', {
      type: 'variable',
      value: variableName,
    })
    selectorVisible.value = false
  }

  // 清除变量绑定
  function handleClearVariable() {
    emit('update:value', '')
  }

  // 打开编辑器
  function handleOpenEditor() {
    // 将值转换为 JSON 字符串显示
    try {
      if (props.value && typeof props.value === 'object') {
        editorValue.value = JSON.stringify(props.value, null, 2)
      } else {
        editorValue.value = resolvedInputType.value === 'array' ? '[]' : '{}'
      }
    } catch {
      editorValue.value = resolvedInputType.value === 'array' ? '[]' : '{}'
    }
    editorVisible.value = true
  }

  // 关闭编辑器
  function handleCloseEditor() {
    editorVisible.value = false
    editorValue.value = ''
  }

  // 保存编辑器内容
  function handleSaveEditor() {
    try {
      // 解析 JSON
      const parsedValue = JSON.parse(editorValue.value)

      // 验证类型
      if (resolvedInputType.value === 'array' && !Array.isArray(parsedValue)) {
        alert('值必须是数组格式')
        return
      }
      if (
        resolvedInputType.value === 'object' &&
        (Array.isArray(parsedValue) || typeof parsedValue !== 'object' || parsedValue === null)
      ) {
        alert('值必须是对象格式')
        return
      }

      emit('update:value', parsedValue)
      handleCloseEditor()
    } catch (error) {
      alert('JSON 格式错误，请检查输入')
    }
  }
</script>

<style lang="scss" scoped>
  .variable-binding-input {
    width: 100%;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    text-align: center;
    gap: 0.5rem;

    ea-select[multiple='true'] {
      text-align: start;
    }
  }

  .input-wrapper > *:first-child {
    flex: 1;
  }

  .bind-btn {
    flex-shrink: 0;
    padding: 0.25rem;
    color: #9ca3af;
    transition: color 0.2s;
  }

  .bind-btn:hover {
    color: #3b82f6;
  }

  .bind-btn.is-bound {
    color: #3b82f6;
  }

  .variable-tag {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.5rem;
    background-color: #eff6ff;
    border: 1px solid #3b82f6;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    color: #1e40af;
  }

  .variable-tag span {
    flex: 1;
  }

  .editor-content {
    padding: 1rem;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .w-full {
    width: 100%;
  }

  .text-center {
    text-align: center;
  }
</style>
