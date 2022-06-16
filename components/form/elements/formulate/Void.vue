<template>
  <div
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
  >
    {{ context.model }}
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

</style>
