<template>
  <div class="remote-component-panel">
    <div class="panel-search">
      <EaInput v-model="searchQuery" placeholder="搜索远程组件..." prefix-icon="magnifying-glass" />
    </div>

    <div class="panel-content">
      <div v-if="filteredComponents.length === 0" class="empty-state">
        <ea-empty description="暂无远程组件" />
      </div>

      <div v-else class="component-grid">
        <div
          v-for="component in filteredComponents"
          :key="component.type"
          class="component-item component-item--remote"
          draggable="true"
          @dragstart="handleDragStart($event, component)"
        >
          <ea-icon :name="component.icon || 'link'" variant="solid" size="20" />
          <span class="component-item__name">{{ component.name }}</span>
          <span class="component-item__badge">远程</span>
        </div>
      </div>
    </div>

    <div class="panel-footer">
      <ea-button text size="small" @click="$emit('open-manager')">
        <ea-icon name="gear" />
        管理远程组件
      </ea-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRemoteComponentStore } from '@/stores/designer/remoteComponent'
import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

interface RemoteComponentItem {
  type: string
  name: string
  icon?: string
  isRemote?: boolean
  [key: string]: unknown
}

const emit = defineEmits<{
  'open-manager': []
}>()

const remoteStore = useRemoteComponentStore()
const searchQuery = ref('')

const filteredComponents = computed<RemoteComponentItem[]>(() => {
  const list = remoteStore.enabledComponentMetaList as RemoteComponentItem[]
  if (!searchQuery.value.trim()) return list

  const query = searchQuery.value.toLowerCase()
  return list.filter(
    comp =>
      comp.name.toLowerCase().includes(query) ||
      comp.type.toLowerCase().includes(query)
  )
})

function handleDragStart(event: DragEvent, component: RemoteComponentItem) {
  event.dataTransfer!.setData('application/json', JSON.stringify(component))
  event.dataTransfer!.effectAllowed = 'copy'
}

onMounted(() => {
  remoteStore.loadConfig()
})
</script>

<style lang="scss" scoped>
.remote-component-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;

  &__search {
    padding: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
  }

  &__footer {
    padding: 0.75rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: center;
  }
}

.panel-search {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
}

.panel-footer {
  padding: 0.75rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.75rem;
  background-color: #fff;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  cursor: move;
  transition: all 0.2s;
  position: relative;

  &:hover {
    border-color: #8b5cf6;
    background-color: #f5f3ff;
  }

  &--remote {
    border-color: #8b5cf6;
    background-color: #f5f3ff;

    &:hover {
      border-color: #7c3aed;
      background-color: #ede9fe;
    }
  }

  &__name {
    font-size: 0.75rem;
    color: #4b5563;
    text-align: center;
  }

  &__badge {
    font-size: 0.625rem;
    color: #8b5cf6;
    background-color: #ede9fe;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
  }
}
</style>
