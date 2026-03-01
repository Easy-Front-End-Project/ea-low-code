<template>
  <div class="prop-input-wrapper">
    <!-- 字符串类型 -->
    <input
      v-if="type === 'string'"
      type="text"
      :value="value"
      @input="handleInput($event.target.value)"
      class="prop-input"
    />

    <!-- 数字类型 -->
    <input
      v-else-if="type === 'number'"
      type="number"
      :value="value"
      @input="handleInput(Number($event.target.value))"
      class="prop-input"
    />

    <!-- 布尔类型 -->
    <label
      v-else-if="type === 'boolean'"
      class="flex items-center gap-2 cursor-pointer"
    >
      <input
        type="checkbox"
        :checked="value"
        @change="handleInput($event.target.checked)"
        class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
      />
      <span class="text-sm text-gray-600">{{ value ? '是' : '否' }}</span>
    </label>

    <!-- 选择类型 -->
    <select
      v-else-if="type === 'select'"
      :value="value"
      @change="handleInput($event.target.value)"
      class="prop-input"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- 颜色类型 -->
    <div v-else-if="type === 'color'" class="flex gap-2">
      <input
        type="color"
        :value="value || '#000000'"
        @input="handleInput($event.target.value)"
        class="w-10 h-8 rounded border border-gray-300 cursor-pointer flex-shrink-0"
      />
      <input
        type="text"
        :value="value || ''"
        @input="handleInput($event.target.value)"
        class="prop-input flex-1"
        placeholder="#000000"
      />
    </div>

    <!-- 对象类型（JSON 编辑器） -->
    <textarea
      v-else-if="type === 'object' || type === 'array'"
      :value="jsonValue"
      @input="handleJsonInput($event.target.value)"
      class="prop-input font-mono text-xs"
      rows="4"
      placeholder="输入 JSON 格式数据"
    ></textarea>

    <!-- 默认类型 -->
    <input
      v-else
      type="text"
      :value="value"
      @input="handleInput($event.target.value)"
      class="prop-input"
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
  emit('update:value', value)
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
