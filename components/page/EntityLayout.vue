<template>
  <div>
    <div id="entity-layout-title">
      <div id="entity-layout-title-text">
        <h1><slot name="entity-layout-title" /></h1>
        <span><slot name="entity-layout-title-note" /></span>
      </div>
      <MedInputButton :button-descriptor="editButtonDescriptor" @click.native="editButtonPressed" />
    </div>
    <Tabs v-model="activeTab" :tabs="tabs">
      <template v-slot:tab-content>
        <slot name="entity-layout-content" />
      </template>
    </Tabs>
    <div>
      <slot name="entity-layout-footer" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'
import Tabs, { TabData } from '~/components/widgets/Tabs.vue'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'

@Component({
  components: { Tabs }
})
export default class EntityLayout extends Vue {
  @Prop({ type: Array, required: true }) tabs!: TabData[];
  @Prop({ type: String, required: true }) value!: string;

  activeTab: string|null = null;

  @Watch('activeTab') activeTabChange () {
    this.$emit('input', this.activeTab)
  }

  get editButtonDescriptor () {
    return new ButtonDescriptor('edit').setFaIcon('fas fa-pencil-alt')
  }

  @Emit('edit-button-pressed')
  editButtonPressed () {
    return true
  }

  created () {
    this.activeTab = this.value
  }
}
</script>

<style scoped lang="scss">
@import "assets/scss/colors";

$headerHeight: 50px;

#entity-layout-title{
  display: inline-block;
  text-align: center;
  width: 100%;
  position: relative;
  height: $headerHeight;

  #entity-layout-title-text{
    position: absolute;
    width: 100%;
    height: $headerHeight;
    line-height: $headerHeight;
  }

  h1{
    display: inline-block;
  }

  span{
    color: $textLessImportant;
  }

  .formulate-input{
    float: right;
    line-height: 50px;
    margin-right: 10px;
    position: relative;
    z-index: 1;
  }
}
.tabs{
  flex: 1;
}
</style>
