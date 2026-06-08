<template>
  <div v-if="propList?.length > 0" class="props-section">
    <h4 class="section-title">属性</h4>
    <div class="space-y-3">
      <div v-for="prop in propList" :key="prop.name" class="prop-item">
        <label class="prop-label">{{ prop.label }}</label>
        <div v-if="prop.description" class="description-wrapper">
          <component
            :is="getDescriptionComponent(prop.description)"
            v-bind="getDescriptionProps(prop.description)"
          >
            {{ getDescriptionContent(prop.description) }}
          </component>
        </div>

        <VariableBindingInput
          :type="prop.type"
          :value="componentProps[prop.name]"
          :options="prop.options"
          @update:value="handlePropChange(prop.name, $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { toRefs } from 'vue'
  import VariableBindingInput from '@/components/designer/common/VariableBindingInput.vue'

  interface PropDefinition {
    name: string
    label: string
    type?: string
    options?: any[]
    description?: string | {
      type?: string
      props?: Record<string, any>
      content?: string
    }
  }

  interface Props {
    props?: PropDefinition[]
    componentProps?: Record<string, any>
  }

  const props = withDefaults(defineProps<Props>(), {
    props: () => [],
    componentProps: () => ({}),
  })

  const { props: propList } = toRefs(props)

  const emit = defineEmits<{
    'prop-change': [propName: string, value: any]
  }>()

  // 获取 description 组件类型
  function getDescriptionComponent(description: PropDefinition['description']): string | null {
    if (!description) return null
    if (typeof description === 'string') {
      return 'ea-text'
    }
    return description.type || 'ea-text'
  }

  // 获取 description props
  function getDescriptionProps(description: PropDefinition['description']): Record<string, any> {
    if (!description) return {}
    if (typeof description === 'string') {
      return { size: 'small', type: 'info' }
    }
    return description.props || { size: 'small', type: 'info' }
  }

  // 获取 description 内容
  function getDescriptionContent(description: PropDefinition['description']): string {
    if (!description) return ''
    if (typeof description === 'string') {
      return description
    }
    return description.content || ''
  }

  // 处理属性变更
  function handlePropChange(propName: string, value: any) {
    emit('prop-change', propName, value)
  }
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/bem.scss';

@include b(props-section) {
  margin-bottom: 1.5rem;

  @include e(section-title) {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
  }

  @include e(prop-item) {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  @include e(prop-label) {
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
  }

  @include e(description-wrapper) {
    margin-bottom: 0.25rem;
  }
}
</style>
