<template>
  <div class="api-request-action-config space-y-4">
    <!-- URL 配置 -->
    <div class="config-item">
      <label class="config-label">URL</label>
      <EaInput v-model="modelValue.url" placeholder="/api/book" size="small" />
    </div>

    <!-- 请求方式 -->
    <div class="config-item">
      <label class="config-label">请求方式</label>
      <EaSelect v-model="modelValue.method" size="small" class="w-full">
        <ea-option value="GET">GET</ea-option>
        <ea-option value="POST">POST</ea-option>
        <ea-option value="PUT">PUT</ea-option>
        <ea-option value="DELETE">DELETE</ea-option>
        <ea-option value="PATCH">PATCH</ea-option>
      </EaSelect>
    </div>

    <!-- 参数配置 Tabs -->
    <div class="config-item">
      <div class="params-tabs">
        <div
          class="tab-item"
          :class="{ active: activeTab === 'params' }"
          @click="activeTab = 'params'"
        >
          params
        </div>
        <div
          class="tab-item"
          :class="{ active: activeTab === 'body' }"
          @click="activeTab = 'body'"
        >
          body
        </div>
      </div>

      <!-- Params 参数列表 -->
      <div v-show="activeTab === 'params'" class="params-list">
        <div
          v-for="(param, index) in modelValue.params"
          :key="index"
          class="param-item"
        >
          <EaInput
            v-model="param.key"
            placeholder="参数名"
            size="small"
            class="param-key"
          />
          <EaInput
            v-model="param.value"
            placeholder="参数值"
            size="small"
            class="param-value"
          />
          <ea-button
            type="danger"
            text
            size="small"
            icon="circle-minus"
            @click="handleRemoveParam(index)"
          />
        </div>
        <ea-button
          class="w-full mt-2"
          size="small"
          @click="handleAddParam"
        >
          <ea-icon name="plus" variant="solid" size="12" class="mr-1"></ea-icon>
          <span>添加字段</span>
        </ea-button>
      </div>

      <!-- Body 参数列表 -->
      <div v-show="activeTab === 'body'" class="params-list">
        <div
          v-for="(param, index) in modelValue.body"
          :key="index"
          class="param-item"
        >
          <EaInput
            v-model="param.key"
            placeholder="参数名"
            size="small"
            class="param-key"
          />
          <EaInput
            v-model="param.value"
            placeholder="参数值"
            size="small"
            class="param-value"
          />
          <ea-button
            type="danger"
            text
            size="small"
            icon="circle-minus"
            @click="handleRemoveBodyParam(index)"
          />
        </div>
        <ea-button
          class="w-full mt-2"
          size="small"
          @click="handleAddBodyParam"
        >
          <ea-icon name="plus" variant="solid" size="12" class="mr-1"></ea-icon>
          <span>添加字段</span>
        </ea-button>
      </div>
    </div>

    <!-- 数据绑定配置 -->
    <div class="config-item">
      <label class="config-label">数据绑定</label>
      <div class="data-bind-section">
        <div class="bind-toggle">
          <EaSwitch v-model="modelValue.enableDataBinding" size="small" />
          <span class="bind-toggle-text">启用响应数据绑定到变量</span>
        </div>
        <div v-if="modelValue.enableDataBinding" class="bind-config mt-2">
          <EaSelect
            v-model="modelValue.targetVariable"
            placeholder="选择目标变量"
            size="small"
            class="w-full"
          >
            <ea-option
              v-for="variable in availableVariables"
              :key="variable.name"
              :value="variable.name"
            >
              {{ variable.name }} ({{ variable.type }})
            </ea-option>
          </EaSelect>
          <div class="bind-hint mt-2">
            <ea-icon name="circle-info" variant="solid" size="12" class="hint-icon"></ea-icon>
            <span class="hint-text">请求成功后，响应数据将自动赋值给选中的变量</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useVariableStore } from '@/components/designer/stores/variable'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'
  import EaSwitch from '@/components/ea-ui-wrap/EaSwitch.vue'

  const props = defineProps({
    modelValue: {
      type: Object,
      required: true,
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const variableStore = useVariableStore()
  const activeTab = ref('params')

  const modelValue = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val),
  })

  // 获取可用的变量列表
  const availableVariables = computed(() => {
    return variableStore.variables || []
  })

  // 添加 params 参数
  function handleAddParam() {
    if (!modelValue.value.params) {
      modelValue.value.params = []
    }
    modelValue.value.params.push({ key: '', value: '' })
  }

  // 删除 params 参数
  function handleRemoveParam(index) {
    if (modelValue.value.params) {
      modelValue.value.params.splice(index, 1)
    }
  }

  // 添加 body 参数
  function handleAddBodyParam() {
    if (!modelValue.value.body) {
      modelValue.value.body = []
    }
    modelValue.value.body.push({ key: '', value: '' })
  }

  // 删除 body 参数
  function handleRemoveBodyParam(index) {
    if (modelValue.value.body) {
      modelValue.value.body.splice(index, 1)
    }
  }
</script>

<style lang="scss" scoped>
  @use './styles/action-config.scss' as *;

  .api-request-action-config {
    @include action-config-base;

    .config-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .config-label {
        font-size: 12px;
        color: #606266;
        font-weight: 500;
      }
    }

    .params-tabs {
      display: flex;
      border-bottom: 1px solid #e4e7ed;
      margin-bottom: 12px;

      .tab-item {
        padding: 8px 16px;
        font-size: 13px;
        color: #606266;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.2s;

        &:hover {
          color: #409eff;
        }

        &.active {
          color: #409eff;
          border-bottom-color: #409eff;
        }
      }
    }

    .params-list {
      .param-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;

        .param-key,
        .param-value {
          flex: 1;
        }
      }
    }

    .data-bind-section {
      .bind-toggle {
        display: flex;
        align-items: center;
        gap: 8px;

        .bind-toggle-text {
          font-size: 12px;
          color: #606266;
        }
      }

      .bind-config {
        padding: 12px;
        background-color: #f5f7fa;
        border-radius: 4px;
      }

      .bind-hint {
        display: flex;
        align-items: flex-start;
        gap: 6px;
        font-size: 11px;
        color: #909399;

        .hint-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .hint-text {
          line-height: 1.4;
        }
      }
    }

    .w-full {
      width: 100%;
    }

    .mt-2 {
      margin-top: 8px;
    }
  }
</style>
