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

<script setup>
  import { ref, watch, onMounted, nextTick } from 'vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'
  import EaSelect from '@/components/ea-ui-wrap/EaSelect.vue'

  const props = defineProps({
    keyword: {
      type: String,
      default: '',
    },
    groupId: {
      type: [Number, String],
      default: null,
    },
    groupOptions: {
      type: Array,
      default: () => [],
    },
  })

  const emit = defineEmits([
    'update:keyword',
    'update:groupId',
    'search',
    'upload',
    'create-group',
    'refresh',
  ])

  const localKeyword = ref(props.keyword)
  const localGroupId = ref(props.groupId)
  const isInitialized = ref(false)

  watch(
    () => props.keyword,
    val => {
      localKeyword.value = val
    }
  )

  watch(
    () => props.groupId,
    val => {
      localGroupId.value = val
    }
  )

  watch(localKeyword, val => {
    emit('update:keyword', val)
  })

  watch(localGroupId, (newVal, oldVal) => {
    const normalizedValue = newVal === '' ? null : newVal
    emit('update:groupId', normalizedValue)

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
  .image-search-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid var(--ea-border-light);

    &__left {
      display: flex;
      align-items: center;
      gap: 12px;

      ea-input {
        width: 280px;
      }
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }
</style>
