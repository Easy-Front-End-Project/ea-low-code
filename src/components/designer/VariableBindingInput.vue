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
          v-model="switchValue"
          @change="handleSwitchChange"
        />
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
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import VariableSelector from './VariableSelector.vue'
  import EaInput from '../ea-ui-wrap/EaInput.vue'
  import EaSelect from '../ea-ui-wrap/EaSelect.vue'
  import EaSwitch from '../ea-ui-wrap/EaSwitch.vue'

  const props = defineProps({
    value: {
      type: [Object, String, Number, Boolean],
      default: '',
    },
    inputType: {
      type: String,
      default: 'input', // input | select | switch
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

  // 处理输入变化
  function handleInputChange(event) {
    const value = event.detail?.value !== undefined ? event.detail.value : event
    emit('update:value', value)
  }

  // 处理 Switch 变化
  function handleSwitchChange(value) {
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
</script>

<style scoped>
  .variable-binding-input {
    width: 100%;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
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
</style>
