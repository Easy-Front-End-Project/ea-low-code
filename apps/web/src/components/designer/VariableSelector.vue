<template>
  <ea-dialog :visible="visible" title="选择变量" width="500px" @close="handleClose">
    <div class="variable-selector">
      <!-- 搜索框 -->
      <div class="search-box">
        <EaInput v-model="searchKeyword" size="small" placeholder="搜索变量...">
          <ea-icon slot="prefix" name="magnifying-glass" variant="solid" size="14"></ea-icon>
        </EaInput>
      </div>

      <!-- 变量列表 -->
      <div class="variable-list">
        <div
          v-for="variable in filteredVariables"
          :key="variable.id"
          class="variable-item"
          @click="handleSelect(variable)"
        >
          <div class="variable-info">
            <div class="variable-name">
              <ea-icon name="cube" variant="solid" size="14" class="text-blue-500"></ea-icon>
              <span>{{ variable.name }}</span>
            </div>
            <div class="variable-meta">
              <span class="variable-type">{{ getTypeLabel(variable.type) }}</span>
              <span v-if="variable.remark" class="variable-remark">{{ variable.remark }}</span>
            </div>
          </div>
          <div class="variable-value">
            <code>{{ formatValue(variable.defaultValue, variable.type) }}</code>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredVariables.length === 0" class="empty-state">
          <ea-icon name="inbox" variant="solid" size="32" class="text-gray-300"></ea-icon>
          <p class="text-gray-400 text-sm mt-2">
            {{ searchKeyword ? '没有找到匹配的变量' : '暂无变量，请先定义变量' }}
          </p>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <ea-button type="primary" @click="handleAddVariable"> 管理变量 </ea-button>
      <ea-button @click="handleClose">取消</ea-button>
    </div>
  </ea-dialog>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useVariableStore } from '@/components/designer/stores/variable'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['select', 'close', 'add-variable'])

  const variableStore = useVariableStore()
  const searchKeyword = ref('')

  // 类型标签映射
  const typeLabels = {
    string: '字符串',
    number: '数字',
    boolean: '布尔值',
    array: '数组',
    object: '对象',
    function: '函数',
  }

  // 过滤后的变量列表
  const filteredVariables = computed(() => {
    // 使用副本避免直接引用 store 中的响应式数组
    const variables = [...variableStore.variables]
    if (!searchKeyword.value) {
      return variables
    }
    const keyword = searchKeyword.value.toLowerCase()
    return variables.filter(
      v => v.name.toLowerCase().includes(keyword) || v.remark.toLowerCase().includes(keyword)
    )
  })

  // 获取类型标签
  function getTypeLabel(type) {
    return typeLabels[type] || type
  }

  // 格式化值显示
  function formatValue(value, type) {
    if (value === null || value === undefined) {
      return 'null'
    }
    if (type === 'function') {
      return '[Function]'
    }
    if (typeof value === 'object') {
      return JSON.stringify(value).slice(0, 30) + '...'
    }
    return String(value).slice(0, 30)
  }

  // 选择变量
  function handleSelect(variable) {
    emit('select', variable.name)
  }

  // 关闭对话框
  function handleClose() {
    searchKeyword.value = ''
    emit('close')
  }

  // 添加变量
  function handleAddVariable() {
    emit('add-variable')
  }
</script>

<style scoped>
  .variable-selector {
    min-height: 300px;
    max-height: 400px;
    display: flex;
    flex-direction: column;
  }

  .search-box {
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .variable-list {
    flex: 1;
    overflow-y: auto;
    padding-top: 0.5rem;
  }

  .variable-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .variable-item:hover {
    background-color: #f3f4f6;
  }

  .variable-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .variable-name {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  .variable-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
  }

  .variable-type {
    padding: 0.125rem 0.375rem;
    background-color: #dbeafe;
    color: #1e40af;
    border-radius: 0.25rem;
  }

  .variable-remark {
    color: #6b7280;
  }

  .variable-value {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .variable-value code {
    padding: 0.125rem 0.375rem;
    background-color: #f3f4f6;
    border-radius: 0.25rem;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
  }

  .dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
  }
</style>
