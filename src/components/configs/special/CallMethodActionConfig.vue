<template>
  <div class="call-method-action-config space-y-3">
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

    <!-- 方法名 -->
    <div class="config-item">
      <label class="config-label">方法名</label>
      <EaInput v-model="modelValue.methodName" placeholder="如：focus" size="small" />
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import { useGlobalDialogs } from '@/composables/useGlobalDialogs.js'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaRadioGroup from '@/components/ea-ui-wrap/EaRadioGroup.vue'
  import EaRadio from '@/components/ea-ui-wrap/EaRadio.vue'

  const props = defineProps({
    modelValue: {
      type: Object,
      required: true,
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const { openComponentSelector } = useGlobalDialogs()

  // 目标模式：alias 或 id
  const targetMode = ref('id')

  // 别名值
  const aliasValue = ref('')

  // ID值
  const idValue = ref('')

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

  // 监听输入变化，更新 modelValue.targetComponentId
  watch(
    [targetMode, aliasValue, idValue],
    ([mode, alias, id]) => {
      if (mode === 'alias' && alias) {
        // 别名模式下，存储 alias:前缀的格式
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

      if (targetId.startsWith('alias:')) {
        targetMode.value = 'alias'
        aliasValue.value = targetId.slice(6)
      } else {
        targetMode.value = 'id'
        idValue.value = targetId
      }
    },
    { immediate: true }
  )
</script>

<style lang="scss" scoped>
  @use './styles/action-config.scss' as *;

  .call-method-action-config {
    @include action-config-base;
    @include target-selector;
    @include component-selector-list;
  }
</style>
