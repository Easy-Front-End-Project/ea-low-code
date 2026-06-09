<template>
  <ea-dialog :visible="visible" title="变量管理" width="800px" @close="handleClose">
    <div class="variable-manager">
      <!-- 变量列表 -->
      <div class="variable-list">
        <form class="variable-form" @submit.prevent>
          <!-- 表头 -->
          <div class="variable-header">
            <div class="col-name">变量名</div>
            <div class="col-type">类型</div>
            <div class="col-default">默认值</div>
            <div class="col-remark">备注</div>
            <div class="col-action">操作</div>
          </div>

          <!-- 变量项 -->
          <div v-for="variable in localVariables" :key="variable.id" class="variable-item">
            <div class="col-name">
              <EaInput
                v-model="variable.name"
                size="small"
                placeholder="变量名"
                @input="(val) => handleUpdate(variable.id, 'name', val)"
              />
            </div>
            <div class="col-type">
              <EaSelect
                v-model="variable.type"
                size="small"
                @change="(val: any) => handleTypeChange(variable.id, val as VariableType)"
              >
                <ea-option value="string">字符串</ea-option>
                <ea-option value="number">数字</ea-option>
                <ea-option value="boolean">布尔值</ea-option>
                <ea-option value="array">数组</ea-option>
                <ea-option value="object">对象</ea-option>
                <ea-option value="function">函数</ea-option>
              </EaSelect>
            </div>
            <div class="col-default">
              <!-- 布尔值类型使用 EaSelect -->
              <EaSelect
                v-if="variable.type === 'boolean'"
                :value="variable.defaultValue || false"
                size="small"
                @change="(val) => handleUpdate(variable.id, 'defaultValue', val)"
              >
                <ea-option :value="true">true</ea-option>
                <ea-option :value="false">false</ea-option>
              </EaSelect>
              <!-- 数组/对象/函数类型使用按钮打开编辑器 -->
              <ea-button
                v-else-if="variable.type === 'array' || variable.type === 'object' || variable.type === 'function'"
                class="w-full text-center"
                type="primary"
                size="small"
                icon="pen"
                @click="handleOpenEditor(variable)"
                >{{ variable.type === 'function' ? '编辑函数' : '编辑' }}
              </ea-button>
              <!-- 其他类型使用 EaInput -->
              <EaInput
                v-else
                v-model="variable.defaultValue"
                size="small"
                placeholder="默认值"
                @input="(val) => handleUpdate(variable.id, 'defaultValue', val)"
              />
            </div>
            <div class="col-remark">
              <EaInput
                v-model="variable.remark"
                size="small"
                placeholder="备注"
                @input="(val) => handleUpdate(variable.id, 'remark', val)"
              />
            </div>
            <div class="col-action">
              <ea-button
                icon="xmark"
                type="danger"
                size="small"
                text
                @click="handleDeleteVariable(variable.id)"
              >
              </ea-button>
            </div>
          </div>

          <!-- 空状态 -->
          <ea-empty
            v-if="localVariables.length === 0"
            class="empty-state"
            description="暂无变量，点击添加变量按钮创建"
          ></ea-empty>
        </form>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <ea-button type="primary" icon="plus" size="small" @click="handleAddVariable">
        添加变量
      </ea-button>
      <ea-button @click="handleClose">关闭</ea-button>
    </div>

    <Teleport to="body">
      <!-- MonacoEditor 弹窗 -->
      <ea-dialog
        :visible="editorVisible"
        :title="editorTitle"
        width="600px"
        @close="handleCloseEditor"
      >
        <div class="editor-content">
          <MonacoEditor
            v-if="editorVisible"
            v-model="editorValue"
            :language="editorLanguage"
            height="300px"
          />
        </div>
        <div slot="footer" class="dialog-footer">
          <ea-button @click="handleCloseEditor">取消</ea-button>
          <ea-button type="primary" @click="handleSaveEditor">保存</ea-button>
        </div>
      </ea-dialog>
    </Teleport>
  </ea-dialog>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { useVariableStore } from '@/components/designer/stores/variable'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'
  import MonacoEditor from '@/components/common/MonacoEditor.vue'

  type VariableType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'function'

  interface VariableItem {
    id: string
    name: string
    type: VariableType
    defaultValue: any
    remark: string
  }

  defineProps<{
    visible?: boolean
  }>()

  const emit = defineEmits<{
    close: []
  }>()

  const variableStore = useVariableStore()

  // 本地变量列表（避免直接操作 store）
  const localVariables = ref<VariableItem[]>([])

  // MonacoEditor 弹窗状态
  const editorVisible = ref(false)
  const editorValue = ref('')
  const editingVariableId = ref<string | null>(null)
  const editingVariableType = ref<VariableType | ''>('')

  // 编辑器标题
  const editorTitle = computed(() => {
    const typeMap: Record<string, string> = {
      array: '编辑数组',
      object: '编辑对象',
      function: '编辑函数',
    }
    return typeMap[editingVariableType.value] || '编辑'
  })

  // 编辑器语言
  const editorLanguage = computed(() => {
    return editingVariableType.value === 'function' ? 'javascript' : 'json'
  })

  // 监听 store 变化，同步到本地
  watch(
    () => variableStore.variables,
    (newVariables: VariableItem[]) => {
      localVariables.value = newVariables.map((v: VariableItem) => ({ ...v }))
    },
    { immediate: true, deep: true }
  )

  // 关闭弹框
  function handleClose() {
    emit('close')
  }

  // 添加变量
  function handleAddVariable() {
    variableStore.addVariable({
      name: '',
      type: 'string',
      defaultValue: '',
      remark: '',
    })
  }

  // 类型改变处理
  function handleTypeChange(id: string, newType: VariableType) {
    handleUpdate(id, 'type', newType)

    // 根据新类型设置默认值
    const variable = variableStore.variables.find((v: VariableItem) => v.id === id)
    if (!variable) return

    let newDefaultValue: any
    switch (newType) {
      case 'number':
        newDefaultValue = 0
        break
      case 'boolean':
        newDefaultValue = false
        break
      case 'string':
        newDefaultValue = ''
        break
      case 'array':
        newDefaultValue = []
        break
      case 'object':
        newDefaultValue = {}
        break
      case 'function':
        newDefaultValue = `// 函数型变量 - 代码将立即执行并返回结果
// 可用 API：
// $component.get(id) - 获取组件DOM
// $component.setProp(id, prop, value) - 设置组件属性
// $component.getProp(id, prop) - 获取组件属性
// $component.call(id, method, ...args) - 调用组件方法
// $vars.get(name) - 获取变量值
// $vars.set(name, value) - 设置变量值
// $alias.get(alias) - 通过别名获取组件ID
// $alias.setProp(alias, prop, value) - 通过别名设置组件属性

// 示例：返回当前时间戳加7天
return Date.now() + 60 * 60 * 24 * 7 * 1000;`
        break
      default:
        newDefaultValue = ''
    }

    // 更新本地变量
    const localVar = localVariables.value.find((v: VariableItem) => v.id === id)
    if (localVar) {
      localVar.defaultValue = newDefaultValue
    }

    variableStore.updateVariable(id, { defaultValue: newDefaultValue })
  }

  // 更新变量
  function handleUpdate(id: string, field: string, value: any) {
    const variable = variableStore.variables.find((v: VariableItem) => v.id === id)
    if (!variable) return

    // 检查值是否真的改变了
    if ((variable as any)[field] !== value) {
      variableStore.updateVariable(id, { [field]: value })
    }
  }

  // 打开 MonacoEditor 编辑器
  function handleOpenEditor(variable: VariableItem) {
    editingVariableId.value = variable.id
    editingVariableType.value = variable.type

    // 根据类型设置默认值和格式
    try {
      if (variable.type === 'function') {
        // 函数类型：直接使用字符串值或提供默认函数模板
        if (variable.defaultValue && typeof variable.defaultValue === 'string') {
          editorValue.value = variable.defaultValue
        } else {
          editorValue.value = `// 函数型变量 - 代码将立即执行并返回结果
// 可用 API：
// $component.get(id) - 获取组件DOM
// $component.setProp(id, prop, value) - 设置组件属性
// $component.getProp(id, prop) - 获取组件属性
// $component.call(id, method, ...args) - 调用组件方法
// $vars.get(name) - 获取变量值
// $vars.set(name, value) - 设置变量值
// $alias.get(alias) - 通过别名获取组件ID
// $alias.setProp(alias, prop, value) - 通过别名设置组件属性

// 示例：返回当前时间戳加7天
return Date.now() + 60 * 60 * 24 * 7 * 1000;`
        }
      } else if (typeof variable.defaultValue === 'object') {
        editorValue.value = JSON.stringify(variable.defaultValue, null, 2)
      } else {
        editorValue.value = variable.type === 'array' ? '[]' : '{}'
      }
    } catch {
      editorValue.value =
        variable.type === 'array' ? '[]' : variable.type === 'function' ? '' : '{}'
    }

    editorVisible.value = true
  }

  // 关闭编辑器
  function handleCloseEditor() {
    editorVisible.value = false
    editorValue.value = ''
    editingVariableId.value = null
    editingVariableType.value = ''
  }

  // 保存编辑器内容
  function handleSaveEditor() {
    if (!editingVariableId.value) return

    // 函数类型直接保存字符串
    if (editingVariableType.value === 'function') {
      const codeValue = editorValue.value.trim()
      if (!codeValue) {
        alert('函数内容不能为空')
        return
      }

      // 更新本地变量
      const localVar = localVariables.value.find((v: VariableItem) => v.id === editingVariableId.value)
      if (localVar) {
        localVar.defaultValue = codeValue
      }

      // 更新 store
      variableStore.updateVariable(editingVariableId.value, { defaultValue: codeValue })

      handleCloseEditor()
      return
    }

    try {
      // 解析 JSON
      const parsedValue = JSON.parse(editorValue.value)

      // 验证类型
      if (editingVariableType.value === 'array' && !Array.isArray(parsedValue)) {
        alert('值必须是数组格式')
        return
      }
      if (
        editingVariableType.value === 'object' &&
        (Array.isArray(parsedValue) || typeof parsedValue !== 'object' || parsedValue === null)
      ) {
        alert('值必须是对象格式')
        return
      }

      // 更新本地变量
      const localVar = localVariables.value.find((v: VariableItem) => v.id === editingVariableId.value)
      if (localVar) {
        localVar.defaultValue = parsedValue
      }

      // 更新 store
      variableStore.updateVariable(editingVariableId.value, { defaultValue: parsedValue })

      handleCloseEditor()
    } catch {
      alert('JSON 格式错误，请检查输入')
    }
  }

  // 删除变量
  async function handleDeleteVariable(id: string) {
    try {
      await window.$confirm!('确定要删除这个变量吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      variableStore.removeVariable(id)
    } catch {
      // 用户取消删除，不做任何操作
    }
  }
</script>

<style lang="scss" scoped>
  @include b(variable-manager) {
    min-height: 300px;
    max-height: 500px;
    overflow-y: auto;
  }

  @include b(variable-form) {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  @include b(variable-header) {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background-color: #f3f4f6;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #4b5563;
  }

  @include b(variable-item) {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    transition: all 0.2s;

    &:hover {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgb(59 130 246 / 10%);
    }
  }

  @include b(col-name) {
    flex: 2;
    min-width: 120px;
    padding-right: 0.5rem;
  }

  @include b(col-type) {
    flex: 1.5;
    min-width: 100px;
    padding-right: 0.5rem;
  }

  @include b(col-default) {
    flex: 1.5;
    min-width: 100px;
    padding-right: 0.5rem;
  }

  @include b(col-remark) {
    flex: 2;
    min-width: 120px;
    padding-right: 0.5rem;
  }

  @include b(col-action) {
    width: 50px;
    display: flex;
    justify-content: center;
  }

  @include b(empty-state) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    border: 2px dashed #e5e7eb;
    border-radius: 0.5rem;
  }

  @include b(dialog-footer) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  @include b(editor-content) {
    padding: 1rem;
  }
</style>
