<template>
  <div class="dropdown-options-config">
    <div class="config-header">
      <span class="config-title">菜单项配置</span>
      <ea-button icon="gear" type="primary" size="small" @click="openDialog">
        <span>配置菜单项</span>
      </ea-button>
    </div>

    <!-- 选项预览 -->
    <div class="options-preview">
      <ea-empty v-if="optionsData.length === 0" description="暂无菜单项"></ea-empty>
      <div v-else class="preview-list">
        <div
          v-for="(item, index) in flatOptions"
          :key="index"
          class="preview-item"
          :class="{ 'is-divided': item.divided }"
        >
          <span class="preview-label">{{ item.label }}</span>
          <span v-if="item.command" class="preview-value">({{ item.command }})</span>
          <ea-tag v-if="item.disabled" type="info" size="mini">禁用</ea-tag>
          <ea-tag v-if="item.divided" type="warning" size="mini">分割线</ea-tag>
        </div>
      </div>
    </div>

    <!-- 配置弹窗 -->
    <ea-dialog
      :visible="dialogVisible"
      title="配置 Dropdown 菜单项"
      width="600px"
      @close="closeDialog"
    >
      <div class="dialog-content">
        <!-- 工具栏 -->
        <div class="toolbar">
          <ea-button icon="plus" type="primary" text size="small" @click="addItem">
            添加菜单项
          </ea-button>
        </div>

        <!-- 列表结构 -->
        <div class="list-container">
          <ea-empty
            v-if="itemsData.length === 0"
            description="暂无数据，请点击上方按钮添加"
          ></ea-empty>
          <div v-else class="item-list">
            <div
              v-for="(item, index) in itemsData"
              :key="item.id"
              class="item-row"
              :class="{ 'is-divided': item.divided }"
            >
              <div class="item-content">
                <ea-icon name="gear" variant="solid" size="12" class="item-icon"></ea-icon>
                <span class="item-label">{{ item.label || '未命名菜单项' }}</span>
                <span v-if="item.command" class="item-command">指令: {{ item.command }}</span>
                <div class="item-badges">
                  <ea-tag v-if="item.disabled" type="info" size="mini">禁用</ea-tag>
                  <ea-tag v-if="item.divided" type="warning" size="mini">分割线</ea-tag>
                </div>
                <div class="item-actions">
                  <ea-button type="primary" text size="small" @click="editItem(item)">
                    编辑
                  </ea-button>
                  <ea-button
                    type="danger"
                    text
                    icon="trash-can"
                    size="small"
                    @click="removeItem(index)"
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
        <ea-button type="primary" @click="saveItems">确定</ea-button>
      </div>
    </ea-dialog>

    <!-- 编辑菜单项弹窗 -->
    <ea-dialog
      :visible="itemDialogVisible"
      :title="itemDialogTitle"
      width="400px"
      @close="closeItemDialog"
    >
      <div class="form-content">
        <div class="form-item">
          <label class="form-label">显示文本</label>
          <EaInput v-model="editingItem.label" placeholder="请输入显示文本" size="small" />
        </div>
        <div class="form-item">
          <label class="form-label">指令值 (command)</label>
          <EaInput v-model="editingItem.command" placeholder="请输入指令值" size="small" />
        </div>
        <div class="form-item form-item-inline">
          <label class="form-label">禁用</label>
          <EaSwitch v-model="editingItem.disabled" size="small" />
        </div>
        <div class="form-item form-item-inline">
          <label class="form-label">分割线</label>
          <EaSwitch v-model="editingItem.divided" size="small" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <ea-button @click="closeItemDialog">取消</ea-button>
        <ea-button type="primary" @click="saveItem">确定</ea-button>
      </div>
    </ea-dialog>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import { generateComponentId, generateUniqueId } from '@/utils/schemaHelper'
  import { useSchemaStore } from '@/components/designer/stores/schema'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaSwitch from '@/components/ea-ui-wrap/EaSwitch.vue'

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
  const itemDialogVisible = ref(false)

  // 列表数据
  const itemsData = ref([])

  // 编辑中的菜单项
  const editingItem = ref({ label: '', command: '', disabled: false, divided: false, id: '' })
  const editingIndex = ref(-1)
  const itemDialogTitle = ref('添加菜单项')

  // 计算扁平化的选项列表用于预览
  const flatOptions = computed(() => {
    return itemsData.value.slice(0, 5) // 只显示前5个
  })

  const optionsData = computed(() => itemsData.value)

  // 监听外部数据变化
  watch(
    () => props.component?.props?.[props.propName],
    newVal => {
      if (newVal && newVal.length > 0) {
        itemsData.value = JSON.parse(JSON.stringify(newVal))
      } else {
        itemsData.value = []
      }
    },
    { immediate: true, deep: true }
  )

  // 生成唯一ID
  function generateId() {
    return generateUniqueId('item')
  }

  // 打开弹窗
  function openDialog() {
    dialogVisible.value = true
  }

  // 关闭弹窗
  function closeDialog() {
    dialogVisible.value = false
  }

  // 关闭菜单项弹窗
  function closeItemDialog() {
    itemDialogVisible.value = false
  }

  // 添加菜单项
  function addItem() {
    editingItem.value = {
      label: '',
      command: '',
      disabled: false,
      divided: false,
      id: generateId(),
    }
    editingIndex.value = -1
    itemDialogTitle.value = '添加菜单项'
    itemDialogVisible.value = true
  }

  // 编辑菜单项
  function editItem(item) {
    editingItem.value = { ...item }
    editingIndex.value = itemsData.value.findIndex(i => i.id === item.id)
    itemDialogTitle.value = '编辑菜单项'
    itemDialogVisible.value = true
  }

  // 保存菜单项
  function saveItem() {
    if (!editingItem.value.label) {
      return
    }

    const newItem = {
      id: editingItem.value.id,
      label: editingItem.value.label,
      command: editingItem.value.command || '',
      disabled: editingItem.value.disabled || false,
      divided: editingItem.value.divided || false,
    }

    if (editingIndex.value > -1) {
      itemsData.value[editingIndex.value] = newItem
    } else {
      itemsData.value.push(newItem)
    }

    itemDialogVisible.value = false
  }

  // 删除菜单项
  function removeItem(index) {
    itemsData.value.splice(index, 1)
  }

  // 保存所有菜单项并更新组件
  function saveItems() {
    if (!props.component) return

    const data = itemsData.value

    // 更新组件 props
    schemaStore.updateComponentProps(props.component.id, {
      [props.propName]: data,
    })

    // 更新子组件
    updateDropdownChildren(data)

    dialogVisible.value = false
  }

  // 更新 Dropdown 的子组件
  function updateDropdownChildren(itemsData) {
    if (!props.component) return

    const existingChildren = props.component.children || []

    // 保留 reference 插槽的子组件（非选项相关）
    const referenceChildren = existingChildren.filter(
      child => child.props?.slot === 'reference' || child.type === 'ea-button'
    )

    // 生成唯一组件 ID
    const createComponentId = () => {
      return generateComponentId()
    }

    // 创建 dropdown-item 组件
    const createDropdownItemComponent = item => {
      const props = {
        slot: 'default',
      }
      if (item.command) {
        props.command = item.command
      }
      if (item.disabled) {
        props.disabled = true
      }
      if (item.divided) {
        props.divided = true
      }
      return {
        id: createComponentId(),
        type: 'ea-dropdown-item',
        props,
        childrenText: item.label,
      }
    }

    // 创建 dropdown-menu 组件，包含所有 dropdown-item
    const dropdownItems = itemsData.map(item => createDropdownItemComponent(item))

    const dropdownMenu = {
      id: createComponentId(),
      type: 'ea-dropdown-menu',
      props: {
        slot: 'default',
      },
      children: dropdownItems,
    }

    schemaStore.updateComponentChildren(props.component.id, [...referenceChildren, dropdownMenu])
  }
</script>

<style lang="scss" scoped>
  .dropdown-options-config {
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

  .preview-item.is-divided {
    border-top: 2px solid #e5e7eb;
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

  /* 列表结构 */
  .list-container {
    min-height: 200px;
  }

  .item-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .item-row {
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
  }

  .item-row.is-divided {
    border-top: 2px solid #e5e7eb;
  }

  .item-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .item-icon {
    color: #6b7280;
    flex-shrink: 0;
  }

  .item-label {
    font-size: 0.875rem;
    color: #374151;
    flex: 1;
  }

  .item-command {
    font-size: 0.75rem;
    color: #9ca3af;
    margin-right: 0.5rem;
  }

  .item-badges {
    display: flex;
    gap: 0.25rem;
    margin-right: 0.5rem;
  }

  .item-actions {
    display: flex;
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

  .form-item-inline {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .form-item-inline .form-label {
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
