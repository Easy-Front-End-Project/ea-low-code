<template>
  <div class="select-options-config">
    <div class="config-header">
      <span class="config-title">选项配置</span>
      <button class="config-btn" @click="openDialog">
        <span class="btn-icon">⚙️</span>
        配置选项
      </button>
    </div>

    <!-- 选项预览 -->
    <div class="options-preview">
      <div v-if="optionsData.length === 0" class="empty-text">暂无选项</div>
      <div v-else class="preview-list">
        <div
          v-for="(item, index) in flatOptions"
          :key="index"
          class="preview-item"
          :class="{ 'is-group': item.type === 'group' }"
        >
          <span class="preview-label">{{ item.label }}</span>
          <span class="preview-value">({{ item.value }})</span>
        </div>
      </div>
    </div>

    <!-- 配置弹窗 -->
    <div v-if="dialogVisible" class="dialog-overlay" @click.self="closeDialog">
      <div class="dialog-container" style="width: 600px">
        <div class="dialog-header">
          <span class="dialog-title">配置 Select 选项</span>
          <button class="close-btn" @click="closeDialog">×</button>
        </div>

        <div class="dialog-body">
          <!-- 工具栏 -->
          <div class="toolbar">
            <button class="toolbar-btn primary" @click="addOption">
              <span class="btn-icon">+</span>
              添加选项
            </button>
            <button class="toolbar-btn" @click="addOptionGroup">
              <span class="btn-icon">📁</span>
              添加分组
            </button>
          </div>

          <!-- 树形结构 -->
          <div class="tree-container">
            <div v-if="treeData.length === 0" class="tree-empty">暂无数据，请点击上方按钮添加</div>
            <div v-else class="tree-list">
              <!-- 分组节点 -->
              <div v-for="node in groupNodes" :key="node.id" class="tree-node is-group">
                <div class="node-content">
                  <span class="node-icon">📂</span>
                  <span class="node-label">{{ node.label || '未命名分组' }}</span>
                  <div class="node-actions">
                    <button class="action-btn" @click="addOptionToGroup(node)">添加选项</button>
                    <button class="action-btn" @click="editGroup(node)">编辑</button>
                    <button class="action-btn danger" @click="removeNodeById(node.id)">删除</button>
                  </div>
                </div>
                <!-- 子选项 -->
                <div class="tree-children">
                  <div
                    v-for="(child, childIndex) in node.children"
                    :key="child.id"
                    class="tree-node is-option"
                  >
                    <div class="node-content">
                      <span class="node-icon">○</span>
                      <span class="node-label">{{ child.label || '未命名选项' }}</span>
                      <span class="node-value">值: {{ child.value }}</span>
                      <div class="node-actions">
                        <button class="action-btn" @click="editOption(child, node)">编辑</button>
                        <button
                          class="action-btn danger"
                          @click="removeChildNode(node, childIndex)"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 普通选项节点 -->
              <div v-for="node in optionNodes" :key="node.id" class="tree-node is-option">
                <div class="node-content">
                  <span class="node-icon">○</span>
                  <span class="node-label">{{ node.label || '未命名选项' }}</span>
                  <span class="node-value">值: {{ node.value }}</span>
                  <div class="node-actions">
                    <button class="action-btn" @click="editOption(node)">编辑</button>
                    <button class="action-btn danger" @click="removeNodeById(node.id)">删除</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <button class="footer-btn" @click="closeDialog">取消</button>
          <button class="footer-btn primary" @click="saveOptions">确定</button>
        </div>
      </div>
    </div>

    <!-- 编辑选项弹窗 -->
    <div v-if="optionDialogVisible" class="dialog-overlay" @click.self="closeOptionDialog">
      <div class="dialog-container" style="width: 400px">
        <div class="dialog-header">
          <span class="dialog-title">{{ optionDialogTitle }}</span>
          <button class="close-btn" @click="closeOptionDialog">×</button>
        </div>
        <div class="dialog-body">
          <div class="form-item">
            <label class="form-label">显示文本</label>
            <input v-model="editingOption.label" class="form-input" placeholder="请输入显示文本" />
          </div>
          <div class="form-item">
            <label class="form-label">选项值</label>
            <input v-model="editingOption.value" class="form-input" placeholder="请输入选项值" />
          </div>
        </div>
        <div class="dialog-footer">
          <button class="footer-btn" @click="closeOptionDialog">取消</button>
          <button class="footer-btn primary" @click="saveOption">确定</button>
        </div>
      </div>
    </div>

    <!-- 编辑分组弹窗 -->
    <div v-if="groupDialogVisible" class="dialog-overlay" @click.self="closeGroupDialog">
      <div class="dialog-container" style="width: 400px">
        <div class="dialog-header">
          <span class="dialog-title">编辑分组</span>
          <button class="close-btn" @click="closeGroupDialog">×</button>
        </div>
        <div class="dialog-body">
          <div class="form-item">
            <label class="form-label">分组标签</label>
            <input v-model="editingGroup.label" class="form-input" placeholder="请输入分组标签" />
          </div>
        </div>
        <div class="dialog-footer">
          <button class="footer-btn" @click="closeGroupDialog">取消</button>
          <button class="footer-btn primary" @click="saveGroup">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'

  const props = defineProps({
    modelValue: {
      type: Array,
      default: () => [],
    },
  })

  const emit = defineEmits(['update:modelValue', 'change'])

  // 弹窗显示状态
  const dialogVisible = ref(false)
  const optionDialogVisible = ref(false)
  const groupDialogVisible = ref(false)

  // 树形数据
  const treeData = ref([])

  // 编辑中的选项
  const editingOption = ref({ label: '', value: '', id: '' })
  const editingGroup = ref({ label: '', id: '' })
  const editingParent = ref(null)
  const optionDialogTitle = ref('添加选项')

  // 计算分组节点
  const groupNodes = computed(() => {
    return treeData.value.filter((n) => n.type === 'group')
  })

  // 计算普通选项节点
  const optionNodes = computed(() => {
    return treeData.value.filter((n) => n.type !== 'group')
  })

  // 计算扁平化的选项列表用于预览
  const flatOptions = computed(() => {
    const result = []
    treeData.value.forEach((node) => {
      if (node.type === 'group') {
        result.push({ type: 'group', label: node.label, value: '-' })
        node.children?.forEach((child) => {
          result.push({ type: 'option', label: child.label, value: child.value })
        })
      } else {
        result.push({ type: 'option', label: node.label, value: node.value })
      }
    })
    return result.slice(0, 5) // 只显示前5个
  })

  const optionsData = computed(() => treeData.value)

  // 监听外部数据变化
  watch(
    () => props.modelValue,
    (newVal) => {
      if (newVal && newVal.length > 0) {
        treeData.value = JSON.parse(JSON.stringify(newVal))
      } else {
        treeData.value = []
      }
    },
    { immediate: true, deep: true },
  )

  // 生成唯一ID
  function generateId() {
    return 'option_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  // 打开弹窗
  function openDialog() {
    dialogVisible.value = true
  }

  // 关闭弹窗
  function closeDialog() {
    dialogVisible.value = false
  }

  // 关闭选项弹窗
  function closeOptionDialog() {
    optionDialogVisible.value = false
  }

  // 关闭分组弹窗
  function closeGroupDialog() {
    groupDialogVisible.value = false
  }

  // 添加选项
  function addOption() {
    editingOption.value = { label: '', value: '', id: generateId() }
    editingParent.value = null
    optionDialogTitle.value = '添加选项'
    optionDialogVisible.value = true
  }

  // 添加选项到分组
  function addOptionToGroup(group) {
    editingOption.value = { label: '', value: '', id: generateId() }
    editingParent.value = group
    optionDialogTitle.value = '添加选项'
    optionDialogVisible.value = true
  }

  // 添加分组
  function addOptionGroup() {
    editingGroup.value = { label: '', id: generateId(), children: [] }
    groupDialogVisible.value = true
  }

  // 编辑选项
  function editOption(option, parent = null) {
    editingOption.value = { ...option }
    editingParent.value = parent
    optionDialogTitle.value = '编辑选项'
    optionDialogVisible.value = true
  }

  // 编辑分组
  function editGroup(group) {
    editingGroup.value = { ...group, children: group.children || [] }
    groupDialogVisible.value = true
  }

  // 保存选项
  function saveOption() {
    if (!editingOption.value.label || !editingOption.value.value) {
      return
    }

    const newOption = {
      id: editingOption.value.id,
      type: 'option',
      label: editingOption.value.label,
      value: editingOption.value.value,
    }

    if (editingParent.value) {
      // 添加到分组
      if (!editingParent.value.children) {
        editingParent.value.children = []
      }
      const index = editingParent.value.children.findIndex((item) => item.id === newOption.id)
      if (index > -1) {
        editingParent.value.children[index] = newOption
      } else {
        editingParent.value.children.push(newOption)
      }
    } else {
      // 添加到根级
      const index = treeData.value.findIndex((item) => item.id === newOption.id)
      if (index > -1) {
        treeData.value[index] = newOption
      } else {
        treeData.value.push(newOption)
      }
    }

    optionDialogVisible.value = false
  }

  // 保存分组
  function saveGroup() {
    if (!editingGroup.value.label) {
      return
    }

    const newGroup = {
      id: editingGroup.value.id,
      type: 'group',
      label: editingGroup.value.label,
      children: editingGroup.value.children || [],
    }

    const index = treeData.value.findIndex((item) => item.id === newGroup.id)
    if (index > -1) {
      treeData.value[index] = { ...treeData.value[index], ...newGroup }
    } else {
      treeData.value.push(newGroup)
    }

    groupDialogVisible.value = false
  }

  // 通过ID删除节点
  function removeNodeById(id) {
    const index = treeData.value.findIndex((item) => item.id === id)
    if (index > -1) {
      treeData.value.splice(index, 1)
    }
  }

  // 删除子节点
  function removeChildNode(parent, childIndex) {
    parent.children?.splice(childIndex, 1)
  }

  // 保存所有选项
  function saveOptions() {
    emit('update:modelValue', treeData.value)
    emit('change', treeData.value)
    dialogVisible.value = false
  }
</script>

<style scoped>
  .select-options-config {
    margin-bottom: 1rem;
  }

  .config-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .config-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }

  .config-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    color: #fff;
    background-color: #3b82f6;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  .config-btn:hover {
    background-color: #2563eb;
  }

  .btn-icon {
    font-size: 0.75rem;
  }

  .options-preview {
    background-color: #f9fafb;
    border-radius: 0.375rem;
    padding: 0.5rem;
    min-height: 40px;
  }

  .empty-text {
    font-size: 0.75rem;
    color: #9ca3af;
    text-align: center;
    padding: 0.5rem;
  }

  .preview-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .preview-item {
    font-size: 0.75rem;
    color: #4b5563;
    padding: 0.25rem 0.5rem;
    background-color: #fff;
    border-radius: 0.25rem;
    border: 1px solid #e5e7eb;
  }

  .preview-item.is-group {
    background-color: #eff6ff;
    border-color: #bfdbfe;
    font-weight: 500;
  }

  .preview-label {
    margin-right: 0.25rem;
  }

  .preview-value {
    color: #9ca3af;
  }

  /* 弹窗样式 */
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .dialog-container {
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    max-height: 80vh;
    display: flex;
    flex-direction: column;
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .dialog-title {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #6b7280;
    cursor: pointer;
    line-height: 1;
  }

  .close-btn:hover {
    color: #374151;
  }

  .dialog-body {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .footer-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    border: 1px solid #d1d5db;
    background-color: #fff;
    border-radius: 0.375rem;
    cursor: pointer;
  }

  .footer-btn:hover {
    background-color: #f9fafb;
  }

  .footer-btn.primary {
    background-color: #3b82f6;
    color: #fff;
    border-color: #3b82f6;
  }

  .footer-btn.primary:hover {
    background-color: #2563eb;
  }

  /* 工具栏 */
  .toolbar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .toolbar-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  .toolbar-btn:hover {
    background-color: #e5e7eb;
  }

  .toolbar-btn.primary {
    background-color: #3b82f6;
    color: #fff;
    border-color: #3b82f6;
  }

  .toolbar-btn.primary:hover {
    background-color: #2563eb;
  }

  /* 树形结构 */
  .tree-container {
    min-height: 200px;
  }

  .tree-empty {
    text-align: center;
    color: #9ca3af;
    padding: 2rem;
    font-size: 0.875rem;
  }

  .tree-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .tree-node {
    border-radius: 0.375rem;
    overflow: hidden;
  }

  .tree-node.is-group {
    background-color: #f0f9ff;
    border: 1px solid #bae6fd;
  }

  .tree-node.is-option {
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
  }

  .node-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
  }

  .node-icon {
    color: #6b7280;
    flex-shrink: 0;
    font-size: 0.875rem;
  }

  .tree-node.is-group .node-icon {
    color: #3b82f6;
  }

  .node-label {
    flex: 1;
    font-size: 0.875rem;
    color: #374151;
  }

  .node-value {
    font-size: 0.75rem;
    color: #6b7280;
    background-color: #e5e7eb;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
  }

  .node-actions {
    display: flex;
    gap: 0.25rem;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .tree-node:hover .node-actions {
    opacity: 1;
  }

  .action-btn {
    padding: 0.125rem 0.375rem;
    font-size: 0.75rem;
    color: #3b82f6;
    background: none;
    border: none;
    cursor: pointer;
  }

  .action-btn:hover {
    text-decoration: underline;
  }

  .action-btn.danger {
    color: #ef4444;
  }

  .tree-children {
    padding-left: 1.5rem;
    padding-bottom: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .tree-children .tree-node {
    margin-right: 0.5rem;
  }

  /* 表单样式 */
  .form-item {
    margin-bottom: 1rem;
  }

  .form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .form-input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    outline: none;
  }

  .form-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
</style>
