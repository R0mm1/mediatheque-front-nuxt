<template>
  <div class="tabs">
    <div class="tabs-titles">
      <div v-for="tab in tabs" :key="tab.id" :class="[{'active': active===tab.id}, 'tab_'+tab.id]" class="tab-title" @click="tabChanged(tab.id)">
        {{ tab.label }}
      </div>
    </div>
    <div class="tab-content">
      <slot name="tab-content" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

export interface TabData {
  id: string;
  label: string;
  disable?: boolean;
}

@Component
export default class Tabs extends Vue {
  @Prop({ type: Array, default: () => [] }) tabs!: TabData[]
  @Prop({ type: String, default: () => [] }) value!: string

  active: string | null = null

  tabChanged (id: string) {
    this.active = id
    this.$emit('input', id)
  }

  created () {
    this.active = this.value
  }
}
</script>

<style scoped lang="scss">
@import "assets/scss/colors";

.tabs{
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tabs-titles{
  border-bottom: 1px solid $shade0;
  display: flex;
  padding-bottom: 3px;

  .tab-title{
    margin: 0 16px;
    position: relative;

    &::after{
      content: ' ';
      height: 3px;
      background-color: $shade0;
      display: block;
      bottom: -5px;
      position: absolute;
      width: calc(100% + 32px);
      left: -16px;
      opacity: 0;
    }

    &.active:after, &:hover:after{
      opacity: 1;
    }

    &:not(.active):hover:after{
      transition: opacity .3s;
    }
  }
}

.tab-content{
  overflow: auto;
  flex: 1;
}
</style>
