<template>
  <div class="pages-search-bar">
    <div class="pages-search-bar__left">
      <EaInput
        v-model="localKeyword"
        placeholder="请输入名称"
        clearable
        @keyup.enter="handleSearch"
      ></EaInput>
      <ea-button type="primary" @click="handleSearch">
        <ea-icon name="magnifying-glass" size="14"></ea-icon>
        <span>搜索</span>
      </ea-button>
    </div>

    <div class="pages-search-bar__right">
      <ea-button type="primary" @click="handleCreate">
        <ea-icon name="plus" size="14"></ea-icon>
        <span>新建</span>
      </ea-button>
      <ea-button circle @click="handleRefresh">
        <ea-icon name="rotate" size="14"></ea-icon>
      </ea-button>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

  const props = defineProps({
    keyword: {
      type: String,
      default: '',
    },
  })

  const emit = defineEmits(['update:keyword', 'search', 'create', 'refresh'])

  const localKeyword = ref(props.keyword)

  watch(
    () => props.keyword,
    val => {
      localKeyword.value = val
    }
  )

  watch(localKeyword, val => {
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
  .pages-search-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__left {
      display: flex;
      align-items: center;
      gap: 12px;

      ea-input {
        width: 240px;
      }
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
</style>
