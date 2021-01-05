<template>
  <div class="form_element" :class="containerCustomClasses">
    <label v-if="!noLabel" class="element_label" :class="cLabelCustomClasses" :for="name">
      <slot name="element_label">
        {{ label }}
      </slot>
    </label>

    <div class="element_content" :class="{hide_content: hideContent}">
      <slot name="element_content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormElement',
  props: {
    label: { type: String, default: '' },
    name: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    containerCustomClasses: { type: String, default: '' },
    labelCustomClasses: { type: String, default: '' },
    hideContent: { default: false, type: Boolean },
    noLabel: { default: false, type: Boolean }
  },
  computed: {
    cLabelCustomClasses () {
      let classes = this.labelCustomClasses
      if (this.disabled) {
        classes += ' disabled'
      }
      return classes
    }
  }
}
</script>

<style scoped lang="scss">
    //.form_element {
    //    display: flex;
    //    margin: 3px 0;
    //    transition: all .3s;
    //
    //    label {
    //        width: 25%;
    //        max-width: 250px;
    //        margin-left: 2px;
    //        text-overflow: ellipsis;
    //        white-space: nowrap;
    //        overflow: hidden;
    //    }
    //
    //    .element_content {
    //        flex: 1;
    //        height: calc(100% - 4px);
    //        max-width: 100%;
    //        margin-right: 2px;
    //
    //        input{
    //            font-weight: normal;
    //        }
    //
    //        &.hide_content {
    //            display: none;
    //        }
    //    }
    //}
</style>
