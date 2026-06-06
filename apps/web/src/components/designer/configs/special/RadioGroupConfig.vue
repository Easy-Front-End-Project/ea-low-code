<template>
  <div class="radio-group-config">
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
          :class="{ 'is-disabled': item.disabled }"
        >
          <ea-icon name="circle" variant="regular" size="12" class="preview-icon"></ea-icon>
          <span class="preview-label">{{ item.label }}</span>
          <span class="preview-value">({{ item.value }})</span>
        </div>
      </div>
    </div>

    <!-- 配置弹窗 -->
    <ea-dialog :visible="dialogVisible" title="配置单选框选项" width="600px" @close="closeDialog">
      <div class="dialog-content">
        <!-- 工具栏 -->
        <div class="toolbar">
          <ea-button icon="plus" type="primary" text size="small" @click="addOption">
            添加选项
          </ea-button>
        </div>

        <!-- 选项列表 -->
        <div class="options-container">
          <ea-empty
            v-if="optionsData.length === 0"
            description="暂无数据，请点击上方按钮添加"
          ></ea-empty>
          <div v-else class="options-list">
            <div
              v-for="(node, index) in optionsData"
              :key="node.id"
              class="option-item"
              :class="{ 'is-disabled': node.disabled }"
            >
              <div class="option-content">
                <ea-icon name="circle" variant="regular" size="14" class="option-icon"></ea-icon>
                <span class="option-label">{{ node.label || '未命名选项' }}</span>
                <span class="option-value">值: {{ node.value }}</span>
                <ea-tag v-if="node.disabled" type="info" size="small">禁用</ea-tag>
                <div class="option-actions">
                  <ea-button type="primary" text size="small" @click="editOption(node)">
                    编辑
                  </ea-button>
                  <ea-button
                    type="danger"
                    text
                    icon="trash-can"
                    size="small"
                    @click="removeOption(index)"
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
        <div class="form-item">
          <label class="form-label">
            <EaCheckbox v-model="editingOption.disabled">禁用该选项</EaCheckbox>
          </label>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <ea-button @click="closeOptionDialog">取消</ea-button>
        <ea-button type="primary" @click="saveOption">确定</ea-button>
      </div>
    </ea-dialog>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import { generateComponentId, generateUniqueId } from '@/utils/schemaHelper'
  import { useSchemaStore } from '@/components/designer/stores/schema'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaCheckbox from '@/components/ea-ui-wrap/EaCheckbox.vue'

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

  // 选项数据
  const optionsData = ref([])

  // 编辑中的选项
  const editingOption = ref({ label: '', value: '', disabled: false, id: '' })
  const editingIndex = ref(-1)
  const optionDialogTitle = ref('添加选项')

  // 计算扁平化的选项列表用于预览
  const flatOptions = computed(() => {
    return optionsData.value.slice(0, 5).map(item => ({
      label: item.label,
      value: item.value,
      disabled: item.disabled,
    }))
  })

  // 监听外部数据变化
  watch(
    () => props.component?.props?.[props.propName],
    newVal => {
      if (newVal && newVal.length > 0) {
        optionsData.value = JSON.parse(JSON.stringify(newVal))
      } else {
        optionsData.value = []
      }
    },
    { immediate: true, deep: true }
  )

  // 生成唯一ID
  function generateId() {
    return generateUniqueId('radio')
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

  // 添加选项
  function addOption() {
    editingOption.value = { label: '', value: '', disabled: false, id: generateId() }
    editingIndex.value = -1
    optionDialogTitle.value = '添加选项'
    optionDialogVisible.value = true
  }

  // 编辑选项
  function editOption(option) {
    editingOption.value = { ...option }
    editingIndex.value = optionsData.value.findIndex(item => item.id === option.id)
    optionDialogTitle.value = '编辑选项'
    optionDialogVisible.value = true
  }

  // 保存选项
  function saveOption() {
    if (!editingOption.value.label || !editingOption.value.value) {
      return
    }

    const newOption = {
      id: editingOption.value.id,
      label: editingOption.value.label,
      value: editingOption.value.value,
      disabled: editingOption.value.disabled,
    }

    if (editingIndex.value > -1) {
      // 更新现有选项
      optionsData.value[editingIndex.value] = newOption
    } else {
      // 添加新选项
      optionsData.value.push(newOption)
    }

    optionDialogVisible.value = false
  }

  // 删除选项
  function removeOption(index) {
    optionsData.value.splice(index, 1)
  }

  // 保存所有选项并更新组件
  function saveOptions() {
    if (!props.component) return

    const data = optionsData.value

    // 更新组件 props
    schemaStore.updateComponentProps(props.component.id, {
      [props.propName]: data,
    })

    // 更新子组件
    updateRadioGroupChildren(data)

    dialogVisible.value = false
  }

  // 更新单选框组的子组件
  function updateRadioGroupChildren(optionsData) {
    if (!props.component) return

    // 移除现有的 ea-radio 子组件
    const existingChildren = props.component.children || []
    const nonRadioChildren = existingChildren.filter(child => child.type !== 'ea-radio')

    // 根据配置生成新的子组件
    const newChildren = optionsData.map(item => ({
      id: generateComponentId(),
      type: 'ea-radio',
      props: {
        value: item.value,
        label: item.label,
        disabled: item.disabled,
        slot: 'default',
      },
    }))

    // 更新组件的子组件
    schemaStore.updateComponentChildren(props.component.id, [...nonRadioChildren, ...newChildren])
  }
</script>

<style lang="scss" scoped>
  .radio-group-config {
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

  .preview-item.is-disabled {
    background-color: #f3f4f6;
    color: #9ca3af;
  }

  .preview-icon {
    color: #3b82f6;
    flex-shrink: 0;
  }

  .preview-item.is-disabled .preview-icon {
    color: #9ca3af;
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

  /* 选项列表 */
  .options-container {
    min-height: 200px;
  }

  .options-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .option-item {
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    padding: 0.5rem;
  }

  .option-item.is-disabled {
    background-color: #f9fafb;
  }

  .option-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .option-icon {
    color: #3b82f6;
    flex-shrink: 0;
  }

  .option-label {
    font-size: 0.875rem;
    color: #374151;
    flex: 1;
  }

  .option-value {
    font-size: 0.75rem;
    color: #9ca3af;
    margin-right: 0.5rem;
  }

  .option-actions {
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
