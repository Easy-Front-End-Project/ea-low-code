<template>
  <div class="set-prop-action-config space-y-3">
    <!-- 目标组件选择 -->
    <div class="config-item">
      <label class="config-label">目标组件</label>
      <div class="target-selector">
        <!-- 模式切换 -->
        <div class="mode-switch">
          <EaRadioGroup v-model="targetMode" size="small">
            <EaRadio value="id">组件ID</EaRadio>
            <EaRadio value="alias">别名</EaRadio>
          </EaRadioGroup>
        </div>

        <!-- 别名模式 -->
        <template v-if="targetMode === 'alias'">
          <div class="alias-input-wrapper">
            <EaInput v-model="aliasValue" placeholder="输入组件别名，如：submitBtn" size="small" />
          </div>
        </template>

        <!-- ID模式 -->
        <template v-else>
          <div class="id-input-wrapper">
            <EaInput v-model="idValue" placeholder="输入组件ID，如：button_123" size="small" />
            <ea-button type="primary" size="small" @click="handleOpenComponentSelector">
              选择
            </ea-button>
          </div>
        </template>
      </div>
    </div>

    <!-- 属性名 -->
    <div class="config-item">
      <label class="config-label">属性名</label>
      <EaInput v-model="modelValue.propName" placeholder="如：loading" size="small" />
    </div>

    <!-- 属性值类型 -->
    <div class="config-item">
      <label class="config-label">值类型</label>
      <EaSelect v-model="valueType" size="small" class="w-full" @change="handleTypeChange">
        <ea-option value="string">字符串</ea-option>
        <ea-option value="number">数字</ea-option>
        <ea-option value="boolean">布尔值</ea-option>
        <ea-option value="array">数组</ea-option>
        <ea-option value="object">对象</ea-option>
        <ea-option value="variable">变量</ea-option>
      </EaSelect>
    </div>

    <!-- 属性值 -->
    <div class="config-item">
      <label class="config-label">属性值</label>
      <!-- 布尔值类型 -->
      <EaSelect
        v-if="valueType === 'boolean'"
        v-model="modelValue.propValue"
        size="small"
        class="w-full"
      >
        <ea-option :value="true">true</ea-option>
        <ea-option :value="false">false</ea-option>
      </EaSelect>
      <!-- 变量类型 -->
      <ea-button
        v-else-if="valueType === 'variable'"
        class="w-full text-center"
        type="primary"
        size="small"
        icon="pen"
        @click="handleOpenVariableSelector"
      >
        {{ modelValue.propValue ? `变量: ${modelValue.propValue}` : '选择变量' }}
      </ea-button>
      <!-- 数组/对象类型使用按钮打开编辑器 -->
      <ea-button
        v-else-if="valueType === 'array' || valueType === 'object'"
        class="w-full text-center"
        type="primary"
        size="small"
        icon="pen"
        @click="handleOpenEditor"
      >
        {{ valueType === 'array' ? '编辑数组' : '编辑对象' }}
      </ea-button>
      <!-- 字符串/数字类型使用 EaInput -->
      <EaInput
        v-else
        v-model="modelValue.propValue"
        size="small"
        :placeholder="valueType === 'number' ? '输入数字' : '输入字符串'"
        class="w-full"
      />
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import { useGlobalDialogs } from '@/composables/useGlobalDialogs.js'
  import { isAliasFormat, extractAlias } from '@/utils/schemaHelper'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'
  import EaRadioGroup from '@/components/ea-ui-wrap/EaRadioGroup.vue'
  import EaRadio from '@/components/ea-ui-wrap/EaRadio.vue'

  const props = defineProps({
    modelValue: {
      type: Object,
      required: true,
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const { openComponentSelector, openVariableSelector, openEditor } = useGlobalDialogs()

  // 目标模式：alias 或 id
  const targetMode = ref('id')

  // 别名值
  const aliasValue = ref('')

  // ID值
  const idValue = ref('')

  // 值类型
  const valueType = ref('boolean')

  // 标记是否为用户主动选择的类型（用于区分自动推断）
  const isUserSelectedType = ref(false)

  // 计算属性
  const modelValue = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val),
  })

  // 打开组件选择器
  async function handleOpenComponentSelector() {
    try {
      const componentId = await openComponentSelector()
      idValue.value = componentId
    } catch {
      // 用户取消，不做处理
    }
  }

  // 打开变量选择器
  async function handleOpenVariableSelector() {
    try {
      const variableName = await openVariableSelector()
      if (variableName) {
        modelValue.value = {
          ...modelValue.value,
          propValue: variableName,
        }
      }
    } catch {
      // 用户取消，不做处理
    }
  }

  // 打开编辑器（数组/对象）
  async function handleOpenEditor() {
    try {
      const currentValue = modelValue.value.propValue
      let initialValue = ''

      if (valueType.value === 'array') {
        initialValue = Array.isArray(currentValue) ? JSON.stringify(currentValue, null, 2) : '[]'
      } else {
        initialValue =
          typeof currentValue === 'object' && currentValue !== null
            ? JSON.stringify(currentValue, null, 2)
            : '{}'
      }

      const result = await openEditor({
        title: valueType.value === 'array' ? '编辑数组' : '编辑对象',
        value: initialValue,
        language: 'json',
      })

      // 验证并保存
      const parsed = JSON.parse(result)
      if (valueType.value === 'array' && !Array.isArray(parsed)) {
        alert('值必须是数组格式')
        return
      }
      if (
        valueType.value === 'object' &&
        (Array.isArray(parsed) || typeof parsed !== 'object' || parsed === null)
      ) {
        alert('值必须是对象格式')
        return
      }

      modelValue.value = {
        ...modelValue.value,
        propValue: parsed,
      }
    } catch {
      // 用户取消或解析错误，不做处理
    }
  }

  // 类型改变处理
  function handleTypeChange(newType) {
    // 标记为用户主动选择
    isUserSelectedType.value = true

    // 根据新类型设置默认值
    let newValue
    switch (newType) {
      case 'boolean':
        newValue = true
        break
      case 'number':
        newValue = 0
        break
      case 'string':
        newValue = ''
        break
      case 'array':
        newValue = []
        break
      case 'object':
        newValue = {}
        break
      case 'variable':
        newValue = ''
        break
      default:
        newValue = ''
    }

    modelValue.value = {
      ...modelValue.value,
      propValue: newValue,
    }
  }

  // 监听输入变化，更新 modelValue.targetComponentId
  watch(
    [targetMode, aliasValue, idValue],
    ([mode, alias, id]) => {
      if (mode === 'alias' && alias) {
        // 别名模式下，存储 alias:前缀的格式，或者通过其他字段存储
        modelValue.value = {
          ...modelValue.value,
          targetComponentId: `alias:${alias}`,
          targetComponentAlias: alias,
        }
      } else {
        modelValue.value = {
          ...modelValue.value,
          targetComponentId: id,
          targetComponentAlias: '',
        }
      }
    },
    { immediate: true }
  )

  // 初始化时解析现有的 targetComponentId
  watch(
    () => props.modelValue.targetComponentId,
    targetId => {
      if (!targetId) return

      if (isAliasFormat(targetId)) {
        targetMode.value = 'alias'
        aliasValue.value = extractAlias(targetId)
      } else {
        targetMode.value = 'id'
        idValue.value = targetId
      }
    },
    { immediate: true }
  )

  // 初始化时根据 propValue 推断类型（仅在非用户主动选择时）
  watch(
    () => props.modelValue.propValue,
    val => {
      // 如果用户主动选择了类型，不要自动推断覆盖
      if (isUserSelectedType.value) return

      if (val === undefined || val === null) return

      if (typeof val === 'boolean') {
        valueType.value = 'boolean'
      } else if (typeof val === 'number') {
        valueType.value = 'number'
      } else if (typeof val === 'string') {
        // 字符串可能是变量名，需要用户明确选择
        valueType.value = 'string'
      } else if (Array.isArray(val)) {
        valueType.value = 'array'
      } else if (typeof val === 'object') {
        valueType.value = 'object'
      }
    },
    { immediate: true }
  )
</script>

<style lang="scss" scoped>
  @use './styles/action-config.scss' as *;

  .set-prop-action-config {
    @include action-config-base;
    @include target-selector;
    @include component-selector-list;
  }

  .variable-selector-wrapper {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .flex-1 {
    flex: 1;
  }
</style>
