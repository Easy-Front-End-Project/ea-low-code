<template>
  <div class="component-label" part="low-code-component-label">
    {{ name }}
    <span v-if="slotName && slotName !== 'default'" class="component-label__slot" part="low-code-slot-label">
      slot: {{ slotName }}
    </span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  name: string
  slotName?: string | null
}>(), {
  slotName: null,
})
</script>

<style lang="scss" scoped>
@include b(component-label) {
  position: absolute;
  top: 0;
  left: 0;
  padding: 2px 6px;
  background-color: #3b82f6;
  color: white;
  font-size: 11px;
  line-height: 16px;
  border-radius: 3px;
  white-space: nowrap;
  transform: translate(-25%, -100%);
  z-index: 100;

  @include e(slot) {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 2px 6px;
    background-color: #10b981;
    color: white;
    font-size: 10px;
    line-height: 14px;
    border-radius: 3px;
    white-space: nowrap;
    transform: translate(25%, 100%);
    z-index: 100;
  }
}
</style>
