<template>
  <div v-if="events?.length > 0" class="props-section">
    <h4 class="section-title">事件</h4>
    <div class="space-y-2">
      <div v-for="event in events" :key="event.name" class="event-item">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-700">{{ event.label }}</span>
          <span class="text-xs text-gray-400 font-mono">{{ event.name }}</span>
        </div>
        <ea-input
          type="text"
          :value="getEventHandler(event.name)"
          @input="handleEventChange(event.name, $event.detail.value)"
          class="prop-input mt-1"
          placeholder="输入处理函数名"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
  componentEvents: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['event-change'])

// 获取事件处理器
function getEventHandler(eventName) {
  const event = props.componentEvents?.find((e) => e.name === eventName)
  return event?.handler || ''
}

// 事件变更
function handleEventChange(eventName, handler) {
  const events = [...(props.componentEvents || [])]
  const index = events.findIndex((e) => e.name === eventName)

  if (handler) {
    if (index > -1) {
      events[index].handler = handler
    } else {
      events.push({ name: eventName, handler })
    }
  } else {
    if (index > -1) {
      events.splice(index, 1)
    }
  }

  emit('event-change', events)
}
</script>

<style scoped>
.props-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.event-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.prop-input {
  width: 100%;
}

.mt-1 {
  margin-top: 0.25rem;
}
</style>
