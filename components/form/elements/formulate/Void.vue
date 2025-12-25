<template>
  <div
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
  >
    <span class="content">{{ context.model }}</span>
    <FormulateSlot name="after" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  context: any;
}

defineProps<Props>();
</script>

<style scoped>
.content {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
