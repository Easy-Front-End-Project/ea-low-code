<template>
  <div class="props-panel flex flex-col h-full">
    <!-- 面板标题 -->
    <div class="h-12 flex items-center px-4 border-b border-gray-200">
      <span class="font-medium text-gray-800">属性配置</span>
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 overflow-y-auto pb-32">
      <!-- 未选中组件时显示 -->
      <div
        v-if="!selectedComponent"
        class="flex flex-col items-center justify-center h-full text-gray-400 p-6"
      >
        <p class="text-sm text-center">选中画布上的组件以编辑属性</p>
      </div>

      <!-- 选中组件后显示属性表单 -->
      <div v-else class="p-4 space-y-6">
        <!-- 组件信息 -->
        <div class="component-info pb-4 border-b border-gray-100">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <ea-icon
                :name="getComponentIcon(selectedComponent.type)"
                size="20"
                color="#3b82f6"
              ></ea-icon>
              <span class="font-medium text-gray-800">{{ componentMeta?.name }}</span>
            </div>
            <ea-button
              type="danger"
              size="small"
              icon="icon-trash-empty"
              @click="handleDeleteComponent"
            >
              删除
            </ea-button>
          </div>
          <div class="text-xs text-gray-500 space-y-1">
            <p>类型: {{ selectedComponent.type }}</p>
            <p>ID: {{ selectedComponent.id }}</p>
            <!-- 别名编辑 -->
            <div class="flex items-center gap-2 mt-2">
              <span>别名:</span>
              <div v-if="!isEditingAlias" class="flex items-center gap-2">
                <span class="text-blue-600">{{ selectedComponent.alias || '未设置' }}</span>
                <ea-button type="primary" size="small" icon="icon-pencil" @click="startEditAlias">
                  {{ selectedComponent.alias ? '修改' : '设置' }}
                </ea-button>
              </div>
              <div v-else class="flex items-center gap-2">
                <ea-input
                  v-model="aliasInput"
                  size="small"
                  placeholder="输入别名"
                  style="width: 120px"
                ></ea-input>
                <ea-button
                  type="success"
                  size="small"
                  icon="icon-ok"
                  @click="saveAlias"
                ></ea-button>
                <ea-button
                  type="default"
                  size="small"
                  icon="icon-cancel"
                  @click="cancelEditAlias"
                ></ea-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 目标插槽配置（排在最上面） -->
        <SlotConfig
          :parent-slots="parentComponentMeta?.slots"
          :slot-value="selectedComponent.props?.slot || 'default'"
          @slot-change="handleSlotChange"
        />

        <!-- 插槽 Scope 数据绑定配置 -->
        <SlotScopeConfig
          :parent-slots="parentComponentMeta?.slots"
          :slot-value="selectedComponent.props?.slot || 'default'"
          :scope="selectedComponent.props?.scope || ''"
          @scope-change="handleScopeChange"
        />

        <!-- 特殊配置：根据组件类型动态渲染对应的配置组件 -->
        <SpecialConfigRenderer
          v-if="hasSpecialConfig"
          :component="selectedComponent"
          :special-config="componentMeta?.specialConfig"
        />

        <!-- 属性配置 -->
        <PropConfig
          :props="componentPropsWithoutSlot"
          :component-props="selectedComponent.props"
          @prop-change="handlePropChange"
        />

        <!-- 样式配置 -->
        <StyleConfig
          :component-type="selectedComponent.type"
          :component-props="selectedComponent.props"
          :style="selectedComponent.style"
          :css-variables="selectedComponent.cssVariables"
          @style-change="handleStyleChange"
          @css-variable-change="handleCssVariableChange"
        />

        <!-- 事件配置 -->
        <EventConfig
          :events="componentMeta?.events"
          :component-events="selectedComponent.events"
          @event-change="handleEventChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useSchemaStore } from '@/stores/designer/schema'
  import { getComponentMeta, getRemoteComponentMetaList } from '@/constants/componentMeta'
  import PropConfig from '@/components/configs/PropConfig.vue'
  import StyleConfig from '@/components/configs/StyleConfig.vue'
  import EventConfig from '@/components/configs/EventConfig.vue'
  import SlotConfig from '@/components/configs/SlotConfig.vue'
  import SlotScopeConfig from '@/components/configs/SlotScopeConfig.vue'
  import SpecialConfigRenderer from '@/components/configs/SpecialConfig.vue'

  const schemaStore = useSchemaStore()

  const selectedComponent = computed(() => schemaStore.selectedComponent)

  // 别名编辑状态
  const isEditingAlias = ref(false)
  const aliasInput = ref('')

  // 开始编辑别名
  function startEditAlias() {
    aliasInput.value = selectedComponent.value?.alias || ''
    isEditingAlias.value = true
  }

  // 保存别名
  function saveAlias() {
    if (!selectedComponent.value) return
    const alias = aliasInput.value.trim()
    // 验证别名格式：只能包含字母、数字、下划线，且不能以数字开头
    if (alias && !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(alias)) {
      alert('别名格式不正确，只能包含字母、数字、下划线，且不能以数字开头')
      return
    }
    // 检查别名是否已被其他组件使用
    if (alias && typeof schemaStore.getComponentIdByAlias === 'function') {
      const existingId = schemaStore.getComponentIdByAlias(alias)
      if (existingId && existingId !== selectedComponent.value.id) {
        alert('该别名已被其他组件使用')
        return
      }
    }
    if (typeof schemaStore.setComponentAlias === 'function') {
      schemaStore.setComponentAlias(selectedComponent.value.id, alias)
    } else {
      // 如果方法不存在，直接设置到组件上
      selectedComponent.value.alias = alias
    }
    isEditingAlias.value = false
  }

  // 取消编辑别名
  function cancelEditAlias() {
    isEditingAlias.value = false
    aliasInput.value = ''
  }
  const componentMeta = computed(() => {
    if (!selectedComponent.value) return null

    // 检查是否是远程组件
    const isRemote =
      selectedComponent.value.type?.startsWith('remote-') || selectedComponent.value.isRemote
    if (isRemote) {
      // 从远程组件列表中查找
      const remoteMetaList = getRemoteComponentMetaList()
      const remoteMeta = remoteMetaList.find(m => m.type === selectedComponent.value.type)
      if (remoteMeta) return remoteMeta
    }

    return getComponentMeta(selectedComponent.value.type)
  })

  // 过滤掉 slot 属性的 props 列表
  const componentPropsWithoutSlot = computed(() => {
    const props = componentMeta.value?.props || []
    return props.filter(prop => prop.name !== 'slot')
  })

  // 是否有特殊配置
  const hasSpecialConfig = computed(() => {
    return !!selectedComponent.value && !!componentMeta.value?.specialConfig?.type
  })

  // 获取父组件的 meta 信息（用于显示目标插槽配置）
  const parentComponentMeta = computed(() => {
    if (!selectedComponent.value) return null

    // 查找父组件
    const parent = schemaStore.findParentComponent(selectedComponent.value.id)
    if (!parent) return null

    // 检查是否是远程组件
    const isRemote = parent.type?.startsWith('remote-') || parent.isRemote
    if (isRemote) {
      const remoteMetaList = getRemoteComponentMetaList()
      const remoteMeta = remoteMetaList.find(m => m.type === parent.type)
      if (remoteMeta) return remoteMeta
    }

    return getComponentMeta(parent.type)
  })

  // 获取组件图标
  function getComponentIcon(type) {
    // 远程组件使用 link 图标
    if (type?.startsWith('remote-')) {
      return 'link'
    }

    const iconMap = {
      'ea-button': 'button',
      'ea-icon': 'star',
      'ea-input': 'edit',
      'ea-select': 'list',
      'ea-checkbox': 'check-square',
      'ea-checkbox-group': 'check-square',
      'ea-radio': 'radio',
      'ea-switch': 'switch',
      'ea-container': 'container',
      'ea-header': 'header',
      'ea-aside': 'aside',
      'ea-main': 'main',
      'ea-card': 'card',
      'ea-table': 'table',
      'ea-pagination': 'page',
      'ea-menu': 'menu',
      'ea-tabs': 'tabs',
      'ea-breadcrumb': 'breadcrumb',
      'ea-dialog': 'dialog',
      'ea-alert': 'alert',
      'ea-message': 'message',
    }
    return iconMap[type] || 'cube'
  }

  // 属性变更
  function handlePropChange(propName, value) {
    if (!selectedComponent.value) return

    // 处理变量绑定格式的值
    if (value && typeof value === 'object' && value.type === 'variable') {
      // 变量绑定格式: { type: 'variable', value: 'varName' }
      schemaStore.updateComponentProps(selectedComponent.value.id, {
        [propName]: value,
      })
    } else {
      // 普通值
      schemaStore.updateComponentProps(selectedComponent.value.id, {
        [propName]: value,
      })
    }
  }

  // 样式变更
  function handleStyleChange(styleName, value, styleType = 'inline') {
    if (!selectedComponent.value) return
    schemaStore.updateComponentStyle(selectedComponent.value.id, { [styleName]: value }, styleType)
  }

  // CSS 变量样式变更
  function handleCssVariableChange(variableName, value) {
    if (!selectedComponent.value) return
    schemaStore.updateComponentStyle(
      selectedComponent.value.id,
      { [variableName]: value },
      'cssVariable'
    )
  }

  // 事件变更
  function handleEventChange(events) {
    if (!selectedComponent.value) return
    schemaStore.updateComponentEvents(selectedComponent.value.id, events)
  }

  // 插槽变更
  function handleSlotChange(slotValue) {
    if (!selectedComponent.value) return
    schemaStore.updateComponentProps(selectedComponent.value.id, { slot: slotValue })
  }

  // Scope 变更
  function handleScopeChange(scope) {
    if (!selectedComponent.value) return
    schemaStore.updateComponentProps(selectedComponent.value.id, { scope })
  }

  // 删除组件
  function handleDeleteComponent() {
    if (!selectedComponent.value) return
    if (confirm('确定要删除这个组件吗？')) {
      schemaStore.removeComponent(selectedComponent.value.id)
    }
  }
</script>

<style scoped>
  .props-panel {
    background-color: #fff;
  }

  .component-info {
    background-color: #f9fafb;
    padding: 12px;
    border-radius: 8px;
  }

  .section-title {
    @apply text-sm font-medium text-gray-700 mb-3;
  }

  .prop-item {
    @apply flex flex-col gap-1;
  }

  .prop-label {
    @apply text-xs text-gray-500;
  }

  .prop-input {
    @apply px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  }

  .event-item {
    @apply p-3 bg-gray-50 rounded-lg;
  }
</style>
