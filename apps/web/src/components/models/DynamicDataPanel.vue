<template>
  <div class="dynamic-data-panel">
    <ea-card class="dynamic-data-panel__info">
      <header slot="header" class="dynamic-data-panel__info-header">
        <span class="dynamic-data-panel__title">{{ model.name }}</span>
        <ea-tag type="primary">{{ model.tableName }}</ea-tag>
      </header>
      <div class="dynamic-data-panel__stats">
        <span>可用字段: {{ userFields.length }} 个</span>
        <ea-button size="small" @click="handlePreviewData">刷新数据</ea-button>
      </div>
    </ea-card>

    <ea-card class="dynamic-data-panel__fields">
      <header slot="header">字段列表</header>
      <ea-table :data.prop="userFields">
        <ea-table-column prop="fieldName" label="字段名"></ea-table-column>
        <ea-table-column prop="fieldLabel" label="显示名"></ea-table-column>
        <ea-table-column prop="fieldType" label="类型"></ea-table-column>
        <ea-table-column prop="isNullable" label="允许空"></ea-table-column>
        <ea-table-column prop="isUnique" label="唯一"></ea-table-column>
      </ea-table>
    </ea-card>

    <ea-card class="dynamic-data-panel__api">
      <header slot="header">动态数据接口</header>

      <div v-for="api in apiList" :key="api.method + api.path" class="dynamic-data-panel__api-item">
        <div class="dynamic-data-panel__api-header">
          <ea-tag :type="api.tagType">{{ api.method }}</ea-tag>
          <code class="dynamic-data-panel__api-url">{{ api.url }}</code>
          <ea-button size="small" @click="copyApi(api)">复制</ea-button>
        </div>
        <pre class="dynamic-data-panel__api-body">{{ api.example }}</pre>
      </div>
    </ea-card>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface ModelData {
    name: string
    tableName: string
  }

  interface FieldData {
    fieldName: string
    fieldType: string
    isSystem?: boolean
    defaultValue?: any
  }

  interface ApiItem {
    method: string
    path: string
    url: string
    tagType: string
    example: string
  }

  interface Props {
    model: ModelData
    fields?: FieldData[]
  }

  const props = withDefaults(defineProps<Props>(), {
    fields: () => [],
  })

  const userFields = computed(() => props.fields.filter(f => !f.isSystem))

  const baseUrl = 'http://localhost:3000/api'
  const tableName = computed(() => props.model.tableName)

  const SAMPLE_MAP: Record<string, any> = {
    text: '字符串',
    number: 0,
    date: '2024-01-01',
    datetime: '2024-01-01 00:00:00',
    boolean: true,
    json: '{}',
  }

  function fieldSample(field: FieldData): any {
    if (
      field.defaultValue !== null &&
      field.defaultValue !== undefined &&
      field.defaultValue !== ''
    ) {
      return field.defaultValue
    }
    return SAMPLE_MAP[field.fieldType] ?? ''
  }

  const createBody = computed(() => {
    const obj: Record<string, any> = {}
    for (const f of userFields.value) {
      obj[f.fieldName] = fieldSample(f)
    }
    return obj
  })

  const updateBody = computed(() => {
    return { id: 1, ...createBody.value }
  })

  const apiList = computed<ApiItem[]>(() => {
    const tn = tableName.value
    return [
      {
        method: 'POST',
        path: `/dynamic/data/get?tableName=${tn}`,
        url: `${baseUrl}/dynamic/data/get?tableName=${tn}`,
        tagType: 'primary',
        example: buildExample('get'),
      },
      {
        method: 'POST',
        path: `/dynamic/data/page?tableName=${tn}`,
        url: `${baseUrl}/dynamic/data/page?tableName=${tn}`,
        tagType: 'success',
        example: buildExample('page'),
      },
      {
        method: 'POST',
        path: `/dynamic/data/create?tableName=${tn}`,
        url: `${baseUrl}/dynamic/data/create?tableName=${tn}`,
        tagType: 'warning',
        example: buildExample('create'),
      },
      {
        method: 'POST',
        path: `/dynamic/data/update?tableName=${tn}`,
        url: `${baseUrl}/dynamic/data/update?tableName=${tn}`,
        tagType: '',
        example: buildExample('update'),
      },
      {
        method: 'POST',
        path: `/dynamic/data/delete?tableName=${tn}`,
        url: `${baseUrl}/dynamic/data/delete?tableName=${tn}`,
        tagType: 'danger',
        example: buildExample('delete'),
      },
    ]
  })

  function buildExample(type: string): string {
    switch (type) {
      case 'get':
        return (
          '// 查询所有数据\n// 无需 Body\n// 可选 Body（条件过滤）:\n' +
          (userFields.value.length
            ? JSON.stringify({ [userFields.value[0].fieldName]: '' }, null, 2)
            : '{}')
        )
      case 'page':
        return '// 分页查询\n' + JSON.stringify({ page: 0, size: 10 }, null, 2)
      case 'create':
        return '// 创建数据\n' + JSON.stringify(createBody.value, null, 2)
      case 'update':
        return '// 更新数据（必须包含 id）\n' + JSON.stringify(updateBody.value, null, 2)
      case 'delete':
        return '// 删除数据\n' + JSON.stringify({ id: 1 }, null, 2)
      default:
        return ''
    }
  }

  function copyApi(api: ApiItem) {
    const text = `${api.method} ${api.url}\n\nBody:\n${api.example}`
    navigator.clipboard.writeText(text).then(() => {
      window.$message?.success('已复制到剪贴板')
    })
  }

  async function handlePreviewData() {
    try {
      const res = await fetch(`${baseUrl}/dynamic/data/get?tableName=${tableName.value}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      window.$message?.success(`共 ${data.length || 0} 条数据`)
    } catch {
      window.$message?.error('获取数据失败')
    }
  }
</script>

<style lang="scss" scoped>
  @include b(dynamic-data-panel) {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @include e(info-header) {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    @include e(title) {
      font-size: 1rem;
      font-weight: 600;
    }

    @include e(stats) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--ea-text-secondary);
      font-size: 0.875rem;
    }

    @include e(api-item) {
      margin-bottom: 1rem;
      padding: 0.75rem;
      border-radius: 6px;
      background-color: var(--ea-fill-color-light);
      border: 1px solid var(--ea-border-color);

      &:last-child {
        margin-bottom: 0;
      }
    }

    @include e(api-header) {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    @include e(api-url) {
      flex: 1;
      font-size: 0.8125rem;
      color: var(--ea-text-regular);
      word-break: break-all;
    }

    @include e(api-body) {
      margin: 0;
      padding: 0.75rem;
      font-size: 0.8125rem;
      line-height: 1.6;
      color: var(--ea-text-primary);
      background-color: var(--ea-fill-color);
      border-radius: 4px;
      overflow-x: auto;
      white-space: pre-wrap;
    }
  }
</style>
