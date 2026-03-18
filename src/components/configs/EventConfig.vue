<template>
  <div class="props-section">
    <h4 class="section-title">事件</h4>

    <!-- 添加事件按钮 -->
    <ea-button type="primary" size="small" @click="handleOpenDialog" class="w-full">
      <span>添加事件</span>
    </ea-button>

    <!-- 已配置事件列表 -->
    <div v-if="componentEvents?.length > 0" class="mt-3 space-y-2">
      <div
        v-for="event in componentEvents"
        :key="event.id"
        class="event-tag flex items-center justify-between px-3 py-2 bg-blue-50 rounded cursor-pointer hover:bg-blue-100"
        @click="handleEditEvent(event)"
      >
        <div class="flex items-center gap-2">
          <span class="text-xs text-blue-600 font-medium">{{ event.eventType }}</span>
          <span class="text-sm text-gray-700">{{ event.name }}</span>
        </div>
        <ea-icon icon="icon-edit" size="12" class="text-gray-400"></ea-icon>
      </div>
    </div>

    <!-- 事件配置弹框 -->
    <ea-dialog :visible="dialogVisible" title="事件配置" width="700px" @close="handleCloseDialog">
      <div class="event-dialog-content flex gap-4" style="height: 400px">
        <!-- 左侧：事件列表 -->
        <div class="event-list w-48 border-r pr-4">
          <div class="mb-3">
            <span class="text-sm font-medium text-gray-700">事件列表</span>
          </div>

          <div class="space-y-2">
            <div
              v-for="event in localEvents"
              :key="event.id"
              class="event-item flex items-center justify-between px-3 py-2 rounded cursor-pointer"
              :class="{ 'bg-blue-50': selectedEvent?.id === event.id }"
              @click="handleSelectEvent(event)"
            >
              <div class="flex flex-col">
                <span class="text-xs text-gray-500">{{ event.eventType }}</span>
                <span class="text-sm text-gray-700">{{ event.name }}</span>
              </div>
              <ea-button type="text" size="small" @click.stop="handleDeleteEvent(event.id)">
                <ea-icon icon="icon-trash-empty" size="12" class="text-red-500"></ea-icon>
              </ea-button>
            </div>
          </div>

          <div v-if="localEvents.length === 0" class="text-center text-gray-400 py-4 text-sm">
            暂无事件，点击 + 添加
          </div>
        </div>

        <!-- 右侧：事件配置 -->
        <div class="event-config flex-1 pl-4 overflow-auto">
          <template v-if="selectedEvent">
            <div class="space-y-4" :key="selectedEvent.id">
              <!-- 事件名称 -->
              <div class="config-item">
                <label class="config-label">事件名称</label>
                <EaInput v-model="selectedEvent.name" placeholder="如：handleClick" size="small" />
              </div>

              <!-- 事件类型 -->
              <div class="config-item">
                <label class="config-label">事件类型</label>
                <div class="event-type-input flex gap-2">
                  <EaSelect
                    :model-value="selectedEvent.eventType"
                    size="small"
                    class="w-full"
                    @change="handleEventTypeChange"
                  >
                    <!-- 组件预定义事件 -->
                    <ea-option-group label="组件事件">
                      <ea-option
                        v-for="event in availableEvents"
                        :key="event.name"
                        :value="event.name"
                      >
                        {{ event.label }} ({{ event.name }})
                      </ea-option>
                    </ea-option-group>
                    <!-- 常用自定义事件 -->
                    <ea-option-group label="常用事件">
                      <ea-option value="custom">自定义...</ea-option>
                    </ea-option-group>
                  </EaSelect>
                </div>
                <!-- 自定义事件名输入 -->
                <EaInput
                  v-if="selectedEvent.eventType === 'custom' || !isPredefinedEvent(selectedEvent.eventType)"
                  v-model="selectedEvent.customEventType"
                  placeholder="输入自定义事件名，如：dblclick"
                  size="small"
                  class="mt-2"
                />
              </div>

              <!-- 动作类型 -->
              <div class="config-item">
                <label class="config-label">动作</label>
                <EaSelect
                  :key="selectedEvent.id"
                  :model-value="selectedEvent.action"
                  size="small"
                  class="w-full"
                  @change="handleActionChange"
                >
                  <ea-option value="message">显示提示</ea-option>
                  <ea-option value="setProp">设置组件属性</ea-option>
                  <ea-option value="callMethod">调用组件方法</ea-option>
                  <ea-option value="custom">自定义代码</ea-option>
                </EaSelect>
              </div>

              <!-- 动态配置区域 -->
              <div class="dynamic-config-section" :key="selectedEvent.id">
                <!-- 显示提示配置 -->
                <MessageActionConfig
                  v-if="selectedEvent.action === 'message'"
                  v-model="selectedEvent.actionConfig"
                />

                <!-- 设置组件属性配置 -->
                <template v-if="selectedEvent.action === 'setProp'">
                  <div class="config-item">
                    <label class="config-label">目标组件ID</label>
                    <EaInput
                      v-model="selectedEvent.actionConfig.targetComponentId"
                      placeholder="如：button_123"
                      size="small"
                    />
                  </div>
                  <div class="config-item">
                    <label class="config-label">属性名</label>
                    <EaInput
                      v-model="selectedEvent.actionConfig.propName"
                      placeholder="如：loading"
                      size="small"
                    />
                  </div>
                  <div class="config-item">
                    <label class="config-label">属性值</label>
                    <EaSelect
                      v-model="selectedEvent.actionConfig.propValue"
                      size="small"
                      class="w-full"
                    >
                      <ea-option :value="true">true</ea-option>
                      <ea-option :value="false">false</ea-option>
                    </EaSelect>
                  </div>
                </template>

                <!-- 调用组件方法配置 -->
                <template v-if="selectedEvent.action === 'callMethod'">
                  <div class="config-item">
                    <label class="config-label">目标组件ID</label>
                    <EaInput
                      v-model="selectedEvent.actionConfig.targetComponentId"
                      placeholder="如：button_123"
                      size="small"
                    />
                  </div>
                  <div class="config-item">
                    <label class="config-label">方法名</label>
                    <EaInput
                      v-model="selectedEvent.actionConfig.methodName"
                      placeholder="如：focus"
                      size="small"
                    />
                  </div>
                </template>

                <!-- 自定义代码配置 -->
                <div v-if="selectedEvent.action === 'custom'" class="config-item">
                  <label class="config-label">自定义代码</label>
                  <div class="code-help">
                    <ea-icon icon="icon-info" size="12" class="code-help-icon"></ea-icon>
                    <span class="code-help-title">可用 API：</span>
                    <div class="code-help-list">
                      <code
                        v-for="api in codeHelpApis"
                        :key="api.name"
                        class="code-help-item"
                        :title="api.desc"
                      >
                        {{ api.name }}
                      </code>
                    </div>
                  </div>
                  <MonacoEditor
                    v-if="dialogVisible"
                    v-model="selectedEvent.actionConfig.code"
                    language="javascript"
                    height="200px"
                    :extra-libs="editorExtraLibs"
                  />
                </div>

                <!-- 动态配置区域结束 -->
              </div>
            </div>
          </template>

          <div v-else class="flex items-center justify-center h-full text-gray-400">
            <p>请选择或添加一个事件进行配置</p>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <ea-button type="primary" size="small" @click="handleAddNewEvent">
          <ea-icon icon="icon-plus" size="12" class="mr-1"></ea-icon>
          <span>添加事件</span>
        </ea-button>
        <div class="flex items-center gap-2">
          <ea-button @click="handleCloseDialog">取消</ea-button>
          <ea-button type="primary" @click="handleSaveEvents">保存</ea-button>
        </div>
      </div>
    </ea-dialog>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import MonacoEditor from '../common/MonacoEditor.vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'
  import MessageActionConfig from './special/MessageActionConfig.vue'
  import { generateUniqueId } from '@/utils/schemaHelper'

  const props = defineProps({
    events: {
      type: Array,
      default: () => [],
    },
    componentEvents: {
      type: Array,
      default: () => [],
    },
  })

  const emit = defineEmits(['event-change'])

  // 常用自定义事件列表
  const commonCustomEvents = [
    { name: 'dblclick', label: '双击' },
    { name: 'mousedown', label: '鼠标按下' },
    { name: 'mouseup', label: '鼠标释放' },
    { name: 'mouseenter', label: '鼠标进入' },
    { name: 'mouseleave', label: '鼠标离开' },
    { name: 'mouseover', label: '鼠标悬停' },
    { name: 'mouseout', label: '鼠标移出' },
    { name: 'mousemove', label: '鼠标移动' },
    { name: 'keydown', label: '按键按下' },
    { name: 'keyup', label: '按键释放' },
    { name: 'keypress', label: '按键按压' },
    { name: 'focus', label: '获得焦点' },
    { name: 'blur', label: '失去焦点' },
    { name: 'input', label: '输入' },
    { name: 'change', label: '改变' },
    { name: 'select', label: '选择' },
    { name: 'scroll', label: '滚动' },
    { name: 'resize', label: '调整大小' },
    { name: 'load', label: '加载' },
    { name: 'unload', label: '卸载' },
    { name: 'error', label: '错误' },
  ]

  // 代码帮助 API 配置
  const codeHelpApis = ref([
    { name: '$event', desc: '原始事件对象' },
    { name: '$component.get(id)', desc: '通过ID获取组件DOM元素' },
    { name: '$component.setProp(id, prop, value)', desc: '通过ID设置组件属性' },
    { name: '$component.getProp(id, prop)', desc: '通过ID获取组件属性' },
    { name: '$component.call(id, method, ...args)', desc: '通过ID调用组件方法' },
    { name: '$vars.get(name)', desc: '获取变量值' },
    { name: '$vars.set(name, value)', desc: '设置变量值' },
    { name: '$alias.get(alias)', desc: '通过别名获取组件ID' },
    { name: '$alias.find(alias)', desc: '通过别名查找组件' },
    { name: '$alias.getElement(alias)', desc: '通过别名获取DOM元素' },
    { name: '$alias.setProp(alias, prop, value)', desc: '通过别名设置组件属性（推荐）' },
    { name: '$alias.getProp(alias, prop)', desc: '通过别名获取组件属性（推荐）' },
    { name: '$alias.call(alias, method, ...args)', desc: '通过别名调用组件方法（推荐）' },
  ])

  // Monaco Editor 类型定义（用于代码提示）
  const editorExtraLibs = [
    {
      filePath: 'ts:global/event-api.d.ts',
      content: `
        /** 事件对象 */
        declare const $event: Event;

        /** 组件操作辅助对象 */
        declare const $component: {
          get(id: string): Element | null;
          setProp(id: string, prop: string, value: any): void;
          getProp(id: string, prop: string): any;
          call(id: string, method: string, ...args: any[]): void;
        };

        /** 变量操作辅助对象 */
        declare const $vars: {
          get(name: string): any;
          set(name: string, value: any): void;
        };

        /** 别名操作辅助对象 */
        declare const $alias: {
          get(alias: string): string | null;
          find(alias: string): any | null;
          getElement(alias: string): Element | null;
          setProp(alias: string, prop: string, value: any): void;
          getProp(alias: string, prop: string): any;
          call(alias: string, method: string, ...args: any[]): void;
        };
      `,
    },
  ]

  // 可用事件列表
  const availableEvents = computed(() => {
    const predefinedEvents = props.events || []
    const allEvents = [...predefinedEvents]
    commonCustomEvents.forEach(event => {
      if (!allEvents.find(e => e.name === event.name)) {
        allEvents.push(event)
      }
    })
    return allEvents
  })

  // 弹框显示状态
  const dialogVisible = ref(false)
  // 本地事件列表
  const localEvents = ref([])
  // 当前选中的事件
  const selectedEvent = ref(null)

  // 检查是否是预定义事件
  function isPredefinedEvent(eventType) {
    return availableEvents.value.some(e => e.name === eventType)
  }

  // 创建默认动作配置
  function createDefaultActionConfig(action) {
    switch (action) {
      case 'message':
        return {
          message: '提示消息',
          type: 'info',
          duration: 3000,
          showClose: false,
          dangerouslyUseHTMLString: false,
          placement: 'top',
          offset: 16,
        }
      case 'setProp':
        return {
          targetComponentId: '',
          propName: '',
          propValue: true,
        }
      case 'callMethod':
        return {
          targetComponentId: '',
          methodName: '',
        }
      case 'custom':
        return {
          code: `// 使用 $component 操作其他组件\n// 示例：设置按钮 loading\n$component.setProp('button_123', 'loading', true);`,
        }
      default:
        return {}
    }
  }

  // 处理事件类型改变
  function handleEventTypeChange(value) {
    if (!selectedEvent.value) return

    if (value === 'custom') {
      selectedEvent.value.eventType = 'custom'
      selectedEvent.value.customEventType = ''
    } else {
      selectedEvent.value.eventType = value
      selectedEvent.value.customEventType = value
    }
  }

  // 打开弹框
  function handleOpenDialog() {
    localEvents.value = JSON.parse(JSON.stringify(props.componentEvents || []))
    selectedEvent.value = null
    dialogVisible.value = true
  }

  // 关闭弹框
  function handleCloseDialog() {
    dialogVisible.value = false
    selectedEvent.value = null
  }

  // 添加新事件
  function handleAddNewEvent() {
    const defaultEvent = availableEvents.value[0] || { name: 'click', label: '点击' }

    const newEvent = {
      id: generateId(),
      name: `event${localEvents.value.length + 1}`,
      eventType: defaultEvent.name,
      customEventType: defaultEvent.name,
      action: 'message',
      actionConfig: createDefaultActionConfig('message'),
    }
    localEvents.value.push(newEvent)
    selectedEvent.value = newEvent
  }

  // 选择事件
  function handleSelectEvent(event) {
    selectedEvent.value = { ...event }
  }

  // 动作类型改变
  function handleActionChange(action) {
    if (!selectedEvent.value) return
    selectedEvent.value.action = action
    selectedEvent.value.actionConfig = createDefaultActionConfig(action)
  }

  // 删除事件
  function handleDeleteEvent(eventId) {
    const index = localEvents.value.findIndex(e => e.id === eventId)
    if (index > -1) {
      localEvents.value.splice(index, 1)
      if (selectedEvent.value?.id === eventId) {
        selectedEvent.value = null
      }
    }
  }

  // 编辑已有事件
  function handleEditEvent(event) {
    localEvents.value = JSON.parse(JSON.stringify(props.componentEvents || []))
    selectedEvent.value = localEvents.value.find(e => e.id === event.id) || null
    dialogVisible.value = true
  }

  // 保存事件
  function handleSaveEvents() {
    const eventsToSave = localEvents.value.map(event => {
      // 确定最终的事件类型
      const finalEventType =
        event.eventType === 'custom' && event.customEventType
          ? event.customEventType
          : event.eventType

      return {
        ...event,
        eventType: finalEventType,
      }
    })
    emit('event-change', eventsToSave)
    handleCloseDialog()
  }

  // 生成唯一ID
  function generateId() {
    return generateUniqueId('event')
  }
</script>

<style scoped>
  .props-section {
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 12px;
  }

  .config-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .config-label {
    font-size: 12px;
    color: #606266;
    font-weight: 500;
  }

  .event-tag {
    transition: all 0.2s;
  }

  .event-item {
    transition: all 0.2s;
  }

  .event-item:hover {
    background-color: #f5f7fa;
  }

  .dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .code-help {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    padding: 8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    font-size: 12px;
  }

  .code-help-icon {
    color: #409eff;
  }

  .code-help-title {
    color: #606266;
    font-weight: 500;
  }

  .code-help-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .code-help-item {
    padding: 2px 6px;
    background-color: #e4e7ed;
    border-radius: 3px;
    color: #606266;
    cursor: help;
  }

  /* 标签徽章样式 */
  .label-badge {
    display: inline-block;
    padding: 1px 6px;
    border-radius: 3px;
    font-size: 10px;
    font-weight: 500;
    margin-left: 6px;
    vertical-align: middle;
  }

  .label-badge.static {
    background-color: #e6f7ff;
    color: #1890ff;
    border: 1px solid #91d5ff;
  }

  .label-badge.dynamic {
    background-color: #f6ffed;
    color: #52c41a;
    border: 1px solid #b7eb8f;
  }

  /* 动态配置区域样式 */
  .dynamic-config-section {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    padding: 12px;
    background-color: #fafafa;
  }

  .dynamic-config-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e8e8e8;
  }

  .dynamic-config-title {
    font-size: 12px;
    font-weight: 600;
    color: #595959;
  }
</style>
