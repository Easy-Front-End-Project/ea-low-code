<template>
  <ea-dialog :visible="visible" title="URL 预设管理" width="700px" @close="handleClose">
    <div class="url-preset-manager">
      <div class="preset-list">
        <form class="preset-form" @submit.prevent>
          <div class="preset-header">
            <div class="col-name">预设名称</div>
            <div class="col-url">基础 URL</div>
            <div class="col-default">默认</div>
            <div class="col-action">操作</div>
          </div>

          <div v-for="preset in localPresets" :key="preset.id" class="preset-item">
            <div class="col-name">
              <EaInput
                v-model="preset.name"
                size="small"
                placeholder="预设名称"
                @input="(val) => handleUpdate(preset.id, 'name', val)"
              />
            </div>
            <div class="col-url">
              <EaInput
                v-model="preset.url"
                size="small"
                placeholder="https://cdn.example.com"
                @input="(val) => handleUpdate(preset.id, 'url', val)"
              />
            </div>
            <div class="col-default">
              <ea-button
                :type="preset.isDefault ? 'primary' : 'default'"
                size="small"
                text
                :disabled="preset.isDefault"
                @click="handleSetDefault(preset.id)"
              >
                {{ preset.isDefault ? '默认' : '设为默认' }}
              </ea-button>
            </div>
            <div class="col-action">
              <ea-button
                icon="xmark"
                type="danger"
                size="small"
                text
                @click="handleDeletePreset(preset.id)"
              ></ea-button>
            </div>
          </div>

          <ea-empty
            v-if="localPresets.length === 0"
            class="empty-state"
            description="暂无 URL 预设，点击下方按钮添加"
          ></ea-empty>
        </form>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <ea-button type="primary" icon="plus" size="small" @click="handleAddPreset">
        添加预设
      </ea-button>
      <ea-button @click="handleClose">关闭</ea-button>
    </div>
  </ea-dialog>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRemoteComponentStore } from '@/stores/designer/remoteComponent'
  import EaInput from '@/components/ea-ui-wrap/EaInput.vue'

  interface UrlPreset {
    id: string | number
    name: string
    url: string
    isDefault: boolean
    [key: string]: any
  }

  interface Props {
    visible?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    visible: false,
  })

  const emit = defineEmits<{
    'close': []
  }>()

  const remoteStore = useRemoteComponentStore()
  const localPresets = ref<UrlPreset[]>([])
  const updateTimers = new Map<string, ReturnType<typeof setTimeout>>()

  watch(
    () => [props.visible, remoteStore.urlPresets] as const,
    ([visible]) => {
      if (visible) {
        localPresets.value = (remoteStore.urlPresets || []).map(p => ({ ...p }))
      }
    },
    { immediate: true }
  )

  function handleClose() {
    emit('close')
  }

  async function handleAddPreset() {
    await remoteStore.addUrlPreset({
      name: '',
      url: '',
      isDefault: false,
    })
  }

  function handleUpdate(id: string | number, field: string, value: string) {
    const preset = localPresets.value.find(p => p.id === id)
    if (!preset) return
    preset[field] = value

    const timerKey = `${id}-${field}`
    const existingTimer = updateTimers.get(timerKey)
    if (existingTimer) clearTimeout(existingTimer)

    const timer = setTimeout(async () => {
      try {
        await remoteStore.updateUrlPreset(id as number, { [field]: value })
      } catch (error) {
        console.error('更新预设失败:', error)
        window.$message?.error('更新失败')
      } finally {
        updateTimers.delete(timerKey)
      }
    }, 500)

    updateTimers.set(timerKey, timer)
  }

  async function handleSetDefault(id: string | number) {
    await remoteStore.setDefaultUrlPreset(id as number)
  }

  async function handleDeletePreset(id: string | number) {
    try {
      await window.$confirm('确定要删除这个 URL 预设吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      await remoteStore.removeUrlPreset(id as number)
    } catch {
      // 用户取消删除，不做任何操作
    }
  }
</script>

<style scoped>
  .url-preset-manager {
    min-height: 300px;
    max-height: 500px;
    overflow-y: auto;
  }

  .preset-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .preset-header {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background-color: #f3f4f6;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #4b5563;
  }

  .preset-item {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    transition: all 0.2s;
  }

  .preset-item:hover {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .col-name {
    flex: 2;
    min-width: 120px;
    padding-right: 0.5rem;
  }

  .col-url {
    flex: 4;
    min-width: 200px;
    padding-right: 0.5rem;
  }

  .col-default {
    width: 90px;
    min-width: 80px;
    padding-right: 0.5rem;
    display: flex;
    justify-content: center;
  }

  .col-action {
    width: 50px;
    display: flex;
    justify-content: center;
  }

  .empty-state {
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
