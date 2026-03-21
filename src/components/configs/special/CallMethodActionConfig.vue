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
            <ea-button type="primary" size="small" @click="showComponentSelector = true">
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

    <!-- 组件选择弹窗 -->
    <ea-dialog
      :visible="showComponentSelector"
      title="选择组件"
      width="400px"
      @close="showComponentSelector = false"
    >
      <div class="selector-list">
        <div
          v-for="comp in flattenComponents"
          :key="comp.id"
          class="selector-item"
          :style="{ paddingLeft: `${comp.level * 16 + 12}px` }"
          @click="selectComponent(comp.id)"
        >
          <ea-icon name="folder" variant="solid" v-if="comp.children?.length" size="14"></ea-icon>
          <ea-icon name="file" variant="solid" v-else size="14"></ea-icon>
          <span class="component-name">{{ comp.name }}</span>
          <span class="component-id">{{ comp.id }}</span>
        </div>
        <ea-empty v-if="flattenComponents.length === 0" description="暂无组件"></ea-empty>
      </div>
    </ea-dialog>
  </div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import { useSchemaStore } from '@/stores/designer/schema'
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

  const schemaStore = useSchemaStore()

  // 弹窗显示状态
  const showComponentSelector = ref(false)

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

  // 扁平化组件列表（用于选择器）
  const flattenComponents = computed(() => {
    const result = []
    const components = schemaStore.pageSchema?.components || []

    function flatten(components, level = 0) {
      for (const comp of components) {
        result.push({
          id: comp.id,
          name: getComponentName(comp),
          level,
          children: comp.children,
        })
        if (comp.children?.length) {
          flatten(comp.children, level + 1)
        }
      }
    }

    flatten(components)
    return result
  })

  // 获取组件显示名称
  function getComponentName(component) {
    if (component.props?.children) {
      return `${component.type} - ${String(component.props.children).slice(0, 20)}`
    }
    if (component.props?.label) {
      return `${component.type} - ${component.props.label}`
    }
    if (component.props?.title) {
      return `${component.type} - ${component.props.title}`
    }
    return component.type
  }

  // 选择组件
  function selectComponent(id) {
    idValue.value = id
    showComponentSelector.value = false
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
