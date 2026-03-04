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
                @change="(val) => handleUpdate(variable.id, 'name', val)"
              />
            </div>
            <div class="col-type">
              <EaSelect
                v-model="variable.type"
                size="small"
                @change="(val) => {handleUpdate(variable.id, 'type', val); console.log(val)}"
              >
                <ea-option value="string">字符串</ea-option>
                <ea-option value="number">数字</ea-option>
                <ea-option value="boolean">布尔值</ea-option>
                <ea-option value="array">数组</ea-option>
                <ea-option value="object">对象</ea-option>
              </EaSelect>
            </div>
            <div class="col-default">
              <EaInput
                v-model="variable.defaultValue"
                size="small"
                placeholder="默认值"
                @change="(val) => handleUpdate(variable.id, 'defaultValue', val)"
              />
            </div>
            <div class="col-remark">
              <EaInput
                v-model="variable.remark"
                size="small"
                placeholder="备注"
                @change="(val) => handleUpdate(variable.id, 'remark', val)"
              />
            </div>
            <div class="col-action">
              <ea-button type="text" size="small" @click="handleDeleteVariable(variable.id)">
                <ea-icon icon="icon-cancel" size="14" class="text-red-500"></ea-icon>
              </ea-button>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="localVariables.length === 0" class="empty-state">
            <ea-icon icon="icon-inbox" size="32" class="text-gray-300"></ea-icon>
            <p class="text-gray-400 text-sm mt-2">暂无变量，点击添加变量按钮创建</p>
          </div>
        </form>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <ea-button type="primary" size="small" @click="handleAddVariable">
        <ea-icon icon="icon-plus" size="12" class="mr-1"></ea-icon>
        <span>添加变量</span>
      </ea-button>
      <div class="flex items-center gap-2">
        <ea-button @click="handleClose">关闭</ea-button>
      </div>
    </div>
  </ea-dialog>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useVariableStore } from '@/stores/designer/variable'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['close'])

  const variableStore = useVariableStore()

  // 本地变量列表（避免直接操作 store）
  const localVariables = ref([])

  // 监听 store 变化，同步到本地
  watch(
    () => variableStore.variables,
    (newVariables) => {
      localVariables.value = newVariables.map((v) => ({ ...v }))
    },
    { immediate: true, deep: true },
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

  // 更新变量
  function handleUpdate(id, field, value) {
    const variable = variableStore.variables.find((v) => v.id === id)
    if (!variable) return

    // 检查值是否真的改变了
    if (variable[field] !== value) {
      variableStore.updateVariable(id, { [field]: value })

      // 如果修改了类型，需要转换默认值
      if (field === 'type') {
        let newDefaultValue = variable.defaultValue
        switch (value) {
          case 'number':
            newDefaultValue = Number(variable.defaultValue) || 0
            break
          case 'boolean':
            newDefaultValue = Boolean(variable.defaultValue)
            break
          case 'string':
            newDefaultValue = String(variable.defaultValue)
            break
          case 'array':
            newDefaultValue = Array.isArray(variable.defaultValue) ? variable.defaultValue : []
            break
          case 'object':
            newDefaultValue =
              typeof variable.defaultValue === 'object' && variable.defaultValue !== null
                ? variable.defaultValue
                : {}
            break
        }
        if (variable.defaultValue !== newDefaultValue) {
          variableStore.updateVariable(id, { defaultValue: newDefaultValue })
        }
      }
    }
  }

  // 删除变量
  function handleDeleteVariable(id) {
    if (confirm('确定要删除这个变量吗？')) {
      variableStore.removeVariable(id)
    }
  }
</script>

<style scoped>
  .variable-manager {
    min-height: 300px;
    max-height: 500px;
    overflow-y: auto;
  }

  .variable-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .variable-header {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background-color: #f3f4f6;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #4b5563;
  }

  .variable-item {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    transition: all 0.2s;
  }

  .variable-item:hover {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .col-name {
    flex: 2;
    min-width: 120px;
    padding-right: 0.5rem;
  }

  .col-type {
    flex: 1.5;
    min-width: 100px;
    padding-right: 0.5rem;
  }

  .col-default {
    flex: 1.5;
    min-width: 100px;
    padding-right: 0.5rem;
  }

  .col-remark {
    flex: 2;
    min-width: 120px;
    padding-right: 0.5rem;
  }

  .col-action {
    width: 50px;
    display: flex;
    justify-content: center;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    border: 2px dashed #e5e7eb;
    border-radius: 0.5rem;
  }

  .dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
  }
</style>
