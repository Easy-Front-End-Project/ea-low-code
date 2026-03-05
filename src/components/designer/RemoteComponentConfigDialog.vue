<template>
  <Teleport to="body">
    <ea-dialog
      :visible="visible"
      :title="'配置组件 - ' + (`【${component?.name}】` || '')"
      width="700px"
      @close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="config-dialog-content">
        <!-- 标签页切换 -->
        <div class="config-tabs">
          <div
            class="config-tab"
            :class="{ active: activeTab === 'props' }"
            @click="activeTab = 'props'"
          >
            属性 ({{ configForm.props.length }})
          </div>
          <div
            class="config-tab"
            :class="{ active: activeTab === 'events' }"
            @click="activeTab = 'events'"
          >
            事件 ({{ configForm.events.length }})
          </div>
          <div
            class="config-tab"
            :class="{ active: activeTab === 'slots' }"
            @click="activeTab = 'slots'"
          >
            插槽 ({{ configForm.slots.length }})
          </div>
        </div>

        <!-- Props 配置 -->
        <div v-if="activeTab === 'props'" class="config-section">
          <div class="config-header">
            <span class="text-sm text-gray-600">配置组件的属性参数</span>
            <ea-button type="primary" size="small" icon="icon-plus" @click="handleAddProp">
              添加属性
            </ea-button>
          </div>
          <div v-if="configForm.props.length === 0" class="empty-config">
            <ea-empty size="48" description="暂无属性配置，点击上方按钮添加"></ea-empty>
          </div>
          <div v-else class="config-list">
            <div v-for="(prop, index) in configForm.props" :key="index" class="config-item">
              <div class="config-item-row">
                <EaInput v-model="prop.name" placeholder="属性名 (如: size)" size="small" />
                <EaInput v-model="prop.label" placeholder="显示名称 (如: 尺寸)" size="small" />
                <EaSelect v-model="prop.type" size="small" placeholder="类型">
                  <ea-option value="string">字符串</ea-option>
                  <ea-option value="number">数字</ea-option>
                  <ea-option value="boolean">布尔值</ea-option>
                  <ea-option value="array">数组</ea-option>
                  <ea-option value="object">对象</ea-option>
                  <ea-option value="function">函数</ea-option>
                </EaSelect>
              </div>
              <div class="config-item-row">
                <EaInput
                  v-model="prop.defaultValue"
                  placeholder="默认值"
                  size="small"
                  class="flex-2"
                />
                <EaSwitch v-model="prop.required" size="small" active-text="必填" />
                <ea-button
                  type="danger"
                  text
                  size="small"
                  icon="icon-trash-empty"
                  @click="handleRemoveProp(index)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Events 配置 -->
        <div v-if="activeTab === 'events'" class="config-section">
          <div class="config-header">
            <span class="text-sm text-gray-600">配置组件的事件</span>
            <ea-button type="primary" size="small" icon="icon-plus" @click="handleAddEvent">
              添加事件
            </ea-button>
          </div>
          <div v-if="configForm.events.length === 0" class="empty-config">
            <ea-empty size="48" description="暂无事件配置，点击上方按钮添加"></ea-empty>
          </div>
          <div v-else class="config-list">
            <div v-for="(event, index) in configForm.events" :key="index" class="config-item">
              <div class="config-item-row">
                <EaInput v-model="event.name" placeholder="事件名 (如: click)" size="small" />
                <EaInput v-model="event.label" placeholder="显示名称 (如: 点击事件)" size="small" />
                <ea-button
                  type="danger"
                  text
                  size="small"
                  icon="icon-trash-empty"
                  @click="handleRemoveEvent(index)"
                />
              </div>
              <EaInput
                v-model="event.description"
                placeholder="事件描述 (如: 点击时触发)"
                size="small"
              />
            </div>
          </div>
        </div>

        <!-- Slots 配置 -->
        <div v-if="activeTab === 'slots'" class="config-section">
          <div class="config-header">
            <span class="text-sm text-gray-600">配置组件的插槽</span>
            <ea-button type="primary" size="small" icon="icon-plus" @click="handleAddSlot">
              添加插槽
            </ea-button>
          </div>
          <div v-if="configForm.slots.length === 0" class="empty-config">
            <ea-empty size="48" description="暂无插槽配置，点击上方按钮添加"></ea-empty>
          </div>
          <div v-else class="config-list">
            <div v-for="(slot, index) in configForm.slots" :key="index" class="config-item">
              <div class="config-item-row">
                <EaInput v-model="slot.name" placeholder="插槽名 (如: default)" size="small" />
                <EaInput v-model="slot.label" placeholder="显示名称 (如: 默认插槽)" size="small" />
                <ea-button
                  type="danger"
                  text
                  size="small"
                  icon="icon-trash-empty"
                  @click="handleRemoveSlot(index)"
                />
              </div>
              <EaInput v-model="slot.description" placeholder="插槽描述" size="small" />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <ea-button @click="handleClose">取消</ea-button>
        <ea-button type="primary" @click="handleSave">保存配置</ea-button>
      </div>
    </ea-dialog>
  </Teleport>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaSwitch from '@/components/ea-ui-wrap/EaSwitch.vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    component: {
      type: Object,
      default: null,
    },
  })

  const emit = defineEmits(['close', 'save'])

  const activeTab = ref('props')
  const configForm = ref({
    props: [],
    events: [],
    slots: [],
  })

  // 监听组件变化，初始化表单
  watch(
    () => props.component,
    (newComponent) => {
      if (newComponent) {
        configForm.value = {
          props: newComponent.props ? [...newComponent.props] : [],
          events: newComponent.events ? [...newComponent.events] : [],
          slots: newComponent.slots ? [...newComponent.slots] : [],
        }
        activeTab.value = 'props'
      }
    },
    { immediate: true },
  )

  function handleClose() {
    emit('close')
  }

  function handleSave() {
    emit('save', {
      props: configForm.value.props,
      events: configForm.value.events,
      slots: configForm.value.slots,
    })
  }

  // Props 操作
  function handleAddProp() {
    configForm.value.props.push({
      name: '',
      label: '',
      type: 'string',
      defaultValue: '',
      required: false,
    })
  }

  function handleRemoveProp(index) {
    configForm.value.props.splice(index, 1)
  }

  // Events 操作
  function handleAddEvent() {
    configForm.value.events.push({
      name: '',
      label: '',
      description: '',
    })
  }

  function handleRemoveEvent(index) {
    configForm.value.events.splice(index, 1)
  }

  // Slots 操作
  function handleAddSlot() {
    configForm.value.slots.push({
      name: 'default',
      label: '默认插槽',
      description: '',
    })
  }

  function handleRemoveSlot(index) {
    configForm.value.slots.splice(index, 1)
  }
</script>

<style scoped>
  .config-dialog-content {
    min-height: 300px;
    max-height: 500px;
    overflow-y: auto;
  }

  .config-tabs {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 1rem;
  }

  .config-tab {
    padding: 0.75rem 1rem;
    cursor: pointer;
    font-size: 0.875rem;
    color: #6b7280;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
  }

  .config-tab:hover {
    color: #374151;
  }

  .config-tab.active {
    color: #409eff;
    border-bottom-color: #409eff;
    font-weight: 500;
  }

  .config-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .config-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .config-item {
    padding: 0.75rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
  }

  .config-item-row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    align-items: center;
  }

  .config-item-row:last-child {
    margin-bottom: 0;
  }

  .config-item-row :deep(.ea-input) {
    flex: 1;
  }

  .config-item-row .flex-2 {
    flex: 2;
  }

  .empty-config {
    padding: 2rem 0;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
  }
</style>
