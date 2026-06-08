<template>
  <component
    :is="componentTag"
    ref="componentRef"
    v-bind="componentProps"
    :style="component.style"
    v-on="componentEventListeners"
  >
    <template v-if="hasNestedChildren">
      <template v-for="child in component.children" :key="child.id">
        <div
          v-if="child.props?.slot && child.props.slot !== 'default'"
          :slot="child.props.slot"
          style="display: contents"
        >
          <PreviewComponent :component="child" />
        </div>
        <PreviewComponent v-else :component="child" />
      </template>
    </template>
    <template v-else-if="component.childrenText"> {{ component.childrenText }} </template>
    <template v-else-if="hasChildrenText">
      <ea-text type="normal" size="medium">{{ resolvedChildrenText }}</ea-text>
    </template>
  </component>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, shallowRef, toRef } from 'vue'
  import { getRemoteComponentMetaList } from '@/components/designer/constants/componentMeta'
  import { loadRemoteComponent } from '@/utils/loadRemoteComponent'
  import { useComponentInstance } from '@/components/designer/composables/useComponentInstance'
  import { useComponentRender } from '@/components/designer/composables/useComponentRender'

  interface ComponentChild {
    id: string
    type: string
    props?: Record<string, any> & { slot?: string }
    events?: any[]
    children?: ComponentChild[]
    childrenText?: string
    style?: Record<string, string>
    isRemote?: boolean
    remoteConfig?: { url: string; exportName?: string; styleUrl?: string }
  }

  interface PreviewComponentProps {
    component: ComponentChild
  }

  const props = defineProps<PreviewComponentProps>()

  const componentRef = ref<HTMLElement | null>(null)
  const componentRefWrapper = toRef(() => props.component) as any

  // 使用公共的组件渲染逻辑
  const { resolvedChildrenText, hasChildrenText, componentProps, componentEventListeners } =
    useComponentRender(componentRefWrapper, { skipSlot: true })

  // 是否为远程组件
  const isRemoteComponent = computed(() => {
    return props.component.type?.startsWith('remote-') || props.component.isRemote
  })

  // 获取远程组件配置
  const remoteConfig = computed(() => {
    if (props.component.remoteConfig) {
      return props.component.remoteConfig
    }
    // 从本地存储查找
    const remoteMetaList = getRemoteComponentMetaList()
    const remoteMeta = remoteMetaList.find((m: any) => m.type === props.component.type)
    return remoteMeta?.remoteConfig
  })

  const remoteComponentLoader = shallowRef<any>(null)

  // 组件标签名（Web Components 或远程组件）
  const componentTag = computed(() => {
    if (isRemoteComponent.value && remoteComponentLoader.value) {
      return remoteComponentLoader.value
    }
    return props.component.type
  })

  // 加载远程组件样式
  function loadRemoteComponentStyle(styleUrl: string) {
    if (!styleUrl) return
    // 检查样式是否已加载
    const existingLink = document.querySelector(`link[data-remote-style="${styleUrl}"]`)
    if (existingLink) return

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = styleUrl
    link.setAttribute('data-remote-style', styleUrl)
    document.head.appendChild(link)
  }

  // 加载远程组件
  async function loadRemoteComponentAsync() {
    if (!isRemoteComponent.value || !remoteConfig.value) return

    try {
      const { url, exportName, styleUrl } = remoteConfig.value

      if (styleUrl) {
        loadRemoteComponentStyle(styleUrl)
      }

      const loadedComponent = await loadRemoteComponent(url, exportName)
      remoteComponentLoader.value = loadedComponent
    } catch (error) {
      console.error('加载远程组件失败:', error)
    }
  }

  // 如果是远程组件，加载它
  onMounted(() => {
    if (isRemoteComponent.value) {
      loadRemoteComponentAsync()
    }
  })

  // 是否有嵌套子组件（数组形式的 children）
  const hasNestedChildren = computed(() => {
    return Array.isArray(props.component.children) && props.component.children.length > 0
  })

  // 使用 composable 管理组件实例（包含 load 事件触发逻辑）
  useComponentInstance({
    componentId: props.component.id,
    componentType: props.component.type,
    componentRef,
    events: props.component.events,
  })
</script>

<style scoped>
  /* 预览模式下组件样式 */
  :deep(*) {
    /* display: contents; */
    pointer-events: auto;
  }
</style>
