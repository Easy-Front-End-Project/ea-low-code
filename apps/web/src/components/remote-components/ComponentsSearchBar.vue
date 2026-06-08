<template>
  <div class="components-search-bar">
    <div class="components-search-bar__main">
      <div class="components-search-bar__search">
        <EaInput
          v-model="localKeyword"
          placeholder="请输入组件名称"
          clearable
          @keyup.enter="handleSearch"
        ></EaInput>
        <ea-button type="primary" @click="handleSearch">
          <ea-icon name="magnifying-glass" size="14"></ea-icon>
          <span>搜索</span>
        </ea-button>
      </div>
      <div class="components-search-bar__actions">
        <ea-button circle icon="rotate" @click="$emit('refresh')"></ea-button>
        <ea-button type="primary" icon="plus" @click="$emit('create')"> 添加组件 </ea-button>
      </div>
    </div>

    <div v-if="urlPresetCount > 0" class="components-search-bar__presets">
      <h4 class="components-search-bar__presets-title">
        URL 预设配置
        <span class="text-xs text-gray-400 font-normal ml-2"> ({{ urlPresetCount }} 个预设) </span>
      </h4>
      <div class="components-search-bar__presets-content">
        <span class="text-sm text-gray-600"> 默认: {{ defaultUrlPreset?.name || '未设置' }} </span>
        <ea-button size="small" icon="pen-to-square" text @click="$emit('manage-presets')">
          管理
        </ea-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

  interface UrlPreset {
    name?: string
  }

  interface Props {
    componentCount?: number
    enabledCount?: number
    urlPresetCount?: number
    defaultUrlPreset?: UrlPreset | null
  }

  withDefaults(defineProps<Props>(), {
    componentCount: 0,
    enabledCount: 0,
    urlPresetCount: 0,
    defaultUrlPreset: null,
  })

  const emit = defineEmits<{
    'search': [keyword: string]
    'create': []
    'refresh': []
    'manage-presets': []
  }>()

  const localKeyword = ref('')

  function handleSearch() {
    emit('search', localKeyword.value)
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins/bem.scss';

  @include b(components-search-bar) {
    @include e(main) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 0;
      flex-wrap: wrap;
      gap: 12px;
    }

    @include e(search) {
      display: flex;
      align-items: center;
      gap: 12px;

      ea-input {
        width: 240px;
      }
    }

    @include e(actions) {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @include e(presets) {
      background-color: #f9fafb;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      padding: 1rem;
    }

    @include e(presets-title) {
      margin: 0 0 0.5rem 0;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
    }

    @include e(presets-content) {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  }
</style>
