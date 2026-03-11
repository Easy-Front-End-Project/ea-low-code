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
          v-if="inputType === 'input'"
          v-model="inputValue"
          size="small"
          :placeholder="placeholder"
          @input="handleInputChange"
        />
        <EaSelect
          v-else-if="inputType === 'select'"
          :model-value="inputValue"
          size="small"
          @change="handleInputChange"
        >
          <ea-option v-for="option in options" :key="option.value" :value="option.value"
            >{{ option.label }}</ea-option
          >
        </EaSelect>
        <EaSwitch
          v-else-if="inputType === 'switch'"
          :model-value="switchValue"
          @update:modelValue="handleSwitchChange"
        />
        <UnitInput
          v-else-if="inputType === 'unit'"
          :value="inputValue"
          :placeholder="placeholder"
          @update:value="handleInputChange"
        />
        <ea-color-picker
          v-else-if="inputType === 'color'"
          :value="inputValue"
          @change="handleColorChange"
          class="prop-input flex-1"
        />
        <!-- Array/Object 类型使用按钮打开编辑器 -->
        <ea-button
          v-else-if="inputType === 'array' || inputType === 'object'"
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
        <MonacoEditor v-model="editorValue" language="json" height="300px" />
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
      type: [Object, String, Number, Boolean],
      default: '',
    },
    inputType: {
      type: String,
      default: 'input',
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

  // 编辑器标题
  const editorTitle = computed(() => {
    return props.inputType === 'array' ? '编辑数组' : '编辑对象'
  })

  // 编辑器按钮文本
  const editorButtonText = computed(() => {
    const hasValue = props.value && Object.keys(props.value).length > 0
    return hasValue ? '编辑' : props.inputType === 'array' ? '编辑数组' : '编辑对象'
  })

  // 处理输入变化
  function handleInputChange(event) {
    const value = event.detail?.value !== undefined ? event.detail.value : event
    emit('update:value', value)
  }

  // 处理 Switch 变化
  function handleSwitchChange(value) {
    emit('update:value', value)
  }

  // 处理颜色变化
  function handleColorChange(event) {
    const value = event.detail?.value
    emit('update:value', value)
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
        editorValue.value = props.inputType === 'array' ? '[]' : '{}'
      }
    } catch {
      editorValue.value = props.inputType === 'array' ? '[]' : '{}'
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
      if (props.inputType === 'array' && !Array.isArray(parsedValue)) {
        alert('值必须是数组格式')
        return
      }
      if (
        props.inputType === 'object' &&
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

<style scoped>
  .variable-binding-input {
    width: 100%;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    text-align: center;
    gap: 0.5rem;
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
