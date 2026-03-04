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
          <span class="text-xs text-blue-600 font-medium">{{ event.type }}</span>
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
                <span class="text-xs text-gray-500">{{ event.type }}</span>
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
            <div class="space-y-4">
              <!-- 事件名称 -->
              <div class="config-item">
                <label class="config-label">事件名称</label>
                <ea-input v-model="selectedEvent.name" placeholder="如：handleClick" size="small" />
              </div>

              <!-- 事件类型 -->
              <div class="config-item">
                <label class="config-label">事件类型</label>
                <ea-select v-model="selectedEvent.type" size="small" class="w-full">
                  <ea-option value="click">点击</ea-option>
                </ea-select>
              </div>

              <!-- 动作类型 -->
              <div class="config-item">
                <label class="config-label">动作</label>
                <ea-select
                  :value="selectedEvent.action"
                  size="small"
                  class="w-full"
                  @change.stop="handleActionChange($event.detail.value)"
                >
                  <ea-option value="message">显示提示</ea-option>
                  <ea-option value="setProp">设置组件属性</ea-option>
                  <ea-option value="callMethod">调用组件方法</ea-option>
                  <ea-option value="custom">自定义代码</ea-option>
                </ea-select>
              </div>

              <!-- 显示提示配置 -->
              <div v-if="selectedEvent.action === 'message'" class="config-item">
                <label class="config-label">提示内容</label>
                <ea-input
                  v-model="selectedEvent.message"
                  placeholder="输入提示消息内容"
                  size="small"
                />
              </div>

              <!-- 设置组件属性配置 -->
              <template v-if="selectedEvent.action === 'setProp'">
                <div class="config-item">
                  <label class="config-label">目标组件ID</label>
                  <ea-input
                    v-model="selectedEvent.targetComponentId"
                    placeholder="如：button_123"
                    size="small"
                  />
                </div>
                <div class="config-item">
                  <label class="config-label">属性名</label>
                  <ea-input
                    v-model="selectedEvent.propName"
                    placeholder="如：loading"
                    size="small"
                  />
                </div>
                <div class="config-item">
                  <label class="config-label">属性值</label>
                  <ea-select
                    :value="selectedEvent.propValue"
                    size="small"
                    class="w-full"
                    @change.stop="selectedEvent.propValue = $event.detail.value"
                  >
                    <ea-option :value="true">true</ea-option>
                    <ea-option :value="false">false</ea-option>
                  </ea-select>
                </div>
              </template>

              <!-- 调用组件方法配置 -->
              <template v-if="selectedEvent.action === 'callMethod'">
                <div class="config-item">
                  <label class="config-label">目标组件ID</label>
                  <ea-input
                    v-model="selectedEvent.targetComponentId"
                    placeholder="如：button_123"
                    size="small"
                  />
                </div>
                <div class="config-item">
                  <label class="config-label">方法名</label>
                  <ea-input
                    v-model="selectedEvent.methodName"
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
                  :key="selectedEvent.id + '_editor'"
                  v-model="selectedEvent.code"
                  language="javascript"
                  height="200px"
                />
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
  import { ref } from 'vue'
  import MonacoEditor from './MonacoEditor.vue'

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

  // 代码帮助 API 配置
  const codeHelpApis = ref([
    { name: '$component.get(id)', desc: '获取组件实例，参数：组件ID' },
    {
      name: '$component.setProp(id, prop, value)',
      desc: '设置组件属性，参数：组件ID、属性名、属性值',
    },
    { name: '$component.getProp(id, prop)', desc: '获取组件属性，参数：组件ID、属性名' },
    {
      name: '$component.call(id, method, ...args)',
      desc: '调用组件方法，参数：组件ID、方法名、方法参数',
    },
    { name: '$vars.get(name)', desc: '获取变量值，参数：变量名' },
    { name: '$vars.set(name, value)', desc: '设置变量值，参数：变量名、变量值' },
  ])

  // 弹框显示状态
  const dialogVisible = ref(false)
  // 本地事件列表
  const localEvents = ref([])
  // 当前选中的事件
  const selectedEvent = ref(null)

  // 打开弹框
  function handleOpenDialog() {
    // 深拷贝当前事件列表
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
    const newEvent = {
      id: generateId(),
      name: `event${localEvents.value.length + 1}`,
      type: 'click',
      action: 'message',
      message: '提示消息',
      code: `console.log('事件触发');`,
    }
    localEvents.value.push(newEvent)
    selectedEvent.value = newEvent
  }

  // 选择事件
  function handleSelectEvent(event) {
    selectedEvent.value = event
  }

  // 动作类型改变
  function handleActionChange(action) {
    if (!selectedEvent.value) return

    selectedEvent.value.action = action

    // 根据动作类型初始化对应字段
    if (action === 'message') {
      selectedEvent.value.message = selectedEvent.value.message || '提示消息'
    } else if (action === 'setProp') {
      selectedEvent.value.targetComponentId = selectedEvent.value.targetComponentId || ''
      selectedEvent.value.propName = selectedEvent.value.propName || 'loading'
      selectedEvent.value.propValue =
        selectedEvent.value.propValue !== undefined ? selectedEvent.value.propValue : true
    } else if (action === 'callMethod') {
      selectedEvent.value.targetComponentId = selectedEvent.value.targetComponentId || ''
      selectedEvent.value.methodName = selectedEvent.value.methodName || ''
    } else if (action === 'custom') {
      selectedEvent.value.code =
        selectedEvent.value.code ||
        `// 使用 $component 操作其他组件\n// 示例：设置按钮 loading\n$component.setProp('button_123', 'loading', true);\n\n// 示例：获取组件\nconst btn = $component.get('button_123');\nconsole.log(btn);\n\n// 使用 $vars 操作变量\n// 示例：获取变量值\nconst username = $vars.get('username');\nconsole.log(username);\n\n// 示例：设置变量值\n$vars.set('count', 100);`
    }
  }

  // 删除事件
  function handleDeleteEvent(eventId) {
    const index = localEvents.value.findIndex((e) => e.id === eventId)
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
    selectedEvent.value = localEvents.value.find((e) => e.id === event.id) || null
    dialogVisible.value = true
  }

  // 保存事件
  function handleSaveEvents() {
    emit('event-change', localEvents.value)
    handleCloseDialog()
  }

  // 生成唯一ID
  function generateId() {
    return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }
</script>

<style scoped>
  .props-section {
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
  }

  .event-tag {
    transition: background-color 0.2s;
  }

  .event-list {
    overflow-y: auto;
  }

  .event-item {
    transition: background-color 0.2s;
  }

  .event-item:hover {
    background-color: #f3f4f6;
  }

  .config-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .config-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
  }

  .dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .code-help {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background-color: #eff6ff;
    border: 1px solid #dbeafe;
    border-radius: 0.375rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
  }

  .code-help-icon {
    color: #3b82f6;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .code-help-title {
    font-size: 0.75rem;
    font-weight: 500;
    color: #1e40af;
    flex-shrink: 0;
  }

  .code-help-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    flex: 1;
  }

  .code-help-item {
    font-size: 0.6875rem;
    padding: 0.125rem 0.375rem;
    background-color: #dbeafe;
    color: #1e40af;
    border-radius: 0.25rem;
    cursor: help;
    transition: background-color 0.2s;
  }

  .code-help-item:hover {
    background-color: #bfdbfe;
  }
</style>
