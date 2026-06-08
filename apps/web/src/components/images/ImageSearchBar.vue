<template>
  <div class="image-search-bar">
    <div class="image-search-bar__left">
      <EaInput
        v-model="localKeyword"
        placeholder="搜索图片名称或描述"
        clearable
        @keyup.enter="handleSearch"
      ></EaInput>
      <EaSelect v-model="localGroupId" placeholder="选择分组" clearable style="width: 180px">
        <ea-option
          v-for="option in groupOptions"
          :key="option.value ?? 'all'"
          :value="option.value"
        >
          {{ option.label }}
        </ea-option>
      </EaSelect>
      <ea-button type="primary" @click="handleSearch">
        <ea-icon name="magnifying-glass" size="14"></ea-icon>
        <span>搜索</span>
      </ea-button>
    </div>

    <div class="image-search-bar__right">
      <ea-button type="primary" @click="handleUpload">
        <ea-icon name="upload" size="14"></ea-icon>
        <span>上传图片</span>
      </ea-button>
      <ea-button @click="handleCreateGroup">
        <ea-icon name="folder-plus" size="14"></ea-icon>
        <span>新建分组</span>
      </ea-button>
      <ea-button circle @click="handleRefresh">
        <ea-icon name="rotate" size="14"></ea-icon>
      </ea-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, nextTick } from 'vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'

  interface GroupOption {
    value: number | string | null
    label: string
  }

  interface Props {
    keyword?: string
    groupId?: number | string | null
    groupOptions?: GroupOption[]
  }

  const props = withDefaults(defineProps<Props>(), {
    keyword: '',
    groupId: null,
    groupOptions: () => [],
  })

  const emit = defineEmits<{
    'update:keyword': [val: string]
    'update:groupId': [val: number | string | null]
    'search': []
    'upload': []
    'create-group': []
    'refresh': []
  }>()

  const localKeyword = ref(props.keyword)
  const localGroupId = ref<string | number | undefined>(props.groupId ?? undefined)
  const isInitialized = ref(false)

  watch(
    () => props.keyword,
    (val: string) => {
      localKeyword.value = val
    }
  )

  watch(
    () => props.groupId,
    (val: number | string | null) => {
      localGroupId.value = val ?? undefined
    }
  )

  watch(localKeyword, (val: string) => {
    emit('update:keyword', val)
  })

  watch(localGroupId, (newVal: string | number | undefined, oldVal: string | number | undefined) => {
    const normalizedValue = newVal === '' ? undefined : newVal
    emit('update:groupId', normalizedValue ?? null)

    if (isInitialized.value && newVal !== oldVal) {
      emit('search')
    }
  })

  onMounted(() => {
    nextTick(() => {
      setTimeout(() => {
        isInitialized.value = true
      }, 50)
    })
  })

  function handleSearch() {
    emit('search')
  }

  function handleUpload() {
    emit('upload')
  }

  function handleCreateGroup() {
    emit('create-group')
  }

  function handleRefresh() {
    emit('refresh')
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(image-search-bar) {
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
