<template>
  <div class="prop-input-wrapper">
    <!-- 使用 VariableBindingInput 包装 -->
    <VariableBindingInput
      :value="value"
      :input-type="getInputType()"
      :options="options"
      :placeholder="getPlaceholder()"
      @update:value="handleValueUpdate"
    />
  </div>
</template>

<script setup>
  import VariableBindingInput from './VariableBindingInput.vue'

  const props = defineProps({
    type: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number, Boolean, Object, Array],
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
  })

  const emit = defineEmits(['update:value'])

  // 获取输入类型
  function getInputType() {
    if (props.type === 'select') {
      return 'select'
    }
    if (props.type === 'boolean') {
      return 'switch'
    }
    return 'input'
  }

  // 获取占位符
  function getPlaceholder() {
    const placeholders = {
      string: '请输入文本',
      number: '请输入数字',
      color: '请选择颜色',
      object: '输入 JSON 格式数据',
      array: '输入 JSON 格式数据',
    }
    return placeholders[props.type] || '请输入'
  }

  // 处理值更新
  function handleValueUpdate(value) {
    // 如果是变量绑定，直接传递
    if (value && typeof value === 'object' && value.type === 'variable') {
      emit('update:value', value)
      return
    }

    // 根据类型转换值
    let convertedValue = value
    switch (props.type) {
      case 'number':
        convertedValue = Number(value) || 0
        break
      case 'boolean':
        convertedValue = value === 'true' || value === true
        break
      case 'object':
      case 'array':
        try {
          if (typeof value === 'string') {
            convertedValue = JSON.parse(value)
          }
        } catch {
          convertedValue = props.type === 'array' ? [] : {}
        }
        break
    }

    emit('update:value', convertedValue)
  }
</script>

<style scoped>
  .prop-input-wrapper {
    width: 100%;
  }
</style>
