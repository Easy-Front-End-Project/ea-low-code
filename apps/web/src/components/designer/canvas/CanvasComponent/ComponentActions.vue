<template>
  <div class="component-actions" part="low-code-component-actions">
    <ea-button
      icon="trash-can"
      type="danger"
      size="small"
      @click.stop="$emit('delete')"
      title="删除"
    ></ea-button>
    <ea-button
      icon="copy"
      type="primary"
      size="small"
      @click.stop="$emit('copy')"
      title="复制"
    ></ea-button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  delete: []
  copy: []
}>()
</script>

<style lang="scss" scoped>
@include b(component-actions) {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 100;
  transform: translate(25%, -75%);
}
</style>
