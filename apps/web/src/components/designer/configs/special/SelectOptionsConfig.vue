<template>
  <div class="select-options-config">
    <div class="config-header">
      <span class="config-title">选项配置</span>
      <ea-button icon="gear" type="primary" size="small" @click="openDialog">
        <span>配置选项</span>
      </ea-button>
    </div>

    <!-- 选项预览 -->
    <div class="options-preview">
      <ea-empty v-if="optionsData.length === 0" description="暂无选项"></ea-empty>
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
    <ea-dialog :visible="dialogVisible" title="配置 Select 选项" width="600px" @close="closeDialog">
      <div class="dialog-content">
        <!-- 工具栏 -->
        <div class="toolbar">
          <ea-button icon="plus" type="primary" text size="small" @click="addOption">
            添加选项
          </ea-button>
          <ea-button icon="folder" type="normal" text size="small" @click="addOptionGroup">
            添加分组
          </ea-button>
        </div>

        <!-- 树形结构 -->
        <div class="tree-container">
          <ea-empty
            v-if="treeData.length === 0"
            description="暂无数据，请点击上方按钮添加"
          ></ea-empty>
          <div v-else class="tree-list">
            <!-- 分组节点 -->
            <div v-for="node in groupNodes" :key="node.id" class="tree-node is-group">
              <div class="node-content">
                <ea-icon name="folder" variant="solid" size="14" class="node-icon"></ea-icon>
                <span class="node-label">{{ node.label || '未命名分组' }}</span>
                <div class="node-actions">
                  <ea-button type="primary" text size="small" @click="addOptionToGroup(node)">
                    添加选项
                  </ea-button>
                  <ea-button type="primary" text size="small" @click="editGroup(node)">
                    编辑
                  </ea-button>
                  <ea-button type="danger" text size="small" @click="removeNodeById(node.id)">
                    删除
                  </ea-button>
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
                    <ea-icon name="file" variant="solid" size="12" class="node-icon"></ea-icon>
                    <span class="node-label">{{ child.label || '未命名选项' }}</span>
                    <span class="node-value">值: {{ child.value }}</span>
                    <div class="node-actions">
                      <ea-button type="primary" text size="small" @click="editOption(child, node)">
                        编辑
                      </ea-button>
                      <ea-button
                        type="danger"
                        text
                        icon="trash-can"
                        size="small"
                        @click="removeChildNode(node, childIndex)"
                      >
                        删除
                      </ea-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 普通选项节点 -->
            <div v-for="node in optionNodes" :key="node.id" class="tree-node is-option">
              <div class="node-content">
                <ea-icon name="file" variant="solid" size="12" class="node-icon"></ea-icon>
                <span class="node-label">{{ node.label || '未命名选项' }}</span>
                <span class="node-value">值: {{ node.value }}</span>
                <div class="node-actions">
                  <ea-button icon="pen" type="primary" text size="small" @click="editOption(node)">
                    编辑
                  </ea-button>
                  <ea-button
                    type="danger"
                    text
                    size="small"
                    icon="trash-can"
                    @click="removeNodeById(node.id)"
                  >
                    删除
                  </ea-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <ea-button @click="closeDialog">取消</ea-button>
        <ea-button type="primary" @click="saveOptions">确定</ea-button>
      </div>
    </ea-dialog>

    <!-- 编辑选项弹窗 -->
    <ea-dialog
      :visible="optionDialogVisible"
      :title="optionDialogTitle"
      width="400px"
      @close="closeOptionDialog"
    >
      <div class="form-content">
        <div class="form-item">
          <label class="form-label">显示文本</label>
          <EaInput v-model="editingOption.label" placeholder="请输入显示文本" size="small" />
        </div>
        <div class="form-item">
          <label class="form-label">选项值</label>
          <EaInput v-model="editingOption.value" placeholder="请输入选项值" size="small" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <ea-button @click="closeOptionDialog">取消</ea-button>
        <ea-button type="primary" @click="saveOption">确定</ea-button>
      </div>
    </ea-dialog>

    <!-- 编辑分组弹窗 -->
    <ea-dialog
      :visible="groupDialogVisible"
      title="编辑分组"
      width="400px"
      @close="closeGroupDialog"
    >
      <div class="form-content">
        <div class="form-item">
          <label class="form-label">分组标签</label>
          <EaInput v-model="editingGroup.label" placeholder="请输入分组标签" size="small" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <ea-button @click="closeGroupDialog">取消</ea-button>
        <ea-button type="primary" @click="saveGroup">确定</ea-button>
      </div>
    </ea-dialog>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import { generateComponentId, generateUniqueId } from '@/utils/schemaHelper'
  import { useSchemaStore } from '@/components/designer/stores/schema'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

  const props = defineProps({
    // 当前选中的组件
    component: {
      type: Object,
      default: null,
    },
    // 配置属性名
    propName: {
      type: String,
      default: 'optionsConfig',
    },
  })

  const schemaStore = useSchemaStore()

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
    return treeData.value.filter(n => n.type === 'group')
  })

  // 计算普通选项节点
  const optionNodes = computed(() => {
    return treeData.value.filter(n => n.type !== 'group')
  })

  // 计算扁平化的选项列表用于预览
  const flatOptions = computed(() => {
    const result = []
    treeData.value.forEach(node => {
      if (node.type === 'group') {
        result.push({ type: 'group', label: node.label, value: '-' })
        node.children?.forEach(child => {
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
    () => props.component?.props?.[props.propName],
    newVal => {
      if (newVal && newVal.length > 0) {
        treeData.value = JSON.parse(JSON.stringify(newVal))
      } else {
        treeData.value = []
      }
    },
    { immediate: true, deep: true }
  )

  // 生成唯一ID
  function generateId() {
    return generateUniqueId('option')
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
      const index = editingParent.value.children.findIndex(item => item.id === newOption.id)
      if (index > -1) {
        editingParent.value.children[index] = newOption
      } else {
        editingParent.value.children.push(newOption)
      }
    } else {
      // 添加到根级
      const index = treeData.value.findIndex(item => item.id === newOption.id)
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

    const index = treeData.value.findIndex(item => item.id === newGroup.id)
    if (index > -1) {
      treeData.value[index] = { ...treeData.value[index], ...newGroup }
    } else {
      treeData.value.push(newGroup)
    }

    groupDialogVisible.value = false
  }

  // 通过ID删除节点
  function removeNodeById(id) {
    const index = treeData.value.findIndex(item => item.id === id)
    if (index > -1) {
      treeData.value.splice(index, 1)
    }
  }

  // 删除子节点
  function removeChildNode(parent, childIndex) {
    parent.children?.splice(childIndex, 1)
  }

  // 保存所有选项并更新组件
  function saveOptions() {
    if (!props.component) return

    const data = treeData.value

    // 更新组件 props
    schemaStore.updateComponentProps(props.component.id, {
      [props.propName]: data,
    })

    // 更新子组件
    updateSelectChildren(data)

    dialogVisible.value = false
  }

  // 更新 Select 的子组件
  function updateSelectChildren(optionsData) {
    if (!props.component) return

    const existingChildren = props.component.children || []
    const nonOptionChildren = existingChildren.filter(
      child => child.type !== 'ea-option' && child.type !== 'ea-option-group'
    )

    // 生成唯一组件 ID
    const createComponentId = () => {
      return generateComponentId()
    }

    // 创建 option 组件
    const createOptionComponent = (value, label) => {
      return {
        id: createComponentId(),
        type: 'ea-option',
        props: {
          value,
          slot: 'default',
        },
        childrenText: label,
      }
    }

    // 创建 option-group 组件
    const createOptionGroupComponent = (label, children) => {
      return {
        id: createComponentId(),
        type: 'ea-option-group',
        props: {
          label,
          slot: 'default',
        },
        children: children.map(child => createOptionComponent(child.value, child.label)),
      }
    }

    const newChildren = optionsData.map(item =>
      item.type === 'group'
        ? createOptionGroupComponent(item.label, item.children || [])
        : createOptionComponent(item.value, item.label)
    )

    schemaStore.updateComponentChildren(props.component.id, [...nonOptionChildren, ...newChildren])
  }
</script>

<style lang="scss" scoped>
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

  .options-preview {
    background-color: #f9fafb;
    border-radius: 0.375rem;
    padding: 0.5rem;
    min-height: 40px;
  }

  .preview-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .preview-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
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

  /* 弹窗内容 */
  .dialog-content {
    max-height: 400px;
    overflow-y: auto;
  }

  .toolbar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  /* 树形结构 */
  .tree-container {
    min-height: 200px;
  }

  .tree-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .tree-node {
    border-radius: 0.375rem;
  }

  .tree-node.is-group {
    background-color: #f3f4f6;
    padding: 0.5rem;
  }

  .tree-node.is-option {
    background-color: #fff;
    border: 1px solid #e5e7eb;
  }

  .node-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem;
  }

  .node-icon {
    color: #6b7280;
    flex-shrink: 0;
  }

  .tree-node.is-group .node-icon {
    color: #3b82f6;
  }

  .node-label {
    font-size: 0.875rem;
    color: #374151;
    flex: 1;
  }

  .node-value {
    font-size: 0.75rem;
    color: #9ca3af;
    margin-right: 0.5rem;
  }

  .node-actions {
    display: flex;
    gap: 0.25rem;
  }

  .tree-children {
    margin-left: 1.5rem;
    margin-top: 0.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  /* 表单样式 */
  .form-content {
    padding: 1rem 0;
  }

  .form-item {
    margin-bottom: 1rem;
  }

  .form-item:last-child {
    margin-bottom: 0;
  }

  .form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
</style>
