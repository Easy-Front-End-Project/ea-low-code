<template>
  <div class="project-search-bar">
    <div class="project-search-bar__left">
      <EaInput
        v-model="localKeyword"
        placeholder="请输入项目名称"
        clearable
        @keyup.enter="handleSearch"
      ></EaInput>
      <ea-button type="primary" @click="handleSearch">
        <ea-icon name="magnifying-glass" size="14"></ea-icon>
        <span>搜索</span>
      </ea-button>
    </div>

    <div class="project-search-bar__right">
      <ea-button type="primary" @click="handleCreate">
        <ea-icon name="plus" size="14"></ea-icon>
        <span>新建</span>
      </ea-button>
      <ea-button @click="handleImport">
        <ea-icon name="file-import" size="14"></ea-icon>
        <span>导入</span>
      </ea-button>
      <ea-button circle @click="handleRefresh">
        <ea-icon name="rotate" size="14"></ea-icon>
      </ea-button>
    </div>

    <!-- 导入文件输入 -->
    <input
      ref="fileInputRef"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { importProject } from '@/api/projects'
  import EaInput from '../ea-ui-wrap/EaInput.vue'

  interface Props {
    keyword?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    keyword: '',
  })

  const emit = defineEmits<{
    'update:keyword': [val: string]
    'search': []
    'create': []
    'refresh': []
  }>()

  const localKeyword = ref(props.keyword)
  const fileInputRef = ref<HTMLInputElement | null>(null)

  watch(
    () => props.keyword,
    (val: string) => {
      localKeyword.value = val
    }
  )

  watch(localKeyword, (val: string) => {
    emit('update:keyword', val)
  })

  function handleSearch() {
    emit('search')
  }

  function handleCreate() {
    emit('create')
  }

  function handleRefresh() {
    emit('refresh')
  }

  function handleImport() {
    fileInputRef.value?.click()
  }

  async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    try {
      const content = await readFile(file)
      const projectData = JSON.parse(content)

      await importProject(projectData)
      window.$message?.success('导入成功')
      emit('refresh')
    } catch (error: any) {
      window.$message?.error('导入失败：' + (error.message || '文件格式错误'))
    } finally {
      // 清空 input 以便可以再次选择同一文件
      target.value = ''
    }
  }

  function readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => resolve(e.target?.result as string)
      reader.onerror = (e: ProgressEvent<FileReader>) => reject(e)
      reader.readAsText(file)
    })
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(project-search-bar) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid var(--ea-border-light);

    @include e(left) {
      display: flex;
      align-items: center;
      gap: 12px;

      ea-input {
        width: 280px;
      }
    }

    @include e(right) {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }
</style>
