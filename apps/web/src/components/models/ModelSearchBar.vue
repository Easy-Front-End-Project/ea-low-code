<template>
  <div class="model-search-bar">
    <div class="model-search-bar__left">
      <EaInput
        v-model="localKeyword"
        placeholder="输入名称或描述搜索"
        clearable
        @keyup.enter="handleSearch"
      ></EaInput>
      <ea-button type="primary" @click="handleSearch">
        <ea-icon name="magnifying-glass" size="14"></ea-icon>
        <span>搜索</span>
      </ea-button>
    </div>

    <div class="model-search-bar__right">
      <ea-button type="primary" @click="handleCreate">
        <ea-icon name="plus" size="14"></ea-icon>
        <span>新增模型</span>
      </ea-button>
      <ea-button circle @click="handleRefresh">
        <ea-icon name="rotate" size="14"></ea-icon>
      </ea-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
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
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(model-search-bar) {
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
