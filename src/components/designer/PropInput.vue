<template>
  <div class="prop-input-wrapper">
    <!-- 字符串类型 -->
    <ea-input
      v-if="type === 'string'"
      :value="value"
      @input="handleInput($event.target.value)"
      class="prop-input"
      placeholder="请输入文本"
    />

    <!-- 数字类型 -->
    <ea-input-number
      v-else-if="type === 'number'"
      :value="value"
      @ea-change="handleInput($event.detail.currentValue)"
      class="prop-input"
    />

    <!-- 布尔类型 -->
    <div v-else-if="type === 'boolean'" class="flex items-center gap-2">
      <ea-switch
        :value="value"
        @change="handleInput($event.detail.value)"
        active-text="是"
        inactive-text="否"
      />
    </div>

    <!-- 选择类型 -->
    <ea-select
      v-else-if="type === 'select'"
      :value="value"
      @change="handleInput($event.detail.value)"
      class="prop-input"
      placeholder="请选择"
    >
      <ea-option v-for="option in options" :key="option.value" :value="option.value">{{
        option.label
      }}</ea-option>
    </ea-select>

    <!-- 颜色类型 -->
    <ea-color-picker
      v-else-if="type === 'color'"
      :value="value || '#000000'"
      @change="handleInput($event.detail.value)"
      class="prop-input"
    />

    <!-- 对象类型（JSON 编辑器） -->
    <ea-input
      v-else-if="type === 'object' || type === 'array'"
      :value="jsonValue"
      @change="handleJsonInput($event.detail.value)"
      type="textarea"
      rows="4"
      class="prop-input font-mono text-xs"
      placeholder="输入 JSON 格式数据"
    />

    <!-- 默认类型 -->
    <ea-input
      v-else
      :value="value"
      @change="handleInput($event.detail.value)"
      class="prop-input"
      placeholder="请输入"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number, Boolean, Object, Array],
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:value'])

// 对象/数组类型的 JSON 表示
const jsonValue = computed(() => {
  if (props.type === 'object' || props.type === 'array') {
    try {
      return JSON.stringify(props.value, null, 2)
    } catch {
      return ''
    }
  }
  return props.value
})

// 处理输入
function handleInput(value) {
  if (value !== props.value) {
    emit('update:value', value)
  }
}

// 处理 JSON 输入
function handleJsonInput(value) {
  try {
    const parsed = JSON.parse(value)
    emit('update:value', parsed)
  } catch {
    // JSON 解析失败，不更新值
  }
}
</script>

<style scoped>
.prop-input-wrapper {
  width: 100%;
}

.prop-input {
  @apply w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

select.prop-input {
  @apply cursor-pointer;
}

textarea.prop-input {
  @apply resize-y;
}
</style>
