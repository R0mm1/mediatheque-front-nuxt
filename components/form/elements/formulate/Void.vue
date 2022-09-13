<template>
  <div
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
  >
    <span class="content">{{ context.model }}</span>
    <FormulateSlot
      name="after"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Void extends Vue {
  @Prop({ type: Object, required: true }) context!: any
}
</script>

<style scoped>
  .content{
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
